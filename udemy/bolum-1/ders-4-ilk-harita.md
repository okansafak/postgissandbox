# Ders 4: Uzaya İlk Temas: Mekansal Geometri Üretmek (İlk Harita)

**[Giriş / Hook]**
Veritabanına bir koordinat kaydetmek ile bir geometri kaydetmek tamamen farklı şeylerdir. İki sayıyı (X ve Y) yan yana yazdığınızda harita hiçbir şey anlamaz; ta ki o sayıları evrensel bir uzamın parçası olarak mühürleyene kadar.

**[Teori / Kavramsal Çerçeve]**
PostGIS'in kalbi `geometry` ve `geography` veri tipleridir. Elinizdeki ham koordinatları bu tiplere dönüştürmek için fonksiyonlar (constructor / yapıcılar) kullanmanız gerekir. Bir nokta yaratmanın kodifiye edilmiş hali `ST_MakePoint(Boylam, Enlem)` fonksiyonudur. 

Ancak bir noktayı yaratmak yetmez, o noktanın Dünya üzerindeki hangi referans sistemine göre hizalandığını da söylemelisiniz. (SRID - Spatial Reference Identifier). GPS cihazlarının ve Google/OpenStreetMap gibi sistemlerin standart referans kodu olan 4326'yı noktaya atamak için onu `ST_SetSRID` adlı bir kimlikleyici ile sararız. Aksi takdirde noktanız haritada yönünü kaybeden bir hayalet veriye dönüşür.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki komut satırına geçelim ve teoriyi gerçeğe (haritaya) dökelim:
`SELECT ST_SetSRID(ST_MakePoint(28.9784, 41.0082), 4326) AS geom;`

Ekrandaki değişime dikkat edin. Klasik veritabanı size sadece bir satır dönerdi ve anlamsız sayı dizileri/byte kodları verirdi. Ancak PostGIS entegreli arka planımız, "geom" ismindeki sütunun WGS84 (4326) formatında uzamsal bir obje olduğunu okudu, rendering motoruna gönderdi ve saniyenin altında bir hızla İstanbul Tarihi Yarımada'nın tam üzerine o noktayı görsel bir raptiye olarak konumlandırdı.
Hata Pratiği: Boylam (X) ve Enlem (Y) sırası çok kritiktir. ST_MakePoint'te sırayı ters yazarsanız noktanız İstanbul yerine Somali açıklarında, denizin ortasına düşecektir. Uzamsal analiz tolerans kabul etmez.

**[Kapanış]**
Gözünüzü somutlaştırılmış bir harita çıktısı ile doyurdunuz. Veritabanının "görme" yetisini ilk defa bizzat yönettiniz. Bir sonraki ve bu bölümün son konusunda, elinizdeki bir uzamsal aracı (ST_ fonksiyonlarını) nasıl araştıracağınızı ve PostGIS dokümantasyonunu bir stratejist gibi nasıl okuyacağınızı ele alacağız.