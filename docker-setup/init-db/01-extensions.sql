-- ============================================================
-- PostGIS Akademi — 01: Eklenti ve Şema Oluşturma
-- ============================================================

-- Mekansal Eklentiler
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_raster;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- Doğrulama
DO $$ BEGIN RAISE NOTICE 'PostGIS Sürümü: %', postgis_full_version(); END $$;

-- Eğitim Şemaları
CREATE SCHEMA IF NOT EXISTS konya;       -- Konya yerel verileri
CREATE SCHEMA IF NOT EXISTS egitim;      -- Genel eğitim tabloları
CREATE SCHEMA IF NOT EXISTS analiz;      -- İleri analiz tabloları
