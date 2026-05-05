-- ============================================================
-- PostGIS Akademi — 04-base-data: Konya Temel Veri Seti
-- Çalıştırılma Sırası: 4/7
-- ============================================================
-- Bu dosya, eğitim boyunca kullanılacak örnek verileri içerir.
-- Gerçek dünya konumlarına yakın koordinatlar kullanılmıştır.

-- ============================================================
-- NOT: Hastaneler, Yollar, Binalar ve Duraklar (POI) gibi mekansal veriler
-- artık '03-import-geojson.sh' betiği aracılığıyla doğrudan gerçek 
-- OpenStreetMap (OSM) GeoJSON dosyalarından (data/ klasörü) içe aktarılmaktadır.
-- Bu nedenle manuel, sahte INSERT işlemleri bu dosyadan kaldırılmıştır.
-- ============================================================

-- ============================================================
-- 7. PERSONEL (Bölüm 0 - Ders 2: DML Egzersizi)
-- ============================================================
INSERT INTO egitim.personel (
    ad, soyad, cinsiyet, unvan, birim, ilce, maas, ise_giris, aktif
)
WITH raw_data AS (
    SELECT 
        floor(random()*50 + 1)::int as ad_idx,
        floor(random()*50 + 1)::int as soyad_idx,
        floor(random()*28 + 1)::int as unvan_idx,
        floor(random()*22 + 1)::int as birim_idx,
        floor(random()*10 + 1)::int as ilce_idx,
        round((random() * 60000 + 25000)::numeric, 2) as maas,
        CURRENT_DATE - (floor(random() * 7300))::int as ise_giris,
        (random() < 0.88) as aktif
    FROM generate_series(1, 1000)
)
SELECT
    (ARRAY[
        'Ahmet','Mehmet','Mustafa','Ali','Hasan','Hüseyin','İbrahim','Yusuf','Osman','Murat',
        'Emre','Mert','Burak','Can','Oğuz','Serkan','Halil','Ramazan','Eren','Kaan',
        'Ayşe','Fatma','Zeynep','Elif','Emine','Merve','Esra','Sultan','Hatice','Derya',
        'Nurgül','Gül','Sevgi','Yasemin','Büşra','Tuğba','İpek','Selin','Damla','Gizem',
        'Sinem','Melis','Aylin','Hülya','Nesrin','Fadime','Şeyma','Sena','Rabia','Nazan'
    ])[ad_idx],
    (ARRAY[
        'Yılmaz','Kaya','Demir','Çelik','Şahin','Yıldız','Arslan','Koç','Kurt','Aydın',
        'Öztürk','Aslan','Doğan','Kılıç','Çetin','Güneş','Erdoğan','Polat','Aksoy','Karaca',
        'Bulut','Avcı','Taş','Kara','Güven','Erdem','Sezer','Yalçın','Işık','Uçar',
        'Duman','Ekinci','Sarı','Özkan','Kaplan','Gök','Çakır','Balcı','Turan','Altun',
        'Özdemir','Gül','Bozkurt','Aktaş','Bayram','Acar','Kocaman','Tuncer','Ergin','Şen'
    ])[soyad_idx],
    CASE WHEN ad_idx <= 20 THEN 'Erkek' ELSE 'Kadın' END,
    (ARRAY[
        'Daire Başkanı','Şube Müdürü','Müdür','Müdür Yardımcısı','Şef','Uzman',
        'Mühendis (İnşaat)','Mühendis (Harita)','Mühendis (Makine)',
        'Mühendis (Elektrik)','Mühendis (Çevre)','Yazılım Geliştirici',
        'CBS Uzmanı','Şehir Plancısı','Mimar','Veri Analisti',
        'Harita Teknikeri','Tekniker','Teknisyen',
        'Zabıta Memuru','İtfaiye Eri','Operatör','Şoför',
        'Saha Personeli','VHKİ','Memur','Avukat','Sosyal Çalışmacı'
    ])[unvan_idx],
    (ARRAY[
        'Fen İşleri Dairesi', 'İmar ve Şehircilik Dairesi', 'Ulaşım Planlama ve Raylı Sistem',
        'Park ve Bahçeler Dairesi', 'Çevre Koruma ve Kontrol', 'Zabıta Dairesi',
        'İtfaiye Dairesi', 'KOSKİ Genel Müdürlüğü', 'Mali Hizmetler Dairesi',
        'İnsan Kaynakları ve Eğitim', 'Bilgi İşlem Dairesi', 'Destek Hizmetleri',
        'Etüt ve Proje Dairesi', 'Coğrafi Bilgi Sistemleri', 'Emlak ve İstimlak',
        'Kırsal Hizmetler', 'Sosyal Hizmetler', 'Kültür ve Turizm',
        'Strateji Geliştirme', 'Basın Yayın ve Halkla İlişkiler', 'Hukuk Müşavirliği',
        'Mezarlıklar Müdürlüğü'
    ])[birim_idx],
    (ARRAY[
        'Selçuklu','Meram','Karatay','Kulu','Beyşehir',
        'Ereğli','Akşehir','Seydişehir','Çumra','Ilgın'
    ])[ilce_idx],
    maas,
    ise_giris,
    aktif
FROM raw_data;
