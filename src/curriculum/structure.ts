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

export interface ModuleMeta {
  day: 1 | 2 | 3;
  module: number;
  title: string;
  durationMinutes: number;
}

export const MODULE_META: ModuleMeta[] = [
  { day: 1, module: 1, title: 'Kuruluma ve Platforma Giriş', durationMinutes: 30 },
  { day: 1, module: 2, title: 'Geometri Temelleri', durationMinutes: 60 },
  { day: 1, module: 3, title: 'SRID ve Projeksiyonlar', durationMinutes: 75 },
  { day: 1, module: 4, title: 'Mekansal İlişkiler', durationMinutes: 60 },
  { day: 1, module: 5, title: 'Ölçüm ve Temel Analitik', durationMinutes: 75 },
  { day: 2, module: 1, title: 'Veri Yükleme ve Dönüştürme', durationMinutes: 45 },
  { day: 2, module: 2, title: 'Geometri İşlemleri (Advanced)', durationMinutes: 60 },
  { day: 2, module: 3, title: 'İndeks ve Performans', durationMinutes: 75 },
  { day: 2, module: 4, title: 'EXPLAIN ANALYZE ile Sorgu Optimizasyonu', durationMinutes: 75 },
  { day: 2, module: 5, title: 'Büyük Veri ve Partitioning', durationMinutes: 45 },
  { day: 3, module: 1, title: 'Üretim Ortamı', durationMinutes: 60 },
  { day: 3, module: 2, title: 'Ağ Analizi', durationMinutes: 75 },
  { day: 3, module: 3, title: 'PostGIS + Uygulama Entegrasyonu', durationMinutes: 60 },
  { day: 3, module: 4, title: 'Proje: Veri Analizi', durationMinutes: 75 },
  { day: 3, module: 5, title: 'Kapanış ve İleri Kaynaklar', durationMinutes: 30 },
];

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
      "PGlite'ın ne olduğunu ve neden tarayıcıda çalıştığını açıklayabilir",
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
      "CBS'in (Coğrafi Bilgi Sistemi) temel amacını açıklayabilir",
      'Vektör ve raster veri tiplerini ayırt edebilir',
      "PostGIS'in CBS'teki rolünü tanımlayabilir",
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
        starterSql: 'SELECT ST_SetSRID(ST_MakePoint(28.979, 41.015), 4326) AS geom; -- İstanbul örneği',
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
          "Google Maps'ta sağ tıklayarak koordinatları kopyalayabilirsin",
          'ST_MakePoint(boylam, enlem) — dikkat: önce boylam (lon), sonra enlem (lat)',
          'SRID 4326 = WGS84, GPS koordinatları için standart',
        ],
        explanation:
          'ST_MakePoint(lon, lat) bir Point geometrisi oluşturur. ST_SetSRID ile 4326 (WGS84) olarak işaretlememiz gerekir, aksi hâlde PostGIS koordinat sistemini bilemez.',
      },
    ],
    tags: ['st_makepoint', 'harita', 'koordinat', 'ilk-sorgu'],
  },

  // ─── Modül 1.2 — Geometri Temelleri ───────────────────────────────────────
  {
    id: 'day-1-module-2-lesson-1',
    day: 1,
    module: 2,
    order: 1,
    title: 'Geometry tipleri: POINT, LINESTRING, POLYGON',
    slug: 'lesson-1',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-1-lesson-4'],
    objectives: [
      'Üç temel geometry tipini ayırt edebilir',
      'Her tipi SQL ile oluşturabilir',
      'ST_GeometryType ile tipi sorgulayabilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-1-geometry-types.mdx',
    exercises: [],
    tags: ['point', 'linestring', 'polygon', 'geometry'],
  },
  {
    id: 'day-1-module-2-lesson-2',
    day: 1,
    module: 2,
    order: 2,
    title: 'MULTI* ve GEOMETRYCOLLECTION',
    slug: 'lesson-2',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-1'],
    objectives: [
      'MULTIPOINT, MULTILINESTRING, MULTIPOLYGON tiplerini açıklayabilir',
      'ST_Collect ve ST_Union farkını özetleyebilir',
      'Gerçek dünya örneğiyle multi-geometry kullanımını gösterebilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-2-multi-and-collection.mdx',
    exercises: [],
    tags: ['multigeometry', 'geometrycollection', 'st_collect'],
  },
  {
    id: 'day-1-module-2-lesson-3',
    day: 1,
    module: 2,
    order: 3,
    title: 'WKT, EWKT ve GeoJSON formatları',
    slug: 'lesson-3',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-2'],
    objectives: [
      'WKT, EWKT ve GeoJSON formatlarını tanıyabilir',
      'ST_AsText, ST_AsEWKT, ST_AsGeoJSON fonksiyonlarını kullanabilir',
      'ST_GeomFromText ile metin formatından geometry oluşturabilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-3-wkt-ewkt-geojson.mdx',
    exercises: [],
    tags: ['wkt', 'ewkt', 'geojson', 'format'],
  },
  {
    id: 'day-1-module-2-lesson-4',
    day: 1,
    module: 2,
    order: 4,
    title: 'Geometri oluşturucuları: MakePoint, MakeLine, MakePolygon',
    slug: 'lesson-4',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-3'],
    objectives: [
      'ST_MakeLine ile çizgi oluşturabilir',
      'ST_MakePolygon ile kapalı poligon oluşturabilir',
      'ST_Collect ile çok parçalı geometry birleştirebilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-4-geometry-constructors.mdx',
    exercises: [],
    tags: ['st_makeline', 'st_makepolygon', 'st_collect', 'constructor'],
  },
  {
    id: 'day-1-module-2-lesson-5',
    day: 1,
    module: 2,
    order: 5,
    title: 'Geometry metadata: AsText, GeometryType, NPoints',
    slug: 'lesson-5',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-4'],
    objectives: [
      'ST_AsText, ST_AsGeoJSON çıktılarını okuyabilir',
      'ST_NPoints, ST_NumGeometries ile yapısal bilgi çekebilir',
      'ST_SRID ve ST_CoordDim fonksiyonlarını açıklayabilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-5-geometry-metadata.mdx',
    exercises: [],
    tags: ['metadata', 'st_astext', 'st_npoints', 'st_srid'],
  },
  {
    id: 'day-1-module-2-lesson-6',
    day: 1,
    module: 2,
    order: 6,
    title: 'Geçerli/geçersiz geometri: ST_IsValid, ST_MakeValid',
    slug: 'lesson-6',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-5'],
    objectives: [
      'Geçersiz geometrinin ne olduğunu açıklayabilir',
      'ST_IsValid ve ST_IsValidReason kullanabilir',
      'ST_MakeValid ile bozuk geometriyi düzeltebilir',
    ],
    mdxPath: '/src/content/day-1/module-2/lesson-6-valid-geometry.mdx',
    exercises: [
      {
        id: 'day-1-module-2-lesson-6-ex-1',
        prompt:
          'Verilen 5 noktayı birleştirerek kapalı bir poligon oluştur. İlk ve son nokta aynı olmalı. Alan hesapla.',
        starterSql: `SELECT ST_Area(
  ST_MakePolygon(
    ST_MakeLine(ARRAY[
      ST_MakePoint(28.9, 41.0),
      ST_MakePoint(29.0, 41.0),
      ST_MakePoint(29.0, 41.1),
      ST_MakePoint(28.9, 41.1),
      ST_MakePoint(28.9, 41.0)
    ])
  )::geography
) AS alan_m2;`,
        expectedResult: {
          kind: 'customValidator',
          fn: (rows) => {
            if (rows.length < 1) return false;
            const val = rows[0]?.['alan_m2'];
            return typeof val === 'number' && val > 0;
          },
        },
        hints: [
          'ST_MakePolygon bir LineString alır — çizginin kapalı olması gerekir (ilk = son nokta)',
          '::geography cast ile metrekarе cinsinden alan elde edersin',
          'ST_MakeLine(ARRAY[...]) ile nokta dizisinden çizgi oluşturabilirsin',
        ],
        explanation:
          'ST_MakePolygon kapalı bir LineString alır. ::geography cast sayesinde ST_Area metrekare döndürür. Koordinat sistemine bağlı doğruluk için geography kullanmak doğru yaklaşımdır.',
      },
    ],
    tags: ['st_isvalid', 'st_makevalid', 'geometry-validation'],
  },

  // ─── Modül 1.3 — SRID ve Projeksiyonlar ──────────────────────────────────
  {
    id: 'day-1-module-3-lesson-1',
    day: 1,
    module: 3,
    order: 1,
    title: 'Dünya yuvarlak, harita düz — bu neden önemli?',
    slug: 'lesson-1',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-2-lesson-6'],
    objectives: [
      "Dünya'nın düz bir haritaya tam aktarılamadığını açıklayabilir",
      'Projeksiyon hatalarının SQL hesaplarını nasıl etkilediğini gösterebilir',
      'SRID kavramının neden var olduğunu anlayabilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-1-why-projections.mdx',
    exercises: [],
    tags: ['projeksiyon', 'srid', 'temel', 'koordinat'],
  },
  {
    id: 'day-1-module-3-lesson-2',
    day: 1,
    module: 3,
    order: 2,
    title: 'SRID, EPSG ve spatial_ref_sys tablosu',
    slug: 'lesson-2',
    level: 'L1',
    estimatedMinutes: 15,
    prerequisites: ['day-1-module-3-lesson-1'],
    objectives: [
      'SRID ve EPSG kodunu açıklayabilir',
      'spatial_ref_sys tablosunu sorgulayabilir',
      'En sık kullanılan EPSG kodlarını ezberleyebilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-2-srid-epsg.mdx',
    exercises: [],
    tags: ['srid', 'epsg', 'spatial_ref_sys', '4326', '3857'],
  },
  {
    id: 'day-1-module-3-lesson-3',
    day: 1,
    module: 3,
    order: 3,
    title: 'Geometry vs Geography — kritik fark',
    slug: 'lesson-3',
    level: 'L1',
    estimatedMinutes: 15,
    prerequisites: ['day-1-module-3-lesson-2'],
    objectives: [
      'geometry ve geography tiplerinin farkını açıklayabilir',
      'İstanbul-Ankara mesafesini 3 farklı yöntemle hesaplayabilir',
      'Hangi tipte ne zaman kullanılacağına karar verebilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-3-geometry-vs-geography.mdx',
    exercises: [],
    tags: ['geometry', 'geography', 'mesafe', 'alan'],
  },
  {
    id: 'day-1-module-3-lesson-4',
    day: 1,
    module: 3,
    order: 4,
    title: 'ST_SetSRID ≠ ST_Transform',
    slug: 'lesson-4',
    level: 'L1',
    estimatedMinutes: 15,
    prerequisites: ['day-1-module-3-lesson-3'],
    objectives: [
      'ST_SetSRID ile ST_Transform farkını kesin olarak açıklayabilir',
      'Yanlış kullanımın sessiz hatalara nasıl yol açtığını gösterebilir',
      'Doğru dönüşüm zincirini yazabilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-4-setsrid-vs-transform.mdx',
    exercises: [],
    tags: ['st_setsrid', 'st_transform', 'dönüşüm'],
  },
  {
    id: 'day-1-module-3-lesson-5',
    day: 1,
    module: 3,
    order: 5,
    title: "Türkiye'de kullanılan EPSG'ler",
    slug: 'lesson-5',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-3-lesson-4'],
    objectives: [
      "Türkiye'de kullanılan başlıca EPSG kodlarını listeleyebilir",
      'Hangi bölge için hangi UTM dilimini seçeceğini belirleyebilir',
      'ITRF96 / TUREF datumunu tanıyabilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-5-turkey-epsg.mdx',
    exercises: [],
    tags: ['utm', 'epsg', 'türkiye', '32635', '32636', '32637', 'itrf96'],
  },
  {
    id: 'day-1-module-3-lesson-6',
    day: 1,
    module: 3,
    order: 6,
    title: 'Hangi durumda hangi projeksiyonu seçmeli?',
    slug: 'lesson-6',
    level: 'L1',
    estimatedMinutes: 10,
    prerequisites: ['day-1-module-3-lesson-5'],
    objectives: [
      'Proje gereksinimlerine göre koordinat sistemi seçimi yapabilir',
      'Depolama, hesaplama ve görüntüleme için uygun SRID belirleyebilir',
      'Modül 1.3 kavramlarını bir arada uygulayabilir',
    ],
    mdxPath: '/src/content/day-1/module-3/lesson-6-projection-decision.mdx',
    exercises: [],
    tags: ['projeksiyon-seçimi', 'karar-ağacı', 'utm', 'geography'],
  },

  // ─── Modül 1.4 — Mekansal İlişkiler ──────────────────────────────────────
  {
    id: 'day-1-module-4-lesson-1', day: 1, module: 4, order: 1,
    title: 'ST_Contains ve ST_Within — "içinde mi?"',
    slug: 'lesson-1', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-3-lesson-6'],
    objectives: ['ST_Contains ile nokta-poligon ilişkisi test edebilir', 'ST_Within ve ST_Contains ilişkisini açıklayabilir', 'Sınır kuralını (ST_Covers farkı) bilir'],
    mdxPath: '/src/content/day-1/module-4/lesson-1-contains-within.mdx',
    exercises: [], tags: ['st_contains', 'st_within', 'st_covers', 'topoloji'],
  },
  {
    id: 'day-1-module-4-lesson-2', day: 1, module: 4, order: 2,
    title: 'ST_Intersects ve ST_Disjoint',
    slug: 'lesson-2', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-4-lesson-1'],
    objectives: ['ST_Intersects ile kesişim testi yapabilir', 'ST_Disjoint performans dezavantajını açıklayabilir', 'Mekansal WHERE koşulu yazabilir'],
    mdxPath: '/src/content/day-1/module-4/lesson-2-intersects-disjoint.mdx',
    exercises: [], tags: ['st_intersects', 'st_disjoint', 'mekansal-filtre'],
  },
  {
    id: 'day-1-module-4-lesson-3', day: 1, module: 4, order: 3,
    title: 'ST_Touches, ST_Crosses, ST_Overlaps',
    slug: 'lesson-3', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-4-lesson-2'],
    objectives: ['Üç ince topolojik ayrımı açıklayabilir', 'DE-9IM matrisini kavramsal düzeyde anlayabilir', 'Komşu poligon tespiti yapabilir'],
    mdxPath: '/src/content/day-1/module-4/lesson-3-touches-crosses-overlaps.mdx',
    exercises: [], tags: ['st_touches', 'st_crosses', 'st_overlaps', 'de9im'],
  },
  {
    id: 'day-1-module-4-lesson-4', day: 1, module: 4, order: 4,
    title: 'ST_DWithin — "N metre içinde"',
    slug: 'lesson-4', level: 'L1', estimatedMinutes: 15,
    prerequisites: ['day-1-module-4-lesson-3'],
    objectives: ['ST_DWithin ile mesafeye dayalı filtre yazabilir', 'ST_DWithin vs ST_Distance performans farkını açıklayabilir', 'geography ile metre cinsinden kullanabilir'],
    mdxPath: '/src/content/day-1/module-4/lesson-4-dwithin.mdx',
    exercises: [], tags: ['st_dwithin', 'proximity', 'mesafe-filtresi'],
  },
  {
    id: 'day-1-module-4-lesson-5', day: 1, module: 4, order: 5,
    title: 'JOIN ile mekansal birleştirme',
    slug: 'lesson-5', level: 'L1', estimatedMinutes: 15,
    prerequisites: ['day-1-module-4-lesson-4'],
    objectives: ['ST_Contains ile mekansal JOIN yazabilir', '"Hangi nokta hangi poligon içinde?" sorusunu SQL ile yanıtlayabilir', 'Aggregate + mekansal JOIN kombinasyonu kurabilir'],
    mdxPath: '/src/content/day-1/module-4/lesson-5-spatial-join.mdx',
    exercises: [], tags: ['spatial-join', 'st_contains', 'lateral-join'],
  },

  // ─── Modül 1.5 — Ölçüm ve Temel Analitik ─────────────────────────────────
  {
    id: 'day-1-module-5-lesson-1', day: 1, module: 5, order: 1,
    title: 'ST_Distance — mesafe hesabı (dikkat: SRID!)',
    slug: 'lesson-1', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-4-lesson-5'],
    objectives: ['ST_Distance doğru birimde kullanabilir', 'geography ve UTM yollarını karşılaştırabilir', 'Nokta-çizgi mesafesi hesaplayabilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-1-distance.mdx',
    exercises: [], tags: ['st_distance', 'mesafe', 'geography'],
  },
  {
    id: 'day-1-module-5-lesson-2', day: 1, module: 5, order: 2,
    title: 'ST_Area, ST_Perimeter, ST_Length',
    slug: 'lesson-2', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-1'],
    objectives: ['Poligon alanını m² ve km² cinsinden hesaplayabilir', 'Çevre ve uzunluk doğru birimde ölçebilir', 'MultiPolygon toplam alanı çıkarabilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-2-area-length.mdx',
    exercises: [], tags: ['st_area', 'st_perimeter', 'st_length'],
  },
  {
    id: 'day-1-module-5-lesson-3', day: 1, module: 5, order: 3,
    title: 'ST_Centroid vs ST_PointOnSurface',
    slug: 'lesson-3', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-2'],
    objectives: ['Ağırlık merkezi ile garantili yüzey noktası arasındaki farkı açıklayabilir', 'Concave poligonda centroid dışarıya düştüğünü gösterebilir', 'Etiket konumlandırma için doğru fonksiyon seçebilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-3-centroid.mdx',
    exercises: [], tags: ['st_centroid', 'st_pointonsurface', 'etiket'],
  },
  {
    id: 'day-1-module-5-lesson-4', day: 1, module: 5, order: 4,
    title: 'ST_Buffer — tampon bölge',
    slug: 'lesson-4', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-3'],
    objectives: ['ST_Buffer ile metre cinsinden tampon oluşturabilir', 'geography yöntemiyle doğru tampon çizebilir', 'Tampon + filtre kombinasyonu kurabilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-4-buffer.mdx',
    exercises: [], tags: ['st_buffer', 'tampon', 'etki-alani'],
  },
  {
    id: 'day-1-module-5-lesson-5', day: 1, module: 5, order: 5,
    title: 'ST_Union, ST_Intersection, ST_Difference',
    slug: 'lesson-5', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-4'],
    objectives: ['Geometri set işlemlerini uygulayabilir', 'Aggregate ST_Union ile çoklu poligon birleştirebilir', 'ST_Intersection boş sonuç durumunu yönetebilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-5-set-operations.mdx',
    exercises: [], tags: ['st_union', 'st_intersection', 'st_difference'],
  },
  {
    id: 'day-1-module-5-lesson-6', day: 1, module: 5, order: 6,
    title: 'ST_Envelope, ST_ConvexHull, ST_ConcaveHull',
    slug: 'lesson-6', level: 'L1', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-5'],
    objectives: ['Sınırlayıcı kutu ve dış bükey kabuk hesaplayabilir', 'ST_ConcaveHull target parametresini ayarlayabilir', 'Üç yöntemin alan farkını karşılaştırabilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-6-envelope-hull.mdx',
    exercises: [], tags: ['st_envelope', 'st_convexhull', 'st_concavehull'],
  },
  {
    id: 'day-1-module-5-lesson-7', day: 1, module: 5, order: 7,
    title: 'En yakın N komşu: <-> KNN operatörü',
    slug: 'lesson-7', level: 'L1', estimatedMinutes: 15,
    prerequisites: ['day-1-module-5-lesson-6'],
    objectives: ['<-> operatörü ile KNN sorgusu yazabilir', 'LATERAL JOIN ile her satır için en yakın komşu bulabilir', 'ST_DWithin + KNN kombinasyonu kurabilir'],
    mdxPath: '/src/content/day-1/module-5/lesson-7-knn.mdx',
    exercises: [], tags: ['knn', 'nearest-neighbor', 'lateral-join', 'gist'],
  },

  // ─── Modül 2.1 — Veri Yükleme ve Dönüştürme ─────────────────────────────
  {
    id: 'day-2-module-1-lesson-1', day: 2, module: 1, order: 1,
    title: 'CSV ve TSV yükleme: COPY vs INSERT',
    slug: 'lesson-1', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-1-module-5-lesson-7'],
    objectives: ['COPY komutu sözdizimini yazabilir', 'CSV başlık ve ayraç seçeneklerini ayarlayabilir', 'COPY ile INSERT arasındaki performans farkını açıklayabilir'],
    mdxPath: '/src/content/day-2/module-1/lesson-1-csv-import.mdx',
    exercises: [], tags: ['copy', 'csv', 'import', 'veri-yükleme'],
  },
  {
    id: 'day-2-module-1-lesson-2', day: 2, module: 1, order: 2,
    title: 'GeoJSON yükleme ve ST_GeomFromGeoJSON',
    slug: 'lesson-2', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-1-lesson-1'],
    objectives: ['JSON operatörleriyle GeoJSON parse edebilir', 'ST_GeomFromGeoJSON ile geometry oluşturabilir', 'Feature array\'ini normalize SQL ile satırlara açabilir'],
    mdxPath: '/src/content/day-2/module-1/lesson-2-geojson-load.mdx',
    exercises: [], tags: ['geojson', 'st_geomfromgeojson', 'json', 'import'],
  },
  {
    id: 'day-2-module-1-lesson-3', day: 2, module: 1, order: 3,
    title: 'Staging tablosu ile güvenli yükleme',
    slug: 'lesson-3', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-1-lesson-2'],
    objectives: ['Staging → validate → upsert pipeline tasarlayabilir', 'INSERT ON CONFLICT DO NOTHING kullanabilir', 'Hatalı satırları staging\'de bırakma stratejisini açıklayabilir'],
    mdxPath: '/src/content/day-2/module-1/lesson-3-staging-pattern.mdx',
    exercises: [], tags: ['staging', 'upsert', 'on-conflict', 'veri-kalitesi'],
  },
  {
    id: 'day-2-module-1-lesson-4', day: 2, module: 1, order: 4,
    title: 'Toplu dönüşüm: ST_Transform + UPDATE',
    slug: 'lesson-4', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-1-lesson-3'],
    objectives: ['Toplu UPDATE ile SRID dönüşümü yapabilir', 'Farklı kaynaklardan gelen veriler için normalize pipeline yazabilir', 'ALTER TABLE ile geometry sütun tipini değiştirebilir'],
    mdxPath: '/src/content/day-2/module-1/lesson-4-bulk-transform.mdx',
    exercises: [], tags: ['st_transform', 'bulk-update', 'srid-dönüşüm'],
  },

  // ─── Modül 2.2 — Geometri İşlemleri (Advanced) ───────────────────────────
  {
    id: 'day-2-module-2-lesson-1', day: 2, module: 2, order: 1,
    title: 'ST_Simplify ve ST_SimplifyPreserveTopology',
    slug: 'lesson-1', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-1-lesson-4'],
    objectives: ['Douglas-Peucker tolerans parametresini seçebilir', 'Topoloji koruyan simplify ile korumayanı karşılaştırabilir', 'Web harita için uygun tolerans değerini belirleyebilir'],
    mdxPath: '/src/content/day-2/module-2/lesson-1-simplify.mdx',
    exercises: [], tags: ['st_simplify', 'douglas-peucker', 'generalizasyon'],
  },
  {
    id: 'day-2-module-2-lesson-2', day: 2, module: 2, order: 2,
    title: 'ST_Subdivide — büyük poligonu parçala',
    slug: 'lesson-2', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-2-lesson-1'],
    objectives: ['ST_Subdivide ile poligon parçalama yapabilir', 'Sorgu performansına etkisini EXPLAIN ile gösterebilir', 'max_vertices parametresini ayarlayabilir'],
    mdxPath: '/src/content/day-2/module-2/lesson-2-subdivide.mdx',
    exercises: [], tags: ['st_subdivide', 'poligon-parçalama', 'performans'],
  },
  {
    id: 'day-2-module-2-lesson-3', day: 2, module: 2, order: 3,
    title: 'Doğrusal referans: ST_LineLocatePoint ve ST_LineInterpolatePoint',
    slug: 'lesson-3', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-2-lesson-2'],
    objectives: ['Çizgi üzerindeki konumu kesir olarak hesaplayabilir', 'Belirli uzaklıktaki noktayı interpolasyon ile bulabilir', 'ST_LineSubstring ile çizgi kesiti çıkarabilir'],
    mdxPath: '/src/content/day-2/module-2/lesson-3-linear-referencing.mdx',
    exercises: [], tags: ['doğrusal-referans', 'st_linelocatepoint', 'st_lineinterpolatepoint'],
  },
  {
    id: 'day-2-module-2-lesson-4', day: 2, module: 2, order: 4,
    title: 'ST_ClosestPoint ve ST_ShortestLine',
    slug: 'lesson-4', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-2-lesson-3'],
    objectives: ['İki geometri arasındaki en kısa bağlantıyı çizebilir', 'ST_ClosestPoint ile projeksiyon noktası bulabilir', 'Çizgiye en yakın noktayı hesaplayabilir'],
    mdxPath: '/src/content/day-2/module-2/lesson-4-closest-point.mdx',
    exercises: [], tags: ['st_closestpoint', 'st_shortestline', 'projeksiyon'],
  },
  {
    id: 'day-2-module-2-lesson-5', day: 2, module: 2, order: 5,
    title: 'ST_Azimuth — yön hesabı',
    slug: 'lesson-5', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-2-lesson-4'],
    objectives: ['İki nokta arasındaki açıyı radyandan dereceye dönüştürebilir', 'Kuzey referanslı yön açısını hesaplayabilir', 'Yön bazlı filtreleme yapabilir'],
    mdxPath: '/src/content/day-2/module-2/lesson-5-azimuth.mdx',
    exercises: [], tags: ['st_azimuth', 'yön', 'açı', 'bearing'],
  },

  // ─── Modül 2.3 — İndeks ve Performans ────────────────────────────────────
  {
    id: 'day-2-module-3-lesson-1', day: 2, module: 3, order: 1,
    title: 'Neden mekansal indeks gerekli?',
    slug: 'lesson-1', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-2-lesson-5'],
    objectives: ['Seq scan vs indeks scan farkını ölçebilir', 'R-Tree yapısını kavramsal düzeyde açıklayabilir', 'İndeks olmadan EXPLAIN planını okuyabilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-1-why-index.mdx',
    exercises: [], tags: ['indeks', 'seq-scan', 'r-tree', 'performans'],
  },
  {
    id: 'day-2-module-3-lesson-2', day: 2, module: 3, order: 2,
    title: 'CREATE INDEX USING GIST — temel',
    slug: 'lesson-2', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-1'],
    objectives: ['GIST indeks oluşturabilir', 'CONCURRENTLY seçeneğini açıklayabilir', 'İndeks sonrası plan değişimini EXPLAIN ile gösterebilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-2-create-gist.mdx',
    exercises: [], tags: ['gist', 'create-index', 'concurrently'],
  },
  {
    id: 'day-2-module-3-lesson-3', day: 2, module: 3, order: 3,
    title: 'SP-GIST — nokta yoğun veri için',
    slug: 'lesson-3', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-2'],
    objectives: ['SP-GIST ve GIST yapısal farkını açıklayabilir', 'Hangi veri tipinde hangisini kullanacağına karar verebilir', 'SP-GIST indeks oluşturabilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-3-spgist.mdx',
    exercises: [], tags: ['spgist', 'quadtree', 'nokta-indeks'],
  },
  {
    id: 'day-2-module-3-lesson-4', day: 2, module: 3, order: 4,
    title: 'Bounding Box operatörü: &&',
    slug: 'lesson-4', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-3'],
    objectives: ['&& operatörünün iki aşamalı filtrelemeyi nasıl kullandığını açıklayabilir', 'ST_Intersects içinde otomatik && kullanıldığını gösterebilir', '~, @, ~= bbox operatörlerini tanıyabilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-4-bbox-operator.mdx',
    exercises: [], tags: ['bbox', '&&', 'iki-aşamalı-filtre'],
  },
  {
    id: 'day-2-module-3-lesson-5', day: 2, module: 3, order: 5,
    title: 'Partial ve Functional index',
    slug: 'lesson-5', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-4'],
    objectives: ['WHERE koşullu partial index oluşturabilir', 'Cast ifadesi üzerine functional index yazabilir', 'Hangi durumda hangi indeks türünü seçeceğine karar verebilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-5-partial-functional-index.mdx',
    exercises: [], tags: ['partial-index', 'functional-index', 'geography-cast'],
  },
  {
    id: 'day-2-module-3-lesson-6', day: 2, module: 3, order: 6,
    title: 'pg_stat_user_indexes ile kullanım izleme',
    slug: 'lesson-6', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-5'],
    objectives: ['pg_stat_user_indexes ile indeks kullanım sayısını sorgulayabilir', 'Kullanılmayan indeksleri tespit edebilir', 'pg_stat_user_tables ile seq/index scan oranını izleyebilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-6-pg-stat-indexes.mdx',
    exercises: [], tags: ['pg_stat_user_indexes', 'indeks-izleme', 'kullanılmayan-indeks'],
  },
  {
    id: 'day-2-module-3-lesson-7', day: 2, module: 3, order: 7,
    title: 'ANALYZE — istatistikleri güncelle',
    slug: 'lesson-7', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-3-lesson-6'],
    objectives: ['ANALYZE komutunun ne yaptığını açıklayabilir', 'pg_stats ile sütun istatistiklerini inceleyebilir', 'Büyük yükleme sonrası neden manuel ANALYZE gerektiğini söyleyebilir'],
    mdxPath: '/src/content/day-2/module-3/lesson-7-analyze.mdx',
    exercises: [], tags: ['analyze', 'istatistik', 'planlayıcı', 'autovacuum'],
  },

  // ─── Modül 2.4 — EXPLAIN ANALYZE ile Sorgu Optimizasyonu ─────────────────
  {
    id: 'day-2-module-4-lesson-1', day: 2, module: 4, order: 1,
    title: 'EXPLAIN ANALYZE temelleri',
    slug: 'lesson-1', level: 'L2', estimatedMinutes: 15,
    prerequisites: ['day-2-module-3-lesson-7'],
    objectives: ['EXPLAIN ve EXPLAIN ANALYZE farkını açıklayabilir', 'Plan anatomisini (cost, rows, actual time) okuyabilir', 'BUFFERS ve FORMAT JSON seçeneklerini kullanabilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-1-explain-analyze-basics.mdx',
    exercises: [], tags: ['explain', 'analyze', 'plan', 'cost'],
  },
  {
    id: 'day-2-module-4-lesson-2', day: 2, module: 4, order: 2,
    title: 'Seq Scan, Index Scan, Bitmap Heap Scan',
    slug: 'lesson-2', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-4-lesson-1'],
    objectives: ['Üç scan tipini açıklayabilir', 'Planlayıcının neden seq scan seçtiğini anlayabilir', 'enable_seqscan ile zorlamalı test yapabilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-2-seq-index-scan.mdx',
    exercises: [], tags: ['seq-scan', 'index-scan', 'bitmap-scan'],
  },
  {
    id: 'day-2-module-4-lesson-3', day: 2, module: 4, order: 3,
    title: 'Cost ve rows tahmini nasıl okunur?',
    slug: 'lesson-3', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-4-lesson-2'],
    objectives: ['cost=X..Y değerini yorumlayabilir', 'Tahmini vs gerçek rows farkını tespit edebilir', 'İstatistik hedefini artırarak tahmini iyileştirebilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-3-reading-cost-rows.mdx',
    exercises: [], tags: ['cost', 'rows-tahmin', 'istatistik'],
  },
  {
    id: 'day-2-module-4-lesson-4', day: 2, module: 4, order: 4,
    title: 'ST_Distance antipattern ve ST_DWithin',
    slug: 'lesson-4', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-4-lesson-3'],
    objectives: ['ST_Distance < x\'in neden indeks kullanmadığını açıklayabilir', 'ST_DWithin ile her zaman değiştirebilir', 'KNN <-> operatörünü doğru kullanabilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-4-st-distance-antipattern.mdx',
    exercises: [], tags: ['st_distance', 'antipattern', 'st_dwithin', 'knn'],
  },
  {
    id: 'day-2-module-4-lesson-5', day: 2, module: 4, order: 5,
    title: 'WHERE içinde fonksiyon kullanımı (sargable)',
    slug: 'lesson-5', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-4-lesson-4'],
    objectives: ['Sargable vs non-sargable koşul farkını açıklayabilir', 'ST_X/ST_Y gibi fonksiyonları bbox ile değiştirebilir', 'Değiştirilemiyorsa functional index oluşturabilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-5-function-in-where.mdx',
    exercises: [], tags: ['sargable', 'non-sargable', 'functional-index', 'st_x'],
  },
  {
    id: 'day-2-module-4-lesson-6', day: 2, module: 4, order: 6,
    title: 'EXPLAIN FORMAT JSON — araçlarla entegrasyon',
    slug: 'lesson-6', level: 'L2', estimatedMinutes: 14,
    prerequisites: ['day-2-module-4-lesson-5'],
    objectives: ['JSON plan formatını parse edebilir', 'En pahalı node\'u bulabilir', 'Planning Time ve Execution Time ayrımını yorumlayabilir'],
    mdxPath: '/src/content/day-2/module-4/lesson-6-explain-json.mdx',
    exercises: [], tags: ['explain-json', 'plan-analiz', 'planning-time'],
  },

  // ─── Modül 2.5 — Büyük Veri ve Partitioning ──────────────────────────────
  {
    id: 'day-2-module-5-lesson-1', day: 2, module: 5, order: 1,
    title: 'VACUUM ve tablo bloat',
    slug: 'lesson-1', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-4-lesson-6'],
    objectives: ['MVCC ve ölü satır kavramını açıklayabilir', 'VACUUM ile VACUUM FULL farkını söyleyebilir', 'pg_stat_user_tables ile bloat oranını ölçebilir'],
    mdxPath: '/src/content/day-2/module-5/lesson-1-vacuum-bloat.mdx',
    exercises: [], tags: ['vacuum', 'bloat', 'mvcc', 'autovacuum'],
  },
  {
    id: 'day-2-module-5-lesson-2', day: 2, module: 5, order: 2,
    title: 'Range Partitioning — zaman bazlı bölümleme',
    slug: 'lesson-2', level: 'L2', estimatedMinutes: 12,
    prerequisites: ['day-2-module-5-lesson-1'],
    objectives: ['PARTITION BY RANGE sözdizimini yazabilir', 'Aylık partition oluşturabilir', 'Partition pruning\'i EXPLAIN ile doğrulayabilir'],
    mdxPath: '/src/content/day-2/module-5/lesson-2-range-partitioning.mdx',
    exercises: [], tags: ['partitioning', 'range-partition', 'partition-pruning'],
  },
  {
    id: 'day-2-module-5-lesson-3', day: 2, module: 5, order: 3,
    title: 'List Partitioning — kategori bazlı bölümleme',
    slug: 'lesson-3', level: 'L2', estimatedMinutes: 10,
    prerequisites: ['day-2-module-5-lesson-2'],
    objectives: ['PARTITION BY LIST sözdizimini yazabilir', 'Şehir veya ülke bazlı partition oluşturabilir', 'DEFAULT partition ile beklenmedik değerleri yönetebilir'],
    mdxPath: '/src/content/day-2/module-5/lesson-3-list-partitioning.mdx',
    exercises: [], tags: ['list-partition', 'kategori', 'default-partition'],
  },
  {
    id: 'day-2-module-5-lesson-4', day: 2, module: 5, order: 4,
    title: 'Partition Pruning — hangi partition atlanır?',
    slug: 'lesson-4', level: 'L2', estimatedMinutes: 13,
    prerequisites: ['day-2-module-5-lesson-3'],
    objectives: ['Pruning\'in çalışma koşullarını açıklayabilir', 'enable_partition_pruning ile test yapabilir', 'Fonksiyon kullanımının pruning\'i nasıl engellediğini gösterebilir'],
    mdxPath: '/src/content/day-2/module-5/lesson-4-partition-pruning.mdx',
    exercises: [], tags: ['partition-pruning', 'static-pruning', 'runtime-pruning'],
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

/** Modüldeki tüm dersler */
export function getLessonsByModule(day: number, module: number): Lesson[] {
  return CURRICULUM.filter((l) => l.day === day && l.module === module).sort((a, b) => a.order - b.order);
}

/** Sonraki ders — modül sınırını aşabilir */
export function getNextLesson(current: Lesson): Lesson | null {
  const sameModule = getLessonsByModule(current.day, current.module);
  const idx = sameModule.findIndex((l) => l.id === current.id);
  if (idx < sameModule.length - 1) return sameModule[idx + 1] ?? null;
  // Sonraki modülün ilk dersi
  const nextModuleLessons = getLessonsByModule(current.day, current.module + 1);
  return nextModuleLessons[0] ?? null;
}

/** Önceki ders */
export function getPrevLesson(current: Lesson): Lesson | null {
  const sameModule = getLessonsByModule(current.day, current.module);
  const idx = sameModule.findIndex((l) => l.id === current.id);
  if (idx > 0) return sameModule[idx - 1] ?? null;
  // Önceki modülün son dersi
  const prevModuleLessons = getLessonsByModule(current.day, current.module - 1);
  return prevModuleLessons[prevModuleLessons.length - 1] ?? null;
}

/** Curriculum ağacı: gün → modül → dersler */
export interface CurriculumNode {
  day: 1 | 2 | 3;
  module: number;
  moduleTitle: string;
  durationMinutes: number;
  lessons: Lesson[];
}

export function getCurriculumTree(): CurriculumNode[] {
  return MODULE_META.map((meta) => ({
    day: meta.day,
    module: meta.module,
    moduleTitle: meta.title,
    durationMinutes: meta.durationMinutes,
    lessons: getLessonsByModule(meta.day, meta.module),
  })).filter((node) => node.lessons.length > 0);
}
