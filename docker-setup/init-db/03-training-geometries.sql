-- ============================================================
-- PostGIS Akademi — 03: Eğitim Geometrileri ve Test Verileri
-- ============================================================

-- Bölüm 1.2: Geometri Oluşturma Testleri
CREATE TABLE egitim.geometri_test (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50),
    geom GEOMETRY
);

INSERT INTO egitim.geometri_test (ad, geom) VALUES 
('Nokta', ST_GeomFromText('POINT(32.50 37.87)', 4326)),
('Çizgi', ST_GeomFromText('LINESTRING(32.40 37.80, 32.60 37.90)', 4326)),
('Poligon', ST_GeomFromText('POLYGON((32.45 37.85, 32.55 37.85, 32.55 37.95, 32.45 37.95, 32.45 37.85))', 4326));

-- Bölüm 1.5: Mesafe ve Tampon Testleri
CREATE VIEW analiz.v_hastane_tampon AS 
SELECT id, ad, ST_Buffer(geom::geography, 1000)::geometry as tampon_1km 
FROM konya.hastaneler;
