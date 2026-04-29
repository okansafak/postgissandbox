# Ders 2: Multi ve Koleksiyon Modeli Geometriler

**[Giriş / Hook]**
Karadan bağımsız olan ada sistemleri, birbiriyle bütünleşik ancak harita üzerinde kopuk franchise ağı; veya altından nehir geçen ama tek parsel olarak değerlendirilmesi gereken araziler... Doğada her yapı tekil değildir. Tekrarlanan ve kesintiye uğrayan (parçalı) coğrafyalar için SQL zekasını yükseltmeliyiz.

**[Teori / Kavramsal Çerçeve]**
Eğer bir coğrafi nesne (örneğin bir takımada ülkesi olan Japonya veya Endonezya) fiziksel olarak birbiriyle bağlantılı olmayan çokgenlerden veya parçalardan oluşuyorsa, bu yapı tek bir `Polygon` veritipinde tutulamaz. Bunun yerine veritabanı mimarisinde çoklu nesne formlarını çağırırız: `MultiPoint`, `MultiLineString` veya `MultiPolygon`. 

Bütün bunlardan daha karmaşık olan senaryoda ise elimizde hem noktalar (adresler) hem de alanlar (hastaneler) aynı mantıksal şemsiye altında olabilir (örneğin bir "Sağlık Kompleksi Verisi"). İşte o zaman OGC’nin en kaotik ve bir o kadar da esnek yapısı olan `GeometryCollection` devreye girer. Bu yapı, homojen nesne kurallarını yıkarak karmaşık coğrafyayı tek bir kapta mühürler.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde bu karmaşık yapıların en çok karşımıza çıkanı olan MultiPolygon örneğini inceleyeceğiz. Japonya formatında iki ayrık toprak parçasını simüle ediyoruz:
`SELECT ST_GeomFromText('MULTIPOLYGON(((28 41, 29 41, 29 42, 28 42, 28 41)), ((30 40, 31 40, 31 41, 30 41, 30 40)))', 4326) AS bolunmus_arazi;`

Bunun yanısıra birbirine tamamen zıt iki geometriyi (Bir nokta ve bir alan) eş zamanlı olarak tek satırda tanımlayalım:
`SELECT ST_GeomFromText('GEOMETRYCOLLECTION(POINT(28 41), POLYGON((29 40, 30 40, 30 41, 29 41, 29 40)))', 4326) AS karmasik_yapi;`

Sonuca baktığınızda, sistem iki farklı bölgeyi veya iki farklı fiziksel nesneyi, tek bir tablo satırında depolayabildiğini kanıtlıyor. Bu, analitik modellemenin sınırlarını zorlamak anlamına gelir.

**[Kapanış]**
Görüldüğü üzere, fiziki dünyayı ne kadar parçalı olursa olsun yansıtacak güçlü geometri tiplerine sahibiz. Ancak PostGIS kodunuz sadece sistem içine konuşmaz; nesnenin dış organizasyonlara veya mobil uygulamalara yansıması için evrensel standart formatlarda iletilmesi (JSON, WKT vb.) gereklidir. Sıradaki videoda dış dünyaya format (WKT, EWKT, GeoJSON) aktarımlarına değineceğiz.