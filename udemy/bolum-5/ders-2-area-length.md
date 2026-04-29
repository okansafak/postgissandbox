# Ders 2: Mülkiyetin Hacmi: Alan ve Uzunluk Ölçümleri (ST_Area & ST_Length)

**[Giriş / Hook]**
Gayrimenkul, tarım, madencilik veya orman projeleri... Bir şeyin fiziksel sınırı, onun piyasa değerini ve hukuki varlığını doğrudan belirler. Sizden milyonlarca dolarlık bir arazinin imar raporu istendiğinde, bu hesabı yapacak olan veritabanı motorunun "santimetre kare" hassasiyetinde doğru konuştuğundan nasıl emin olabilirsiniz?

**[Teori / Kavramsal Çerçeve]**
Uzamsal veritabanında poligonların "yüzölçümünü" `ST_Area`, çizgilerin "uzunluğunu" ise `ST_Length` fonksiyonu ölçer. Tıpkı mesafe ölçümündeki (ST_Distance) dev kırmızı çizgimiz burada da devrededir: Eğer veriniz global `4326` EPSG kodunda (derece formatında) kalmışsa ve siz ona "Alanım ne kadar?" derseniz, motor size "0.005 derece kare" gibi iş dünyasında hiçbir ticari geçerliliği olmayan, soyut bir sonuç dönecektir.

Bunu çözmenin, mühendislikte karşılık bulan iki yolu vardır: Eğer poligon devasa (mesela ülke sınırları veya kıtalar) boyutundaysa, veriyi `::geography` formuna dönüştürüp motorun kavisli dev cetvelini kullanırız. Ancak veri, bir şehrin imar planındaki küçük parsellerse, onu mutlaka bölgesel metrik yüzeye (Türkiye için bölgesine uygun bir EPSG:5254 vb. TUREF/TM dilimine ya da en azından EPSG:3857 mercator'a) dönüştürüp (Transform) kartezyen geometrinin kusursuz hız ve doğruluk aralığından yararlanmalıyız.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde bir inşaat rotasının uzunluğunu ve bir maden sahasının kapladığı alanı ölçüyoruz. 
`SELECT`
  `ST_Length(ST_GeomFromText('LINESTRING(0 0, 0 4, 3 4)')::geography) AS insaat_rotasi_metre,`
  `ST_Area(ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))')::geography) / 10000 AS maden_sahasi_hektar;`

Geometriyi sarmalayıp, Geography cast'i atadığımız an, sistem 10x10'luk o kutuyu gerçek dünyadaki devasa bir parselmiş gibi algılar ve metrekare değerini 10 bine bölüp bize tertemiz bir Hektar raporu döner. Uzunluklar ve metrajlar artık sizin tek komutunuzla biliniyor.

**[Kapanış]**
Fiziksel boyutun ticari maliyetini ortaya çıkardınız. Koca bir arazinin sınırlarını belirledik; ancak yönetim sizden o devasa araziyi haritada sadece tek bir nokta etiketi ("pin") ile işaretlemenizi isterse ne yapacaksınız? Eğri büğrü bir coğrafyanın denge noktasını neresi kabul edilir? Gelecek devrede ağırlık merkezleri (Centroid) problemini çözeceğiz.