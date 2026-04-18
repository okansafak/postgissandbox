/**
 * PGlite Dedicated Web Worker.
 *
 * Tüm veritabanı işlemleri bu worker içinde çalışır; UI thread'i asla bloklanmaz.
 * postMessage protokolü discriminated union tiplidir.
 */
import { PGlite } from '@electric-sql/pglite';
import { postgis } from '@electric-sql/pglite-postgis';

type Req =
  | { id: string; kind: 'query'; sql: string }
  | { id: string; kind: 'exec'; sql: string }
  | { id: string; kind: 'ping' };

type Res =
  | { id: string; ok: true; rows: Record<string, unknown>[]; fields: { name: string; dataTypeID: number }[] }
  | { id: string; ok: false; error: string };

let db: PGlite | null = null;

/** Worker init — IndexedDB persistence + PostGIS extension */
async function init() {
  db = await PGlite.create('idb://postgis-akademi', { extensions: { postgis } });
  await db.exec('CREATE EXTENSION IF NOT EXISTS postgis;');
  await db.exec('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
  self.postMessage({ id: '__init__', ok: true, rows: [], fields: [] } satisfies Res);
}

self.addEventListener('message', async (event: MessageEvent<Req>) => {
  const req = event.data;

  if (req.kind === 'ping') {
    self.postMessage({ id: req.id, ok: true, rows: [], fields: [] } satisfies Res);
    return;
  }

  if (!db) {
    self.postMessage({ id: req.id, ok: false, error: 'DB henüz hazır değil' } satisfies Res);
    return;
  }

  try {
    if (req.kind === 'exec') {
      await db.exec(req.sql);
      self.postMessage({ id: req.id, ok: true, rows: [], fields: [] } satisfies Res);
      return;
    }

    // kind === 'query'
    const t0 = performance.now();
    const result = await db.query(req.sql);
    const durationMs = Math.round(performance.now() - t0);

    self.postMessage({
      id: req.id,
      ok: true,
      rows: (result.rows as Record<string, unknown>[]).map(serializeRow),
      fields: (result.fields as { name: string; dataTypeID: number }[]),
      durationMs,
    });
  } catch (e: unknown) {
    self.postMessage({
      id: req.id,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    } satisfies Res);
  }
});

/** Geometry binary değerlerini stringe çevir */
function serializeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v instanceof Uint8Array || ArrayBuffer.isView(v)) {
      // PGlite geometry sütunlarını WKB olarak verir — hex stringe çevir
      out[k] = bufToHex(v as Uint8Array);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
}

init().catch((e) => {
  self.postMessage({ id: '__init_error__', ok: false, error: String(e) });
});
