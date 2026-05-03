-- ============================================================
-- PostGIS Akademi — 01: Uzantılar, Şemalar ve Tablo Yapıları
-- ============================================================

-- 1. Eklentiler
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_raster;
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- 2. Şemalar
CREATE SCHEMA IF NOT EXISTS konya;
CREATE SCHEMA IF NOT EXISTS analiz;

-- 3. Tablo Yapıları (Konya Şeması)

-- Mahalleler
CREATE TABLE konya.mahalleler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    ilce VARCHAR(50),
    nufus INTEGER,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX idx_mahalleler_geom ON konya.mahalleler USING GIST(geom);

-- Hastaneler
CREATE TABLE konya.hastaneler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(150),
    kapasite INTEGER,
    geom GEOMETRY(POINT, 4326)
);
CREATE INDEX idx_hastaneler_geom ON konya.hastaneler USING GIST(geom);

-- Yollar (pgRouting uyumlu)
CREATE TABLE konya.osm_yollar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(200),
    tip VARCHAR(50),
    hiz_limiti INTEGER DEFAULT 50,
    one_way INTEGER DEFAULT 0, -- 0: İki yön, 1: Source->Target, -1: Target->Source
    source INTEGER,
    target INTEGER,
    cost DOUBLE PRECISION,
    reverse_cost DOUBLE PRECISION,
    geom GEOMETRY(LINESTRING, 4326)
);
CREATE INDEX idx_yollar_geom ON konya.osm_yollar USING GIST(geom);

-- Binalar
CREATE TABLE konya.osm_binalar (
    id SERIAL PRIMARY KEY,
    tip VARCHAR(100),
    mahalle_id INTEGER,
    kat_sayisi INTEGER DEFAULT 1,
    geom GEOMETRY(MULTIPOLYGON, 4326)
);
CREATE INDEX idx_binalar_geom ON konya.osm_binalar USING GIST(geom);

-- Duraklar (Toplu Taşıma)
CREATE TABLE konya.duraklar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(150),
    hat_no VARCHAR(50),
    geom GEOMETRY(POINT, 4326)
);
CREATE INDEX idx_duraklar_geom ON konya.duraklar USING GIST(geom);

-- POI (Önemli Noktalar)
CREATE TABLE konya.poi (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(200),
    kategori VARCHAR(100),
    geom GEOMETRY(POINT, 4326)
);
CREATE INDEX idx_poi_geom ON konya.poi USING GIST(geom);
