# Ders 5: Mekansal Cerrahi: Çakışmaları veya Çıkarımları Geometriye Dönüştürmek (ST_Intersection, ST_Difference, ST_Union)

**[Giriş / Hook]**
Tapu kayıtlarında bir otoyol projesinin planı (Çizgi), mevcut bir özel arazinin (Poligon) tam ortasından geçiyorsa, bu sadece bir "kesişme alarmı" değildir. Şirket sizden otobanın arazi içinde kalan *o o spesifik parçasının* kaç metre olduğunu veya arazinin yoldan sonra kalan harabe kısmının mülkiyetini çıkarmanızı isteyecektir. Analistler sorun tespit eder; cerrahlar ise sorunu operasyonla çözer.

**[Teori / Kavramsal Çerçeve]**
Daha önce işlediğimiz `ST_Intersects` (TRUE/FALSE) komutu, sadece bir alarm veya dedektördür. Oysa Geometrik Küme (Set Operations) fonksiyonları, matematikteki "Kümeler" konusunu coğrafyaya taşır ve geriye yepyeni geometriler (yeni şekiller) kusar:
1. `ST_Intersection(A, B)`: İki obje üst üste bindirildiğinde, kestişen (ortak bölge olan) o küçük alanı (veya çizgiyi) alır ve dijital makasla oradan kesip size yeni bir Geometri verir.
2. `ST_Difference(A, B)`: A objesinden, B'nin kestiği alanları makaslayarak koparıp atar; yani kalanı siluet şeklinde sistemde yaratır. (A fark B). Otoyol geçtikten sonra elde kalan, budanmış arsanızdır.
3. `ST_Union(A, B)`: Yan yana, bitişik veya üst üste duran tüm objeleri dikiş izi bırakmadan devasa tek sınır çizgisine (tek bir poligon veya yapıya) doğru eritir.

**[Uygulama / Ekran Gösterimi]**
Ortam penceremize odaklanıyoruz. Elimizde bir parsel (kutu) ve onu yatay olarak işgal eden devasa bir boru hattı/yol zonu var. Sistemden, bu çakışan (ihtilaflı) arazi alanının geometrisini yepyeni bir kanıt objesine dökmesini istiyoruz:
`SELECT ST_AsText(`
  `ST_Intersection(`
    `ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))'),`
    `ST_GeomFromText('POLYGON((5 -5, 15 -5, 15 15, 5 15, 5 -5))')`
  `)`
`) AS ihtilafli_hedef_alan;`

Çıktıda veritabanı yepyeni bir POLYGON formülü dikte eder (`POLYGON((5 0, 10 0, 10 10, 5 10, 5 0))`). Eski objeler yok edildi. Karşınızda sadece çekişmenin ve işgalin kendisi duruyor; ölçülebilir, saklanabilir ve yeni bir mülkiyete konu edilebilir şekilde dijitalize edildi.

**[Kapanış]**
Görüldüğü gibi sistemdeki verileri statik ve dokunulmaz nesneler olmaktan çıkardık. Onları kesip, budayıp yepyeni fiziki varlıklar üretme kapasitene eriştik. Yaratım serüveninin bir sonraki durağında, birbirinden dağınık binlerce müşteri veya depo noktasını, stratejik bir analiz raporu için "tek bir dış ambalaj kağıdına" nasıl saracağımızı; yani Zarf (Envelope) ve Dışbükey Örtü (Convex Hull) zırh kuramını konuşacağız.