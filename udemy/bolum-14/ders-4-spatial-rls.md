# Ders 4: Gömülü Duvarlar (Mekansal RLS / Spatial Row-Level Security)

**[Giriş / Hook]**
Bir önceki derste, tablodaki bir metin (`sahip_ilce = 'kadikoy'`) sütununa bakarak binlerce satırı, sadece sisteme giren (`current_user = 'kadikoy'`) kişiye göre sihirli şekilde ayırdık. Mükemmel. Peki ya "Depremler, Kazalar, Su Arızaları" veri tabanınızda her bir satırda `sahip_ilce` yazmıyorsa? Çoğunlukla bu böyledir, o satırlarda sadece ham, dilsiz "Koordinatlar" (Point `geom`) vardır. Bir Kadıköy memurunun, İstanbul haritasını QGIS ile açarken "Kendi ilçe sınırı (`ilceler` tablosu) İÇİNE DÜŞEN" arızaları sistem seviyesinde GÖRMESİNİ, Beykoz'da yaşanan kazanın "Ağda dahi olmamasını, veritabanı kapısından geri dönmesini" (RLS kuralı içinde mekansal PostGIS fonsiyonu yazarak) nasıl başarırız? Karşınızda en karmaşık kapı: Spatial RLS.

**[Teori / Kavramsal Çerçeve]**
`Policy (Kural)` yazarken PostgreSQL'e, sadece düz metin (String) değil, dilediğiniz her sarmal SQL sorgusunu veya `ST_...` fonksiyonunu (İstisnalar dışındaki True/False dönen şartları) "USING (...)" içerisinde dikte edebilirsiniz!
Sistem şöyle düşünür: "Benim adım 'kadikoy'. `arizalar` tablosuna `SELECT *` dedim. Zindancı (RLS) uyandı. O arızaları bana sunmadan önce, `USING` içindeki şarta bakar; bir Spatial Join fırlatır: 'O arızanın noktası (`geom`), bu login olmuş 'kadikoy' kullanıcısının, `ilceler` tablosundaki o devasa poligonunun içine düşüyor mu (`ST_Contains`)?'. Evet ise gönder, Hayır ise (Beykoz vb) çöpe at."
Bu, Veritabanı ve Coğrafi Bilgi Sistemlerinin birleştiği mutlak Siber Güvenlik zirvesidir. Bir satırlık Node.js kodu bile yazmadınız!

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `arizalar` (Milyonlarca arıza noktası) ve `ilceler` (İstanbul'un ilçe poligonları, `ad` = 'kadikoy' vs.) tabloları var.
Kadıköy memuru (`kadikoy` adıyla veritabanımıza login oldu). Biz bu memurun (ve diğerlerinin) sadece kendi memurluk bölgesine ("ad" sütununa) denk gelen arızaları görmesini istiyoruz:

`-- 1. Zindancıyı Arızalar Üzerinde Uyandıralım`
`ALTER TABLE arizalar ENABLE ROW LEVEL SECURITY;`

`-- 2. Devlete (Database) Mekansal Okuma Politikası (Spatial Policy) Yasalaştırıyoruz!`
`CREATE POLICY mekansal_ilce_yetkilisi ON arizalar`
`  FOR SELECT`
`  -- Arızanın "geom" noktası, giriş yapan "kullanıcının" ('kadikoy' / current_user)`
`  -- ilceler tablosundaki O poligonunun "İçindeyse (ST_Contains)" izin ver:`
`  USING (`
`    ST_Contains(`
`      (SELECT geom FROM ilceler WHERE ad = current_user),`
`      arizalar.geom`
`    )`
`  );`

*Bu komuttan sonra `kadikoy` rolü tabloya sorgu attığında, RLS motoru her bir MİLYONLARCA arıza noktasının (arizalar.geom), O login olan adamın ilçesiyle `ST_Contains` testini süzgecinden geçirir; sadece Kadıköy içindeki arızaları sunar! Ve 'beykoz' girdiği an o memura 'beykoz' sınırına göre Spatial Join atarak arızaları çevirir! Bu kadar.*

**[Kapanış]**
Gördünüz mü? Her memura ayrı tablo (39 ilçe X 39 Tablo) ya da API (Backend) seviyesinde "token/ilce join" ameleliği yazmak yerine, PostgreSQL C-motorunda "Görünmez Mekansal Duvarlar" kastınız. RLS sizin kalkanınız, `ST_Contains` ise Gözleriniz (Filter/Subquery) oldu.
Ancak burada son bir tehlike var: Bazen veriyi (tüm Türkiye'yi) saklamanız gerekmez, "Çok Gizli Askeri" tesisleri göstermeniz ama "Sadece Pikselli/Şekli Bozulmuş" (Blurred/Masked) olarak halka/stajyere yayınlamanız gerekir. (Örn 1:1,000.000 Haritalar gibi "Hassasiyeti Kırpılmış" veriler).
Veriyi saklamak (RLS) yerine Süzmek ve Yozlaştırmak (Data Masking) nasıl yapılır? Karşınızda Bölüm 14'ün Eğitim Finali, Zirve Savunma Modeli: Güvenli Görünümler (Views) ve Geometri Maskeleme. Devam.