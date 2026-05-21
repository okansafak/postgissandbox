-- ============================================================
-- Konya BB PostGIS Eğitimi — Tüm Sorgular
-- Bölüm 0, 1, 2, 3'teki tüm SQL örnekleri
-- ============================================================

-- ============================================================
-- BÖLÜM 0: SQL'E GİRİŞ
-- ============================================================

-- 0.2 Veritabanı Nedir?
-- Bağlantı ve sürüm bilgisini göster
SELECT current_user, current_database(), version();


-- 50.000+ nüfuslu ilçeler
SELECT ad
FROM konya.ilce_sinirlari t 
WHERE nufus > 50000

-- 0.3 Cluster, Database ve Schema
-- Aktif bağlantı bilgisi
SELECT current_database(),  -- Hangi veritabanında?
       current_schema(),    -- Hangi şemada?
       current_user;        -- Kim olarak?

-- Tüm şemaları listele
SELECT nspname AS sema_adi
FROM pg_namespace
WHERE nspname NOT LIKE 'pg_%'
ORDER BY nspname;

-- konya şeması altındaki tüm tabloları listele
SELECT 
    schemaname AS sema_adi,
    tablename  AS tablo_adi
FROM pg_tables
WHERE schemaname = 'konya'
ORDER BY tablename;

-- mahalleler tablosundaki tüm kolonları listele
SELECT
    table_schema AS sema_adi,
    table_name   AS tablo_adi,
    column_name  AS kolon_adi,
    data_type    AS veri_tipi
FROM information_schema.columns
WHERE table_schema = 'konya'
  AND table_name = 'mahalleler'
ORDER BY ordinal_position;

-- Şema oluşturma (görev)
CREATE SCHEMA egitim;
SET search_path = egitim;

-- 0.4.3 Veri Tipleri: Örnek Uygulama
-- Personel tablosu oluşturma
CREATE TABLE konya.personel (
    id          SERIAL PRIMARY KEY,
    tc_kimlik   VARCHAR(11) NOT NULL UNIQUE,
    ad          TEXT NOT NULL,
    soyad       TEXT NOT NULL,
    birim       TEXT,
    maas        NUMERIC(12, 2) CHECK (maas >= 0),
    ise_giris   DATE,
    aktif       BOOLEAN DEFAULT true,
    ek_bilgiler JSONB
);

-- Tabloya veri ekleme
INSERT INTO konya.personel
    (tc_kimlik, ad, soyad, birim, maas, ise_giris, ek_bilgiler)
VALUES
    ('12345678901', 'Ahmet', 'Yılmaz', 'CBS', 45000.50, '2022-01-15',
     '{"telefon": "05551234567"}'::jsonb);

-- 0.4.4 Constraints (Veri Bütünlüğü)
-- Hastaneler tablosu: tüm constraint tipleriyle
CREATE TABLE konya.hastaneler (
    id           SERIAL PRIMARY KEY,
    ad           TEXT NOT NULL,
    yatak_sayisi INT CHECK (yatak_sayisi > 0),
    kodu         VARCHAR(10) UNIQUE,
    mahalle_id   INT REFERENCES konya.mahalleler(id)
);

-- Mevcut constraint'leri listele
SELECT conname, contype FROM pg_constraint WHERE conrelid = 'konya.personel'::regclass;

-- 0.5 SELECT ve Sütun Seçimi
SELECT ad || ' Belediyesi' AS kurum_adi,
       nufus AS kisi_sayisi,
       nufus / 1000.0 AS nufus_k,
       'KONYA' AS sehir
FROM konya.ilce_sinirlari;

-- 0.6 WHERE ile Filtreleme
-- 1) Sayısal kıyaslama + BETWEEN
SELECT ad, soyad, maas
FROM konya.personel
WHERE maas BETWEEN 40000 AND 70000
  AND aktif = true;

-- 2) IN + IS NOT NULL
SELECT ad, ilce
FROM konya.mahalleler
WHERE ilce IN ('Selçuklu', 'Karatay', 'Meram')
  AND geom IS NOT NULL;

-- 3) ILIKE + OR + parantez
SELECT ad, ilce
FROM konya.mahalleler
WHERE (ad ILIKE '%yeni%' OR ad ILIKE 'ata%')
  AND ilce != 'Akşehir';

-- Görev: Selçuklu'nun 5.000-15.000 nüfuslu mahalleleri
SELECT ad, nufus FROM konya.mahalleler
WHERE ilce = 'Selçuklu' AND nufus BETWEEN 5000 AND 15000
ORDER BY nufus DESC;

-- 0.7 ORDER BY ve LIMIT
SELECT ad, nufus
FROM konya.ilce_sinirlari
ORDER BY nufus DESC
LIMIT 5 OFFSET 0;

-- Görev: En az nüfuslu 3 mahalle
SELECT ad, nufus FROM konya.mahalleler ORDER BY nufus ASC LIMIT 3;

-- 0.8 Toplama Fonksiyonları
SELECT COUNT(*) AS toplam_ilce,
       SUM(nufus) AS toplam_nufus
FROM konya.ilce_sinirlari;

-- Görev: Ortalama nüfus
SELECT AVG(nufus) FROM konya.ilce_sinirlari;

-- 0.9 GROUP BY ve HAVING
SELECT ilce, COUNT(*)
FROM konya.mahalleler
GROUP BY ilce
HAVING COUNT(*) > 5;

-- Görev: Birimlere göre toplam maaş
SELECT birim, SUM(maas) FROM konya.personel GROUP BY birim ORDER BY SUM(maas) DESC;

-- 0.10 JOIN ve Tablo İlişkileri
SELECT m.ad AS mahalle, p.ad AS yer_adi
FROM konya.mahalleler m
JOIN konya.poi p ON p.mahalle_id = m.id;

-- Görev: Hastanesi olmayan mahalleler (LEFT JOIN)
SELECT m.ad FROM konya.mahalleler m
LEFT JOIN konya.poi p ON p.mahalle_id = m.id
WHERE p.id IS NULL;

-- 0.11 İndeks Yönetimi
CREATE INDEX idx_personel_birim ON konya.personel(birim);
CREATE INDEX idx_mahalleler_ilce ON konya.mahalleler(ilce);

-- Şema bazında indeks listesi
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'konya'
ORDER BY tablename;

-- Gereksiz indeksi kaldır
DROP INDEX konya.idx_personel_birim;

-- 0.12 Veri Yönetimi (DML)
-- INSERT
INSERT INTO konya.mahalleler(ad, nufus, ilce)
VALUES ('Yeni Mahalle', 1500, 'Selçuklu');

-- UPDATE
UPDATE konya.mahalleler SET nufus = 1250
WHERE ad = 'Yeni Mahalle';

-- DELETE
DELETE FROM konya.mahalleler
WHERE ad = 'Yeni Mahalle';

-- 0.13 MVCC ve Transaction Yapısı
BEGIN;
  INSERT INTO konya.mahalleler(ad, nufus, ilce)
  VALUES ('Test Mahalle', 100, 'Selçuklu');

  UPDATE konya.mahalleler SET nufus = 150
  WHERE ad = 'Test Mahalle';

