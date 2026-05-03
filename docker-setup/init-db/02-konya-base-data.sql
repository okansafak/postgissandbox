-- ============================================================
-- PostGIS Akademi — 02: Konya Temel Veri Seti
-- Çalıştırılma Sırası: 3/6
-- ============================================================
-- Bu dosya, eğitim boyunca kullanılacak örnek verileri içerir.
-- Gerçek dünya konumlarına yakın koordinatlar kullanılmıştır.

-- ============================================================
-- 1. MAHALLELER (Bölüm 0: WHERE/GROUP BY, Bölüm 1: ST_Transform)
-- ============================================================
INSERT INTO konya.mahalleler (ad, ilce, nufus, geom) VALUES
('Yazır',          'Selçuklu', 69444, ST_GeomFromText('MULTIPOLYGON(((32.48 37.92, 32.51 37.92, 32.51 37.95, 32.48 37.95, 32.48 37.92)))', 4326)),
('Bosna Hersek',   'Selçuklu', 39814, ST_GeomFromText('MULTIPOLYGON(((32.50 38.00, 32.53 38.00, 32.53 38.03, 32.50 38.03, 32.50 38.00)))', 4326)),
('Akabe',          'Karatay',  18400, ST_GeomFromText('MULTIPOLYGON(((32.51 37.86, 32.54 37.86, 32.54 37.88, 32.51 37.88, 32.51 37.86)))', 4326)),
('Karaaslan',      'Karatay',  12850, ST_GeomFromText('MULTIPOLYGON(((32.47 37.87, 32.50 37.87, 32.50 37.89, 32.47 37.89, 32.47 37.87)))', 4326)),
('Hacıveyiszade',  'Karatay',  8200,  ST_GeomFromText('MULTIPOLYGON(((32.49 37.87, 32.51 37.87, 32.51 37.88, 32.49 37.88, 32.49 37.87)))', 4326)),
('Şeker',          'Meram',    45200, ST_GeomFromText('MULTIPOLYGON(((32.42 37.84, 32.45 37.84, 32.45 37.87, 32.42 37.87, 32.42 37.84)))', 4326)),
('Yenişehir',      'Meram',    27600, ST_GeomFromText('MULTIPOLYGON(((32.44 37.85, 32.47 37.85, 32.47 37.88, 32.44 37.88, 32.44 37.85)))', 4326)),
('Loras',          'Meram',    6300,  ST_GeomFromText('MULTIPOLYGON(((32.40 37.82, 32.43 37.82, 32.43 37.85, 32.40 37.85, 32.40 37.82)))', 4326)),
('Horozluhan',     'Selçuklu', 52100, ST_GeomFromText('MULTIPOLYGON(((32.45 37.93, 32.49 37.93, 32.49 37.96, 32.45 37.96, 32.45 37.93)))', 4326)),
('Sille',          'Selçuklu', 3200,  ST_GeomFromText('MULTIPOLYGON(((32.38 37.95, 32.42 37.95, 32.42 37.98, 32.38 37.98, 32.38 37.95)))', 4326));

-- ============================================================
-- 2. İLÇE SINIRLARI (Bölüm 2: ST_Subdivide, Partitioning)
-- ============================================================
INSERT INTO konya.ilce_sinirlari (ad, geom) VALUES
('Selçuklu', ST_GeomFromText('MULTIPOLYGON(((32.35 37.90, 32.55 37.90, 32.55 38.10, 32.35 38.10, 32.35 37.90)))', 4326)),
('Karatay',  ST_GeomFromText('MULTIPOLYGON(((32.45 37.82, 32.60 37.82, 32.60 37.92, 32.45 37.92, 32.45 37.82)))', 4326)),
('Meram',    ST_GeomFromText('MULTIPOLYGON(((32.35 37.78, 32.50 37.78, 32.50 37.90, 32.35 37.90, 32.35 37.78)))', 4326));

-- ============================================================
-- 3. HASTANELER (Bölüm 0: LEFT JOIN, Bölüm 1: ST_Intersects/KNN)
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
