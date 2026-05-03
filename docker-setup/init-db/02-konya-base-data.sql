-- ============================================================
-- PostGIS Akademi — 02: Konya Temel Veri Seti (Gerçek Veriler)
-- ============================================================

-- 1. Mahalleler (Gerçek Nüfus ve Yaklaşık Koordinatlar)
-- Koordinat sistemi: WGS84 (4326)
INSERT INTO konya.mahalleler (ad, ilce, nufus, geom) VALUES 
('Yazır', 'Selçuklu', 69444, ST_GeomFromText('MULTIPOLYGON(((32.48 37.92, 32.51 37.92, 32.51 37.95, 32.48 37.95, 32.48 37.92)))', 4326)),
('Bosna Hersek', 'Selçuklu', 39814, ST_GeomFromText('MULTIPOLYGON(((32.50 38.00, 32.53 38.00, 32.53 38.03, 32.50 38.03, 32.50 38.00)))', 4326)),
('Beyhekim', 'Selçuklu', 28892, ST_GeomFromText('MULTIPOLYGON(((32.47 37.96, 32.49 37.96, 32.49 37.98, 32.47 37.98, 32.47 37.96)))', 4326)),
('İstasyon', 'Meram', 12500, ST_GeomFromText('MULTIPOLYGON(((32.47 37.85, 32.49 37.85, 32.49 37.87, 32.47 37.87, 32.47 37.85)))', 4326)),
('Akabe', 'Karatay', 18400, ST_GeomFromText('MULTIPOLYGON(((32.51 37.86, 32.54 37.86, 32.54 37.88, 32.51 37.88, 32.51 37.86)))', 4326));

-- 2. Hastaneler (Gerçek Konumlar)
INSERT INTO konya.hastaneler (ad, kapasite, geom) VALUES 
('Konya Şehir Hastanesi', 1250, ST_SetSRID(ST_MakePoint(32.540, 37.865), 4326)),
('Meram Tıp Fakültesi', 950, ST_SetSRID(ST_MakePoint(32.425, 37.882), 4326)),
('Numune Hastanesi', 600, ST_SetSRID(ST_MakePoint(32.492, 37.878), 4326)),
('Beyhekim Devlet Hastanesi', 450, ST_SetSRID(ST_MakePoint(32.485, 37.975), 4326));

-- 3. Önemli Caddeler (Gerçek Güzergahlar)
INSERT INTO konya.yollar (ad, tip, hiz_limiti, geom) VALUES 
('Mevlana Caddesi', 'Ana Arter', 50, ST_GeomFromText('LINESTRING(32.492 37.872, 32.498 37.871)', 4326)),
('Alaaddin Bulvarı', 'Döner Kavşak', 40, ST_GeomFromText('LINESTRING(32.492 37.872, 32.490 37.873, 32.492 37.875, 32.494 37.873, 32.492 37.872)', 4326)),
('Ahmet Hilmi Nalçacı Caddesi', 'Bulvar', 70, ST_GeomFromText('LINESTRING(32.492 37.885, 32.485 37.910)', 4326)),
('Yeni İstanbul Caddesi', 'Devlet Yolu', 90, ST_GeomFromText('LINESTRING(32.497 37.894, 32.515 38.050)', 4326));

-- 4. Binalar (Kritik Kamu Binaları)
INSERT INTO konya.binalar (tip, mahalle_id, geom) VALUES 
('Büyükşehir Belediye Sarayı', 1, ST_SetSRID(ST_MakePoint(32.493, 37.886), 4326)),
('Mevlana Müzesi', 5, ST_SetSRID(ST_MakePoint(32.5048, 37.8748), 4326)),
('Konya Valiliği', 4, ST_SetSRID(ST_MakePoint(32.491, 37.873), 4326));
