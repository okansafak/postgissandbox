-- ============================================================
-- PostGIS Akademi — 05: İleri Analiz ve pgRouting Hazırlığı
-- ============================================================

-- 1. pgRouting Topoloji Hazırlığı (Mevcut yollar için)
-- Not: Bu işlem normalde pgr_createTopology ile yapılır. 
-- Burada ders öncesi sütunları hazırlıyoruz.
ALTER TABLE konya.osm_yollar ADD COLUMN IF NOT EXISTS source INTEGER;
ALTER TABLE konya.osm_yollar ADD COLUMN IF NOT EXISTS target INTEGER;

-- 2. Kümeleme Görünümü (DBSCAN Testi)
-- 500m mesafe ve min 3 nokta ile yoğunluk bölgeleri
CREATE OR REPLACE VIEW analiz.v_yogunluk_bolgeleri AS
SELECT 
    id, 
    ST_ClusterDBSCAN(geom, eps := 0.005, minpoints := 3) OVER () AS cluster_id,
    geom
FROM konya.duraklar;

-- 3. Konya Acil Durum Analizi (Proje Taslağı)
CREATE TABLE analiz.riskli_binalar (
    bina_id INTEGER,
    en_yakin_hastane_mesafe DOUBLE PRECISION,
    geom GEOMETRY
);
