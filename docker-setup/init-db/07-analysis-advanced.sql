-- ============================================================
-- PostGIS Akademi — 07-analysis-advanced: İleri Analiz Verileri
-- Çalıştırılma Sırası: 7/7
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
-- 4. SENTETİK KAZA VERİSİ (Bölüm 3: DBSCAN, Isı Haritası)
-- ============================================================
-- Selçuklu yollarının kesişim noktalarını (kavşakları) bulup
-- çevrelerine rastgele kaza noktaları serpme stratejisi.

-- Adım 1: Kavşak noktalarını bul ve çevresine kazalar üret
INSERT INTO analiz.kazalar (tarih, siddet, tur, ilce, geom)
SELECT
    -- Son 1 yıl içinde rastgele tarih
    NOW() - (random() * interval '365 days'),
    -- Şiddet: Ağırlıklı olarak hafif (1-2), az sayıda ağır (4-5)
    CASE 
        WHEN random() < 0.4 THEN 1
        WHEN random() < 0.7 THEN 2
        WHEN random() < 0.85 THEN 3
        WHEN random() < 0.95 THEN 4
        ELSE 5
    END,
    -- Kaza türü
    (ARRAY['Maddi Hasarlı', 'Yaralanmalı', 'Zincirleme', 'Yaya Çarpma', 'Kavşak Kazası'])[floor(random() * 5 + 1)::int],
    'Selçuklu',
    -- Kavşak noktasının etrafında ±200m rastgele kayma
    ST_SetSRID(
        ST_MakePoint(
            ST_X(kavsaklar.geom) + (random() - 0.5) * 0.004,
            ST_Y(kavsaklar.geom) + (random() - 0.5) * 0.003
        ), 4326
    )
FROM (
    -- Selçuklu yollarının birbirleriyle kesiştiği noktaları bul
    SELECT DISTINCT
        (ST_DumpPoints(
            ST_Intersection(a.geom, b.geom)
        )).geom AS geom
    FROM konya.osm_yollar a
    JOIN konya.osm_yollar b ON ST_Intersects(a.geom, b.geom) AND a.id < b.id
    WHERE a.ilce = 'selcuklu' AND b.ilce = 'selcuklu'
    LIMIT 100  -- İlk 100 kavşak
) AS kavsaklar,
-- Her kavşak için 2-5 kaza üret
generate_series(1, (2 + floor(random() * 4))::int) AS seri;

-- Bilgilendirme
DO $$ 
DECLARE kaza_sayisi INTEGER;
BEGIN
    SELECT count(*) INTO kaza_sayisi FROM analiz.kazalar;
    RAISE NOTICE 'PostGIS Akademi: % adet sentetik kaza kaydı oluşturuldu.', kaza_sayisi;
END $$;

-- ============================================================
-- 5. ACİL DURUM ANALİZ TASLAĞ (Bölüm 3: Kapanış Projesi)
-- ============================================================
CREATE TABLE IF NOT EXISTS analiz.riskli_binalar (
    bina_id INTEGER REFERENCES konya.osm_binalar(id),
    en_yakin_hastane_id INTEGER,
    en_yakin_hastane_mesafe DOUBLE PRECISION,
    risk_skoru DOUBLE PRECISION,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);

-- Kaza DBSCAN Kümeleme Görünümü (eps ≈ 300m, min 3 kaza)
CREATE OR REPLACE VIEW analiz.v_kaza_kumeleri AS
SELECT
    id,
    tarih,
    siddet,
    tur,
    ST_ClusterDBSCAN(geom, eps := 0.003, minpoints := 3) OVER () AS cluster_id,
    geom
FROM analiz.kazalar;

-- Doğrulama
DO $$ BEGIN RAISE NOTICE 'PostGIS Akademi: Tüm init-db betikleri başarıyla tamamlandı.'; END $$;
