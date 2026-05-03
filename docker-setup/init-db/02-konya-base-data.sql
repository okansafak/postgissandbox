-- ============================================================
-- PostGIS Akademi — 02: Konya Temel Veri Seti (Insert)
-- ============================================================

-- 1. Mahalleler
INSERT INTO konya.mahalleler (ad, ilce, nufus, geom) VALUES 
('Yazır', 'Selçuklu', 69444, ST_GeomFromText('MULTIPOLYGON(((32.48 37.92, 32.51 37.92, 32.51 37.95, 32.48 37.95, 32.48 37.92)))', 4326)),
('Bosna Hersek', 'Selçuklu', 39814, ST_GeomFromText('MULTIPOLYGON(((32.50 38.00, 32.53 38.00, 32.53 38.03, 32.50 38.03, 32.50 38.00)))', 4326)),
('Akabe', 'Karatay', 18400, ST_GeomFromText('MULTIPOLYGON(((32.51 37.86, 32.54 37.86, 32.54 37.88, 32.51 37.88, 32.51 37.86)))', 4326));

-- 2. Hastaneler
INSERT INTO konya.hastaneler (ad, kapasite, geom) VALUES 
('Konya Şehir Hastanesi', 1250, ST_SetSRID(ST_MakePoint(32.540, 37.865), 4326)),
('Meram Tıp Fakültesi', 950, ST_SetSRID(ST_MakePoint(32.425, 37.882), 4326)),
('Numune Hastanesi', 600, ST_SetSRID(ST_MakePoint(32.492, 37.878), 4326));

-- 3. Yollar
INSERT INTO konya.osm_yollar (ad, tip, hiz_limiti, geom) VALUES 
('Mevlana Caddesi', 'Ana Arter', 50, ST_GeomFromText('LINESTRING(32.492 37.872, 32.498 37.871)', 4326)),
('Yeni İstanbul Caddesi', 'Devlet Yolu', 90, ST_GeomFromText('LINESTRING(32.497 37.894, 32.515 38.050)', 4326));

-- 4. Binalar
INSERT INTO konya.osm_binalar (tip, mahalle_id, geom) VALUES 
('Mevlana Müzesi', 3, ST_GeomFromText('MULTIPOLYGON(((32.504 37.874, 32.505 37.874, 32.505 37.875, 32.504 37.875, 32.504 37.874)))', 4326)),
('Büyükşehir Belediye Sarayı', 1, ST_GeomFromText('MULTIPOLYGON(((32.493 37.886, 32.494 37.886, 32.494 37.887, 32.493 37.887, 32.493 37.886)))', 4326));

-- 5. Duraklar
INSERT INTO konya.duraklar (ad, hat_no, geom) VALUES 
('Kültürpark', 'T1', ST_SetSRID(ST_MakePoint(32.490, 37.875), 4326)),
('Belediye', 'T1', ST_SetSRID(ST_MakePoint(32.493, 37.887), 4326));