COMMIT;
-- ROLLBACK;  -- Hata durumunda tüm değişiklikleri geri al

-- 0.14 Isolation Levels ve Lock Mekanizması
SHOW transaction_isolation;

BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
COMMIT;

-- Lock'a düşmüş sorguları izle
SELECT pid, query, wait_event, state
FROM pg_stat_activity
WHERE wait_event_type = 'Lock';

-- 0.15 VACUUM, ANALYZE ve Autovacuum
-- Dead tuple / bloat kontrolü
SELECT relname, n_dead_tup, n_live_tup,
  round(n_dead_tup * 100.0 /
    NULLIF(n_live_tup + n_dead_tup, 0), 1) AS bloat_pct
FROM pg_stat_all_tables
WHERE schemaname = 'konya'
ORDER BY n_dead_tup DESC;

-- Manuel bakım
VACUUM konya.mahalleler;
VACUUM FULL konya.mahalleler;  -- Dikkat: tablo kilitlenir!
ANALYZE konya.mahalleler;

-- 0.16 pg_stat_activity ve Performans Takibi
SELECT pid,
       now() - query_start AS sure,
       query, state, wait_event
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY sure DESC;

-- 5 dakikadan uzun çalışan sorguyu durdur
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start < now() - interval '5 minutes';

-- 0.17 Tablespace Mantığı
SELECT spcname AS adi,
       pg_tablespace_location(oid) AS konum
FROM pg_tablespace;

CREATE TABLESPACE ssd_fast LOCATION '/mnt/ssd/pgdata';
ALTER TABLE konya.mahalleler SET TABLESPACE ssd_fast;


-- ============================================================
-- BÖLÜM 1: SPATIAL SQL FUNDAMENTALS
-- ============================================================

-- 1.1 Platforma Giriş
SELECT postgis_full_version();  -- PostGIS ve bağımlılık sürümleri

SELECT postgis_version();       -- Kısa sürüm bilgisi

-- 1.2 Geometri Tipleri
-- Karma geometri koleksiyonu oluşturma
SELECT ST_GeomFromText('GEOMETRYCOLLECTION(POINT(0 0),LINESTRING(1 1,2 2))');

-- Görev: Poligon oluşturma
SELECT ST_GeomFromText('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))');

-- 1.3 WKT, EWKT, WKB ve Metadata
SELECT
  ST_AsText(geom)   AS wkt,     -- Well-Known Text
  ST_AsBinary(geom) AS wkb,     -- Well-Known Binary
  ST_AsEWKT(geom)   AS ewkt     -- Extended WKT (SRID'li)
FROM konya.mahalleler LIMIT 1;

-- EWKT ile geometri oluşturma
SELECT 'SRID=4326;POINT(32.4920 37.8727)'::geometry AS alaaddin_tepesi;

-- Mekansal sütun metadata görünümü
SELECT * FROM geometry_columns;

-- Görev: Geometriyi metin olarak gör
SELECT ST_AsText(geom) FROM konya.mahalleler LIMIT 1;

-- 1.4 SRID ve Projeksiyonlar
-- WGS84 projeksiyon parametreleri
SELECT * FROM spatial_ref_sys WHERE srid = 4326;

-- Görev: Türkiye TM33 sistemi parametreleri
SELECT srtext FROM spatial_ref_sys WHERE srid = 5255;

-- 1.5 Geometry vs Geography Ayrımı
-- Geography tipiyle kuş uçuşu mesafe (metre)
SELECT ST_Distance(
  'POINT(32.49 37.87)'::geography,
  'POINT(32.50 37.88)'::geography
) AS metre_mesafe;

-- Görev: Mahalle alanını metrekare cinsinden bul
SELECT ST_Area(geom::geography) FROM konya.mahalleler LIMIT 1;

-- 1.6 SetSRID != Transform ve Türkiye Sistemleri
-- TM33 ve UTM36N etiket karşılaştırması
WITH merkez AS (
  SELECT
    ST_SetSRID(ST_Point(450000, 4180000), 5255)  AS dogru_geom,
    ST_SetSRID(ST_Point(450000, 4180000), 32636) AS yanlis_geom
)
SELECT 'DOGRU (5255 — TM33)' AS durum,
  ST_AsText(ST_Transform(dogru_geom, 4326)) AS wgs84,
  ST_SRID(dogru_geom) AS srid
FROM merkez
UNION ALL
SELECT 'YANLIŞ (32636 SANDI)' AS durum,
  ST_AsText(ST_Transform(yanlis_geom, 4326)) AS wgs84,
  ST_SRID(yanlis_geom) AS srid
FROM merkez;

-- TM33 ve UTM36N parametrelerini yan yana gör
SELECT srtext FROM spatial_ref_sys WHERE srid IN (5255, 32636);

-- 1.7 Mekansal İlişkiler: Contains, Within, Intersects
-- Noktayla kesişen mahalleyi bul
SELECT * FROM konya.mahalleler
WHERE ST_Intersects(geom, ST_MakePoint(32.49, 37.87));

-- Görev: Poligonla kesişen mahalleleri bul
SELECT m.ad FROM konya.mahalleler m
WHERE ST_Intersects(m.geom,
  ST_GeomFromText('POLYGON((32.49 37.87, 32.51 37.87, 32.51 37.89, 32.49 37.89, 32.49 37.87))', 4326));

-- 1.8 İleri İlişkiler: Touches, Crosses, DWithin
-- 500m mesafe filtresi (index dostu)
SELECT * FROM konya.osm_binalar
WHERE ST_DWithin(geom::geography, 'POINT(32.49 37.87)'::geography, 500);

-- Görev: Çizgiyle kesişen yollar
SELECT id FROM konya.osm_yollar
WHERE ST_Crosses(geom, ST_GeomFromText('LINESTRING(32.48 37.86, 32.52 37.89)', 4326));

-- 1.9 JOIN ile Mekansal İlişki
SELECT b.id, m.ad
FROM konya.osm_binalar b
JOIN konya.mahalleler m
  ON ST_Intersects(b.geom, m.geom)
LIMIT 5;

-- Görev: Hastane-Mahalle spatial join
SELECT p.ad, m.ad
FROM konya.poi p
JOIN konya.mahalleler m ON ST_Within(p.geom, m.geom)
WHERE p.kategori ILIKE '%hastane%';

-- 1.10 GiST Mekansal İndeks
CREATE INDEX idx_mahalleler_geom ON konya.mahalleler USING GIST (geom);
CREATE INDEX idx_binalar_geom    ON konya.osm_binalar USING GIST (geom);

ANALYZE konya.mahalleler;

EXPLAIN ANALYZE
SELECT * FROM konya.mahalleler
WHERE ST_Intersects(geom, ST_MakePoint(32.49, 37.87));

-- İndeks kullanım istatistikleri
SELECT indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'konya';

-- 1.11 Ölçüm Fonksiyonları
SELECT
  ad,
  ST_Area(geom::geography)      AS alan_m2,
  ST_Perimeter(geom::geography) AS cevre_m,
  ST_Length(ST_Boundary(geom)::geography) AS sinir_m
FROM konya.mahalleler LIMIT 3;

-- İki nokta arası mesafe
SELECT ST_Distance(
  ST_SetSRID(ST_Point(32.4920, 37.8727), 4326)::geography,
  ST_SetSRID(ST_Point(32.5120, 37.8927), 4326)::geography
) AS metre;

-- Görev: Yol uzunluğu
SELECT ST_Length(geom::geography) FROM konya.osm_yollar LIMIT 5;

-- 1.12 Mesafe Yöntemleri Karşılaştırması (7 farklı yöntem)
WITH geom AS (
  SELECT
    ST_SetSRID(ST_Point(32.4846, 37.8719), 4326) AS p0,
    ST_SetSRID(ST_Point(32.4846 + 0.05, 37.8719), 4326) AS p_east,
    ST_SetSRID(ST_Point(32.4846, 37.8719 + 0.05), 4326) AS p_north,
    ST_SetSRID(ST_Point(32.4846 - 0.035355, 37.8719 + 0.035355), 4326) AS p_nw
)
SELECT 'YATAY (DOĞU)' AS yon,
  ROUND(ST_DistanceSphere(p0, p_east)::numeric, 2)::text AS pg_sphere_m,
  ROUND((6371000*2*ASIN(SQRT(POWER(SIN(RADIANS(ST_Y(p_east)-ST_Y(p0))/2),2)+COS(RADIANS(ST_Y(p0)))*COS(RADIANS(ST_Y(p_east)))*POWER(SIN(RADIANS(ST_X(p_east)-ST_X(p0))/2),2))))::numeric,2)::text AS math_haversine_m,
  ROUND(ST_Distance(p0::geography, p_east::geography)::numeric, 2)::text AS geography_m,
  ROUND(ST_DistanceSpheroid(p0, p_east, 'SPHEROID["WGS 84",6378137,298.257223563]')::numeric, 2)::text AS spheroid_m,
  ROUND(ST_Distance(ST_Transform(p0, 32636), ST_Transform(p_east, 32636))::numeric, 2)::text AS utm6_m,
  ROUND(ST_Distance(ST_Transform(p0, 5255),  ST_Transform(p_east, 5255))::numeric, 2)::text AS itrf3_m,
  ROUND(ST_Distance(ST_Transform(p0, 3857),  ST_Transform(p_east, 3857))::numeric, 2)::text AS web_mercator_m
FROM geom
UNION ALL
SELECT 'DÜŞEY (KUZEY)',
  ROUND(ST_DistanceSphere(p0, p_north)::numeric, 2)::text,
  ROUND((6371000*2*ASIN(SQRT(POWER(SIN(RADIANS(ST_Y(p_north)-ST_Y(p0))/2),2)+COS(RADIANS(ST_Y(p0)))*COS(RADIANS(ST_Y(p_north)))*POWER(SIN(RADIANS(ST_X(p_north)-ST_X(p0))/2),2))))::numeric,2)::text,
  ROUND(ST_Distance(p0::geography, p_north::geography)::numeric, 2)::text,
  ROUND(ST_DistanceSpheroid(p0, p_north, 'SPHEROID["WGS 84",6378137,298.257223563]')::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 32636), ST_Transform(p_north, 32636))::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 5255),  ST_Transform(p_north, 5255))::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 3857),  ST_Transform(p_north, 3857))::numeric, 2)::text
