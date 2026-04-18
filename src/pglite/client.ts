/**
 * PGlite client — UI thread'den worker'a güvenli erişim.
 *
 * Her istek benzersiz bir UUID ile tag'lenir; response eşleştirmesi
 * promise map'i üzerinden yapılır.
 */
import type { QueryResult } from '@/store/editorStore';

// Vite worker import syntax — '?worker' suffix
import DbWorker from './worker?worker';

type Res =
  | { id: string; ok: true; rows: Record<string, unknown>[]; fields: { name: string; dataTypeID: number }[]; durationMs?: number }
  | { id: string; ok: false; error: string };

let worker: Worker | null = null;
let isReady = false;
const pendingMap = new Map<string, { resolve: (v: Res) => void; reject: (e: Error) => void }>();
const readyCallbacks: Array<() => void> = [];

function getWorker(): Worker {
  if (worker) return worker;

  worker = new DbWorker();
  worker.addEventListener('message', (event: MessageEvent<Res>) => {
    const res = event.data;
    if (res.id === '__init__') {
      isReady = true;
      readyCallbacks.forEach((cb) => cb());
      readyCallbacks.length = 0;
      return;
    }
    if (res.id === '__init_error__') {
      console.error('[PGlite worker init error]', res);
      return;
    }
    const pending = pendingMap.get(res.id);
    if (pending) {
      pendingMap.delete(res.id);
      pending.resolve(res);
    }
  });

  return worker;
}

function waitReady(): Promise<void> {
  if (isReady) return Promise.resolve();
  return new Promise((resolve) => readyCallbacks.push(resolve));
}

function send(req: { id: string; kind: string; sql?: string }): Promise<Res> {
  const w = getWorker();
  return new Promise((resolve, reject) => {
    pendingMap.set(req.id, { resolve, reject });
    w.postMessage(req);
    // 30 saniye timeout
    setTimeout(() => {
      if (pendingMap.has(req.id)) {
        pendingMap.delete(req.id);
        reject(new Error(`Sorgu timeout: ${req.id}`));
      }
    }, 30_000);
  });
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** SQL SELECT / WITH sorgularını çalıştırır ve satırları döndürür */
export async function executeQuery(sql: string): Promise<QueryResult> {
  await waitReady();
  const t0 = performance.now();
  const res = await send({ id: uid(), kind: 'query', sql });
  if (!res.ok) throw new Error(res.error);
  return {
    rows: res.rows,
    fields: res.fields,
    durationMs: res.durationMs ?? Math.round(performance.now() - t0),
  };
}

/** DDL / DML — sonuç satırı beklenmez */
export async function executeExec(sql: string): Promise<void> {
  await waitReady();
  const res = await send({ id: uid(), kind: 'exec', sql });
  if (!res.ok) throw new Error(res.error);
}

/** Worker init edildi mi? */
export function isDbReady(): boolean {
  return isReady;
}

/** Worker'ı başlat (uygulama açılışında çağrılır) */
export function initDb(): void {
  getWorker();
}
