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
