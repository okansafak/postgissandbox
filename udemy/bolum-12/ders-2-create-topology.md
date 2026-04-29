# Ders 2: Uçları Birleştiren Sihirbaz (pgr_createTopology)

**[Giriş / Hook]**
Açık kaynak bir web sitesinden ya da belediyenin sunduğu "Sokaklar ve Caddeler" dosyasını veri tabanına doldurdunuz. "Şimdi rota çizebilirim" yanılgısına düştünüz. Hayır.
O sokakların sadece çizgi, düz birer çizgi olduğunu unutmayın. Bilgisayar; Bağdat Caddesi çizgisi ile Moda Caddesi çizgisinin gerçekten birbirine dokunduğunu bilemez bile. İki çizginin ucu milimetrik boşlukla ayrık kalmış olabilir veya üst üste bindikleri piksellerde kavşak noktası eksik kalmış olabilir. Sizin arabanız o yoldan, o kavşağa geçerken "Bu sokağın başı diğer sokağın bitişini nasıl tanıyor?" diye sormalısınız. Sihirbazımız `pgr_createTopology`.

**[Teori / Kavramsal Çerçeve]**
`pgRouting` motoru "Topoloji olmadan nefes alamaz." Topoloji = Komşuluk Haritası (Bağlanabilirlik).
`pgr_createTopology`, tablonuzdaki tüm otoyol çizgilerinin, sokakların geometrilerini milisaniyeler içerisinde okur; birbirine bir "tolerans payı" (örneğin 10 santimetreden daha yakın olan çizgiler birbirine temas etmelidir) aralığında yaklaşan tüm çizgilerin uç uçlarına birer benzersiz Kırmızı Nokta "Düğüm (Node/Vertex)" çakar.
Daha sonra, tablonuzdaki ilk baştaki boş "source" (Kaynak) ve "target" (Hedef) sütunlarını, çaktığı bu Nokta ID'leri ile milisaniyede doldurur. Artık "Ağa (Network)" sahipsiniz!

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `sokaklar` adında içinde `geom` barındıran bir dev tablo var. Tek satırlık ölümcül bir topoloji inşa kodu:

`-- 'sokaklar' tablomuz, 'geom' geometri sütununa sahip, birincil anahtarı 'id'.`
`-- 0.0001 = Tolerans (Birbirine değen santimetrik farkları kaynak yapsın)`
`SELECT pgr_createTopology(`
`  'sokaklar', `
`  0.0001, `
`  'geom', `
`  'id'`
`);`

-- Bu komut çalıştıktan saniyeler sonra PostgreSQL arkada otomatik bir "vertices" (kavşaklar) tablosu (sokaklar_vertices_pgr) çıkartır.
-- Aynı anda orijinal "sokaklar" tablonuzu otomatik EDITLER.
-- Ve source, target hücrelerini mucizevi şekilde sayılarla eşleştirir.

**[Kapanış]**
Gördüğünüz gibi "pgr_createTopology" sokağın sadece başlangıcına (source) ve sonuna (target) zekice düğümler attı; yolları birleştirdi. Trafik akışını taşıyacak damarlar artık bağlandı, yapay zekanın "aracı sürmesi için" gerekli olan kan tanzimi de bitti. Artık bu yolda "En Kısa Rota Nasıl Çizilir?" efsanesini yazacağız (Ders 3 - Dijkstra Algoritması). Motoru çalıştırın.