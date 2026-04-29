# Ders 5: Uzamsal İsviçre Çakısı ve Terminal Gücü (ogr2ogr)

**[Giriş / Hook]**
Veri her zaman veritabanı içerisinde uysalca oturmaz. Genelde kurumların FTP klasörlerine veya diskin baş köşesine yüz megabaytlık terkedilmiş `.shp` (Shapefile) dosyaları, Google Earth'ten düşmüş `.kml` dosyaları fırlatılır. Bu hantal harici formları PostGIS'in damarlarına sokmak (veya oradan alıp diske `.gpkg` (GeoPackage) halinde servis etmek) sadece SQL diliyle yapılabilecek çeviklikte değildir. Terminalin tozlu, karanlık ortamlarına dalıp, haritacılığın en amansız konsol aracını kullanmak gerekir. Karşınızda endüstri standardı olan OGR kütüphanesinin taşıyıcısı: `ogr2ogr`.

**[Teori / Kavramsal Çerçeve]**
`ogr2ogr`, meşhur ve açık kaynaklı GDAL kütüphanesinin veri aktarım motorudur. Sistem veritabanı dışında (bash terminali veya cmd üzerinde) çalışır.
Bir otoyol, bir matris dönüştürücüdür. Dünyadaki neredeysen bilinen tüm geometrik-coğrafi uzantıları alır (GeoJSON, ESRI Shapefile, KML, MapInfo), onları saniyesinde çevirir ve doğruca bir PostgreSQL/PostGIS bağlantı hattı kurarak "tabloya" döker.
Bu tek satırlık terminal komutu arka planda "Tabloyu kendisi kurar, tipi kendisi atar (`Geometry/Geography`) ve indeksi otomatik şablonlarla ateşler." Tüm manuel ameleliği üzerinden silen, devasa bir terminal cerrahıdır.

**[Uygulama / Ekran Gösterimi]**
Bu kez terminal konsolundayız. Disk üzerindeki `parseller.shp` dosyasını, PostGIS sunucumuzun içine canlı bir uzamsal tablo olarak yükleyecek o keskin komutu yazıyoruz:
`# Terminal Command (Linux/Windows)`
`ogr2ogr -f "PostgreSQL" PG:"dbname=akademi user=postgres password=gizli" parseller.shp \`
`  -nln public.yeni_parseller_tablosu \`
`  -lco GEOMETRY_NAME=geom \`
`  -lco FID=id \`
`  -t_srs EPSG:4326`

Komutu ateşlediğimiz anda `ogr2ogr` Shapefile'ın ceketini çıkarır, özellik sütunlarını veritabanı String'lerine dönüştürür. Hedef projeksiyonu (`-t_srs`) anında 4326'ya bağlar ve motorunuzun içinde tertemiz bir tablo ihraç eder. Tam tersini yapıp PostGIS'ten veri çekmek istediğinizde format bayrağını `-f "GeoJSON"` yapmanız kafi olacaktır.

**[Kapanış]**
Sistemi bir ada olmaktan çıkarıp, tüm evrensel ekosisteme bağlayan terminal entegrasyonlarını devreye soktunuz. OGR gücü sayesinde kurumunuz hiçbir veri tipi bariyerine takılmayacak. İçe aktarım, devasa işleme (bulk) ve entegrasyonu hallettiğimize göre Bölüm 6'nın da operasyonel zirvesine ulaştınız. Sıradaki faz (Bölüm 7), uzamsal veriyle geometri formlarındaki cerrahi onarımlar ve çizgisel zekaları deşeceğimiz Gelişmiş Geometri Operasyonlarıdır (Advanced Geography). İlerlemeye hazırız.