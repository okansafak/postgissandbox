# Ders 5: Geometrinin Kimliğini Çözmek (Metadata Fonksiyonları)

**[Giriş / Hook]**
Elinizdeki bir tablo sadece siyah bir "Geom" hücresinden ibaretse, sistemin beynine uzamsal veri kazınmış olsa bile, onu bir yöneticiye "okutamazsınız". Bu dosyanın geometrik tipi ne? Hangi koordinat projeksiyonuyla koruma altında? Ciro ve işlem sayıları kadar, o alanın köşe (Vertex) sayısını öğrenebilir miyiz?

**[Teori / Kavramsal Çerçeve]**
`Metadata` (Üst Veri) fonksiyonları, geometrinin içine nüfuz eden ve size arka plandaki konfigürasyon bilgisini döndüren fonksiyonlardır. Bir cismin tipini sorduğunuzda, dış katmanın arkasında onun `ST_GeometryType`'ı; bağlı olduğu projeksiyon haritasını merak ettiğinizde ise `ST_SRID`'si çalışır. Veya daha ekstrem bir analitikte `ST_NPoints` o nesneyi meydana getiren matematiksel nokta / kırılım (Vertex) miktarını raporlar. Elinizdeki devasa poligon hatlarının veya çizgi dizilerinin yüklerini ve uzamsal kimlik kartını analiz ederken, en büyük silahımız bu fonksiyonlar dizisidir.

**[Uygulama / Ekran Gösterimi]**
Ortam penceremize odaklanalım ve yarattığımız anonim bir kurgunun kimlik defterini gün yüzüne çıkartalım:
`SELECT`  
`ST_GeometryType(geom) AS tipi,`  
`ST_SRID(geom) AS referans_sistemi,`  
`ST_NPoints(geom) AS kesisim_nokta_sayisi`  
`FROM (SELECT ST_SetSRID(ST_MakeEnvelope(28, 41, 29, 42), 4326) AS geom) AS soyut_kutu;`

Çıktıyı inceleyin. Veritabanının kendi içinde şifrelenmiş olan kapalı bir hücreye sorular sorduk ve karşılığında net değerler elde ettik. Bize, "ben bir POLİGON'um", "4326 koordinat sistemindeyim" ve "beni var etmek için uzamda 5 temel nokta kilitlenmiştir" cevabını veriyor.

**[Kapanış]**
Görüldüğü gibi, haritadan ziyade sisteme varlığın DNA'sını sorma konseptinde ustalaştık. Fakat her veri sağlam olmayabilir. Sisteme dış dünyadan "arızalı" veya "kendini boğan/kesen" geometriler aktarılabilir ve bu da bütün raporları çökertebilir. Bu bölümün son modülünde, bozuk uzamsal kurguların (`Valid Geometry`) tespiti ve onarılmasını göreceğiz.