FROM geom
UNION ALL
SELECT 'ÇAPRAZ (HİPOTENÜS)',
  ROUND(ST_DistanceSphere(p0, p_nw)::numeric, 2)::text,
  ROUND((6371000*2*ASIN(SQRT(POWER(SIN(RADIANS(ST_Y(p_nw)-ST_Y(p0))/2),2)+COS(RADIANS(ST_Y(p0)))*COS(RADIANS(ST_Y(p_nw)))*POWER(SIN(RADIANS(ST_X(p_nw)-ST_X(p0))/2),2))))::numeric,2)::text,
  ROUND(ST_Distance(p0::geography, p_nw::geography)::numeric, 2)::text,
  ROUND(ST_DistanceSpheroid(p0, p_nw, 'SPHEROID["WGS 84",6378137,298.257223563]')::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 32636), ST_Transform(p_nw, 32636))::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 5255),  ST_Transform(p_nw, 5255))::numeric, 2)::text,
  ROUND(ST_Distance(ST_Transform(p0, 3857),  ST_Transform(p_nw, 3857))::numeric, 2)::text
FROM geom
UNION ALL
SELECT 'BİLGİ',
  'Küre Sabit R', 'Trig Haversine', 'Hassas Jeodezik',
  'WGS84 Spheroid', 'UTM (6 derece)', 'ITRF (3 derece)', 'Web Mercator (Hatalı)';

-- 1.13 Centroid vs PointOnSurface
SELECT ST_AsText(ST_Centroid(geom)) FROM konya.mahalleler LIMIT 1;
SELECT ST_AsText(ST_PointOnSurface(geom)) FROM konya.mahalleler LIMIT 1;

-- 1.14 Buffer, Intersection, Union ve Difference
-- TAMPON BÖLGE (Buffer) — 500m coğrafi tampon
SELECT ST_Buffer(geom::geography, 500)::geometry AS tampon_500m
FROM konya.osm_yollar LIMIT 1;

-- KESİŞİM (Intersection) — iki geometrinin ortak alanı
SELECT ST_Intersection(a.geom, b.geom) AS kesisim_alani
FROM konya.mahalleler a
JOIN konya.mahalleler b ON ST_Intersects(a.geom, b.geom)
WHERE a.ad <> b.ad LIMIT 1;

-- BİRLEŞİM (Union) — ilçe mahallelerini tek sınıra birleştir
SELECT ST_Union(geom) AS selcuklu_siniri
FROM konya.mahalleler WHERE ilce = 'Selçuklu';

-- FARK (Difference) — A'dan B'yi çıkar
SELECT ST_Difference(a.geom, b.geom) AS a_eksi_b
FROM konya.mahalleler a
JOIN konya.mahalleler b ON ST_Intersects(a.geom, b.geom)
WHERE a.ad <> b.ad LIMIT 1;

-- Görev: SymDifference
SELECT ST_AsText(ST_SymDifference(a.geom, b.geom))
FROM konya.mahalleler a, konya.mahalleler b
WHERE ST_Intersects(a.geom, b.geom) AND a.ad <> b.ad LIMIT 1;

-- 1.15 Dissolve ve Clip
-- BÜTÜNLEŞTİR (Dissolve) — ilçe sınırlarını mahalleleri eriterek oluştur
SELECT ilce,
  ST_Union(geom)  AS ilce_sinir,
  COUNT(*)        AS mahalle_sayisi,
  ROUND(ST_Area(ST_Union(geom)::geography)::numeric / 1e6, 2) AS alan_km2
FROM konya.mahalleler
GROUP BY ilce
ORDER BY alan_km2 DESC;

