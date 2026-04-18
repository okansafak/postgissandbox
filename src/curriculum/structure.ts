/** Ders seviyesi — plan §6 */
export type LessonLevel = 'L1' | 'L2' | 'L3';

export type ExpectedResult =
  | { kind: 'rowCount'; count: number }
  | { kind: 'exactRows'; rows: Record<string, unknown>[]; orderMatters: boolean }
  | { kind: 'geometryEquals'; geom: string; tolerance: number }
  | { kind: 'customValidator'; fn: (rows: Record<string, unknown>[]) => boolean };

export interface Exercise {
  id: string;
  prompt: string;
  starterSql?: string;
  expectedResult: ExpectedResult;
  hints: string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  day: 1 | 2 | 3;
  module: number;
  order: number;
  title: string;
  slug: string;
  level: LessonLevel;
  estimatedMinutes: number;
  prerequisites: string[];
  objectives: string[];
  mdxPath: string;
  exercises: Exercise[];
  dataset?: string;
  tags: string[];
}

/** Modül 1.1 — Kuruluma ve Platforma Giriş */
export const CURRICULUM: Lesson[] = [
  {
    id: 'day-1-module-1-lesson-1',
    day: 1,
    module: 1,
    order: 1,
    title: 'Hoş geldin: Bu platform nasıl çalışır?',
    slug: 'lesson-1',
    level: 'L1',
    estimatedMinutes: 5,
    prerequisites: [],
    objectives: [
      'Platformun 3 panelini (içerik, editör, harita/tablo) tanımlayabilir',
      'Bir SQL sorgusunu çalıştırıp sonucu görebilir',
    ],
    mdxPath: '/src/content/day-1/module-1/lesson-1-welcome.mdx',
    exercises: [],
    tags: ['platform', 'tanıtım'],
  },
  {
    id: 'day-1-module-1-lesson-2',
    day: 1,
    module: 1,
    order: 2,
    title: 'PGlite nedir? PostgreSQL ≠ PostGIS',
    slug: 'lesson-2',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-1-lesson-1'],
    objectives: [
      'PGlite\'ın ne olduğunu ve neden tarayıcıda çalıştığını açıklayabilir',
      'PostgreSQL ile PostGIS arasındaki farkı özetleyebilir',
      'SELECT version() ve postgis_full_version() sorgularını çalıştırabilir',
    ],
    mdxPath: '/src/content/day-1/module-1/lesson-2-pglite-postgresql-postgis.mdx',
    exercises: [],
    tags: ['pglite', 'postgresql', 'postgis', 'temel'],
  },
  {
    id: 'day-1-module-1-lesson-3',
    day: 1,
    module: 1,
    order: 3,
    title: 'Bir CBS ne işe yarar? Vektör vs Raster',
    slug: 'lesson-3',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-1-lesson-2'],
    objectives: [
      'CBS\'in (Coğrafi Bilgi Sistemi) temel amacını açıklayabilir',
      'Vektör ve raster veri tiplerini ayırt edebilir',
      'PostGIS\'in CBS\'teki rolünü tanımlayabilir',
    ],
    mdxPath: '/src/content/day-1/module-1/lesson-3-cbs-vector-raster.mdx',
    exercises: [],
    tags: ['cbs', 'vektör', 'raster', 'temel'],
  },
  {
    id: 'day-1-module-1-lesson-4',
    day: 1,
    module: 1,
    order: 4,
    title: 'İlk haritayı çiz',
    slug: 'lesson-4',
    level: 'L1',
    estimatedMinutes: 5,
    prerequisites: ['day-1-module-1-lesson-3'],
    objectives: [
      'ST_MakePoint ile bir nokta geometrisi oluşturabilir',
      'Sorgu sonucunu haritada görebilir',
      'Koordinat sırasının (lon, lat) doğru olduğunu bilir',
    ],
    mdxPath: '/src/content/day-1/module-1/lesson-4-first-map.mdx',
    exercises: [
      {
        id: 'day-1-module-1-lesson-4-ex-1',
        prompt:
          'Kendi bulunduğun şehrin koordinatlarını bul ve ST_MakePoint ile haritada göster. (İpucu: lon, lat sırası)',
        starterSql: "SELECT ST_SetSRID(ST_MakePoint(28.979, 41.015), 4326) AS geom; -- İstanbul örneği",
        expectedResult: {
          kind: 'customValidator',
          fn: (rows) => {
            if (rows.length < 1) return false;
            const row = rows[0];
            if (!row) return false;
            const geom = row['geom'];
            return geom !== null && geom !== undefined;
          },
        },
        hints: [
          'Google Maps\'ta sağ tıklayarak koordinatları kopyalayabilirsin',
          'ST_MakePoint(boylam, enlem) — dikkat: önce boylam (lon), sonra enlem (lat)',
          'SRID 4326 = WGS84, GPS koordinatları için standart',
        ],
        explanation:
          'ST_MakePoint(lon, lat) bir Point geometrisi oluşturur. ST_SetSRID ile 4326 (WGS84) olarak işaretlememiz gerekir, aksi hâlde PostGIS koordinat sistemini bilemez.',
      },
    ],
    tags: ['st_makepoint', 'harita', 'koordinat', 'ilk-sorgu'],
  },
];

/** ID'ye göre ders bul */
export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

/** Gün + modül + slug'a göre bul */
export function getLessonByRoute(day: string, module: string, lessonSlug: string): Lesson | undefined {
  return CURRICULUM.find(
    (l) => l.day === Number(day) && l.module === Number(module.replace('module-', '')) && l.slug === lessonSlug,
  );
}
