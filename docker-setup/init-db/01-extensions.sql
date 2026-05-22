-- ============================================================
-- PostGIS Akademi — 01: Eklentiler ve Şema Oluşturma
-- Çalıştırılma Sırası: 1/6 (İlk çalışır)
-- ============================================================

-- Mekansal Eklentiler
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_raster;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS pgrouting;
CREATE EXTENSION IF NOT EXISTS h3;
CREATE EXTENSION IF NOT EXISTS h3_postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_dirtyread;  -- MVCC dead tuple recovery (Bölüm 4, Slayt 15)

-- Doğrulama
DO $$ BEGIN RAISE NOTICE 'PostGIS Sürümü: %', postgis_full_version(); END $$;

-- Eğitim Şemaları
CREATE SCHEMA IF NOT EXISTS konya;       -- Konya yerel verileri
CREATE SCHEMA IF NOT EXISTS egitim;      -- Genel eğitim tabloları (Bölüm 0)
CREATE SCHEMA IF NOT EXISTS analiz;      -- İleri analiz ve performans tabloları