-- KIRPMA (Clip) — tanımlı kutu içinde kalan kısımları kes
WITH clip_alani AS (
  SELECT ST_MakeEnvelope(32.45, 37.85, 32.55, 37.95, 4326) AS bbox
)
SELECT m.ad,
  ST_Intersection(m.geom, c.bbox) AS kirpilmis_geom,
  ROUND(ST_Area(ST_Intersection(m.geom, c.bbox)::geography)::numeric, 2) AS alan_m2
FROM konya.mahalleler m, clip_alani c
WHERE m.geom && c.bbox
  AND ST_Intersects(m.geom, c.bbox);

-- Görev: İlçe alanlarını büyükten küçüğe sırala
SELECT ilce, ROUND(ST_Area(ST_Union(geom)::geography)::numeric/1e6, 2) AS km2
FROM konya.mahalleler GROUP BY ilce ORDER BY km2 DESC;

-- 1.16 Envelope ve ConvexHull
-- Tek geometrinin zarfı ve konveks zarfı
SELECT
  ST_AsText(ST_Envelope(geom))    AS bbox,
  ST_AsText(ST_ConvexHull(geom))  AS konveks_zarf,
  ST_NPoints(ST_Envelope(geom))   AS bbox_nokta_sayisi,
  ST_NPoints(ST_ConvexHull(geom)) AS hull_nokta_sayisi
FROM konya.mahalleler LIMIT 1;

-- İlçe bazlı toplam alan zarfı (aggregate)
SELECT ilce,
  ST_AsText(ST_Extent(geom)::geometry)        AS ilce_bbox,
  ST_AsText(ST_ConvexHull(ST_Union(geom)))    AS ilce_konveks
FROM konya.mahalleler
GROUP BY ilce;

-- Manuel BBox + && hız filtresi
WITH alan AS (
  SELECT ST_MakeEnvelope(32.40, 37.82, 32.60, 37.95, 4326) AS bbox
)
SELECT m.ad
FROM konya.mahalleler m, alan
WHERE m.geom && alan.bbox;

-- BBox'ı genişlet (buffer yerine hızlı yaklaşım)
SELECT ST_AsText(ST_Expand(ST_Envelope(geom), 0.01)) AS genisletilmis_bbox
FROM konya.mahalleler LIMIT 1;

-- Görev: Tüm Konya'nın zarfı
SELECT ST_AsText(ST_Extent(geom)::geometry) FROM konya.mahalleler;

-- 1.17 En Yakın N Komşu (KNN)
-- <-> operatörü ile indeksle en yakını bul
SELECT ad
FROM konya.poi
WHERE kategori ILIKE '%hastane%'
ORDER BY geom <-> ST_SetSRID(ST_Point(32.49, 37.87), 4326)
LIMIT 3;

-- Görev: En yakın 5 bina
SELECT id FROM konya.osm_binalar
ORDER BY geom <-> ST_SetSRID(ST_Point(32.4920, 37.8727), 4326)
LIMIT 5;


-- ============================================================
-- BÖLÜM 2: SORGULAR, İNDEKS VE PERFORMANS
-- ============================================================

-- 2.1 Veri Yükleme (CSV ve COPY)
-- Tablo oluşturma
CREATE TABLE IF NOT EXISTS konya.nufus_copy (
    yil     INT,
    il      VARCHAR(50),
    ilce    VARCHAR(100),
    ilce_id INT,
    nufus   INT
);

-- psql ile CSV içe aktarma (psql istemcisinde çalıştırın)
-- \copy konya.nufus_copy FROM 'D:\nufus_copy.csv' WITH (FORMAT csv, HEADER, ENCODING 'UTF8')

-- 2.1 Veri Temizliği (Regex ve UPDATE)
-- "Fakılar Mah." gibi isimlendirmelerdeki " Mah." ekini temizler
SELECT regexp_replace(mahalle_adi, ' Mah\.$', '') FROM konya.mahalleler_tkgm LIMIT 5;

-- 2.2 ST_Simplify ve ST_Smooth
-- NOT: SRID 4326'da ölçü birimi DERECEDİR. 0.01 derece ≈ 1.1 km
SELECT id,
       ST_SimplifyPreserveTopology(geom, 0.01) AS geom_sade,
       geom AS geom_orjinal
FROM konya.ilce_sinirlari LIMIT 5;

-- 2.2 ST_SubDivide: Büyük poligonları indeks-dostu parçalara böler
SELECT id, ST_SubDivide(geom, 255) AS parcalanmis_geom
FROM konya.il_sinirlari;

-- 2.2 Doğrusal Referanslama (Linear Referencing)
-- Hem hattı hem noktayı DBeaver'da görmek için ST_Collect
SELECT id,
   ST_Collect(ST_GeometryN(geom, 1), ST_GeomFromText('POINT(32.498179 37.894507)', 4326)) AS harita,
   ROUND((ST_LineLocatePoint(ST_GeometryN(geom, 1),
         ST_GeomFromText('POINT(32.498179 37.894507)', 4326)) * 100)::numeric, 1) || '%' AS oran_yuzde,
   ROUND((ST_LineLocatePoint(ST_GeometryN(geom, 1),
         ST_GeomFromText('POINT(32.498179 37.894507)', 4326)) *
         ST_Length(ST_GeometryN(geom, 1)::geography))::numeric, 1) || ' m' AS mesafe_metre
FROM konya.osm_yollar WHERE id = 30135;

-- Görev: Yolun ortasındaki noktayı bul
SELECT ST_LineInterpolatePoint(ST_GeometryN(geom, 1), 0.5) AS orta_nokta
FROM konya.osm_yollar
WHERE id = 30135;

-- 2.2 ST_ClosestPoint ve ST_Azimuth
-- AZIMUTH: İki nokta arası yön açısı (kuzey=0°)
SELECT degrees(ST_Azimuth(
  ST_SetSRID(ST_Point(32.4920, 37.8727), 4326),  -- Alaaddin Tepesi
  ST_SetSRID(ST_Point(32.5040, 37.8710), 4326)   -- Mevlana Müzesi
)) AS bearing_derece;

-- CLOSEST POINT + ShortestLine: Bina → en yakın yol
WITH bina AS (
  SELECT ST_SetSRID(ST_Point(32.5920, 37.827), 4326) AS p
)
SELECT y.id,
  ST_Collect(ARRAY[b.p, y.geom, ST_ShortestLine(y.geom, b.p)]) AS harita,
  ROUND(ST_Length(ST_ShortestLine(y.geom, b.p)::geography)::numeric, 1) || ' m' AS uzaklik_metre
FROM konya.osm_yollar y, bina b
ORDER BY y.geom <-> b.p
LIMIT 1;

-- Görev: En yakın yola dikme mesafesi
WITH bina AS (SELECT ST_SetSRID(ST_Point(32.5920, 37.827), 4326) AS p)
SELECT ST_AsText(ST_ShortestLine(y.geom, b.p)) AS dik_cizgi,
       ROUND(ST_Length(ST_ShortestLine(y.geom, b.p)::geography)::numeric, 2) || ' m' AS dik_mesafe
