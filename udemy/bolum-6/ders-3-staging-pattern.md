# Ders 3: Gümrük ve Güvenlik Duvarı (Veri Aktarımında Staging Pattern)

**[Giriş / Hook]**
Veritabanınıza dışarıdan yüz binlerce koordinat veya yeni teslimat deposu ekleniyor. Eğer bu veriyi doğrudan "canlı" production (üretim) tablolarınıza alıyorsanız; kurumunuzun belkemiğinde açık kalp ameliyatını anestezisiz yapıyorsunuz demektir. Kirli, geometrisi hatalı veya "kendiliğinden kesişen" (self-intersecting) tek bir problemli poligon objesi, bütün mesafe ölçümü ve raporlama modüllerinizin çökmesine neden olur. Çözüm, kurumsal mimarinin gümrük odasıdır: Staging Pattern (Aşama Tabloları).

**[Teori / Kavramsal Çerçeve]**
Veri ambarı yönetiminde Staging (Aşamalama), dış dünyadan alınan ham materyalin önce ikincil ve kuralsız bir "karantina" tablosuna (örn. `staging_sehirler`) alınması mantığına dayanır. Veriler burada tamamen metin (Text) veya ham koordinat formatındadır. Bu tablo geçicidir, indekslerle şişirilmemiştir ve kullanıcılara kapalıdır.
Daha sonra mühendis (yani siz), bu tampon alandaki veriye zeki filtreler (`ST_IsValid` veya `ST_MakeValid`) uygulayarak yavaş yavaş "Canlı Tablolarımıza" süzer. Bozuk geometriler onarılır; geçersiz şehir poligonlarına müdahale edilir, düzlemsel sapmalar filtrelenerek üretim merkezine salt kusursuzluk aktarılır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda senkronize iki tablo açısıyla çalışıyoruz. `staging_sehir_verisi` adındaki karantina alanında binlerce ham nokta ve poligon var. Zeki bir `INSERT INTO ... SELECT` motoruyla yalnızca "Geometrik Geçerlilik Testini" (`ST_IsValid`) aşabilenleri canlıya aktarıyoruz:
`INSERT INTO sehirler (ad, nufus, geom)`
`SELECT s_ad, s_nufus, s_geom`
`FROM staging_sehir_verisi`
`WHERE ST_IsValid(s_geom) = TRUE;`

`-- Kalan bozuk poligonları analiz edip, raporlamak veya düzeltmek bizim inisiyatifimizde kalacak.`
`SELECT s_ad, ST_IsValidReason(s_geom) AS hata_raporu`
`FROM staging_sehir_verisi`
`WHERE ST_IsValid(s_geom) = FALSE;`

Artık çöp veriyi süzülen altın tozundan ayırdık. Geçerli objeler canlı sistemi beslerken, geriye kalan hasarlı nesneler hata raporu (ST_IsValidReason) ile cerrahi müdahaleyi bekliyorlar.

**[Kapanış]**
Sistemi çöp veri zehirlenmesinden koruyan mükemmel bir savunma kalkanı kurdunuz. Ancak ya bu staging masasından canlıya taşınacak veriler milyonlarca parçaysa? Milyonluk veri aktarımı sırasında SRID değişimleri, tiplerin dönüşümü (`cast`) büyük darboğazlara ve kitlenmelere neden olacaktır. İşte gelecek derste, devasa boyutlu bir yığını kilitlenmeden kitlesel dönüşüme (Bulk Transform) uğratmanın analitik mühendisliğini işleyeceğiz.