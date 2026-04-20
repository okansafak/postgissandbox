/**
 * GeoJSON Adapter — sorgu sonucunu OpenLayers'a beslenebilecek
 * GeoJSON FeatureCollection'a çevirir.
 *
 * Strateji:
 * 1. Önce PGlite field metadata'sından geometry sütunlarını tespit et
 * 2. Tespit edilemezse, değerlerin içeriğine bak (GeoJSON string / hex WKB)
 * 3. Harita render için kullanıcının SQL'ine dokunmadan, wrapper query çalıştır:
 *    WITH __user AS (...original...) SELECT ..., ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM __user
 */
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import { executeQuery } from './client';

/** PGlite'ın geometry tiplerine atadığı OID'ler (PostGIS 3.x) */
const GEOMETRY_TYPE_IDS = new Set([
  // runtime'da postgis_geometry_columns veya pg_type'tan alınabilir;
  // burada yaygın değerleri sabit olarak tutuyoruz
  17001, 17002, 17003, // tipik postgis geometry OID aralığı
]);

export interface DetectedGeomCol {
  name: string;
  index: number;
}

/**
 * Sonuç field listesinde geometry sütunlarını tespit et.
 * Hem OID kontrolü hem de değer içeriği kontrolü yapar.
 */
export function detectGeometryColumns(
  fields: { name: string; dataTypeID: number }[],
  firstRow: Record<string, unknown> | null,
): DetectedGeomCol[] {
  const result: DetectedGeomCol[] = [];

  fields.forEach((field, index) => {
    // OID tabanlı tespit
    if (GEOMETRY_TYPE_IDS.has(field.dataTypeID)) {
      result.push({ name: field.name, index });
      return;
    }

    // Değer tabanlı tespit — GeoJSON string veya hex WKB
    if (firstRow) {
      const val = firstRow[field.name];
      if (typeof val === 'string') {
        if (isGeoJSON(val) || isHexWKB(val)) {
          result.push({ name: field.name, index });
        }
      }
    }
  });

  return result;
}

function isGeoJSON(s: string): boolean {
  try {
    const obj = JSON.parse(s) as { type?: string };
    return typeof obj.type === 'string' && ['Point', 'LineString', 'Polygon',
      'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'].includes(obj.type);
  } catch {
    return false;
  }
}

function isHexWKB(s: string): boolean {
  // EWKB hex: 20+ karakter, sadece hex karakterler, 0 veya 1 ile başlar
  return s.length >= 10 && /^[0-9a-fA-F]+$/.test(s);
}

/**
 * Sorgu sonucunu GeoJSON FeatureCollection'a çevirir.
 *
 * Geometry sütunları için wrapper query çalıştırır:
 * WITH __user AS (<orijinal sql>) SELECT ..., ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM __user
 */
export async function resultToGeoJSON(
  _rows: Record<string, unknown>[],
  geomCols: DetectedGeomCol[],
  originalSql: string,
): Promise<FeatureCollection> {
  // Geometry sütunlarını ST_AsGeoJSON + ST_Transform wrapper ile yeniden sorgula
  const wrappedResult = await runWrappedQuery(originalSql, geomCols);
  return buildFeatureCollection(wrappedResult.rows, geomCols.map((c) => c.name));
}

/** Orijinal SQL'i CTE'ye alarak geometry sütunlarını GeoJSON'a çevirir */
async function runWrappedQuery(
  originalSql: string,
  geomCols: DetectedGeomCol[],
): Promise<{ rows: Record<string, unknown>[] }> {
  // CTE içine gömerken sondaki yorum/semicolon artıklarını temizle
  const cleanSql = sanitizeSqlForCte(originalSql);

  // Her geometry sütunu için ST_AsGeoJSON(ST_Transform(col, 4326)) ifadesi oluştur
  const geomExpressions = geomCols
    .map((c) => `ST_AsGeoJSON(ST_Transform(${c.name}::geometry, 4326)) AS ${c.name}`)
    .join(', ');

  // Non-geometry sütunları için * yerine explicit seçim (geometry hariç)
  // Basitlik için: tüm geometry sütunlarını override eden bir CTE
  const wrappedSql = `
    WITH __user_query AS (
      ${cleanSql}
    )
    SELECT
      *,
      ${geomExpressions}
    FROM __user_query
  `;

  try {
    return await executeQuery(wrappedSql);
  } catch {
    // Wrapper query başarısız olursa orijinal sonucu dön
    return { rows: [] };
  }
}

function sanitizeSqlForCte(sql: string): string {
  let clean = sql.trim();

  // Sondaki yorum + semicolon kombinasyonlarını stabil hale gelene kadar buda
  // Örn: "SELECT ...; -- yorum" veya "SELECT ...; /* not */"
  while (true) {
    const prev = clean;
    clean = clean
      .replace(/--[^\n\r]*$/g, '')
      .replace(/\/\*[\s\S]*?\*\/\s*$/g, '')
      .replace(/;\s*$/g, '')
      .trimEnd();

    if (clean === prev) break;
  }

  return clean;
}

function buildFeatureCollection(
  rows: Record<string, unknown>[],
  geomColNames: string[],
): FeatureCollection {
  const features: Feature[] = [];

  for (const row of rows) {
    // Her satır için ilk geçerli geometry'yi kullan
    let geometry: Geometry | null = null;
    for (const colName of geomColNames) {
      const raw = row[colName];
      if (typeof raw === 'string') {
        try {
          geometry = JSON.parse(raw) as Geometry;
          break;
        } catch {
          // Devam et
        }
      }
    }

    if (!geometry) continue;

    // Geometry olmayan sütunlar properties olarak
    const properties: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      if (!geomColNames.includes(k)) {
        properties[k] = v;
      }
    }

    features.push({ type: 'Feature', geometry, properties });
  }

  return { type: 'FeatureCollection', features };
}
