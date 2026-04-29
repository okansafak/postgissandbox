# Ders 3: Isı Haritası ve Talep Fırtınası (Gerçek Zamanlı Yoğunluk Analizi)

**[Giriş / Hook]**
"Başmühendis bey, sistemde şu an Kadıköy ve Üsküdar civarında 12,000 aktif müşteri talep (sipariş) pini yanıyor. Haritamız çöktü, yöneticilerin ekranında devasa mavi noktalar birleşti, kasmaktadan fareyi hareket ettiremiyorlar. 'Bana acil bu 12,000 talebi, petek (Hexagon) veya sıcak bölge (Heatmap/Cluster) olarak dönüştürüp ağırlığına göre renklendirerek (Çok yoğun/Az yoğun) getiren bir raporlama API'si yazın' dediler". Arka uçta Node.js ile 12,000 koordinatı çekip hafızada saydığınız gün şirketin kovulanı olurdunuz. Çözüm, veritabanının kaslarına (PostGIS Hexagonal Grid / DBSCAN) emir verip "Milyonlarca noktayı bana saniyede 'Sıcak Bölge' ve 'Hücre' ağırlığıyla teslim et" demektir.

**[Teori / Kavramsal Çerçeve]**
İleri derece raporlama (Analytics), milyonlarca tekil Point verisini değil, onların "Yoğunluk İzini (Density Map)" görselleştirir.
Bunun iki sarsılmaz yolu vardır:
1. `ST_HexagonGrid`: Olayın olduğu coğrafyaya görünmez bir bal peteği (Altıgen ızgaralar) ağ atarsınız. Ve `Spatial_JOIN` (İçinde Mi?) komutuyla, "Hangi peteğin (Altıgenin) içine kaç tane sipariş / müşteri noktası düşmüş?" (GROUP BY count) dersiniz! 0-5 düşen yeşil, 50 üstü düşen kırmızı!
2. `ST_ClusterDBSCAN`: Önceden belirli peteklere sıkıştırmak yerine organik adalara bölmek (Kümeleme Analitiği).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `core.musteri_talepleri` (geom) ve `ref.istanbul_il_siniri` (geom) var. İstanbul sınırını, her biri 500 metrelik altıgen hücrelere bölen, ve içine sipariş düşmeyenleri ELEYEN muazzam bir "Talep Yoğunluğu Haritası (HexGrid) Sorgusu":

`-- Harita Çizelim: İstanbul'daki müşteri siparişleri hangi altıgen hücrelere yığıldı?`
`SELECT`
`  grid.geom AS hex_hucresi,`
`  COUNT(m.id) AS siparis_sayisi`
`FROM`
`  -- 500 metre çözünürlüklü hücreler (SRID=3857 metrik için)`
`  ST_HexagonGrid(500, (SELECT geom FROM ref.istanbul_il_siniri LIMIT 1)) AS grid`
`JOIN`
`  core.musteri_talepleri m`
`  -- 'Eğer sipariş (m) noktası, grid o altıgen hücresinin İÇİNDEYSE (Intersects) SAY'`
`  ON ST_Intersects(m.geom, grid.geom)`
`GROUP BY grid.geom`
`HAVING COUNT(m.id) > 10 -- Sadece 10'dan fazla siparişin patladığı SICAK PETEKLERİ GETİR!`
`ORDER BY siparis_sayisi DESC;`

-- *Sonuç:* Tekil noktalardan kurtulup, her biri "Poligon olan altıgenler" ve yanında "siparis_sayisi" döndüren kusursuz bir Rapor (Analytics) tablosunu Node.js'e / Tableau'ya / QGIS'e sattınız. Ekrana direkt Isı Haritası düştü!

**[Kapanış]**
Gördünüz mu? Gerçek bir projenin zekası, "Binlerce ham veriyi" ekrana basması değil, onları "Yüksek değere sahip Analitik Görsel Yüzeylere (HexGrid) dönüştürüp, Isı Ağırlıklarını" döndürmesidir. Artık "Talebin Şiştiği (Surge Pricing / Yoğunluk Fiyatlandırması - Örn Uber'deki kırmızılıklar)" bölgeyi biliyoruz. O peteklerin oralara "Kuryeleri / Taksileri" en hızlı şekilde (Trafik ağından / Routing) nasıl yollayacağız? Sırada kuryemizi labirent sokaklardan kurtarıp, hedefe optimize eden Sistem Mimarisini uyandırmak (Ders 4) var. Routing'e yürüyoruz.