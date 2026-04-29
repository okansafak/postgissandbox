# Ders 4: Yığınların Zeki Dönüşümü (Bulk Transform ve Optimizasyon)

**[Giriş / Hook]**
Üç beş bin satırlık test ortamında sistem saniyeler içerisinde dönüşüm komutlarına tepki verir. Ancak ya elinizde iki buçuk milyon parsellik devasa bir kadastro verisi varsa ve o verinin tamamını EPSG 4326 metotlarından çıkarıp 3857 metrik projeksiyonuna dökmeniz (Transform işlemi) gerekiyorsa? Acemi geliştirici doğrudan çalışan formüllere yüklenir ve tabloyu kilitler. Zeki veritabanı mühendisi ise orkestrasyonu (indekslerin devre dışı bırakılıp formülün arkasına geçilmesini) yönetir.

**[Teori / Kavramsal Çerçeve]**
Bir veritabanında toplu güncelleme (`Bulk Update` veya milyarlarca satır içeren `INSERT INTO`) işlemi yaparken uygulanan iki kritik anayasa vardır:
1. İşlem uygulanırken daima İndeksler Susturulmalıdır (Drop Index): Her eklenen veya dönüşüme uğrayan satırda GIST indeksinin mekanik ağacı yeniden kendini dallandırıp bükmeye çalışır; bu ölümcül bir yavaşlık doğurur. Önce indeks silinir, veri dökülür, en son indeks tek seferde ve kusursuzca yeniden yaratılır.
2. İşlem belleğini şişirmemek (Write-Ahead Logging / WAL bloklarını taşmamak). Bu nedenle, PostGIS mimarisinde varolan veriyi 'Update' yapmaktansa (çünkü MVCC mimarisinde UPDATE işlemi veriyi silip yeniden yazar), veriyi yeni bir formla çekip taptaze bir "Yeni Tablo" yaratmak (CTAS: Create Table As Select) inanılmaz derecede daha çevik ve kurumsaldır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda milyonlarca noktamızın projeksiyonunu değiştireceğiz. Hantal bir "UPDATE" kullanmak yerine, `INSERT INTO` ve "CREATE TABLE AS" (CTAS) hızlandırıcısı ile çok daha keskin bir ameliyat gerçekleştiriyoruz:
`-- Hızlıca Dönüştürülmüş Saf Veriden Yeni Bir Tablo Yaratmak`
`CREATE TABLE bolgeler_metrik AS `
`SELECT id, isim, ST_Transform(geom, 3857)::geometry(MultiPolygon, 3857) AS geom_m `
`FROM bolgeler;`

`-- Operasyon bittikten sonra can alıcı coğrafi indeksi tek parça halinde basmak`
`CREATE INDEX idx_bolgeler_metrik_geom ON bolgeler_metrik USING GIST (geom_m);`

Bu kod bloğu, bellek bloklarını ezmeden ve eski verinin çöplüğünü (vacuum bedeli) çıkarmadan saniyeler içinde devasa projeksiyonu yeni bir uzay matrisine oturtur. 

**[Kapanış]**
Devasa hacimlerdeki veri göçünü veri kaybı yaşamadan tamamladınız. Bulk stratejisiyle çalışan bir veri ambarınız var artık. Yalnız, şimdiye dek hep SQL içinde, kodlar ve tablolar arası konuştuk. Eğer dünyanın en büyük şekil verisi dosyası olan ShapeFile (`.shp`), KML ya da devasa GML harita dosyaları doğrudan disk ünitenize konursa, onlarla PostGIS zindanına inmeden kim konuşacak? Gelecek ve bu bölümün final dersinde uzamsal dünyanın İsviçre çakısıyla tanışacağız: `ogr2ogr`.