# Ders 3: Mekansal Değişim ve Standart Formatlar (WKT, EWKT, GeoJSON)

**[Giriş / Hook]**
Veritabanı sadece bir depo alanı değil, dünya ile konuşan bir servistir. Ürettiğiniz geometri parçasının sadece motorun içinde yaşamasının veya özel bir donanım koduna sahip olmasının analitik anlamı yoktur. Web uygulamaları veya kurum dışı yazılımlar bu veriyi okuyabilmelidir. Mekansal iletişim, standart formatlarla sağlanır.

**[Teori / Kavramsal Çerçeve]**
İki sistemin (örneğin PostGIS ve Leaflet/OpenLayers haritaları) birleşmesi veya bir yazılımcının bir objenin içerik şablonunu çıplak gözle doğrulayabilmesi için bazı ortak tercüman formatlar vardır:
1. **WKT (Well-Known Text):** OGC standartlarına uygun, `POINT(28 41)` gibi sadece koordinatların ve tipin çıplak gözle okunabildiği en sade tasarımdır. Ancak referans kimliği (SRID) içermemesi nedeniyle bağlamını (gerçek düzlemdeki ölçüsünü) eksik bırakır.
2. **EWKT (Extended WKT):** PostGIS'in kendi icadıdır. WKT yapısına analitik SRID kimliğini dahil eder: `SRID=4326;POINT(28 41)` gibi.
3. **GeoJSON:** Bu ise çağımızın açık web ve API standartlarından biridir. Mobil veya front-end uygulamalar veriyi evrensel bir JSON formatındaki düğüm olarak görmek ister. 

**[Uygulama / Ekran Gösterimi]**
Ortamımızda kaputun arkasındaki bayt (byte) kodlarını okumak yerine bu uzamsal verileri insan zihninin ve web dillerinin anladığı evrensel dillere nasıl konuşturacağımızı inceleyelim. Çıktı dönüştürme fonksiyonlarına odaklanıyoruz:
`SELECT ST_AsText(ST_MakePoint(28.97, 41.01)) AS citlak_wkt;`
`SELECT ST_AsEWKT(ST_SetSRID(ST_MakePoint(28.97, 41.01), 4326)) AS gelismis_ewkt;`
`SELECT ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(28.97, 41.01), 4326)) AS web_cikti;`

Sorguyu attığımızda konsol çıktısındaki evrensel yansımalara bakın. GeoJSON çıktısı tam bir JavaScript objesi olarak üretilir, frontend/API ekipleri ile entegre olmanın en temiz protokolü anından kurgulanmış olur.

**[Kapanış]**
Görüldüğü üzere, sadece PostGIS altyapısıyla çalışmakla kalmayıp, bu çıktıları web ortamlarıyla kesintisiz konuşturabiliyoruz. Formatlar arası köprü kurduğunuza göre bir sonraki aşamada "Geometry Constructors" yani haritada sıfırdan sentetik mekan inşa eden fonksiyon bloklarını yakından inşa edeceğiz.