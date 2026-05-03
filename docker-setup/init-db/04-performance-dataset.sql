-- ============================================================
-- PostGIS Akademi — 04: Performans ve İndeksleme Test Verisi
-- Çalıştırılma Sırası: 5/6
-- ============================================================
-- Bölüm 2 (GiST İndeks, EXPLAIN ANALYZE, Seq Scan vs Index Scan)
-- derslerinde kullanılacak büyük veri simülasyonu.

-- 1. Performans Test Tablosu (10.000 Rastgele Nokta)
CREATE TABLE IF NOT EXISTS analiz.performans_test (
    id SERIAL PRIMARY KEY,
    deger DOUBLE PRECISION,
    kategori VARCHAR(20),
    geom GEOMETRY(POINT, 4326)
);

-- Konya çevresinde rastgele 10.000 nokta üretimi
-- İndeks KASITLI olarak oluşturulmuyor! (Ders esnasında öğrenciler oluşturacak)
INSERT INTO analiz.performans_test (deger, kategori, geom)
SELECT
    random() * 100,
    CASE WHEN random() < 0.33 THEN 'Selçuklu'
         WHEN random() < 0.66 THEN 'Karatay'
         ELSE 'Meram' END,
    ST_SetSRID(ST_MakePoint(
        32.0 + random() * 1.0,    -- Boylam: 32.0 - 33.0
        37.5 + random() * 1.0     -- Enlem:  37.5 - 38.5
    ), 4326)
FROM generate_series(1, 10000);

-- 2. Staging Örnek Verisi (Bölüm 2: Slayt 3 — Batch Processing)
-- CSV import yerine SQL ile staging tablosuna örnek veri yükleme
INSERT INTO konya.staging_import (kaynak_id, ad, x, y, kategori)
SELECT
    'OSM-' || i,
    'Eczane_' || i,
    32.4 + random() * 0.2,
    37.8 + random() * 0.2,
    'Eczane'
FROM generate_series(1, 50) AS i;

-- Staging verisinden geometri oluşturma (ders esnasında gösterilecek)
UPDATE konya.staging_import
SET geom = ST_SetSRID(ST_MakePoint(x, y), 4326)
WHERE geom IS NULL;
