# Ders 3: Raylı Sistemler ve Kilometre Taşları (Doğrusal Referanslama - Linear Referencing)

**[Giriş / Hook]**
Otoyol polisi telsizden anons geçiyor: "İstanbul-Ankara E-80 otoyolunun tam ortasında bir enkaz var." Polisin parmağıyla haritaya dokunduğu bu noktanın, x/y koordinatını bilmek çoğu zaman yetmez. Size kurumsal ve yasal bir ifade lazımdır: "Bu kaza, 430 kilometrelik yolun %32'nci dilimindedir (veya 137. kilometresindedir)." Bir nokta (Point) ile bir Rotayı (LineString) hiyerarşik bir ölçü zeminine (Lineer Referans) nasıl dönüştürürsünüz?

**[Teori / Kavramsal Çerçeve]**
Otoban, doğalgaz boru hatları veya demiryolu gibi çizgi (LineString) varlıkların üzerinde bir şeyin yerini tarif etmeye "Doğrusal Referanslama" (Linear Referencing) denir. Burada iki muazzam motor çalışır:
1. `ST_LineLocatePoint(cizgi, nokta)` : Haritada uzaydan gelen, yol çizgisinin hemen yanındaki (veya üzerindeki) bir GPS noktasını alır, onu otoyola izdüşürür. Başlangıç sıfır (0), bitiş bir (1) olacak şekilde tam yüzde kaçlık (% fraction) mesafede olduğunu saptar (örn: 0.32 -> Yolun %32'si).
2. `ST_LineInterpolatePoint(cizgi, yuzde)` : Tam tersi bir varoluş yaratır. Elinizde hiç nokta veya koordinat yoktur. Makineye "Şu fay hattının veya şu otoyolun tam ortasındaki (%50) noktayı bana 'Point' olarak yarat" dersiniz.

**[Uygulama / Ekran Gösterimi]**
Panodan bir doğalgaz hattını alıp, devriye polisinin düşürdüğü bir enkaz GPS noktasını "otoyol kilometrajına" uyarlayalım:
`SELECT `
  `-- Kaza noktasının (0.01 ile komşu) Hat üzerinde (0-1 arasında) nereye denk geldiği (Oran)`
  `ST_LineLocatePoint(`
    `ST_GeomFromText('LINESTRING(0 0, 100 0)'), `
    `ST_GeomFromText('POINT(32 0.01)')`
  `) AS kazanin_yol_orani_yuzdesi,`

  `-- Doğrudan Otoyolun %32'sine Temsili Bir Nokta Çakıp Görmek`
  `ST_AsText(`
    `ST_LineInterpolatePoint(ST_GeomFromText('LINESTRING(0 0, 100 0)'), 0.32)`
  `) AS orana_karsilik_gelen_nokta;`

Ekrana gelen değer 0.32 olacaktır. Eğer hattınız 100 km ise kaza 32. kilometrededir. Orijinal GPS noktası `Y=0.01` olarak hattın hafif dışında olsa bile sistem kusursuzca dik (en kısa) izdüşüm yaratarak onu otoyol omurgasına çekmiş ve yerini bulmuştur.

**[Kapanış]**
Lojistik rotaları ve çizgi varlıkları statik objeler olmaktan çıkarıp; ölçülebilir, üzerine izdüşüm alınabilir yasal yol göstergelere çevirdiniz. Gördüğünüz otoyol izdüşümü makinenin "en kısa çiziği" bulması sayesinde gerçekleşti. Peki farklı iki devasa poligon (iki ilçe, iki deniz) birbiri ile komşu olmadan duruyorsa ve siz "aralarındaki en yakın temas (Closest Point) köprüsünün kök koordinatlarını" bulmak istiyorsanız ne yapacaksınız? Gelecek derste köprüler inşa edeceğiz.