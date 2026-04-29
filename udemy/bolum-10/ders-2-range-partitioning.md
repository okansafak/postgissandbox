# Ders 2: Zamanı ve Mekanı Dilimlemek (Range Partitioning)

**[Giriş / Hook]**
"Araç Takip" veritabanınızda son on yılın GPS noktalarından oluşan 4 Milyar satır veri birikti. Yönetim sizden "Sadece geçen haftaki konumlarda bir ST_Distance analizi çaprazlaması" istediğinde, motor yine koskoca GIST indeksine veya 4 milyar satırlık bir tabloya çarpar. Oysa 10 yıllık eski verinin bugün kullandığınız RAM'de ne işi var? Devasa volümleri fiziksel olarak bir arada tutmak felakettir. Çözüm, veriyi zaman ve uzay dilimlerine ustaca kıran "Bölümlendirme" (Partitioning) hiyerarşisidir.

**[Teori / Kavramsal Çerçeve]**
Range Partitioning (Aralık Bölümleme), devasa tek bir tablo yaratmak yerine, dışarıdan yekpare görünen ama disk altında örneğin "Aylara" veya "Yıllara" bölünmüş bağımsız mini tablolar silsilesi kurmaktır.
Sisteme veriyi yüklerken asla "2024 Mart tablosuna insert at" demezsiniz. Uygulama sadece "Ana Tabloya" veriyi yazar. PostGIS'in zeki Partition motoru, tarih aralığına bakar ve onu gider asıl sahip olması gereken "2024 Mart" alt tablosuna fırlatıp kaydeder.
Böylece, 5 yıl önceki veriyi silmek istediğinizde `DELETE` atıp tabloyu "Bloat" zehirlenmesine (ölü satırlara) boğmazsınız; doğrudan o ayın alt tablosunu `DROP TABLE` komutuyla saniyesinde çöpe atarsınız. Vakum maliyeti yoktur, disk şişmesi yoktur.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde zaman damgasıyla bölümlenmiş devasa bir IoT sensör arşivi kuralım:
`-- 1. ADIM: Master (Ata) Tabloyu Yarat (İçinde veri durmayacak, sadece yönlendirecek)`
`CREATE TABLE arac_koordinatlar (`
  `id SERIAL,`
  `arac_kod VARCHAR(50),`
  `geom GEOMETRY(Point, 4326),`
  `sinyal_tarihi DATE NOT NULL`
`) PARTITION BY RANGE (sinyal_tarihi);`

`-- 2. ADIM: Çocuk Tabloları (Aylık/Yıllık Dilimleri) Yarat`
`CREATE TABLE kord_2024_01 PARTITION OF arac_koordinatlar `
  `FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');`
  
`CREATE TABLE kord_2024_02 PARTITION OF arac_koordinatlar `
  `FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');`

Uygulamanız Ana tabloya insert atar, sistem onu tarihine göre 01 veya 02 kasasına mühürler. Eğer sadece Şubat loglarını tarayacaksanız, makine Ocak verisinin diskine saniyenin binde biri kadar bile dokunmadan es geçer.

**[Kapanış]**
Görüldüğü gibi devasa hacimlerle savaşmanın yolu veriyi sıkıştırmak değil, mantıksal çekmecelere bölmektir. Aralık (Range) metodu sayılar ve tarihler için mükemmeldir. Ancak ya veriniz kronolojik değil de bölgelere ayrılacak cinstense? "Marmara Arabaları" veya "Ege Teslimatları" gibi liste bazlı mantıksal bir bölme yapacaksınız, bu kez tarih yerine Statik Kıta/Bölge bölümlendirmesine ihtiyacımız olacak. Sıradaki bölüm Liste Bölümlendirme (List Partitioning).