FROM konya.osm_yollar y, bina b
ORDER BY y.geom <-> b.p LIMIT 1;

-- 2.3 GiST ve SP-GiST İndeksleme
-- GiST (R-Tree): Poligon ve Çizgiler için
CREATE INDEX IF NOT EXISTS idx_binalar_gist ON konya.osm_binalar USING GIST(geom);

-- SP-GiST (Quad-tree): Noktalar (POI) için daha hızlı
CREATE INDEX IF NOT EXISTS idx_poi_spgist ON konya.poi USING SPGIST(geom);

-- 2.3 Bounding Box Operatörü (&&)
SELECT id, ad
FROM konya.mahalleler
WHERE geom && ST_MakeEnvelope(32.40, 37.80, 32.60, 37.90, 4326);

-- 2.3 Partial ve Functional İndeksler
-- PARTIAL INDEX: Sadece eczane kategorisindeki POI'ler
CREATE INDEX idx_eczane_geom ON konya.poi USING SPGIST(geom) WHERE kategori = 'eczane';

-- FUNCTIONAL INDEX: Binaların EPSG:3857 dönüşümünü indeksler
CREATE INDEX idx_bina_3857 ON konya.osm_binalar USING GIST(ST_Transform(geom, 3857));

-- Görev: Bina merkez noktalarını indeksle
CREATE INDEX idx_bina_merkez ON konya.osm_binalar USING GIST(ST_Centroid(geom));

-- 2.3 ANALYZE
ANALYZE konya.osm_binalar;
ANALYZE konya.mahalleler;

-- 2.3 İndeks Takibi — hiç kullanılmamış indeksler
SELECT
  indexrelname AS indeks_adi,
  pg_size_pretty(pg_relation_size(indexrelid)) AS bosuna_kapladigi_yer
FROM pg_stat_user_indexes
WHERE schemaname = 'konya'
  AND idx_scan = 0;

-- 2.4 Seq Scan ve Index Scan Farkı
-- İndeks olmadan
DROP INDEX IF EXISTS konya.idx_binalar_geom;
EXPLAIN ANALYZE
SELECT COUNT(*) FROM konya.osm_binalar
WHERE ST_Intersects(geom, ST_MakeEnvelope(32.49, 37.87, 32.51, 37.89, 4326));

-- İndeks varken (~100x hızlı)
CREATE INDEX idx_binalar_geom ON konya.osm_binalar USING GIST(geom);
ANALYZE konya.osm_binalar;

EXPLAIN ANALYZE
SELECT COUNT(*) FROM konya.osm_binalar
WHERE ST_Intersects(geom, ST_MakeEnvelope(32.49, 37.87, 32.51, 37.89, 4326));

-- 2.4 ST_Distance Anti-Pattern (Mesafe Tuzağı)
-- YANLIŞ: ST_Distance indeksi kullanamaz, tüm tabloyu tarar
-- WHERE ST_Distance(geom, p) < 500

-- DOĞRU: ST_DWithin indeksi kullanır
-- WHERE ST_DWithin(geom, p, 500)

-- 2.4 EXPLAIN FORMAT JSON
EXPLAIN (FORMAT JSON, ANALYZE)
SELECT id FROM konya.osm_binalar
WHERE geom && ST_MakeEnvelope(32.45, 37.85, 32.55, 37.95, 4326);

-- 2.5 VACUUM ve Bloat Yönetimi
SELECT schemaname AS sema_adi,
  relname AS tablo_adi,
  n_live_tup AS canli_satir,
  n_dead_tup AS olu_satir,
  ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS olu_yuzde
FROM pg_stat_user_tables
WHERE schemaname = 'konya'
ORDER BY olu_yuzde DESC NULLS LAST;

VACUUM ANALYZE konya.mahalleler;

-- 2.5 Tablo Bölümleme (Partitioning)
-- Ana tablo (Parent)
CREATE TABLE konya.binalar_bolunmus (
  id    SERIAL,
  geom  GEOMETRY(MULTIPOLYGON, 4326),
  ilce  TEXT NOT NULL
) PARTITION BY LIST (ilce);

-- Alt tablolar (Partitions)
CREATE TABLE konya.binalar_selcuklu PARTITION OF konya.binalar_bolunmus FOR VALUES IN ('SELÇUKLU', 'Selçuklu');
CREATE TABLE konya.binalar_meram    PARTITION OF konya.binalar_bolunmus FOR VALUES IN ('MERAM', 'Meram');
CREATE TABLE konya.binalar_karatay  PARTITION OF konya.binalar_bolunmus FOR VALUES IN ('KARATAY', 'Karatay');

-- Diğer ilçeler için varsayılan bölüm
CREATE TABLE konya.binalar_diger PARTITION OF konya.binalar_bolunmus DEFAULT;

-- Veri doldurma: Selçuklu binalarını ata
INSERT INTO konya.binalar_bolunmus (geom, ilce)
SELECT b.geom, 'Selçuklu'
FROM konya.osm_binalar b
JOIN konya.ilce_sinirlari i ON ST_Intersects(b.geom, i.geom)
WHERE i.ad ILIKE 'selçuklu';

-- 2.5 Partition Pruning (Ayıklama)
SET enable_partition_pruning = on;

EXPLAIN ANALYZE
SELECT * FROM konya.binalar_bolunmus
WHERE ilce = 'Selçuklu';

-- 2.5 Tablespace ile Disk Yönetimi
CREATE TABLESPACE ts_hizli LOCATION '/var/lib/postgresql/data/ssd';
CREATE TABLESPACE ts_arsiv LOCATION '/var/lib/postgresql/data/hdd';

ALTER TABLE konya.osm_binalar SET TABLESPACE ts_hizli;

CREATE TABLE konya.log_arsiv (
  id    BIGSERIAL,
  islem TEXT,
  tarih TIMESTAMPTZ
) TABLESPACE ts_arsiv;

CREATE INDEX idx_binalar_geom_ts ON konya.osm_binalar
  USING GIST(geom) TABLESPACE ts_hizli;

SELECT spcname,
  pg_size_pretty(pg_tablespace_size(oid)) AS boyut,
  pg_tablespace_location(oid)             AS yol
FROM pg_tablespace;


-- ============================================================
-- BÖLÜM 3: PRODUCTION, AĞ ANALİZİ VE PROJE
-- ============================================================

-- 3.1 ST_ClusterKMeans: Mekansal Gruplama
-- Durakları 10 gruba ayır
SELECT ST_ClusterKMeans(geom, 10) OVER() AS cluster_id, geom
FROM konya.poi
WHERE kategori = 'Durak';

-- 3.1 ST_ClusterDBSCAN: Yoğunluk Analizi
-- 150 metre çapında en az 5 kaza olan kümeleri bul
SELECT ST_ClusterDBSCAN(ST_Transform(geom, 5255), 150, 5) OVER() AS cluster_id, geom
FROM analiz.kazalar;

