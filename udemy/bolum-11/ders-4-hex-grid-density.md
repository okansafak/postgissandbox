# Ders 4: Doğanin Formülü Isı Haritaları (Hexagonal Grid ve Yoğunluk)

**[Giriş / Hook]**
Taksi firmaları, dron kiralama şirketleri veya modern emlak analizcileri veriyi hiçbir zaman siyasi ilçe sınırlarıyla, nehir kenarlarıyla veya kaba asimetrik dörtgenlerle (Kare Grid) sunmazlar. Kareler bir eksene göre uzun, bir diğerine göre haksızdırlar (Köşegenleri merkeze adaletsiz mesafededir). Oysa doğanın binlerce yıldır arı kovanlarında sakladığı bir sırlar felsefesi vardır: Altıgen (Hexagon). Kenar dengesi mükemmeldir, kör noktası yoktur, kıvrımları muazzam sarar. PostGIS'te devasa bir alanı, anında milyonlarca bal peteğine dönüştürüp, "Hangi petekte kaç müşteri var?" yoğunluğunu (Heatmap) nasıl basarsınız?

**[Teori / Kavramsal Çerçeve]**
`ST_HexagonGrid` fonskiyonu, sizden iki değer talep eder: "Bana bir başlangıç kutusu veya çokgeni ver (Zarf), ve bir kenar uzunluğu (Boyut - Metre/Derece) söyle". 
PostGIS o bölgeyi sanal bir çarşaf gibi altıgenlere (Hexagon hücrelere - Cell) parçalar ve size o altıgen poligonları liste olarak fırlatır. Sonra yapmanız gereken tek şey, sizin Dağınık Pinlerinizi (Noktalarınızı), bu yeni doğmuş altıgenlerin içine Mekansal olarak Katmaktır (`Spatial JOIN: ST_Intersects`). Ardından bir `COUNT()` atarsınız. Rapor masanıza düştüğünde, hangi altıgenin içinde 5.000 vaka, hangisinde 2 vaka olduğunu kusursuz bir yüzey (Surface) analitiğiyle renk skalalarına aktarmış olursunuz. Bu işlem, Heatmap (Isı haritası) üretiminin arka odasıdır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda koca İstanbul yığınını 1000'er metrelik (1 KM) kovanlara bölelim ve otoyol kazalarımızı içlerine doldurup yoğunluğu sayalım:
`SELECT `
  `hex.i AS petek_ikinci_koordinat, `
  `hex.j AS petek_birin_koordinat, `
  `hex.geom AS petek_cokgeni, `
  `COUNT(k.id) AS kaza_sayisi`
`FROM `
  `-- İstanbul'un Zarfi üzerine 1000m (EPSG 3857 ortamında) kenarlı petekler ör:`
  `ST_HexagonGrid(1000, ST_MakeEnvelope(3100000, 4800000, 3300000, 5000000, 3857)) AS hex`
`LEFT JOIN kazalar k `
  `ON ST_Intersects(k.geom, hex.geom)`
`GROUP BY hex.i, hex.j, hex.geom`
`HAVING COUNT(k.id) > 0; -- Sadece kaza olan petekleri ekrana bas (Siyah boşlukları çöpe at)`

Bu formülün çıktısı bir sanat eseridir. Rapor, haritanıza kusursuz pürüzsüzlükte çokgenler (petekler) döşeyecek ve her peteğe kırmızıdan (100 kaza) maviye (1 kaza) giden kurumsal renk kodlarınızı besleyebileceğiniz o devasa pikselleri bahşedecektir. 

**[Kapanış]**
Görüldüğü gibi piksellerin en verimlisi olan altıgenleri uzayımıza diktik. Isı haritalarını, pazar alanlarını ve otonom kapsama zonlarını kurdunuz. Elinizde 3 dev mühimmat var: K-Means, DBSCAN ve HexGrid. O halde bir projenin tam ortasında, elinizdeki veriye baktığınızda hangi silahı çekeceğinize (karar matrisi) uzman bir mimar olarak nasıl karar vereceksiniz? Serinin son seansında Zeka Laboratuvarı Stratejisini (Decision Matrix) kuracağız.