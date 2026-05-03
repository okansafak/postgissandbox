-- ============================================================
-- PostGIS Akademi — 03: Eğitim Geometrileri ve Test Verileri
-- Çalıştırılma Sırası: 4/6
-- ============================================================
-- Bölüm 1 canlı uygulamalarında (Geometri Tipleri, ST_IsValid,
-- ST_Buffer, ST_PointOnSurface) kullanılacak test nesneleri.

-- 1. Geometri Oluşturma Testleri (Bölüm 1: Slayt 5-7)
CREATE TABLE IF NOT EXISTS egitim.geometri_test (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50),
    aciklama TEXT,
    geom GEOMETRY
);

INSERT INTO egitim.geometri_test (ad, aciklama, geom) VALUES
('Basit Nokta',      'POINT örneği',
    ST_GeomFromText('POINT(32.50 37.87)', 4326)),
('Basit Çizgi',      'LINESTRING örneği',
    ST_GeomFromText('LINESTRING(32.40 37.80, 32.50 37.85, 32.60 37.90)', 4326)),
('Basit Poligon',    'Kapalı POLYGON (başladığı yere döner)',
    ST_GeomFromText('POLYGON((32.45 37.85, 32.55 37.85, 32.55 37.95, 32.45 37.95, 32.45 37.85))', 4326)),
('Multi Nokta',      'MULTIPOINT — Birden fazla koordinat',
    ST_GeomFromText('MULTIPOINT((32.49 37.87), (32.50 37.88), (32.51 37.87))', 4326)),
('Hatalı Poligon',   'Self-intersection: ST_IsValid = false olacak',
    ST_GeomFromText('POLYGON((0 0, 2 2, 2 0, 0 2, 0 0))', 4326));

-- 2. Hastane Tampon Görünümü (Bölüm 1: Slayt 16 — ST_Buffer)
CREATE OR REPLACE VIEW analiz.v_hastane_tampon AS
SELECT
    id,
    ad,
    ST_Buffer(geom::geography, 1000)::geometry AS tampon_1km
FROM konya.hastaneler;

-- 3. Mahalle Yüzey Noktası Görünümü (Bölüm 1: Slayt 15 — ST_PointOnSurface)
CREATE OR REPLACE VIEW analiz.v_mahalle_etiket AS
SELECT
    id,
    ad,
    ilce,
    ST_PointOnSurface(geom) AS etiket_noktasi
FROM konya.mahalleler;
