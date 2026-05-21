-- ============================================================
-- PostGIS Akademi — 09: POI Mekansal Zenginleştirme
-- Çalıştırılma Sırası: 9/9 (03-import-geojson.sh'den sonra)
-- ============================================================
-- poi.mahalle_id ve poi.ilce_id kolonlarını spatial join ile doldurur.
-- Her iki tablonun geometrileri 03-import-geojson.sh tarafından
-- yüklendikten sonra bu script çalışır.

-- ADIM 1: mahalle_id — POI'nin içinde bulunduğu mahalle
UPDATE konya.poi p
SET mahalle_id = m.id
FROM konya.mahalleler m
WHERE ST_Within(p.geom, m.geom);

-- ADIM 2: ilce_id — POI'nin içinde bulunduğu ilçe
UPDATE konya.poi p
SET ilce_id = i.id
FROM konya.ilce_sinirlari i
WHERE ST_Within(p.geom, i.geom);

-- ADIM 3: Kontrol
SELECT
    COUNT(*)                         AS toplam_poi,
    COUNT(mahalle_id)                AS mahalle_eslesti,
    COUNT(ilce_id)                   AS ilce_eslesti,
    COUNT(*) - COUNT(mahalle_id)     AS mahalle_eslesmeyen
FROM konya.poi;
