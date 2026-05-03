-- ============================================================
-- PostGIS Akademi — 03: Eğitim Geometrileri ve Global Veri
-- ============================================================

-- 1. Global Şehirler (Natural Earth Tarzı)
CREATE TABLE egitim.dunya_sehirleri (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    ulke VARCHAR(100),
    nufus BIGINT,
    geom GEOMETRY(POINT, 4326)
);

INSERT INTO egitim.dunya_sehirleri (ad, ulke, nufus, geom) VALUES 
('İstanbul', 'Türkiye', 15840900, ST_SetSRID(ST_MakePoint(28.9784, 41.0082), 4326)),
('Londra', 'İngiltere', 8982000, ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326)),
('New York', 'ABD', 8419000, ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326)),
('Tokyo', 'Japonya', 13960000, ST_SetSRID(ST_MakePoint(139.6503, 35.6762), 4326)),
('Konya', 'Türkiye', 2250000, ST_SetSRID(ST_MakePoint(32.4833, 37.8667), 4326));

-- 2. Karmaşık Geometri Tipleri (Workshop Örnekleri)
CREATE TABLE egitim.geometri_tipleri (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50),
    geom GEOMETRY
);

INSERT INTO egitim.geometri_tipleri (ad, geom) VALUES 
('MultiPoint', ST_GeomFromText('MULTIPOINT(32.48 37.86, 32.49 37.87, 32.50 37.88)', 4326)),
('MultiLineString', ST_GeomFromText('MULTILINESTRING((32.48 37.86, 32.49 37.87), (32.50 37.88, 32.51 37.89))', 4326)),
('GeometryCollection', ST_GeomFromText('GEOMETRYCOLLECTION(POINT(32.48 37.86), LINESTRING(32.49 37.87, 32.50 37.88))', 4326));

-- 3. Geçersiz Geometri Test Seti
CREATE TABLE egitim.gecersiz_geometriler (
    id SERIAL PRIMARY KEY,
    hata_tipi VARCHAR(100),
    geom GEOMETRY
);

INSERT INTO egitim.gecersiz_geometriler (hata_tipi, geom) VALUES 
('Kendi Kesen (Self-intersecting)', ST_GeomFromText('POLYGON((32.48 37.86, 32.50 37.86, 32.48 37.88, 32.50 37.88, 32.48 37.86))', 4326)),
('Kapanmamış Poligon', ST_GeomFromText('LINESTRING(32.48 37.86, 32.50 37.86, 32.50 37.88)', 4326)),
('Delikli Poligon', ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0), (2 2, 2 4, 4 4, 4 2, 2 2))', 4326));

-- 4. SRID Dönüşüm Tablosu (Konya UTM 36N)
CREATE TABLE egitim.projeksiyon_test (
    id SERIAL PRIMARY KEY,
    nokta_ad VARCHAR(50),
    geom_wgs84 GEOMETRY(POINT, 4326),
    geom_utm36n GEOMETRY(POINT, 32636)
);

INSERT INTO egitim.projeksiyon_test (nokta_ad, geom_wgs84) VALUES 
('Alaaddin Tepesi', ST_SetSRID(ST_MakePoint(32.492, 37.872), 4326));

UPDATE egitim.projeksiyon_test SET geom_utm36n = ST_Transform(geom_wgs84, 32636);
