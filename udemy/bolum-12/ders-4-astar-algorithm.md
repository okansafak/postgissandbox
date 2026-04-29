# Ders 4: Püray ve Odaklanmış Yıldız (A* A-Star Heuristic Yönlendirme)

**[Giriş / Hook]**
Dijkstra algoritmasını yazdınız, binlerce caddeden oluşan şehrinizde harikalar yaratıyor. Sonra veritabanınıza "Tüm Türkiye'nin veya Avrupa'nın" sokaklarını yüklediniz (Milyonlarca Node). İstanbul'dan Ankara'ya bir güzergah çizmesini istediniz. Bir anda Dijkstra, İstanbul'dan kalkıp sanki Yunanistan'a da gitmesi gerekiyormuş gibi 360 derece tüm ihtimalleri (Kör Dalgıç gibi) dallandırdı ve RAM belleğinizi felç etti! Eğer hedefinizi "Ankara (Doğu)" olarak biliyorsanız, neden algoritma batıya doğru da yol arıyor ki? İşte veritabanı belleğinizi kurtaran mucize: `pgr_astar` (A-Star Algoritması).

**[Teori / Kavramsal Çerçeve]**
`A* (A-Star) Algoritması`, Dijkstra'nın akıllanmış ve gözleri "Gökyüzüne / Hedefe" dikilmiş, (Heuristic - Sezgisel) geliştirilmiş versiyonudur.
Dijkstra, sadece önüne çıkan yolların maliyet (Cost) durumuna bakar. A* ise o yola her adım attığında ekstra bir soru sorar: "Bu attığım adım (Kenar/Edge), benim hedef noktamın coğrafi konumuna uçuş uçuş "daha mı yakın" yoksa "daha mı uzak?". Eğer batıdaki sokak hedef koordinattan uzaklaşıyorsa orayı doğrudan eler (Budama/Pruning).
Bu yüzden A* algoritmasının çalışması için sadece `source`, `target`, `cost` yetmez. O sokakların X ve Y (Enlem/Boylam - Long/Lat) koordinatlarını da SQL motoruna vermelisiniz ki, uzaklaşıp yakınlaştığını sezgisel olarak matematiğe oturtsun (Öklit Mesafesi / Heuristic Formula).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda yine `sokaklar` tablosu var ama bu sefer o devasa Türkiye haritasında, X (Boylam) ve Y (Enlem) koordinatlarını (Düğüm noktalarının X,Y değerlerini) fonksiyonun içine besliyoruz:

`-- A* için kenarların başına (x1, y1) ve sonuna (x2, y2) ait konumları eklemeliyiz:`
`SELECT seq, node, edge, cost, agg_cost `
`FROM pgr_astar(`
`  -- SQL Stringi (A* İçin X ve Y Sütunları Zorunludur!)`
`  'SELECT id, source, target, cost, `
`          x1, y1, x2, y2 -- Başlangıç ve Bitiş X,Y (Enlem, Boylam)`
`   FROM sokaklar',`
`  -- Başlangıç Düğümü (İstanbul - 120)`
`  120,`
`  -- Hedef Düğümü (Ankara - 85002)`
`  85002,`
`  -- Yönlü yol mu? Çok uzun mesafelerde False diyerek hızı arttırabilirsiniz.`
`  directed := true`
`);`

*Makine bu sayede İstanbul'dan yola çıktığında hedefi coğrafi x,y olarak algılar. Edirne'ye veya İzmir'e doğru arama dallarını anında keser (Prune) ve motoru 100 kat daha hızlı sonuca götürür.*

**[Kapanış]**
Gördüğünüz gibi, devasa coğrafyalarda (Big Data) salt mesafe yeterli değildir, "Yön ve Hedefin Manyetizması" algoritmaya zeka katar. Dijkstra garantili ve her ihtimali bilen bir muhasebeci iken; A*, doğrudan hedefe kilitlenmiş sezgisel (Heuristic) bir avcıdır.
Şimdi, "Ya tek bir kargo aracım sadece tek bir hedefe değil de, 50 farklı sipariş noktasına gidip geri depoya dönecekse?" Bu soru, asrın yöneylem araştırması problemi olan Gezgin Satıcı (Traveling Salesperson)'a kapı açar. Motor rölantide, son aşamaya (Ders 5) ilerliyoruz.