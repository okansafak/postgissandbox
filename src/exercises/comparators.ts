/** Geometri karşılaştırma yardımcıları */

/** GeoJSON koordinat dizisinin geometry türünü döndürür */
export function getGeometryType(geojsonStr: string): string | null {
  try {
    const obj = JSON.parse(geojsonStr) as { type?: string };
    return obj.type ?? null;
  } catch {
    return null;
  }
}

/** Bir satır dizisinde geometry tipinde sütun var mı? */
export function hasGeometryColumn(rows: Record<string, unknown>[]): boolean {
  const first = rows[0];
  if (!first) return false;
  return Object.values(first).some((v) => {
    if (typeof v !== 'string') return false;
    return v.startsWith('{') && v.includes('"type"') && v.includes('"coordinates"');
  });
}
