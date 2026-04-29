# Ders 2: Şehre Can Suyu Vermek (Gerçek Zamanlı Veri ve Staging)

**[Giriş / Hook]**
"Abi, sistem çalışırken saniyede 5 bin aktif taksiden (Device/Cihaz) X ve Y (Enlem/Boylam) verisi geliyor. Bu veriyi direkt 'Arac_Mevcut_Konum' (Canlı) tablosuna basalım, haritacı web ekranından oradan görsün" dediniz. Milyonlarca satır, 2 saniyede bir UPDATE attı ve veritabanı kilitlendi! MVC yapınızın omurgası çöktü. Sonra fark ettiniz: "Bazı gelen koordinatların enlemi 'Istanbul' yerine Mısır'da (GPS Hatası) çıkıyor! Yanlış kişiye, denizin ortasındaki taksiyi atamak üzereyiz!" Krizin çözümünde, Bölüm 6'da öğrendiğimiz Staging (Gümrük) pattern’ını kentsel boyutta hayata geçirmek yatıyor.

**[Teori / Kavramsal Çerçeve]**
Cihazlardan (IoT / Uygulama) akan veriler doğrudan canlı (`core`) şemasındaki kalıcı, indeksli, tetikleyiciler (Triggers) olan tablolara eklenmemelidir (Deadlock).
**Staging (Gümrük) Akışı:**
1. Veri, indeksi bile olmayan son derece "basit metin" tablolarına (Şema: `stg`) yüksek hızda (`COPY` komutlarıyla veya RabbitMQ gibi aracıların boşaltmalarıyla) boca edilir.
2. Saniyede bir (veya 10 saniyede bir) akan bir arka plan işlemi veya cron job; bu gümrükteki veriyi inceler (`ST_IsValid`, `İstanbul sınırı (ref) içerisinde mi?`).
3. GPS sinyali saçmalamamış, doğru formatlı verileri canlı (core.arac_konumlari) sistemimize "Transform" (Geometri yaratarak) işler.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `stg.ham_taksi_pingleri` tablomuz ve canlı `core.aktif_filo` tablomuz var:

`-- 1. IoT cihazlardan gelen kirli text/float metinlerinin toplandığı Gümrük`
`CREATE TABLE stg.ham_taksi_pingleri (`
`  cihaz_id varchar, `
`  zaman_damgasi timestamp, `
`  enlem float, boylam float`
`);`

`-- 2. Gümrükten temiz veriyi süzen Zeki INSERT (Giriş) Kapısı:`
`INSERT INTO core.aktif_filo (arac_id, son_guncelleme, geom)`
`SELECT cihaz_id, zaman_damgasi, ST_SetSRID(ST_MakePoint(boylam, enlem), 4326)`
`FROM stg.ham_taksi_pingleri`
`WHERE -- HATA FİLTRESİ (İstanbul Dışına Düşen Hatalı Pingsleri ALMA!)`
`  ST_Contains(`
`    (SELECT geom FROM ref.istanbul_il_siniri),`
`    ST_SetSRID(ST_MakePoint(boylam, enlem), 4326)`
`  );`

-- *İşlemleri tamamlanan ham kayıtları temizleyelim (TRUNCATE stg.ham_taksi_pingleri)*.

**[Kapanış]**
Gördünüz mu? Gerçek bir sistem tasarlerken, veritabanı saf bir ambar değil, "Canlı bir kargo limanıdır". Gelen kötü veriyi (denizin ortasına GPS atan bozuk pingsleri) dışarı attık. `core` (Canlı) tablomuz sadece elit, temizlenmiş mekansal verili "Taksi" katmanı oldu. Artık taksilerimiz ve müşterilerimiz veritabanında kusursuz görünüyor. Şehre suyu verdik, taksiler dolaşıyor. Şimdi de o taksilerin nerede yığıldıklarını, hangi bölgelerin (Heatmaps) müşteri potansiyeliyle çalkalandığını bulmak var. Ders 3: Canlı Veriden Yapay Zeka (Clustering / Hexagons). Devam edelim.