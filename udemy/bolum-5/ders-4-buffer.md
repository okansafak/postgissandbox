# Ders 4: Kalkanlar ve Riske Dayalı Koruma Zonları (ST_Buffer)

**[Giriş / Hook]**
"Bu stadyumun etrafındaki 1 kilometrelik alanda alkol satışı yapılamaz" veya "Bu zehirli atık tesisinin 500 metrelik yarıçap çizgisinde hiçbir konut barınamaz." Kanunların, risk yönetiminin ve jeopolitiğin temelinde görünmez güvenlik kalkanları yatar. Noktasal bir varlığı, devasa bir etki alanına dönüştürmek, coğrafi işleme sanatı demektir.

**[Teori / Kavramsal Çerçeve]**
Bir geometriyi alıp, etrafına dışarıya doğru (veya içeriye doğru eksi değerle) şişiren ve sonuçta mükemmel bir yastıklanmış çokgen (Poligon) üreten araca `ST_Buffer` denir. Noktayı verirseniz, size daire döner. Bir nehir çizgisini (LineString) verirseniz, o nehrin kıvrımlarını 50 metre açılardan şaşmadan takip eden etli bir şerit (boru/yılan gibi sınır alanı) yaratır.

Bunun analitik gücü ölçülemezdir. Stadyumu noktadan poligona çevirdiğinizde, daha önceki devrede gördüğümüz `ST_Contains` ve `Spatial JOIN` taktiklerini kullanarak: "Bu alanın içine düşen barları getir" tespitini saniyeler içerisinde otomatikleştirebilir kalarınız. 

**[Uygulama / Ekran Gösterimi]**
Ortamımızda sentetik bir nokta inşa edip, onun etrafında, metrik hassasiyette (örneğin Geography cast'i üzerinden) 500 metrelik kusursuz bir kalkan oluşturuyoruz:
`SELECT `
  `ST_Buffer(ST_MakePoint(28.9, 41.0)::geography, 500)::geometry AS guvenlik_kalkani;`

Komut çalıştığı an, o masum nokta, etrafına giydirilmiş sanal ve hesaplanabilir bir mülkiyete, yani "geometri" çokgenine (Geometry Polygon) evrilir. Harita arayüzünüz doğrudan çemberinizi (poligonize eidlmiş noktaları sırtında taşıyan 32 köşe noktalı bir disk) haritaya yapıştıracaktır. O artık kendi başına, içi hacim olan hukuksal veya operasyonel bir varlıktır. 

**[Kapanış]**
Görünmez sınırları görünür risk kalkanlarına evirmeye artık yetkiniz var. Biz objeleri ölçtük, merkezini bulduk, şişirip tampon alanlar yarattık. Fakat sahada bazen iki büyük projenin alanı birbiriyle çakışır. Bir orman poligonu ile tarım arazisi poligonu tapuda üst üste binmiştir. O ortak "gri" ihtilaflı kesişim alanını geometrik olarak oradan koparıp yeni bir varlık yapabilir misiniz? Bir sonraki dersimizde uzamsal kümeleri, geometrileri makas ve otoyol gibi biçmeyi (Intersection, Difference) pratik edeceğiz.