-- 3.1 H3 Index ve Hexagonal Grid (h3-pg eklentisi gerektirir)
SELECT h3_cell_to_boundary_geometry(h3_lat_lng_to_cell(geom, 9)) AS h3_geom,
       COUNT(*) AS kaza_sayisi
FROM analiz.kazalar
GROUP BY h3_lat_lng_to_cell(geom, 9);

-- 3.2 Yol Verimizi Tanıyalım (Veri Keşfi)
-- Toplam yol sayısı
SELECT count(*) AS toplam_yol FROM konya.osm_yollar;

-- İlk 5 kaydı incele
SELECT id, ad, tip, ilce, one_way, source, target,
       ROUND(ST_Length(geom::geography)::numeric, 1) AS uzunluk_m
FROM konya.osm_yollar LIMIT 5;

-- Tek yön dağılımı
SELECT one_way, count(*) AS yol_sayisi FROM konya.osm_yollar GROUP BY one_way;

-- Kritik kontrol: source/target dolu mu?
SELECT count(*) FILTER (WHERE source IS NOT NULL) AS dolu,
       count(*) FILTER (WHERE source IS NULL) AS bos
FROM konya.osm_yollar;

-- 3.2 Maliyet Hesabı
-- İleri yön maliyeti (metre)
UPDATE konya.osm_yollar
SET cost = ST_Length(geom::geography);

-- Geri yön maliyeti (tek yön kuralı)
UPDATE konya.osm_yollar
SET reverse_cost = CASE
  WHEN one_way = 1 THEN -1  -- Tek yön → geri geçiş YOK
  ELSE cost                  -- Çift yön → aynı maliyet
END;

-- Doğrulama
SELECT one_way, min(cost), avg(cost)::int, max(cost),
       count(*) FILTER (WHERE reverse_cost = -1) AS tek_yon_sayisi
FROM konya.osm_yollar
GROUP BY one_way;

-- 3.2 Topoloji Oluşturma: pgRouting 4.x (3 Adım)
-- ADIM 1: Noded tablo + old_id
DROP TABLE IF EXISTS konya.osm_yollar_noded CASCADE;
CREATE TABLE konya.osm_yollar_noded AS
WITH noded AS (
  SELECT (ST_Dump(ST_Node(ST_Collect(geom)))).geom AS geom
  FROM konya.osm_yollar
)
SELECT (row_number() OVER ())::integer AS id,
       NULL::integer AS source, NULL::integer AS target,
       NULL::integer AS old_id, geom
FROM noded;
ALTER TABLE konya.osm_yollar_noded ADD PRIMARY KEY (id);
CREATE INDEX ON konya.osm_yollar_noded USING gist(geom);

WITH matched AS (
  SELECT DISTINCT ON (m.id) m.id AS nid, o.id AS oid
  FROM (SELECT id, ST_LineInterpolatePoint(geom,0.5) AS mp
        FROM konya.osm_yollar_noded) m
  JOIN konya.osm_yollar o ON o.geom && ST_Expand(m.mp, 0.0001)
  WHERE ST_Distance(m.mp, o.geom) < 0.000015
  ORDER BY m.id, ST_Distance(m.mp, o.geom)
)
UPDATE konya.osm_yollar_noded SET old_id = matched.oid
FROM matched WHERE matched.nid = id;

-- ADIM 2: Vertices Tablosu
DROP TABLE IF EXISTS konya.osm_yollar_noded_vertices_pgr;
CREATE TABLE konya.osm_yollar_noded_vertices_pgr AS
WITH ep AS (
  SELECT ST_StartPoint(geom) AS the_geom FROM konya.osm_yollar_noded
  UNION SELECT ST_EndPoint(geom) FROM konya.osm_yollar_noded
)
SELECT (row_number() OVER ())::integer AS id, the_geom FROM ep;
ALTER TABLE konya.osm_yollar_noded_vertices_pgr ADD PRIMARY KEY (id);
ALTER TABLE konya.osm_yollar_noded_vertices_pgr ADD COLUMN cnt integer DEFAULT 0;
CREATE INDEX ON konya.osm_yollar_noded_vertices_pgr USING gist(the_geom);

-- ADIM 3: source / target / cnt Doldur
UPDATE konya.osm_yollar_noded n SET source = v.id
FROM konya.osm_yollar_noded_vertices_pgr v
WHERE v.the_geom = ST_StartPoint(n.geom);

UPDATE konya.osm_yollar_noded n SET target = v.id
FROM konya.osm_yollar_noded_vertices_pgr v
WHERE v.the_geom = ST_EndPoint(n.geom);

UPDATE konya.osm_yollar_noded_vertices_pgr v SET cnt = (
  SELECT count(*) FROM konya.osm_yollar_noded n
  WHERE n.source = v.id OR n.target = v.id);

-- Doğrulama
SELECT count(*) AS kavsaklar FROM konya.osm_yollar_noded_vertices_pgr;

SELECT count(*) FILTER (WHERE source IS NULL) AS null_source,
       count(*) FILTER (WHERE target IS NULL) AS null_target
FROM konya.osm_yollar_noded;

-- 3.2 Topoloji Oluşturma: pgRouting 3.x (2 Adım)
-- ADIM 1: Ağı node et
SELECT pgr_nodeNetwork(
  'konya.osm_yollar',
  0.00001,
  'id',
  'geom'
);

-- ADIM 2: Topoloji kur
SELECT pgr_createTopology(
  'konya.osm_yollar_noded',
  0.00001, 'geom', 'id'
);

-- Doğrulama (3.x)
SELECT count(*) AS kavsaklar FROM konya.osm_yollar_noded_vertices_pgr;
SELECT id, old_id, source, target FROM konya.osm_yollar_noded WHERE source IS NOT NULL LIMIT 5;

-- 3.2 Graf Sağlık Kontrolü (pgRouting 4.x)
-- Çıkmaz sokaklar
SELECT count(*) AS cikmaz_sayisi FROM (
  SELECT node FROM (
    SELECT source AS node FROM konya.osm_yollar_noded
    UNION ALL
    SELECT target FROM konya.osm_yollar_noded
  ) e GROUP BY node HAVING count(*) = 1
) t;

-- Bağlı bileşenler
SELECT component, count(*) AS node_sayisi
FROM pgr_connectedComponents(
  'SELECT id, source, target,
   ST_Length(geom::geography) AS cost
   FROM konya.osm_yollar_noded'
)
GROUP BY component
ORDER BY node_sayisi DESC
LIMIT 5;

-- Toplam bileşen sayısı (1 = tamamen bağlı ağ)
SELECT count(DISTINCT component) AS bilesen_sayisi
FROM pgr_connectedComponents(
  'SELECT id, source, target,
   ST_Length(geom::geography) AS cost
   FROM konya.osm_yollar_noded'
);

-- Graf Sağlık Kontrolü (pgRouting 3.x)
SELECT pgr_analyzeGraph(
  'konya.osm_yollar_noded',
  0.00001, 'geom', 'id', 'source', 'target'
);

