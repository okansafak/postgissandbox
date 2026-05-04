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
-- Dosya yolu Docker konteyneri içindeki yol olmalıdır.
-- Not: Başlıktaki boş satırları ve metadata kısmını da alır, 
-- sonra temizleyeceğiz.

-- COPY konya.nufus_staging FROM '/docker-entrypoint-initdb.d/data/nufus.csv' WITH (FORMAT text);

-- ------------------------------------------------------------
-- ADIM 3: INSERT Örneği (Manuel Giriş)
-- ------------------------------------------------------------
-- Küçük veri setleri veya testler için INSERT kullanılır.
-- nufus.csv'den örnek satırlar:
INSERT INTO konya.nufus_staging VALUES 
('2023|Konya(Ahırlı)-1868|5027.0|'),
('|Konya(Akören)-1753|5902.0|'),
('|Konya(Akşehir)-1122|92946.0|'),
('2024|Konya(Ereğli)-1312|156253.0|');

-- ------------------------------------------------------------
-- ADIM 4: Veriyi Temizleme ve Formatlandırma (Regex)
-- ------------------------------------------------------------
-- Hedef: '|Konya(Ahırlı)-1868|5027.0|' -> 'Ahırlı', 5027
-- Regex açıklaması:
-- \((.*?)\)  -> Parantez içindeki metni (ilçe adı) yakalar.
-- \|(\d+\.?\d*)\| -> Boru (|) işaretleri arasındaki sayısal değeri (nüfus) yakalar.

SELECT 
    (regexp_matches(raw_satir, '\((.*?)\)'))[1] as ilce_adi,
    (regexp_matches(raw_satir, '\|(\d+\.?\d*)\|'))[1]::numeric::integer as nufus,
    CASE 
        WHEN raw_satir ~ '^\d{4}' THEN LEFT(raw_satir, 4)
        ELSE NULL -- Yıl bilgisi her satırda yok, üst satırdan gelmesi gerekir (İleri seviye)
    END as yil
FROM konya.nufus_staging
WHERE raw_satir ~ '\('; -- Sadece içinde parantez olan (veri içeren) satırları al

-- ------------------------------------------------------------
-- ADIM 5: Asıl Tabloya (konya.ilce_sinirlari) Aktarma
-- ------------------------------------------------------------
-- Staging tablosundaki temizlenmiş veriyi asıl tabloya UPDATE edelim.

UPDATE konya.ilce_sinirlari i
SET nufus = t.temiz_nufus
FROM (
    SELECT 
        (regexp_matches(raw_satir, '\((.*?)\)'))[1] as temiz_ad,
        (regexp_matches(raw_satir, '\|(\d+\.?\d*)\|'))[1]::numeric::integer as temiz_nufus
    FROM konya.nufus_staging
    WHERE raw_satir ~ '\('
) t
WHERE i.ad = t.temiz_ad;

-- ------------------------------------------------------------
-- ÖZET: COPY vs INSERT
-- ------------------------------------------------------------
-- 1. INSERT: Küçük veri setleri (1000 satır altı) için idealdir.
--    Hata ayıklaması kolaydır, SQL standartıdır.
-- 2. COPY: Büyük veri setleri (Milyon satır) için standarttır.
--    İşlem sırasında log tutmadığı için çok daha hızlıdır.
