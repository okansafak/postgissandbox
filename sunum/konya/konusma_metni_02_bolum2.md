# PostGIS Akademi: Bölüm 2 - Sorgular, İndeks ve Performans
**2. Gün ve 3. Gün (9., 10. ve 11. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 9] 15:00 - 15:50 | Veri Entegrasyonu ve Geometri Optimizasyonu

### [Slayt 1] Kapak: Sorgular, İndeks ve Performans
**(Süre: 2 Dakika)**
**Sahne Metni:**
"Mekansal SQL'in temellerini attık. Ancak gerçek dünya senaryolarında, Konya gibi devasa bir şehrin milyonlarca verisini yönetirken, doğru sonuç almak yetmez; sonucu *hızlı* almak gerekir. Bu bölümde, kurumsal veri yükleme stratejilerini, ileri geometri analitiğini, indeksleme derinliklerini ve sorgu planlamasını inceleyeceğiz."

### [Slayt 2] 2.1 — Veri Yükleme (CSV, GeoJSON, SHP)
**(Süre: 8 Dakika | Soru: ogr2ogr neden tercih edilir?)**
**Sahne Metni:**
"Veritabanı dışındaki farklı formatları PostGIS'e aktarmanın yollarını bilmeliyiz. `ogr2ogr` aracı, GeoJSON'dan veritabanına veya KML'den Shapefile'a kadar her türlü dönüşümü terminalden tek komutla yapabilir. Hafif veri setlerinde `COPY` komutu ile CSV dosyalarını doğrudan tabloya basabiliriz."

**Canlı Uygulama / Görev (CSV Yükle):**
*   **Aksiyon:** `COPY konya.temp_tablo FROM 'veri.csv' WITH (FORMAT csv, HEADER);`

### [Slayt 3] 2.1 — Staging ve Batch Processing
**(Süre: 10 Dakika | Soru: Büyük veri setlerinin entegrasyonunda Staging yaklaşımı neden gereklidir?)**
**Sahne Metni:**
"2012 yılında, Knight Capital Group, üretim (production) ortamına yeni güncellemeleri kontrolsüzce aktardı. Optimizasyon hataları sebebiyle kurum 45 dakika içinde 440 Milyon Dolar zarar etti. Afet lojistiği gibi kritik operasyonlarda da sistem gecikmelerinin maliyeti büyüktür. Kurumsal mimarilerde performans, verinin nasıl yüklendiğiyle başlar. Ham verinin doğrudan aktif tablolara yazılması indeksleri zorlar ve RAM'i tüketir. Endüstri standartları, veriyi önce bir ara belleğe (Staging) almayı, doğrulama sonrası paketler (Batch Processing) halinde ana tablolara aktarmayı önerir."

