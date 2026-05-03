# PostGIS Akademi: Bölüm 2 - Sorgular, İndeks ve Performans
**2. Gün ve 3. Gün (9., 10. ve 11. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 9] 15:00 - 15:50 | Veri Entegrasyonu ve Geometri Optimizasyonu

### [15:00 - 15:15] Açılış Anekdotu ve Veri Yükleme (Staging)
**(Kritik Soru: Büyük veri setlerinin entegrasyonunda Staging yaklaşımı neden gereklidir?)**

**Teorik Anlatım:**
"2012 yılında, Knight Capital Group, üretim (production) ortamına yeni güncellemeleri aktardı. Optimizasyon hataları sebebiyle kurum 45 dakika içinde 440 Milyon Dolar zarar etti. Afet lojistiği gibi kritik operasyonlarda da sistem gecikmelerinin maliyeti büyüktür. Kurumsal mimarilerde performans, verinin nasıl yüklendiğiyle başlar. Ham verinin doğrudan aktif tablolara yazılması indeksleri zorlar. Endüstri standartları, veriyi önce bir ara belleğe (Staging) almayı, doğrulama sonrası paketler (Batch Processing) halinde canlıya aktarmayı önerir."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** CSV Yükle ve Staging'den Aktar
*   **Uygulama Adımları:** `ogr2ogr` aracıyla veri önce bir Staging tablosuna alınır. Ardından `INSERT INTO ... SELECT ...` ile asıl tabloya aktarılır.

### [15:25 - 15:40] Geometri Optimizasyonu (Simplify ve Subdivide)
**(Kritik Soru: ST_Simplify işleminin topolojik bütünlük üzerindeki etkileri nelerdir?)**

**Teorik Anlatım:**
"Yüksek çözünürlüklü poligonlar, indeks arama sürelerini uzatır. `ST_Simplify` ile nokta sayısını azaltmak bir yöntemdir ancak topolojik boşluklara yol açabilir. Asıl performans kazanımı `ST_Subdivide` ile sağlanır. Bu fonksiyon, devasa bir poligonu alt parçalara bölerek GiST indeksinin doğruluğunu maksimize eder."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** İl Sınırını Böl
*   **Uygulama Adımları:** `ST_Subdivide(geom, 255)` fonksiyonu ile devasa bir sınır poligonu küçük parçalara bölünerek yeni bir tabloya kaydedilir.

---

## [Ders 10] 16:00 - 16:50 | İndeksleme Stratejileri ve Analiz

### [16:00 - 16:20] İndeksleme ve Bounding Box Operatörleri
**(Kritik Soru: Mekansal sorgularda Bounding Box (&&) operatörünün maliyet avantajı nedir?)**

**Teorik Anlatım:**
"PostGIS'in sorgu yeteneğinin temeli GiST mimarisine dayanır. Karmaşık topolojik işlemler yüksek işlemci gücü gerektirir. Veritabanı, geometriyi kapsayan sanal bir zarf (Bounding Box) oluşturur ve önce bu zarfların çakışıp çakışmadığını (`&&` operatörü ile) test eder. Zarf seviyesinde ön eleme, gereksiz matematiksel hesaplamaları önler. Bununla birlikte, tüm tabloyu indekslemek yerine `is_active = true` olan kayıtlar için Partial İndeks kurmak disk I/O operasyonlarını ciddi ölçüde azaltır."

**Canlı Uygulama / Görev (5 Dakika):**
*   **Görev:** Partial İndeks Kur
*   **Uygulama Adımları:** `CREATE INDEX idx_geom ON konya.mahalleler USING GIST (geom) WHERE aktif_mi = true;`

### [16:25 - 16:50] EXPLAIN ANALYZE ve ST_Distance Anti-Pattern
**(Kritik Soru: Tahmin (Planning) ile Gerçek (Execution) süreleri arasındaki sapmalar ne anlama gelir?)**

**Teorik Anlatım:**
"Performansı değerlendirmenin analitik yöntemi `EXPLAIN ANALYZE` komutudur. Bu araç, sorgunun çalışma algoritmasını ortaya koyar. Mekansal SQL yazımındaki en yaygın performans hatası (anti-pattern), mesafe kontrollerinde `ST_Distance` fonksiyonunun WHERE koşulunda kullanılmasıdır. Bu, GiST indeksini göz ardı ederek tam tablo aramasına neden olur. Optimum mimarilerde, `ST_DWithin` fonksiyonu standart kabul edilmelidir."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Plan Çıkart ve Anti-Pattern'ı Düzelt
*   **Uygulama Adımları:** `ST_Distance` kullanılan yavaş bir sorgu çalıştırılıp EXPLAIN ile incelenir. Ardından `ST_DWithin` ile optimize edilerek aradaki milisaniye farkı (Cost düşüşü) kanıtlanır.

---

## [Ders 11 - İlk Yarı] 10:00 - 10:25 (3. Gün) | Veritabanı Bakımı

### [10:00 - 10:25] VACUUM, Bloat ve Partitioning
**(Kritik Soru: Veritabanı yönetiminde Partition Pruning, büyük hacimli sorguları nasıl hızlandırır?)**

**Teorik Anlatım:**
"PostgreSQL güncellenen veya silinen satırları diskten anında silmez (MVCC), bu da tabloların zamanla şişmesine (Bloat) neden olur. `VACUUM` süreçleri bu alanları yeniden kullanılabilir hale getirir. Performansın zirvesi ise Tablo Bölümleme (Partitioning) yöntemidir. Veriyi tek tablo yerine ilçelere göre fiziksel bölümlere ayırdığımızda; sorgu motoru sadece talep edilen bölüme bakar ve diğerlerini görmezden gelir (Partition Pruning)."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Partition Oluştur
*   **Uygulama Adımları:** Konya verileri için `PARTITION BY LIST (ilce)` mantığıyla tablolar oluşturulur ve `VACUUM ANALYZE` komutu tetiklenir.
*   **Geçiş:** "Performans süreçlerimizi standardize ettiğimize göre, 10:25 itibariyle Bölüm 3'e geçerek bu verimli altyapı üzerinde ağ teorisini kurgulamaya başlayacağız."
