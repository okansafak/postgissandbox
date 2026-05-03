-- ============================================================
-- PostGIS Akademi — 05: İleri Analiz ve Proje Verileri
-- ============================================================

-- 1. Kaza Yoğunluk Kümeleme (DBSCAN / KMeans)
CREATE TABLE analiz.trafik_kazalari (
    id SERIAL PRIMARY KEY,
    kaza_tipi VARCHAR(50),
    ciddiyet VARCHAR(20),
    zaman TIMESTAMPTZ,
    geom GEOMETRY(POINT, 4326)
);

-- Kaza kümeleri oluşturma (3 ana odak noktası)
-- Odak 1: Alaaddin Bulvarı
INSERT INTO analiz.trafik_kazalari (kaza_tipi, ciddiyet, zaman, geom)
SELECT 'Çarpışma', 'Orta', NOW(), ST_SetSRID(ST_MakePoint(32.492 + (random() * 0.002), 37.872 + (random() * 0.002)), 4326)
FROM generate_series(1, 40);

-- Odak 2: Otogar Kavşağı
INSERT INTO analiz.trafik_kazalari (kaza_tipi, ciddiyet, zaman, geom)
SELECT 'Zincirleme', 'Yüksek', NOW(), ST_SetSRID(ST_MakePoint(32.510 + (random() * 0.003), 38.005 + (random() * 0.003)), 4326)
FROM generate_series(1, 30);

-- Odak 3: Meram Yaka
INSERT INTO analiz.trafik_kazalari (kaza_tipi, ciddiyet, zaman, geom)
SELECT 'Yayaya Çarpma', 'Düşük', NOW(), ST_SetSRID(ST_MakePoint(32.440 + (random() * 0.005), 37.855 + (random() * 0.005)), 4326)
FROM generate_series(1, 20);

-- 2. Ağ Analizi (pgRouting) - Detaylı Graf
CREATE TABLE analiz.yol_agi (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    source INTEGER,
    target INTEGER,
    cost DOUBLE PRECISION,
    reverse_cost DOUBLE PRECISION,
    max_hiz INTEGER,
    geom GEOMETRY(LINESTRING, 4326)
);

-- Örnek Ağ (Mevlana - Alaaddin - Kültür Park - Belediye)
-- Not: Bu manuel bir graf simülasyonudur.
INSERT INTO analiz.yol_agi (ad, source, target, cost, reverse_cost, max_hiz, geom) VALUES 
('Mevlana - Alaaddin', 1, 2, 0.6, 0.6, 50, ST_GeomFromText('LINESTRING(32.504 37.874, 32.492 37.872)', 4326)),
('Alaaddin - Kültür Park', 2, 3, 0.4, 0.4, 40, ST_GeomFromText('LINESTRING(32.492 37.872, 32.488 37.878)', 4326)),
('Kültür Park - Belediye', 3, 4, 0.7, 0.7, 60, ST_GeomFromText('LINESTRING(32.488 37.878, 32.493 37.886)', 4326)),
('Alaaddin - Belediye (Alternatif)', 2, 4, 1.2, 1.2, 50, ST_GeomFromText('LINESTRING(32.492 37.872, 32.493 37.886)', 4326));

-- 3. Acil Durum Tesisleri (Proje İçin)
CREATE TABLE analiz.acil_durum_tesisleri (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    tip VARCHAR(50), -- 'İtfaiye', 'Karakol', 'AFAD'
    personel_sayisi INTEGER,
    geom GEOMETRY(POINT, 4326)
);

INSERT INTO analiz.acil_durum_tesisleri (ad, tip, personel_sayisi, geom) VALUES 
('Karatay İtfaiye Merkezi', 'İtfaiye', 45, ST_SetSRID(ST_MakePoint(32.520, 37.875), 4326)),
('Selçuklu İtfaiye Merkezi', 'İtfaiye', 60, ST_SetSRID(ST_MakePoint(32.485, 37.930), 4326)),
('Meram Emniyet Müdürlüğü', 'Karakol', 120, ST_SetSRID(ST_MakePoint(32.460, 37.860), 4326)),
('Konya AFAD Koordinasyon', 'AFAD', 200, ST_SetSRID(ST_MakePoint(32.505, 37.915), 4326));

-- 4. Güvenlik: Row-Level Security Politikaları Ön Hazırlık
-- Bu tablo eğitimde policy yazmak için kullanılacak
CREATE TABLE analiz.kullanici_bolgeleri (
    username TEXT PRIMARY KEY,
    bolge_geom GEOMETRY(POLYGON, 4326)
);

INSERT INTO analiz.kullanici_bolgeleri VALUES 
('selcuklu_admin', ST_GeomFromText('POLYGON((32.45 37.88, 32.55 37.88, 32.55 38.05, 32.45 38.05, 32.45 37.88))', 4326)),
('meram_admin', ST_GeomFromText('POLYGON((32.40 37.80, 32.48 37.80, 32.48 37.90, 32.40 37.90, 32.40 37.80))', 4326));
