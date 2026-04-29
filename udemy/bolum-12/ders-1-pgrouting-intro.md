# Ders 1: Asfaltı Döşemek ve Çizgileri Yola Çevirmek (pgRouting'e Giriş)

**[Giriş / Hook]**
Elinizde binlerce çizgi (LineString) geometrisi var; "Türkiye karayolları ağı" adlı bir tabloya doldurdunuz. Yöneticiniz gelip "A noktasından B noktasına en hızlı nasıl gideriz?" dediğinde, standart PostGIS fonksiyonlarına bakarsınız ve sessizliğe bürünürsünüz. Çünkü `ST_Distance` size sadece kuş uçuşu mesafeyi verir. Çizgiler birbirini kesiyor mu, yol tek yön mü, bir sokak diğer sokağa gerçekten kilitlenmiş mi (Topology), standart veri tipleri bunu bilemez. Gerçekçi bir "Navigasyon" motoru yazmak istiyorsanız, sıradan çizgileri zeki "Graf" ağlarına dönüştürmeniz gerekir. Karşınızda PostGIS'in en efsanevi eklentilerinden biri: `pgRouting`.

**[Teori / Kavramsal Çerçeve]**
`pgRouting`, PostgreSQL üzerine kurulan ve PostGIS ile entegre çalışan bir Graph (Graf) veritabanı analiz motorudur.
Yol haritaları sadece çizgilerden (`edges` veya `links`) ve kavşaklardan (`nodes` veya `vertices`) oluşur. Bir arayol ile ana yolun kesişimi, aslında bir Düğüm Noktasıdır (Node).
Siz bir çizgi tablosu yüklediğinizde, `pgRouting` bu çizgilerin uç ve başlangıç noktalarını (Source ve Target) alır, birbirine değenleri milimetrik olarak kaynak ve hedef mantığıyla bağlar ve onlara birer "Maliyet (Cost)" atar (Maliyet = Mesafe veya Süre). Artık elinizdeki o aptal çizgiler, üzerinden akım geçen elektrik devrelerine, içinden araç geçen otoyol rotalarına dönüşmüştür.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda pgRouting eklentisini aktif etmek her şeyin ilk adımıdır:
`-- Eklentinin yüklenmesi (Eğer PGLite kullanıyorsanız destekleyen sürümde olmalısınız)`
`CREATE EXTENSION IF NOT EXISTS pgrouting;`

`-- Bir çizgi tablosunda pgRouting'in anlayacağı üç temel zorunlu sütun:`
`-- source (Başlangıç Düğümü ID'si)`
`-- target (Bitiş Düğümü ID'si)`
`-- cost (Yolun maliyeti, örneğin uzunluğu veya geçiş süresi)`

`ALTER TABLE yollar ADD COLUMN source integer;`
`ALTER TABLE yollar ADD COLUMN target integer;`
`ALTER TABLE yollar ADD COLUMN cost double precision;`
`ALTER TABLE yollar ADD COLUMN reverse_cost double precision; -- Çift taraflı gidiş/geliş`

**[Kapanış]**
Sıradan mekansal veriyi (Çizgileri), birbirine sinir ağı gibi bağlı akıllı bir yol haritasına dönüştürmek için altyapıyı ve felsefeyi kavradınız. Bir sonraki derste, bu parçalanmış yolların uçlarını sihirli bir fonksiyonla birbirine lehimleyeceğimiz "Topoloji Yaratma (Create Topology)" aşamasına geçeceğiz. Asfalt henüz yaş, devamlılık esastır.