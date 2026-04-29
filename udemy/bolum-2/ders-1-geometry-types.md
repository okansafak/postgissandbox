# Ders 1: Temel Geometri Tipleri (Point, LineString, Polygon)

**[Giriş / Hook]**
Veritabanına sadece koordinat kaydetmek yetmez; sistem koordinatların dünyadaki hangi organik veya inorganik nesnelere karşılık geldiğini bilmelidir. Bir çeşme mi, bir sahil şeridi mi, yoksa bir parsel mi? PostGIS'in dünyaya bakışı, bu üç temel varlık modeliyle (Point, LineString, Polygon) başlar.

**[Teori / Kavramsal Çerçeve]**
Uzamsal sistemlerin yapıtaşı üç OGC (Open Geospatial Consortium) formuna dayanır:
1. **Nokta (Point):** Alansızdır ve uzunluğu yoktur. Sadece tam ve spesifik (X, Y) koordinatlarıyla evrende tek bir konumu mühürler. Acil durum butonları, elektrik direkleri veya adresler birer `Point` nesnesidir.
2. **Çizgi (LineString):** Noktaların bir araya gelmesiyle uzayan, bir yönü ve rotası olan, birbirine en az bir eksende bağlanan doğrusal yapılardır. Nehirler, otoyollar veya doğalgaz hatları `LineString` ile tarif edilir.
3. **Çokgen (Polygon):** Alan ölçümünün başladığı yerdir. Çizgiler kendi üzerilerine kapanarak dış (exterior) ve gerekirse iç (interior) sınırları olan bölgeler oluşturur. Bir orman sınırı, ilçe konturu veya arsa parseli `Polygon` kategorisine girer.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda bu nesnelerin soyut varlıklarını somutlaştırıp test edelim. `ST_GeomFromText` fonksiyonu, metin tabanlı olarak yazdığımız soyut mekansal veriyi PostGIS'in donanımsal zekasının tanıyacağı işlenebilir geometri formuna çevirir. Kodu çalıştırıyoruz:
`SELECT ST_GeomFromText('POINT(28.9784 41.0082)', 4326) AS istanbul_nokta;`
`SELECT ST_GeomFromText('LINESTRING(28.97 41.00, 28.98 41.01, 28.99 41.02)', 4326) AS kisa_rota;`
`SELECT ST_GeomFromText('POLYGON((28.0 41.0, 29.0 41.0, 29.0 42.0, 28.0 42.0, 28.0 41.0))', 4326) AS kapsama_alani;`

Buradaki kritik detay şudur: Bir poligon asla ardı ardına sıralanmış noktalar dizisi olarak kalmaz; başladığı koordinat ile tamamen bitmek, yani kendini 'kapatmak' zorundadır. Sistem kapalı bir dizi görürse onu doldurur ve ona "Alan" zekasını atar.

**[Kapanış]**
Evrensel nesneleri, tekil varlık şablonlarıyla sisteme dâhil ettik. Ancak gerçek dünya her zaman bu kadar sade değildir. Bir ülkenin birbirine bağlantısı olmayan adaları (parçalı topografya) var ise tek bir poligon modeli yetersiz kalacaktır. Bir sonraki derste, parçalı ve modüler varlıkların sisteme "Multi" önekiyle (MultiPolygon, MultiPoint vs.) nasıl kazındığını inceleyeceğiz.