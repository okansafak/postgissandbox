# Ders 4: Asfaltın Ruhu (Canlı Navigasyon ve Rota API'si)

**[Giriş / Hook]**
"Müşteri Moda'dan taksi çağırdı. Sistemimizde 500 taksi var. Moda'ya kuş uçuşu (ST_Distance) en yakın taksi denizin ortasında (ya da Fenerbahçe burnunda, etrafında köprü yok) bekleyen taksi çıktı! Adama taksiyi atadınız, taksi 45 dakikada dolaşıp gelebildi. Müşteri uygulamayı sildi." Klasik, ölümcül bir "Kuş Uçuşu (Euclidean)" hatası. Gerçek kentsel hareketlilik (Mobility) platformları kuş uçuşu mesafe ile çalışmaz. Asfaltın, tek yönlü sokakların, kapalı caddelerin (Traffic Cost) "Gerçek Yol Ağı" mesafesiyle (Routing) çalışır. Taksiyi atamanız gereken kişi, kuş uçuşu en yakın olan değil, "Sokak Topolojisi olarak Sürüş Süresi en kısa olan" kişidir!

**[Teori / Kavramsal Çerçeve]**
Uygulamamızın `network` şemasında, Bölüm 12'de (pgRouting) inşa ettiğimiz "İstanbul Yol Ağı (`istanbul_yollar` - source, target, cost, reverse_cost, x1, y1)" tablosu duruyor.
**Sistem Senaryosu (Ridesharing Dispatch Logic):**
1. Müşteri PIN (koordinat) atar. Müşterinin PIN'i yol ağı üzerinde HANGİ DÜĞÜME (Nearest Node / Street Intersection) en yakındır bulur. (`ST_Distance` veya `K-NN` ile, sadece 1 hedef node çekilir).
2. Etraftaki 1 kilometre yarıçaptaki 10 adet "Müsait Taksinin" konumları da Node'lara yapıştırılır (Snap To Node).
3. `pgr_dijkstraCost` (Sadece maliyet döndüren devasa, çoklu rotalama aracı) ile 10 taksinin herbirinin Müşteriye OLAN "Asfalt Süresi / Mesafesi" hesaplanır.
4. Çıkan 10 satırlık rapordan "cost (maliyet) değeri en düşük olan taksiye" İŞ EMRİ (Job Dispatch) fırlatılır!

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `core.aktif_taksiler` ve `network.istanbul_yollar` var. `musteri_node_id` = 4500 (Moda İskelesi). Müsait Taksilerin Node ID'leri = (120, 480, 5000, 992).

`-- Müşteriye Asfalt Maliyeti (Sürüş Uzunluğu) Olarak EN YAKIN Taksinin Bulunması:`
`-- pgr_dijkstraCost: Rota çizgisini (Geometry) DÖNDÜRMEZ, Sadece O Otoyolların "A'dan B'ye Toplam Uzunluğunu" döner, çooook hızlıdır!`
`SELECT`
`  start_vid AS taksi_node_id, -- Kalkış Noktası (Taksilerin yerleri)`
`  agg_cost AS yol_maliyeti_metre -- Sürüş Mesafesi (Hedef Müşteri 4500'e)`
`FROM pgr_dijkstraCost(`
`  -- 1) Alt Sorgu: İstanbul'un sokak ağı (Çift Yönlü Trafik Uyumlu)`
`  'SELECT id, source, target, cost, reverse_cost FROM network.istanbul_yollar',`
`  -- 2) Arama Kümesi (Taksilerimiz - Çoklu Başlangıç (Multi-Source))`
`  ARRAY[120, 480, 5000, 992],`
`  -- 3) Hedef Kümesi (Müşteri - Tek Hedef)`
`  4500,`
`  directed := true`
`)`
`ORDER BY agg_cost ASC`
`LIMIT 1;`

-- *Sonuç:* Kuş uçuşu en yakın olan 120 Node'lu taksi değil de, Asfalt maliyeti en kısa (400 metre) olan 5000 Node'lu Taksi (agg_cost = 400) kazandı. API o taksiye "İş Geldi!" diye notification atar. MÜKEMMEL!

**[Kapanış]**
Gördünüz mu? PostGIS ve pgRouting, Uber'in (Dispatch) "İş Atama / Sürüş Süresi" çekirdeğini (Core Engine) bizim veritabanımızın içinde saniyesinde tek bir SQL sorgusuna çevirdi! Node.js arkada sadece bu SQL'i koşturdu, o kadar. Mimarimiz tıkır tıkır işliyor! Zirveye, bu eğitim serisinin kapanışına (Ders 5) yürüyoruz. Uygulamayı Canlandırma (Deployment), Sistem Denetimi ve Kapanış.