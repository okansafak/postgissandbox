-- ============================================================
-- PostGIS Akademi — 08: CSV Veri Temizleme ve Aktarma (ETL)
-- ============================================================
-- Bu ders, ham (kirli) bir CSV verisinin veritabanına nasıl 
-- aktarılacağını, Regex ile nasıl temizleneceğini ve asıl 
-- tablolara nasıl dağıtılacağını uygulamalı olarak gösterir.

-- ------------------------------------------------------------
-- ADIM 1: Geçici Staging Tablosu Oluşturma
-- ------------------------------------------------------------
-- Ham veriyi olduğu gibi kabul edecek basit bir tablo.
DROP TABLE IF EXISTS konya.nufus_staging;
CREATE TABLE konya.nufus_staging (
    raw_satir TEXT
);

-- ------------------------------------------------------------
-- ADIM 2: COPY Komutu ile Veriyi İçeri Alma
-- ------------------------------------------------------------
-- COPY, büyük dosyalar için standarttır. 
COPY konya.nufus_staging FROM '/docker-entrypoint-initdb.d/data/nufus.csv' WITH (FORMAT text);

-- ------------------------------------------------------------
-- ADIM 3: INSERT Örneği (Manuel Giriş - Eğitim Amaçlı)
-- ------------------------------------------------------------
-- (Bu kısım eğitimde manuel deneme için bırakılmıştır)
INSERT INTO konya.nufus_staging VALUES 
('2025|Konya(Örnek İlçe)-9999|1000.0|');

-- ------------------------------------------------------------
-- ADIM 4: Veriyi Temizleme ve Formatlandırma (Regex)
-- ------------------------------------------------------------
-- Temizlenmiş veriyi bir view veya tablo olarak görelim.
CREATE OR REPLACE VIEW konya.v_temiz_nufus AS
SELECT DISTINCT ON (ilce_adi)
    (regexp_matches(raw_satir, '\((.*?)\)'))[1] as ilce_adi,
    (regexp_matches(raw_satir, '\|(\d+\.?\d*)\|'))[1]::numeric::integer as nufus,
    CASE 
        WHEN raw_satir ~ '^\d{4}' THEN LEFT(raw_satir, 4)
        ELSE NULL 
    END as yil
FROM konya.nufus_staging
WHERE raw_satir ~ '\('
ORDER BY ilce_adi, yil DESC; -- En güncel yılı al

-- ------------------------------------------------------------
-- ADIM 5: Asıl Tabloya (konya.ilce_sinirlari) Aktarma
-- ------------------------------------------------------------
ALTER TABLE konya.ilce_sinirlari ADD COLUMN IF NOT EXISTS nufus INTEGER;

UPDATE konya.ilce_sinirlari i
SET nufus = t.nufus
FROM konya.v_temiz_nufus t
WHERE i.ad = t.ilce_adi;

-- ------------------------------------------------------------
-- ÖZET: COPY vs INSERT
-- ------------------------------------------------------------
-- 1. INSERT: Küçük veri setleri (1000 satır altı) için idealdir.
--    Hata ayıklaması kolaydır, SQL standartıdır.
-- 2. COPY: Büyük veri setleri (Milyon satır) için standarttır.
--    İşlem sırasında log tutmadığı için çok daha hızlıdır.

-- ============================================================
-- BÖLÜM 2: Mahalle Nüfus Verisi Aktarımı (mahallenufus.csv)
-- ============================================================
-- mahallenufus.csv: tab-ayrımlı, başlıksız, 1136 satır
-- Kolonlar: ilce | mahalle | toplam | erkek | kadin
-- Dikkatler:
--   - Binler noktayla gösterilmiş: "1.079" → 1079
--   - Gizli (çok küçük) değerler "C" ile gösterilmiş → NULL

-- ADIM 1: Ham Staging Tablosu (TEXT — tüm değerleri olduğu gibi alır)
DROP TABLE IF EXISTS konya.mahalle_nufus_staging;
CREATE TABLE konya.mahalle_nufus_staging (
    ilce    TEXT,
    mahalle TEXT,
    toplam  TEXT,
    erkek   TEXT,
    kadin   TEXT
);

-- ADIM 2: COPY ile CSV'yi İçeri Al
COPY konya.mahalle_nufus_staging
FROM '/docker-entrypoint-initdb.d/data/mahallenufus.csv'
WITH (FORMAT csv, DELIMITER E'\t', HEADER false);

-- ADIM 3: Mahalleler Tablosunu Güncelle
--   REPLACE('.','')  → binler noktasını kaldırır (1.079 → 1079)
--   NULLIF(x,'C')    → 'C' (gizli) değerini NULL yapar
-- İsim eşleştirme notları:
--   m.ad   = "Akkise Mah."  →  REGEXP_REPLACE ile " Mah." kısmı kaldırılır
--   m.ilce = "Ahırlı"       →  TRANSLATE ile ı→i dönüşümü yapılır (C locale'de UPPER ı'yı büyütmez)
--   s.mahalle = "AKKİSE"    →  LOWER("AKKİSE") = "akkise" (İ→i PostgreSQL'de doğru çalışır)
--   s.ilce = "AHIRLI"       →  LOWER("AHIRLI") = "ahirli"
UPDATE konya.mahalleler m
SET
    nufus = REPLACE(s.toplam, '.', '')::integer,
    erkek = NULLIF(REPLACE(s.erkek, '.', ''), 'C')::integer,
    kadin = NULLIF(REPLACE(s.kadin, '.', ''), 'C')::integer
FROM konya.mahalle_nufus_staging s
WHERE TRANSLATE(LOWER(m.ilce), 'ı', 'i') = LOWER(s.ilce)
  AND TRANSLATE(REGEXP_REPLACE(LOWER(m.ad), '\s+mah\.\s*$', ''), 'ı', 'i') = LOWER(s.mahalle);

-- ADIM 4: Alan Hesaplama (UTM Zone 36N — metre cinsinden, Türkiye için uygun)
UPDATE konya.mahalleler
SET alan_m2 = ST_Area(ST_Transform(geom, 32636))
WHERE geom IS NOT NULL AND alan_m2 IS NULL;
