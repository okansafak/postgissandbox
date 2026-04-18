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
  { day: 2, module: 4, title: 'Büyük Veri ve Partitioning', durationMinutes: 60 },
  { day: 2, module: 5, title: 'Raster Temelleri', durationMinutes: 60 },
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