**Canlı Uygulama / Görev (Staging'den Aktar):**
*   **Aksiyon:** Staging tablosundaki geçersiz geometrileri `ST_MakeValid` ile düzelterek ana tabloya aktarın. `INSERT INTO ... SELECT ...`

### [Slayt 4] 2.2 — ST_Simplify ve ST_Smooth
**(Süre: 8 Dakika | Soru: ST_Simplify işleminin topolojik bütünlük üzerindeki etkileri nelerdir?)**
**Sahne Metni:**
"Yüksek çözünürlüklü poligonlar, çok fazla nokta içerdiği için indeks arama sürelerini uzatır. `ST_Simplify` ile nokta sayısını azaltmak bir yöntemdir ancak poligonları birbirinden kopararak topolojik boşluklara yol açabilir. Bu yüzden standart komut yerine topolojiyi koruyan `ST_SimplifyPreserveTopology` varyantını kullanırız. Görsel iyileştirmeler için ise `ST_ChaikinSmoothing` ile keskin köşeleri yumuşatırız."

**Canlı Uygulama / Görev (Smoothing Uygula):**
*   **Aksiyon:** `ST_ChaikinSmoothing` fonksiyonunu 2 iterasyon ile mahalle sınırlarına uygulayın.

### [Slayt 5] 2.2 — ST_Subdivide: Performans Canavarı
**(Süre: 10 Dakika | Soru: Neden 255 nokta?)**
**Sahne Metni:**
"Basitleştirmek yerine veriyi parçalamak asıl performans kazanımını sağlar. `ST_Subdivide` fonksiyonu, devasa bir poligonu (Örneğin koskoca bir il sınırı) alt parçalara böler. Hedefimiz 255 noktadır. Neden? Çünkü 255-512 arası nokta sayısı, GiST indeksinin Bounding Box algoritması için ideal boyutları oluşturur ve arama sürelerini logaritmik olarak düşürür."

**Canlı Uygulama / Görev (İl Sınırını Böl):**
*   **Aksiyon:** Konya il sınırını 100 nokta limitiyle subdivide edip kaç parça oluştuğunu `COUNT(*)` ile görün.

### [Slayt 6] 2.2 — Doğrusal Referanslama (Linear Referencing)
**(Süre: 6 Dakika | Soru: M Koordinatı nedir?)**
**Sahne Metni:**
"Klasik X (Boylam) ve Y (Enlem) koordinatlarına ek olarak M (Measure - Ölçü) koordinatı vardır. Bir otoyolda '34. kilometrede kaza oldu' dediğinizde bu M koordinatıdır. Doğrusal Referanslama, devasa hat geometrilerinde belirli bir mesafeyi veya yüzdelik dilimi nokta olarak hesaplamamızı sağlar."

**Canlı Uygulama / Görev (Orta Nokta Bul):**
*   **Aksiyon:** `ST_LineInterpolatePoint` ile bir yolun tam %50'sine (0.5 oranına) bir nokta atayın.

### [Slayt 7] 2.2 — ST_ClosestPoint ve ST_Azimuth
**(Süre: 6 Dakika | Soru: Azimuth nerede kullanılır?)**
**Sahne Metni:**
"Sadece mesafe değil, yön bulmak da kritiktir. `ST_Azimuth` iki nokta arasındaki açıyı radyan cinsinden döndürür. Bu, rüzgar yönüne göre duman yayılım analizlerinde veya güneş enerjisi panellerinin parsel yönelim analizlerinde hayat kurtarır. `ST_ClosestPoint` ise iki poligonun birbirine en yakın sınır noktalarını yakalar."

**Canlı Uygulama / Görev (En Yakın Sınırı Bul):**
*   **Aksiyon:** Bir binadan en yakın parsel sınırına dikme indiren `ST_ShortestLine` komutunu çalıştırın.

---

## [Ders 10] 16:00 - 16:50 | İndeksleme Stratejileri ve Analiz

### [Slayt 8] 2.3 — GiST ve SP-GIST İndeksleme
**(Süre: 8 Dakika | Soru: SP-GIST ne zaman hızlanır?)**
**Sahne Metni:**
"PostGIS'in sorgu yeteneğinin temeli GiST mimarisine dayanır. GiST iç içe geçmiş zarflar (Bounding Boxes) oluşturarak veriyi arar. Ancak veriniz seyrekse ve üst üste binmiyorsa (örneğin devasa alana yayılmış adres noktaları), SP-GIST indeks türü klasik GiST'ten çok daha hızlı sonuç verecektir."

**Canlı Uygulama / Görev (İndeks Oluştur):**
*   **Aksiyon:** `CREATE INDEX idx_gist ON osm_binalar USING GIST(geom);`

### [Slayt 9] 2.3 — Bounding Box Operatörleri (&&)
**(Süre: 8 Dakika | Soru: && neden vazgeçilmezdir?)**
**Sahne Metni:**
"Karmaşık topolojik işlemler (Intersects, Contains) yüksek işlemci gücü gerektirir. İndeksler arka planda sadece `&&` operatörünü anlar. Veritabanı, geometriyi kapsayan sanal bir zarf oluşturur ve önce bu zarfların çakışıp çakışmadığını `&&` operatörü ile test eder. Zarf seviyesinde ön eleme, gereksiz matematiksel hesaplamaları önler ve gerçek poligon kesişiminden 100 kat daha hızlıdır."

**Canlı Uygulama / Görev (Kutu Sorgusu Yap):**
*   **Aksiyon:** Belirlediğiniz bir koordinatın etrafındaki binaları sadece `&&` operatörü ile sorgulayın.

### [Slayt 10] 2.3 — Partial ve Functional İndeksler
**(Süre: 8 Dakika | Soru: Functional Index nedir?)**
**Sahne Metni:**
"Tüm tabloyu indekslemek yerine, sadece ihtiyacınız olan veriyi indeksleme sanatıdır. `is_active = true` olan kayıtlar için 'Partial İndeks' kurmak disk okuma/yazma (I/O) operasyonlarını ciddi ölçüde azaltır. Bir fonksiyonun sonucunu (Örn: `ST_Centroid`) önceden hesaplayıp indekslerseniz (Functional Index), sorgu anında o fonksiyon hiç vakit kaybetmeden çalışır."

**Canlı Uygulama / Görev (Partial İndeks Kur):**
*   **Aksiyon:** `CREATE INDEX idx_geom_aktif ON konya.mahalleler USING GIST (geom) WHERE aktif_mi = true;`

### [Slayt 11] 2.3 — ANALYZE ve Kullanım Takibi
**(Süre: 6 Dakika | Soru: ANALYZE neden şarttır?)**
**Sahne Metni:**
"İndeksi kurduk ama sistem onu kullanacak mı? Planlayıcı, verinin nasıl dağıldığına dair istatistiklere bakar. Tabloya devasa veri yükledikten sonra `ANALYZE` komutunu çalıştırmazsanız, planlayıcı istatistikleri eski sanır ve indeks yerine tabloyu baştan sona okumayı seçer (Seq Scan)."

**Canlı Uygulama / Görev (İndeksleri Takip Et):**
*   **Aksiyon:** `pg_stat_user_indexes` üzerinden `idx_scan` değeri 0 olan, yani sistemi boşuna yavaşlatan indeksleri bulun.

### [Slayt 12] 2.4 — EXPLAIN ANALYZE Giriş
**(Süre: 10 Dakika | Soru: Tahmin (Planning) ile Gerçek (Execution) süreleri arasındaki sapmalar ne anlama gelir?)**
**Sahne Metni:**
"Performansı değerlendirmenin analitik yöntemi `EXPLAIN ANALYZE` komutudur. Bu araç, sorgunun çalışma algoritmasını (röntgenini) ortaya koyar. Sadece `EXPLAIN` yazarsanız veritabanının tahmin süresini, yanına `ANALYZE` eklerseniz gerçek çalışma süresini görürsünüz. İkisi arasındaki büyük fark indeks bozulmasına veya eksik istatistiğe işarettir."

**Canlı Uygulama / Görev (Plan Çıkart):**
*   **Aksiyon:** Herhangi bir mekansal sorgunun önüne `EXPLAIN ANALYZE` ekleyerek "Actual Time" değerini not edin.

### [Slayt 13] 2.4 — Seq Scan ve Index Scan Farkı
**(Süre: 5 Dakika | Soru: Seq Scan ne zaman iyidir?)**
**Sahne Metni:**
"Plan çıktılarında iki ana terim görürsünüz: `Index Scan` (doğrudan hedefe gidiş) ve `Sequential Scan` (tabloyu baştan aşağı tarama). Eğer tablonuz 100 satır gibi çok küçük bir tabloyse, indekse uğramak disk okuma maliyetini artıracağından `Seq Scan` çok daha hızlı ve mantıklı bir yoldur. Ancak milyonluk tablolarda `Seq Scan` sistemi çökertir."

**Canlı Uygulama / Görev (Maliyet Düşür):**
*   **Aksiyon:** Sorguda `SELECT *` yerine sadece ihtiyacınız olan kolonları seçerek plan çıktısındaki `width` (ağ yükü) maliyetini azaltın.

### [Slayt 14] 2.4 — ST_Distance Anti-Pattern
**(Süre: 10 Dakika | Soru: Neden DWithin?)**
**Sahne Metni:**
"Mekansal SQL yazımındaki en yaygın performans hatası (anti-pattern), mesafe kontrollerinde `ST_Distance` fonksiyonunun `WHERE` koşulunda kullanılmasıdır. Bu, GiST indeksini tamamen göz ardı ederek tam tablo aramasına (Seq Scan) neden olur. Optimum mimarilerde, mesafe filtresini `&&` Bounding Box mantığıyla optimize eden `ST_DWithin` fonksiyonu standart kabul edilmelidir."

**Canlı Uygulama / Görev (Sorguyu Düzenle):**
*   **Aksiyon:** `ST_Distance < 500` kullanılan yavaş bir sorguyu `ST_DWithin(geom, geom2, 500)` ile optimize ederek aradaki milisaniye farkını (Cost düşüşü) kanıtlayın.

### [Slayt 15] 2.4 — EXPLAIN FORMAT (JSON, YAML)
**(Süre: 5 Dakika | Soru: Neden JSON/YAML?)**
**Sahne Metni:**
"Karmaşık plan okumalarını kolaylaştırmak için çıktıları JSON veya YAML formatında alabilirsiniz. Bu formatlar, PEV2 gibi gelişmiş görsel arayüz araçlarına yüklendiğinde, sorgudaki performans darboğazını size saniyeler içinde grafiksel olarak gösterir."

**Canlı Uygulama / Görev (YAML Çıktısı Al):**
*   **Aksiyon:** Daha okunaklı bir ağaç yapısı için `EXPLAIN (FORMAT YAML, ANALYZE)` kullanarak karmaşık bir join sorgusunu inceleyin.

---

## [Ders 11 - İlk Yarı] 10:00 - 10:25 (3. Gün) | Veritabanı Bakımı

### [Slayt 16] 2.5 — VACUUM ve Tablo Şişmesi (Bloat)
**(Süre: 8 Dakika | Soru: Bloat neden sorguyu yavaşlatır?)**
**Sahne Metni:**
"PostgreSQL güncellenen veya silinen satırları diskten anında silmez (MVCC sayesinde), bu da tabloların zamanla diskte gereksiz yer kaplamasına (Bloat) neden olur. Veritabanı RAM'e okuma yaparken o 'boş' hayalet satırları da okur ve yavaşlar. Düzenli `VACUUM` süreçleri bu ölü alanları yeniden kullanılabilir hale getirir. `VACUUM FULL` komutu tam temizlik yapsa da tabloyu kullanıma kilitler, dikkatli olunmalıdır."

**Canlı Uygulama / Görev (Bakım Planla):**
*   **Aksiyon:** `pg_stat_all_tables` üzerinden `n_dead_tup` sütununu inceleyerek ölü satır sayısını kontrol edin.

### [Slayt 17] 2.5 — Tablo Bölümleme (Partitioning)
**(Süre: 8 Dakika | Soru: İlçe bazlı partitioning neden avantajlıdır?)**
**Sahne Metni:**
"Performansın zirvesi Tablo Bölümleme (Partitioning) yöntemidir. Bir milyon binayı tek bir tabloda tutmak yerine, veriyi ilçelere göre (örneğin Selçuklu, Meram, Karatay) fiziksel bölümlere ayırırız. Yazılım ekibi veriyi yine ana tabloya (binalar) gönderir, ancak arka planda veri gizlice alt tablolara gider."

**Canlı Uygulama / Görev (Partition Oluştur):**
*   **Aksiyon:** Adresler tablosunu Konya'daki 3 ana ilçeye göre `PARTITION BY LIST (ilce)` mantığıyla oluşturmayı planlayın.

### [Slayt 18] 2.5 — Partition Pruning ve Tablespace
**(Süre: 7 Dakika | Soru: Tablespace nerede lazımdır?)**
**Sahne Metni:**
"Partition kurduğumuzda, sorgu motoru sadece Selçuklu verisini arıyorsa Meram ve Karatay disklerini hiç okumadan es geçer (Partition Pruning). Daha da ileri gidersek, 10 yıllık pasif arşiv verilerini ucuz HDD disklerdeki `Tablespace` alanlarına atıp, aktif Karatay verisini pahalı ve hızlı SSD'lere taşıyabiliriz. İşte gerçek kurumsal maliyet ve performans optimizasyonu budur."

**Canlı Uygulama / Görev (Pruning Kontrolü):**
*   **Aksiyon:** Partition kurulmuş tabloda bir WHERE koşulu yazın ve `EXPLAIN` çıktısında diğer partition'ların taranmadığını gözlemleyin.

### [Slayt 19] Kapanış
**(Süre: 2 Dakika)**
**Sahne Metni:**
"Bölüm 2'yi tamamladınız ve performans yönetimi süreçlerimizi standardize ettiniz. Artık endüstriyel seviyede bir PostGIS Performans Uzmanısınız. 10:25 itibariyle Bölüm 3'e geçerek, hazırladığımız bu yüksek performanslı altyapı üzerinde yönlendirme algoritmalarını (pgRouting) ve gelişmiş topoloji ağlarını kurgulamaya başlayacağız."