-- 3.2 Sorun Giderme: Kopuk Graf
SELECT count(*) AS cikmaz_sayisi
FROM konya.osm_yollar_noded_vertices_pgr
WHERE cnt = 1;

-- İzole bileşenler
SELECT component, count(*) AS node_sayisi
FROM pgr_connectedComponents(
  'SELECT id, source, target,
   ST_Length(geom::geography) AS cost
   FROM konya.osm_yollar_noded'
)
GROUP BY component
ORDER BY node_sayisi DESC
LIMIT 10;

-- Ana bileşene ait olmayan yolları say
WITH ana AS (
  SELECT component
  FROM pgr_connectedComponents(
    'SELECT id, source, target,
     ST_Length(geom::geography) AS cost
     FROM konya.osm_yollar_noded')
  GROUP BY component ORDER BY count(*) DESC LIMIT 1
)
SELECT count(*) AS izole_yol
FROM konya.osm_yollar_noded n
JOIN pgr_connectedComponents(
  'SELECT id, source, target,
   ST_Length(geom::geography) AS cost
   FROM konya.osm_yollar_noded') c ON c.node = n.source
WHERE c.component != (SELECT component FROM ana);

-- 3.2 Gerçek Adresten Kavşak ID Bulma
-- KNN operatörüyle en yakın kavşağı bul
SELECT id, the_geom,
       ST_Distance(
         the_geom::geography,
         ST_SetSRID(ST_MakePoint(32.488560, 37.947955), 4326)::geography
       )::int AS mesafe_m
FROM konya.osm_yollar_noded_vertices_pgr
ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560, 37.947955), 4326)  -- Stadyum
LIMIT 1;

-- 3.2 Dijkstra: En Kısa Yol Hesabı
WITH baslangic AS (
  SELECT id FROM konya.osm_yollar_noded_vertices_pgr
  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560, 37.947955), 4326) LIMIT 1
),
bitis AS (
  SELECT id FROM konya.osm_yollar_noded_vertices_pgr
  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.491773, 37.873543), 4326) LIMIT 1
)
SELECT seq, node, edge, cost, agg_cost
FROM pgr_dijkstra(
  'SELECT n.id, n.source, n.target,
   ST_Length(n.geom::geography) AS cost,
   CASE WHEN o.one_way = 1 THEN -1
   ELSE ST_Length(n.geom::geography) END AS reverse_cost
   FROM konya.osm_yollar_noded n
   LEFT JOIN konya.osm_yollar o ON n.old_id = o.id',
  (SELECT id FROM baslangic),
  (SELECT id FROM bitis)
);

-- 3.2 A* Algoritması: Sezgisel Rota
WITH baslangic AS (
  SELECT id FROM konya.osm_yollar_noded_vertices_pgr
  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560, 37.947955), 4326) LIMIT 1
),
bitis AS (
  SELECT id FROM konya.osm_yollar_noded_vertices_pgr
  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.491773, 37.873543), 4326) LIMIT 1
)
SELECT seq, node, edge, cost, agg_cost
FROM pgr_astar(
  'SELECT n.id, n.source, n.target,
   ST_Length(n.geom::geography) AS cost,
   CASE WHEN o.one_way = 1 THEN -1
   ELSE ST_Length(n.geom::geography) END AS reverse_cost,
   ST_X(ST_StartPoint(n.geom)) AS x1,
   ST_Y(ST_StartPoint(n.geom)) AS y1,
   ST_X(ST_EndPoint(n.geom)) AS x2,
   ST_Y(ST_EndPoint(n.geom)) AS y2
   FROM konya.osm_yollar_noded n
   LEFT JOIN konya.osm_yollar o ON n.old_id = o.id',
  (SELECT id FROM baslangic),
  (SELECT id FROM bitis),
  directed := true,
  heuristic := 5  -- Haversine mesafe sezgisi
);

-- 3.2 Rotayı Haritada Görmek
WITH rota AS (
  SELECT d.seq, d.edge, d.cost, d.agg_cost
  FROM pgr_dijkstra(
    'SELECT n.id, n.source, n.target,
     ST_Length(n.geom::geography) AS cost,
     CASE WHEN o.one_way = 1 THEN -1
     ELSE ST_Length(n.geom::geography) END AS reverse_cost
     FROM konya.osm_yollar_noded n
     LEFT JOIN konya.osm_yollar o ON n.old_id = o.id',
    (SELECT id FROM konya.osm_yollar_noded_vertices_pgr
     ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560,37.947955),4326) LIMIT 1),
    (SELECT id FROM konya.osm_yollar_noded_vertices_pgr
     ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.491773,37.873543),4326) LIMIT 1)
  ) AS d
)
SELECT r.seq,
       COALESCE(y.ad, 'İsimsiz Yol') AS sokak_adi,
       ROUND(r.cost::numeric, 1) AS adim_metre,
       ROUND(r.agg_cost::numeric, 1) AS toplam_metre,
       n.geom AS rota_cizgisi
FROM rota r
JOIN konya.osm_yollar_noded n ON r.edge = n.id
LEFT JOIN konya.osm_yollar y ON n.old_id = y.id
ORDER BY r.seq;

-- Tüm rotayı tek LineString'e birleştir (harita için)
SELECT ST_LineMerge(ST_Union(n.geom)) AS rota_geom
FROM pgr_dijkstra(
  'SELECT n.id, n.source, n.target,
   ST_Length(n.geom::geography) AS cost,
   CASE WHEN o.one_way = 1 THEN -1
   ELSE ST_Length(n.geom::geography) END AS reverse_cost
   FROM konya.osm_yollar_noded n
   LEFT JOIN konya.osm_yollar o ON n.old_id = o.id',
  (SELECT id FROM konya.osm_yollar_noded_vertices_pgr
   ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560,37.947955),4326) LIMIT 1),
  (SELECT id FROM konya.osm_yollar_noded_vertices_pgr
   ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.491773,37.873543),4326) LIMIT 1)
) AS d
JOIN konya.osm_yollar_noded n ON d.edge = n.id;

-- 3.2 Servis Alanı: İzokron Haritası
-- Stadyum'dan 1500m içinde ulaşılabilen kavşaklar
WITH merkez AS (
  SELECT id FROM konya.osm_yollar_noded_vertices_pgr
  ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(32.488560, 37.947955), 4326) LIMIT 1
),
ulasilabilir AS (
  SELECT v.id, v.the_geom, d.agg_cost
  FROM pgr_drivingDistance(
    'SELECT n.id, n.source, n.target,
     ST_Length(n.geom::geography) AS cost
     FROM konya.osm_yollar_noded n',
    (SELECT id FROM merkez),
    1500,
    directed := false
  ) AS d
  JOIN konya.osm_yollar_noded_vertices_pgr v ON d.node = v.id
)
SELECT ST_ConcaveHull(ST_Collect(the_geom), 0.85) AS servis_alani
FROM ulasilabilir;

-- 3.2 TSP: Çoklu Durak Optimizasyonu
SELECT seq, node, cost, agg_cost
FROM pgr_TSPeuclidean(
  'SELECT id,
   ST_X(the_geom) AS x,
   ST_Y(the_geom) AS y
   FROM konya.osm_yollar_noded_vertices_pgr
   WHERE id IN (100, 250, 400, 600, 800)',
  100  -- Başlangıç Node ID
);

