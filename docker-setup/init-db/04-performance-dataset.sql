-- ============================================================
-- PostGIS Akademi — 04: Performans ve İndeksleme Test Verisi
-- ============================================================

-- Büyük Veri Simülasyonu (10.000 Rastgele Nokta)
CREATE TABLE analiz.performans_test (
    id SERIAL PRIMARY KEY,
    deger DOUBLE PRECISION,
    geom GEOMETRY(POINT, 4326)
);

-- Rastgele veri üretimi (Konya çevresi)
INSERT INTO analiz.performans_test (deger, geom)
SELECT 
    random() * 100,
    ST_SetSRID(ST_MakePoint(32.0 + random()*1.0, 37.5 + random()*1.0), 4326)
FROM generate_series(1, 10000);

-- İndeksiz haliyle bırakıyoruz (Ders esnasında oluşturulacak)
-- ANALYZE analiz.performans_test;
