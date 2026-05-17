-- ============================================================
-- PostGIS Akademi — 02-schema: Tablo Yapıları
-- Çalıştırılma Sırası: 2/7
-- ============================================================
-- NOT: Eklentiler ve şemalar 01-extensions.sql tarafından
-- zaten oluşturulmuştur. Burada sadece tablolar tanımlanır.

-- ============================================================
-- BÖLÜM 0: SQL'e Giriş Tabloları
-- ============================================================

-- Personel Tablosu (Bölüm 0 - Ders 2: DDL Egzersizi)
-- Öğrenciler bu tabloyu CREATE TABLE ile oluşturmayı öğrenecek.
-- Docker ortamında hazır olması için burada da tanımlıyoruz.
CREATE TABLE IF NOT EXISTS egitim.personel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad TEXT NOT NULL,
    soyad TEXT,
    cinsiyet TEXT,
    unvan TEXT,
    birim TEXT,
    ilce TEXT,
    maas NUMERIC(10,2),
    ise_giris DATE,
    aktif BOOLEAN DEFAULT true
);

-- ============================================================
-- ANA VERİ TABLOLARI (konya şeması)
-- ============================================================

-- Mahalleler (Bölüm 0: WHERE/GROUP BY, Bölüm 1: ST_Transform, Bölüm 2: Partitioning)
CREATE TABLE IF NOT EXISTS konya.mahalleler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    ilce VARCHAR(50) NOT NULL,
    nufus INTEGER,
    erkek INTEGER,
    kadin INTEGER,
    alan_m2 DOUBLE PRECISION,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_mahalleler_geom ON konya.mahalleler USING GIST(geom);

-- İlçe Sınırları (Bölüm 2: ST_Subdivide, ST_SimplifyPreserveTopology)
CREATE TABLE IF NOT EXISTS konya.ilce_sinirlari (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    plaka INTEGER DEFAULT 42,
    nufus INTEGER,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_ilce_geom ON konya.ilce_sinirlari USING GIST(geom);

-- İl Sınırları (Yeni: Büyük ölçekli analizler için)
CREATE TABLE IF NOT EXISTS konya.il_sinirlari (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_il_geom ON konya.il_sinirlari USING GIST(geom);


-- Yollar - pgRouting uyumlu (Bölüm 1: Linear Referencing, Bölüm 3: Dijkstra)
CREATE TABLE IF NOT EXISTS konya.osm_yollar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(200),
    tip VARCHAR(50),
    ilce VARCHAR(50),  -- Hangi ilçeye ait olduğu bilgisi
    hiz_limiti INTEGER DEFAULT 50,
    one_way INTEGER DEFAULT 0,
    source INTEGER,
    target INTEGER,
    cost DOUBLE PRECISION,
    reverse_cost DOUBLE PRECISION,
    geom GEOMETRY(LINESTRING, 4326)
);
CREATE INDEX IF NOT EXISTS idx_yollar_geom ON konya.osm_yollar USING GIST(geom);

-- Binalar (Bölüm 1: KNN, Bölüm 2: GiST İndeks Performans Testi)
CREATE TABLE IF NOT EXISTS konya.osm_binalar (
    id SERIAL PRIMARY KEY,
    tip VARCHAR(100),
    mahalle_id INTEGER,
    kat_sayisi INTEGER DEFAULT 1,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_binalar_geom ON konya.osm_binalar USING GIST(geom);

-- POI - İlgi Noktaları (Genel amaçlı)
CREATE TABLE IF NOT EXISTS konya.poi (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(200),
    kategori VARCHAR(100),
    ilce VARCHAR(50),
    mahalle_id INTEGER,
    ilce_id INTEGER,
    geom GEOMETRY(POINT, 4326)
);
CREATE INDEX IF NOT EXISTS idx_poi_geom ON konya.poi USING GIST(geom);

-- Staging Tablosu (Bölüm 2: CSV Import ve Batch Processing Egzersizi)
CREATE TABLE IF NOT EXISTS konya.staging_import (
    id SERIAL PRIMARY KEY,
    kaynak_id TEXT,
    ad TEXT,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION,
    kategori TEXT,
    geom GEOMETRY(POINT, 4326)
);

-- ============================================================
-- ANALİZ TABLOLARI (analiz şeması)
-- ============================================================

-- Sentetik Kaza Verileri (Bölüm 3: DBSCAN, Isı Haritası, HexGrid)
CREATE TABLE IF NOT EXISTS analiz.kazalar (
    id SERIAL PRIMARY KEY,
    tarih TIMESTAMP DEFAULT NOW(),
    siddet INTEGER CHECK (siddet BETWEEN 1 AND 5),  -- 1: Hafif, 5: Ölümlü
    tur VARCHAR(50),
    ilce VARCHAR(50) DEFAULT 'Selçuklu',
    geom GEOMETRY(POINT, 4326)
);
CREATE INDEX IF NOT EXISTS idx_kazalar_geom ON analiz.kazalar USING GIST(geom);

-- Hastaneler (Bölüm 0: JOIN, Bölüm 1: ST_Intersects/KNN)
-- NOT: Gerçek veriler POI tablosuna yüklendiği için, eski tablo yerine dinamik bir View oluşturuyoruz.
-- Bu sayede eğitimdeki mahalle_id JOIN sorguları gerçek OSM verisiyle hatasız çalışır.
CREATE OR REPLACE VIEW konya.hastaneler AS
SELECT 
    p.id, 
    p.ad, 
    m.id AS mahalle_id, 
    500 AS kapasite, 
    true AS acil_servis, 
    p.geom
FROM konya.poi p
LEFT JOIN konya.mahalleler m ON ST_Intersects(p.geom, m.geom)
WHERE p.kategori = 'Hastane';
