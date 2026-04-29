# Ders 5: Optimizasyon Dünyasının Kutsal Kasesi (TSP / Gezgin Satıcı)

**[Giriş / Hook]**
"Bugün İstanbul içinde teslim etmemiz gereken 150 kargo paketi var. Kurye depodan saat 08:00'da çıkacak. Hepsini dağıtıp mesaisi bitmeden depoya geri dönecek. En optimum sıralama hangisi?"
Lojistik şirketlerinin milyon dolarlarca para yaktığı, bilgisayar bilimleri ve "NP-Hard" (Polynomial-time hard) teorisinin en ikonik problemine hoş geldiniz: **Traveling Salesperson Problem (Gezgin Satıcı).**
Elinizde pgr_dijkstra ve A* motorları var. Ancak onlar sadece "A merkezinden B merkezine gitmeyi" bilir. Oysa bizim problemimiz "A'dan kalkıp, C, H, Z, K, X noktalarından rastgele değil, matematikte *en az maliyet çıkaracak* bir perlitasyon zincirinde dolaşmak ve geri A'ya gelmek." 
PostGIS ve pgRouting, bu korkutucu permutasyonu da sizin için çözer. Karşılaşacağınız komut: `pgr_TSP`.

**[Teori / Kavramsal Çerçeve]**
Satıcımız (kuryemiz) depodan (`source = 10`) çıkacak ve elinde dağıtması gereken düğümler dizisi olacak `ARRAY[25, 49, 130, 202, ... 9]`. Sonra tekrar dağıtımı bitirip depoya dönecek.
`pgr_TSP`, 150 adet kargo noktası arasındaki **her birinin birbirine olan mesafesini (Matris - Matrix)** okur. Simulated Annealing (Tavlama Benzetişimi) algoritmasını (ya da lokal arama kombinasyonlarını) ateşler.
Matematikte 150 tane noktanın birbirine uğrama kombinasyonu ($150!$ / Faktöriyel) evrenin yaşından fazla sürer! Veritabanımız ise bu kaosu pgr_TSP komutuna bir mesafe "Matrisi" (Düğüm A'dan B'ye maliyet) verdiğinizde "Sezgisel olarak en iyiye, %5 toleransla ve anında" ulaştırır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda Kadıköy Dağıtım Merkezi (Düğüm 1) ve teslimat lokasyonları (Düğüm 5, 20, 8, 92) dizimiz var:
Önce noktalar arasındaki Euclidean (Öklit/Cost) matrisini hazırlamak ve bunu pgRouting'e paslamak (Eskiden pgr_TSP sadece Euclidean mesafelere bakardı ama veritabanı matriksine (pgr_dijkstraMaliyeti) bağlarsak otoyol ağını baz alır).

`-- Kuryenin Uğrama Sırasını Anında (Maliyet) İle Veren Sorgu:`
`SELECT seq, node, cost, agg_cost `
`FROM pgr_TSP(`
`  -- 1) Matris Oluşturma (SQL Text): Seçili noktaların birbirine asimetrik tablosu veya X,Y`
`  $$`
`  SELECT id, x, y `
`  FROM sokaklar_vertices_pgr `
`  WHERE id IN (1, 5, 20, 8, 92)`
`  $$,`
`  -- 2) Başlangıç Noktası (Depo: 1),`
`  1,`
`  -- 3) Nihai/Bitiş Noktası (Tekrar Depo: 1) (Satıcı Geri Dönüyor!)`
`  1`
`);`

-- *Sonuç Tablosu:*
-- seq (Ziyaret Sırası) | node (Nereye/Hangi Eve gideceği) | cost | agg_cost
Makine anında size bir liste döner: `1 (Depo) -> 5 -> 8 -> 20 -> 92 -> 1 (Eve Dönüş)`. Topoloji motoru işi anında sıraladı! Oysa o veritabanı satırlarını siz döngü ile SQL'de eşleştirmeye çalışsanız (Self Join ile) yıllar sürerdi.

**[Kapanış]**
Tebrikler. Çizgilerden ağlara (Topology), algoritmalardan (Dijkstra, A*) lojistik optimizasyona (TSP) kadar "Bölüm 12 - Ağ Analizi ve pgRouting" sınırlarını yerle bir ettiniz. Veritabanının sadece bir depo olmadığını, devasa bir *Karar Destek ve Matematik Laboratuvarı* olduğunu kanıtladınız. Artık PostGIS ve pgRouting üzerinde "Coğrafi Karar Sistemlerini" sıfırdan kurabilecek endüstriyel yetkinliğe sahipsiniz. Bir sonraki devrede bu ağları daha kompleks yüzeylerle (Topoloji Standartları) ve can alıcı Güvenlik-Production aşamalarıyla taçlandıracağız. Gelecek bölüme (Bölüm 13) adım atabilirsiniz.