-- ============================================================
-- PostGIS Akademi — 04-base-data: Konya Temel Veri Seti
-- Çalıştırılma Sırası: 4/7
-- ============================================================
-- Bu dosya, eğitim boyunca kullanılacak örnek verileri içerir.
-- Gerçek dünya konumlarına yakın koordinatlar kullanılmıştır.

-- ============================================================
-- 1. HASTANELER (Bölüm 0: LEFT JOIN, Bölüm 1: ST_Intersects/KNN)
-- ============================================================
INSERT INTO konya.hastaneler (ad, kapasite, acil_servis, geom) VALUES
('Konya Şehir Hastanesi',         1250, true,  ST_SetSRID(ST_MakePoint(32.540, 37.865), 4326)),
('Meram Tıp Fakültesi',           950,  true,  ST_SetSRID(ST_MakePoint(32.425, 37.882), 4326)),
('Numune Hastanesi',               600,  true,  ST_SetSRID(ST_MakePoint(32.492, 37.878), 4326)),
('Karatay Devlet Hastanesi',       400,  true,  ST_SetSRID(ST_MakePoint(32.510, 37.870), 4326)),
('Selçuklu Devlet Hastanesi',      350,  true,  ST_SetSRID(ST_MakePoint(32.470, 37.930), 4326)),
('Özel Farabi Hastanesi',          200,  false, ST_SetSRID(ST_MakePoint(32.485, 37.890), 4326)),
('Beyhekim Devlet Hastanesi',      450,  true,  ST_SetSRID(ST_MakePoint(32.465, 37.875), 4326));

-- ============================================================
-- 4. YOLLAR (Bölüm 1: Linear Referencing, Bölüm 3: pgr_dijkstra)
-- ============================================================
INSERT INTO konya.osm_yollar (ad, tip, hiz_limiti, geom) VALUES
('Mevlana Caddesi',         'Ana Arter',    50, ST_GeomFromText('LINESTRING(32.492 37.872, 32.498 37.871, 32.505 37.874)', 4326)),
('Yeni İstanbul Caddesi',   'Devlet Yolu',  90, ST_GeomFromText('LINESTRING(32.497 37.894, 32.505 37.940, 32.515 38.050)', 4326)),
('Ankara Caddesi',          'Devlet Yolu',  70, ST_GeomFromText('LINESTRING(32.490 37.880, 32.510 37.890, 32.530 37.870)', 4326)),
('Nalçacı Caddesi',         'Ana Arter',    50, ST_GeomFromText('LINESTRING(32.460 37.870, 32.475 37.880, 32.492 37.878)', 4326)),
('Konya-Aksaray Yolu',      'Otoyol',      120, ST_GeomFromText('LINESTRING(32.500 37.900, 32.600 38.000, 32.700 38.100)', 4326)),
('Büsan Caddesi',           'Ana Arter',    50, ST_GeomFromText('LINESTRING(32.470 37.925, 32.485 37.935, 32.500 37.940)', 4326)),
('Musalla Bağları Caddesi', 'Bulvar',       60, ST_GeomFromText('LINESTRING(32.450 37.885, 32.465 37.880, 32.480 37.870)', 4326)),
('Feritpaşa Caddesi',       'Ana Arter',    50, ST_GeomFromText('LINESTRING(32.490 37.870, 32.488 37.860, 32.485 37.850)', 4326));

-- ============================================================
-- 5. BİNALAR (Bölüm 1: KNN, Bölüm 2: GiST İndeks Performans)
-- ============================================================
INSERT INTO konya.osm_binalar (tip, mahalle_id, kat_sayisi, geom) VALUES
('Mevlana Müzesi',              3, 2,  ST_GeomFromText('MULTIPOLYGON(((32.504 37.874, 32.505 37.874, 32.505 37.875, 32.504 37.875, 32.504 37.874)))', 4326)),
('Büyükşehir Belediye Sarayı',  1, 8,  ST_GeomFromText('MULTIPOLYGON(((32.493 37.886, 32.494 37.886, 32.494 37.887, 32.493 37.887, 32.493 37.886)))', 4326)),
('Alaaddin Camii',              3, 1,  ST_GeomFromText('MULTIPOLYGON(((32.495 37.876, 32.496 37.876, 32.496 37.877, 32.495 37.877, 32.495 37.876)))', 4326)),
('Selçuklu Belediyesi',         1, 5,  ST_GeomFromText('MULTIPOLYGON(((32.472 37.932, 32.473 37.932, 32.473 37.933, 32.472 37.933, 32.472 37.932)))', 4326)),
('Karatay Medresesi',           3, 1,  ST_GeomFromText('MULTIPOLYGON(((32.497 37.877, 32.498 37.877, 32.498 37.878, 32.497 37.878, 32.497 37.877)))', 4326)),
('Konya Bilim Merkezi',         9, 3,  ST_GeomFromText('MULTIPOLYGON(((32.455 37.920, 32.456 37.920, 32.456 37.921, 32.455 37.921, 32.455 37.920)))', 4326)),
('Meram Belediyesi',            6, 4,  ST_GeomFromText('MULTIPOLYGON(((32.440 37.860, 32.441 37.860, 32.441 37.861, 32.440 37.861, 32.440 37.860)))', 4326));

-- ============================================================
-- 6. DURAKLAR (Bölüm 3: ST_ClusterKMeans, DBSCAN)
-- ============================================================
INSERT INTO konya.duraklar (ad, hat_no, geom) VALUES
('Kültürpark',       'T1', ST_SetSRID(ST_MakePoint(32.490, 37.875), 4326)),
('Belediye',         'T1', ST_SetSRID(ST_MakePoint(32.493, 37.887), 4326)),
('Mevlana',          'T1', ST_SetSRID(ST_MakePoint(32.505, 37.874), 4326)),
('Alaaddin',         'T1', ST_SetSRID(ST_MakePoint(32.495, 37.877), 4326)),
('Selçuk Üniv.',     'T2', ST_SetSRID(ST_MakePoint(32.515, 37.960), 4326)),
('Bosna Hersek',     'T2', ST_SetSRID(ST_MakePoint(32.510, 38.010), 4326)),
('Büsan',            'T2', ST_SetSRID(ST_MakePoint(32.485, 37.935), 4326)),
('Meram Bahçeleri',  'T3', ST_SetSRID(ST_MakePoint(32.440, 37.850), 4326)),
('Şeker Fabrikası',  'T3', ST_SetSRID(ST_MakePoint(32.430, 37.845), 4326)),
('Loras',            'T3', ST_SetSRID(ST_MakePoint(32.415, 37.835), 4326)),
('Terminal',         'T1', ST_SetSRID(ST_MakePoint(32.520, 37.885), 4326)),
('Karatay Sanayi',   'T4', ST_SetSRID(ST_MakePoint(32.555, 37.870), 4326));

-- ============================================================
-- 7. PERSONEL (Bölüm 0 - Ders 2: DML Egzersizi)
-- ============================================================
INSERT INTO egitim.personel (ad, soyad, maas, ise_giris) VALUES
('Ahmet', 'Yılmaz',   8500.00, '2018-03-15'),
('Ayşe',  'Kaya',     9200.50, '2019-07-01'),
('Mehmet','Demir',     7800.00, '2020-01-10'),
('Fatma', 'Çelik',   11000.00, '2015-09-20'),
('Ali',   'Şahin',    6500.00, '2022-06-01');
