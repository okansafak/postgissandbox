# Ders 5: Analitiğin Şahikası: Mekansal Birleştirme (Spatial JOIN)

**[Giriş / Hook]**
Geleneksel ilişkisel dünyada, maaş bordroları ile çalışan listelerini aynı rapora sıkıştırmanın tek bir yolu vardır: Her iki tabloda da bir `id` eşleşmesi veya Foreign Key bulunması. Aksi halde iki veri seti birbirine dilsizdir ve asimile olamaz. Peki ya elinizdeki müşteri adresleri tablosuyla, şehrin ilçe sınırlarını gösteren çokgenler (poligon) tablosunu hangi ortak kimlikle (ID) yan yana getireceksiniz? Burada ID yoktur. Burada referans noktası sadece uzay ve onun kurallarıdır.

**[Teori / Kavramsal Çerçeve]**
SQL evrenini coğrafi bir beyne çeviren ve PostGIS'i yerkürenin en rakipsiz kılan yegane yapı `Spatial JOIN` mekanizmasıdır. Klasik `JOIN` işleminde birleştirme (ON) koşulu olarak eşitlik ararken (`A.id = B.kategori_id`); Spatial JOIN'de birleştirme koşulu olarak daha önceki derslerde gördüğümüz uzamsal ilişki anahtarlarını yazarız: `ON ST_Intersects(A.geom, B.geom)` veya `ON ST_Contains(A.geom, B.geom)`. 
Sistem devasa iki tabloyu havaya kaldırır, geometrileri üst üste bindirir; adresi hangi ilçe sınırına fiziksel olarak düştüyse o iki satırı kopmaz bir mantıkla birbirine diker ve sonucu size sunar. ID matrisi gitmiş, yerini coğrafi "yerçekimi" matematiğine bırakmıştır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda (IDE panelimizde) şirketin mağaza verileriyle (`magazalar`) belediye ilçelerini (`ilceler`) bir araya getirdiğimiz kusursuz o sentezi yazalım:
`SELECT m.isim AS sube, i.ilce_ad AS bolge `
`FROM magazalar m `
`JOIN ilceler i ON ST_Contains(i.geom, m.geom);`

Komut çalıştığı an, sistemin çekirdeğindeki uzamsal zeka uyanır. Her şubenin noktasal "X,Y" verisini (Point) alır, hangi çokgenin (Polygon) sınırlarına sığdığını (Contains) saniyenin onda biri hızda test eder ve ekrana, "X Şubesi Kadıköy ilçesinde", "Y Şubesi Çankaya ilçesinde" diye organik, iki ayrık tablodan süzülmüş mükemmel bir finans+coğrafya sentezi raporu çıkartır. 

**[Kapanış]**
Girdiğimiz bu nokta, mekansal veritabanı uzmanlarının "Tam ve Eksiksiz Analiz" (Complete Analysis) olarak nitelediği yerdir. Elinizdeki tamamen farklı demografik veya yapısal tabloları sırf konumları kesişiyor diye iç içe geçirdiniz. "Uzamsal İlişkiler" modülünün tüm kalkanlarını, kesişimlerini ve birleştirme kudretini donandınız. Dördüncü bölümü zaferle geçtik. Gelecek bölümlerde, kendi mekanımızı yaratma, geometrileri budama (Clipping), parçalama ve en karmaşık analitik sentezlere doğru bir sonraki evreye (Spatial Processing / İşleme) adım atacağız. Kusursuz bir yolculuk. Kurmaya devam edelim.