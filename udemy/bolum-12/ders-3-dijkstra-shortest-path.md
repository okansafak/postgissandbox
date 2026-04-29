# Ders 3: Efsanenin Doğuşu (Dijkstra En Kısa Yol Algoritması)

**[Giriş / Hook]**
"A noktasındaki (Kadıköy) kargomu B noktasına (Taksim) taşı." Bunu herkes Google Maps’ten okuyabilir. Ama ya patronunuz size "Müşterimiz tır filosu yönetiyor; paralı yollar, yasak köprüler, dar sokaklar (kamyon giremez) var. Tüm veritabanımız elimizde. Kendi lojistik rotamızı çizmeliyiz!" diyorsa? İşte bu anda, dış API'lere bağımlı kalmadan "PostgreSQL motorunda" doğrudan Hollandalı bilgisayar bilimcisi Edsger W. Dijkstra’nın 1956'da yazdığı, tüm navigasyon teknolojilerinin atası olan "En Kısa Yol (Shortest Path)" silahına sarılacaksınız. Karşınızda lojistik analitiğinin mutlak hakimi: `pgr_dijkstra`.

**[Teori / Kavramsal Çerçeve]**
Dijkstra, veritabanına attığınız topolojik ağ üzerinde (Düğüm A'dan Düğüm B'ye giden çizgiler - Edge) tüm ihtimalleri, kolların maliyet (Cost / Mesafe) değerine göre yayan ve su gibi sızan bir matematiksel arayıştır. Tıpkı bir su damlasının otoyollarınıza bırakılması ve oradan çatallanıp en az direnç (Distance/Zaman) gören yolu seçerek hedefe ulaşması gibidir.
`pgr_dijkstra` komutu çalıştığında; SQL cümleniz bir `SELECT` alt sorgusu (String olarak!) alır. Çünkü motor, Dijkstra arayışında anlık olarak veriyi manipüle etmenizi, örn. "Eğer kamyon 10 tondan ağırsa 'weight_limit > 10' olanları maliyetine ekleme" deme imkanını size açar. Motor, "Bu caddeden geçemez" demek tır için dinamik bir "Topoloji Seçimidir."

**[Uygulama / Ekran Gösterimi]**
Ortamımızda Kadıköy Düğümü (`source = 25`) ve Taksim Düğümü (`target = 490`) id'leri var. Maliyetimiz = Metre bazında caddenin uzunluğu.
İşte kendi veritabanımızda Google Maps seviyesi rotalamanın yapıldığı an, saniyeden kısa süren o görkemli SQL sorgusu:

`SELECT seq, path_seq, node, edge, cost, agg_cost `
`FROM pgr_dijkstra(`
`  -- 1. Parametre: Veritanındaki graf ağını getiren alt sorgu (Dizgi halinde yazılır)`
`  'SELECT id, source, target, cost FROM sokaklar',`
`  -- 2. Parametre: Başlangıç Node ID'si`
`  25,`
`  -- 3. Parametre: Bitiş/Hedef Node ID'si`
`  490,`
`  -- 4. Parametre (Opsiyonel): Yönlü Graf mı? (Trafik Tek Yön mü?)`
`  directed := false`
`);`

-- *Sonuç Tablosu:*
-- seq | node | edge | cost (Geçilen sokağın metersi) | agg_cost (Gidilmiş toplam yol!)
Döndürülen 'edge' (Kenar) numaralarını alıp ana `sokaklar` tablosuyla (JOIN on id = edge) birleştirdiğiniz an elinizde A noktasından B noktasına giden kırmızı, kusursuz navigasyon çizgisi (Geometri) doğar!

**[Kapanış]**
Gördünüz mu? Tüm dünya sadece "SELECT" çekip beklerken, siz "SELECT" içine bir SQL daha sarmalayıp matematikteki "Shortest Path" ağlarını veritabanınızda çözdürdünüz. Dijkstra otoyolları ahtapot gibi 360 derece çevreleyerek arar (Biraz inatçı ve kördür).
Peki ama "Ben sadece hedef yönüne doğru arasın, geriye doğru arama zahmetine girmesin" diyecek zeki bir algoritmaya ihtiyacınız varsa? İşte bir sonraki aşamada "A* (A-Star) Algoritması" vizyonunu işleyeceğiz. Yol Açık.