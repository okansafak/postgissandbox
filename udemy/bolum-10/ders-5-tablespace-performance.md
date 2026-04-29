# Ders 5: Fiziğin ve Maliyetin Ayrışımı (Tablespace Optimizasyonu)

**[Giriş / Hook]**
Verileriniz partition (bölümleme) sayesinde ayrı tablolara ayrıldı. "Son 1 ayın" lojistik verisi her saniye taranıyor, deli gibi güncelleniyor (Sıcak Veri). Ama "3 yıl önceki" navigasyon verisine sadece yılda 1 kez mevzuat denetimi için bakılıyor (Soğuk Veri). İkisini de sunucunuzun saniyesi binlerce dolara mal olan Ultra-Fast NVMe SSD disklerinde tutmak, şirketin finansal aklına hakarettir. SQL yazılım katmanından çıkıp donanım disklerine cerrahi müdahale etme sanatı The Tablespace'tir.

**[Teori / Kavramsal Çerçeve]**
`TableSpace` (Tablo Uzayı), basitçe veritabanında mantıksal bir klasördür, fakat aslında sunucudaki spesifik bir "Donanım Diskine" yapılmış doğrudan bağlantıdır.
Veritabanı elitlerinin sırrı şudur: Sunucuya iki farklı hard disk takılır.
1. `Fast_Zon`: Çok pahalı ve hızlı SSD.
2. `Slow_Zon`: Dev gibi ama çok ucuz, yavaş Manyetik disk (HDD).
Ardından, sıcak güncel Partition alt tablosunu ve onun o can alıcı `GIST` İndeksini doğrudan SSD klasörüne (`Tablespace fast_zone`) yaratırsınız. 2021 yılına ait soğuk arşivi ve indeksleri ise yavaş (`Tablespace slow_zone`) diske kaydedersiniz. 
Böylece uygulama "Güncel veriyi bul" dediğinde, motor SSD'den tepki verir ve sorgu anında uçar. Yıllık ciro ve performans dengeniz kusursuz bir optimizasyona oturmuş olur.

**[Uygulama / Ekran Gösterimi]**
Makine odasına inip, devasa sunucumuzun içindeki iki farklı fiziksel lokasyona (Disk Klasörüne) veritabanı kancası (Tablespace) asıyoruz:
`-- 1. Fiziksel donanım klasörlerini (Sunucunun içindeki yolları) Tablespace olarak bağlama`
`CREATE TABLESPACE ucan_disk LOCATION '/mnt/ssd_fast_disk_01';`
`CREATE TABLESPACE arsiv_diski LOCATION '/mnt/hdd_slow_archive_01';`

`-- 2. Partition tabloları ilgili donanımlara çakma aşaması`
`-- Sıcak, güncel ve fırtına gibi taranacak 2024 verisini pahalı SSD'ye koyuyoruz:`
`CREATE TABLE kord_2024_03 PARTITION OF arac_koordinatlar `
  `FOR VALUES FROM ('2024-03-01') TO ('2024-04-01')`
  `TABLESPACE ucan_disk;`

`-- İşi bitmiş ölü arşiv verisini yavaş, büyük diske hapsediyoruz:`
`CREATE TABLE kord_2021_01 PARTITION OF arac_koordinatlar `
  `FOR VALUES FROM ('2021-01-01') TO ('2021-02-01')`
  `TABLESPACE arsiv_diski;`

Artık sadece SQL'i optimize etmiyorsunuz; fiziksel sunucu donanımını (Storage Tiering) doğrudan kod içinden yöneten bir Sistem Mimarı konumundasınız.

**[Kapanış]**
Gereksiz ölü verileri vakumladınız, mega yığınları Partition metoduyla zekice hücrelere böldünüz (Range/List). Motorun zekasını kullanarak taranmamayı (Pruning) buyurdunuz ve son evrede donanım disklerinin fiyat/performans ayrımına (Tablespace) kadar indiniz. Bölüm 10'da sadece PostGIS geometri sihirbazlığını değil, PostgreSQL'in asıl devasa kurumsal veri tabanı ambarı kurallarını haritacılığa harmanladınız. Mimari tamamlandı. Büyük şirketlerin petabayt düzeyindeki veri savaşlarını yönetmeye hazırsınız. Eğitim sürecinin zirvesinde tebriklerimi sunarım.