-- 3.3 PostGIS Topology: Topoloji Kurulumu
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Yeni topoloji şeması oluştur
SELECT topology.CreateTopology('konya_topo', 4326);

-- 3.3 Topoloji Şema Anatomisi
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'konya_topo'
ORDER BY table_name;

SELECT edge_id, start_node, end_node, left_face, right_face
FROM konya_topo.edge_data LIMIT 3;

SELECT layer_id, schema_name, table_name, feature_column, feature_type
FROM topology.layer;

SELECT * FROM topology.TopologySummary('konya_topo');

-- 3.3 Veri Aktarımı ve Doğrulama
-- Topology katman tanımı
SELECT topology.AddTopoGeometryColumn(
  'konya_topo',
  'konya',
  'ilce_sinirlari',
  'topo_geom',
  'POLYGON'
);

-- Geometriden TopoGeometry üret (tolerans: 0.0001 ≈ 11 metre)
UPDATE konya.ilce_sinirlari
SET topo_geom = topology.toTopoGeom(geom, 'konya_topo', 1, 0.0001);

-- Aktarım özeti
SELECT * FROM topology.TopologySummary('konya_topo');

-- Kalite kontrolü (boş sonuç = hatasız)
SELECT * FROM topology.ValidateTopology('konya_topo');

-- Paylaşılan sınırlar (her iki tarafı da ilçe olan edge'ler)
SELECT edge_id, left_face, right_face,
       ST_Length(geom::geography)::int AS uzunluk_m
FROM konya_topo.edge_data
WHERE left_face != 0 AND right_face != 0
ORDER BY uzunluk_m DESC LIMIT 5;

-- 3.3 Komşuluk Analizi
-- Selçuklu'nun tüm komşu ilçelerini bul
SELECT DISTINCT i2.ad AS komsu_ilce
FROM konya.ilce_sinirlari i1
JOIN konya.ilce_sinirlari i2
  ON ST_Touches(i1.topo_geom::geometry, i2.topo_geom::geometry)
WHERE i1.ad = 'Selçuklu' AND i2.ad != 'Selçuklu'
ORDER BY i2.ad;

-- Her komşuyla paylaşılan sınır uzunluğu
SELECT i2.ad AS komsu_ilce,
       ROUND((ST_Length(
         ST_Intersection(
           i1.topo_geom::geometry::geography,
           i2.topo_geom::geometry::geography
         )
       ) / 1000)::numeric, 2) AS ortak_sinir_km
FROM konya.ilce_sinirlari i1
JOIN konya.ilce_sinirlari i2
  ON ST_Touches(i1.topo_geom::geometry, i2.topo_geom::geometry)
WHERE i1.ad = 'Selçuklu' AND i2.ad != 'Selçuklu'
ORDER BY ortak_sinir_km DESC;

-- 3.4 Kurumsal Yetki ve Rol Yönetimi
CREATE ROLE editor_role;
GRANT SELECT, INSERT ON TABLE konya.osm_binalar TO editor_role;

-- 3.4 Mekansal Row Level Security (RLS)
-- ADIM 1: Rol + Yetki
CREATE ROLE meram_calisani LOGIN PASSWORD 'meram2024';
GRANT USAGE ON SCHEMA konya TO meram_calisani;
GRANT SELECT ON konya.osm_binalar TO meram_calisani;
GRANT SELECT ON konya.ilce_sinirlari TO meram_calisani;

-- ADIM 2: RLS Etkinleştir + Politika
ALTER TABLE konya.osm_binalar ENABLE ROW LEVEL SECURITY;

CREATE POLICY meram_only ON konya.osm_binalar
  AS PERMISSIVE FOR SELECT
  TO meram_calisani
  USING (
    ST_Intersects(
      geom,
      (SELECT geom FROM konya.ilce_sinirlari WHERE ad = 'Meram')
    )
  );

-- ADIM 3: Test
-- Admin: tüm binalar
SELECT count(*) FROM konya.osm_binalar;

-- Meram çalışanı: sadece Meram binaları
SET ROLE meram_calisani;
SELECT count(*) FROM konya.osm_binalar;
RESET ROLE;

-- 3.4 Salt-Okunur Web Kullanıcısı
-- ADIM 1: Kullanıcı oluştur
CREATE ROLE geoserver LOGIN PASSWORD 'geo2024';
GRANT USAGE ON SCHEMA konya TO geoserver;
GRANT USAGE ON SCHEMA analiz TO geoserver;
GRANT SELECT ON ALL TABLES IN SCHEMA konya TO geoserver;
GRANT SELECT ON ALL TABLES IN SCHEMA analiz TO geoserver;

-- ADIM 2: Salt-okunur kilitle
ALTER USER geoserver SET default_transaction_read_only = on;

-- ADIM 3: Test
SET ROLE geoserver;
SELECT count(*) FROM konya.osm_binalar;  -- Çalışmalı
-- UPDATE konya.osm_binalar SET tip = 'test' WHERE id = 1;  -- Hata vermeli
RESET ROLE;

-- 3.5 Replikasyon: Logical Publication
CREATE PUBLICATION konya_pub FOR TABLE konya.mahalleler;

-- 3.6 Proje Adım 1: Mekansal Zenginleştirme
-- Binalara mahalle ID'lerini spatial join ile ata
UPDATE konya.osm_binalar b
SET mahalle_id = m.id
FROM konya.mahalleler m
WHERE ST_Intersects(b.geom, m.geom)
  AND b.mahalle_id IS NULL;

-- Eksik veri kontrolü
SELECT count(*) FROM konya.osm_binalar WHERE mahalle_id IS NULL;

-- 3.6 Proje Adım 2: Toplu Rota Hesabı (Many-to-Many)
SELECT start_vid, end_vid, agg_cost
FROM pgr_dijkstra(
  'SELECT id, source, target, cost FROM konya.osm_yollar',
  (SELECT array_agg(id) FROM (SELECT id FROM konya.osm_yollar_noded_vertices_pgr LIMIT 10) AS t),
  (SELECT array_agg(id) FROM (SELECT id FROM konya.osm_yollar_noded_vertices_pgr WHERE id < 1000) AS t),
  false
) LIMIT 10;

-- ============================================================
-- NOTLAR
-- ============================================================
-- * ogr2ogr ve pg_dump/pg_restore komutları terminal/CMD'de çalışır,
--   bu SQL dosyasında yer almaz.
-- * H3 fonksiyonları (h3_lat_lng_to_cell vb.) için h3-pg eklentisi gereklidir.
--   Docker kurulumunda mevcuttur; Windows .exe kurulumunda ek derleme gerekir.
-- * pgRouting 4.x'te pgr_nodeNetwork ve pgr_createTopology kaldırılmıştır.
--   Alternatif: Yukarıdaki 3 adımlı manuel prosedürü kullanın.
-- ============================================================
