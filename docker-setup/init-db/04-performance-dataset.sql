-- ============================================================
-- PostGIS Akademi — 04: Büyük Veri Seti ve Performans
-- ============================================================

-- 1. Yüksek Hacimli Sensör Verisi (100.000 Kayıt)
-- İndeksleme ve Sorgu Planlama (Explain Analyze) testleri için
CREATE TABLE analiz.iot_sensor_data (
    id SERIAL PRIMARY KEY,
    device_id UUID DEFAULT gen_random_uuid(),
    sensor_type VARCHAR(50),
    value NUMERIC(10,4),
    reading_time TIMESTAMPTZ,
    geom GEOMETRY(POINT, 4326)
);

-- Rastgele Veri Üretimi (Konya Kentsel Alanı: 32.4 - 32.6 Boylam, 37.8 - 38.0 Enlem)
INSERT INTO analiz.iot_sensor_data (sensor_type, value, reading_time, geom)
SELECT 
    (ARRAY['Hava Kalitesi', 'Gürültü', 'Sıcaklık', 'Nem', 'PM10'])[floor(random() * 5 + 1)],
    random() * 100,
    NOW() - (random() * interval '365 days'),
    ST_SetSRID(ST_MakePoint(32.4 + (random() * 0.2), 37.8 + (random() * 0.2)), 4326)
FROM generate_series(1, 100000);

-- Not: Eğitimde katılımcılar indeks oluşturmadan önce ve sonra performans farkını ölçecekler.
-- CREATE INDEX idx_iot_geom ON analiz.iot_sensor_data USING GIST(geom);

-- 2. Büyük Geometri Parçalama (ST_SubDivide) Test Tablosu
CREATE TABLE analiz.buyuk_poligonlar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    geom GEOMETRY
);

-- Çok fazla noktaya sahip karmaşık bir poligon simülasyonu
INSERT INTO analiz.buyuk_poligonlar (ad, geom)
SELECT 'Karmaşık İl Sınırı', ST_Buffer(ST_SetSRID(ST_MakePoint(32.5, 37.9), 4326), 0.1, 'quad_segs=500');

-- 3. Araç Takip Sistemi (Partitioning Testi)
CREATE TABLE analiz.arac_takip_log (
    id BIGINT,
    plaka VARCHAR(20),
    hiz INTEGER,
    zaman TIMESTAMPTZ,
    geom GEOMETRY(POINT, 4326)
) PARTITION BY RANGE (zaman);

-- Partition'lar (2024 Yılı İçin)
CREATE TABLE analiz.arac_takip_2024_01 PARTITION OF analiz.arac_takip_log FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE analiz.arac_takip_2024_02 PARTITION OF analiz.arac_takip_log FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE analiz.arac_takip_2024_03 PARTITION OF analiz.arac_takip_log FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- Örnek veri aktarımı
INSERT INTO analiz.arac_takip_log (plaka, hiz, zaman, geom)
SELECT 
    '42 ABC ' || floor(random() * 999 + 1),
    random() * 120,
    '2024-01-01'::timestamptz + (random() * interval '90 days'),
    ST_SetSRID(ST_MakePoint(32.45 + (random() * 0.1), 37.85 + (random() * 0.1)), 4326)
FROM generate_series(1, 10000);
