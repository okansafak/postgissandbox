-- ============================================================
-- PostGIS Akademi — 05: İleri Analiz ve pgRouting Hazırlığı
-- Çalıştırılma Sırası: 6/6
-- ============================================================
-- Bölüm 3 (Kümeleme, pgRouting, HexagonGrid) derslerinde
-- kullanılacak ileri analiz yapıları.

-- ============================================================
-- 1. pgRouting Topoloji Hazırlığı (Bölüm 3: Slayt 8-10)
-- ============================================================
-- Maliyet hesabı: yol uzunluğu (metre)
UPDATE konya.osm_yollar
SET cost = ST_Length(geom::geography)
WHERE cost IS NULL;

-- Ters maliyet (çift yönlü yollar için)
UPDATE konya.osm_yollar
SET reverse_cost = CASE
    WHEN one_way = 0 THEN cost     -- Çift yön: aynı maliyet
    WHEN one_way = 1 THEN -1       -- Tek yön (ileri): ters geçiş yok
    ELSE cost                       -- Tek yön (geri): maliyet geçerli
END
WHERE reverse_cost IS NULL;

-- Topoloji oluşturma (Node-Edge ağı)
-- pgr_createTopology çalışması için yolların birbirine bağlı olması gerekir.
SELECT pgr_createTopology('konya.osm_yollar', 0.0001, 'geom', 'id');

-- ============================================================
-- 2. KÜMELEME GÖRÜNÜMLERİ (Bölüm 3: Slayt 3-5)
-- ============================================================

-- DBSCAN Yoğunluk Kümeleme (eps ≈ 500m, min 3 nokta)
CREATE OR REPLACE VIEW analiz.v_durak_dbscan AS
SELECT
    id,
    ad,
    ST_ClusterDBSCAN(geom, eps := 0.005, minpoints := 3) OVER () AS cluster_id,
    geom
FROM konya.duraklar;

-- KMeans Kümeleme (3 küme = 3 merkez ilçe)
CREATE OR REPLACE VIEW analiz.v_durak_kmeans AS
SELECT
    id,
    ad,
    ST_ClusterKMeans(geom, 3) OVER () AS cluster_id,
    geom
FROM konya.duraklar;

-- ============================================================
-- 3. HexagonGrid Hazırlığı (Bölüm 3: Slayt 11-13)
-- ============================================================
-- Not: ST_HexagonGrid fonksiyonu PostGIS 3.1+ gerektirir.
-- Aşağıdaki view, Konya bounding box'ı üzerinde 1km'lik
-- petek grid oluşturur ve mahalle kesişimlerini hesaplar.
CREATE OR REPLACE VIEW analiz.v_konya_hexgrid AS
SELECT
    hex.i, hex.j,
    hex.geom
FROM
    ST_HexagonGrid(
        0.01,  -- ~1km hücre boyutu (derece cinsinden)
        ST_SetSRID(ST_MakeEnvelope(32.30, 37.70, 32.70, 38.10), 4326)
    ) AS hex;

-- ============================================================
-- 4. ACİL DURUM ANALİZ TASLAĞ (Bölüm 3: Kapanış Projesi)
-- ============================================================
CREATE TABLE IF NOT EXISTS analiz.riskli_binalar (
    bina_id INTEGER REFERENCES konya.osm_binalar(id),
    en_yakin_hastane_id INTEGER,
    en_yakin_hastane_mesafe DOUBLE PRECISION,
    risk_skoru DOUBLE PRECISION,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);

-- Doğrulama
DO $$ BEGIN RAISE NOTICE 'PostGIS Akademi: Tüm init-db betikleri başarıyla tamamlandı.'; END $$;
