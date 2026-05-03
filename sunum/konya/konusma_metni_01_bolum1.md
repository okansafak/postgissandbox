# PostGIS Akademi: Bölüm 1 - Spatial SQL Fundamentals
**2. Gün (6., 7. ve 8. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 6] 10:00 - 10:50 | Mimari, Veri Tipleri ve Geometri

### [10:00 - 10:15] Açılış Anekdotu ve Platform Seçimi
**(Kritik Soru: İstemci tarafı çözümleri üretim ortamları için neden yetersiz kalır?)**

**Teorik Anlatım:**
"Orman yangınlarıyla mücadelede eski yaklaşımlar, sadece rüzgarın yönüne ve gözleme dayalı müdahale planlarından ibaretti. Günümüzde ise modern afet yönetim merkezleri, anlık veri analitiği kullanmaktadır. Sensör verileri, arazi eğimi ve rüzgar koridorları mekansal bir veritabanında entegre ediliyor. Veriler gösteriyor ki, bu parametrelerin uzamsal ilişkileri analiz edildiğinde yangının yayılım yönü saatler öncesinden hesaplanabilmektedir. Elde edilen bilgiyi coğrafi zeka ile birleştiren bu analitik yapının kalbine, PostGIS'e iniyoruz. Platform seçimi bu noktada kritiktir. İstemci tarafında çalışan hafif çözümler prototipler için uygun olsa da, üretim ortamlarında Docker gibi izole edilmiş sunucu mimarilerine ihtiyaç duyarız."

**Canlı Uygulama / Görev (5 Dakika):**
*   **Görev:** Mekansal Veritabanına Bağlan
*   **Uygulama Adımları:** `SELECT postgis_version();` komutu ile eklentinin durumu kontrol edilir.

### [10:20 - 10:35] Veri Mimarisi ve Tablespace
**(Kritik Soru: MVCC mimarisi, eşzamanlılığı nasıl sağlar?)**

**Teorik Anlatım:**
"PostgreSQL, farklı veri türlerini ayrı fiziksel konumlara yönlendirmek için `Tablespace` yapısını kullanır. Örneğin, mekansal indeksleri hızlı depolama birimlerine taşıyarak gecikmeler azaltılabilir. MVCC mimarisi okuma ve yazma operasyonlarının birbirini engellemesini önleyerek veri bütünlüğünü sağlar."

### [10:35 - 10:50] Geometri Tipleri ve ST_IsValid
**(Kritik Soru: Makine ve insan tarafından okunabilen geometri formatları nelerdir?)**

**Teorik Anlatım:**
"Geometriler, metin formatı olarak WKT veya ikili format olan WKB ile depolanır. Ancak en kritik aşama, geometrilerin yapısal geçerliliğidir. Kendi üzerine katlanan çizgiler (invalid geometries) hatalı hesaplamalara yol açar. Operasyonel setlerde mutlaka `ST_IsValid` kontrolleri yapılmalı ve sorunlu nesneler `ST_MakeValid` ile onarılmalıdır."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Çoklu Geometri Çiz ve Onar
*   **Uygulama Adımları:** `ST_GeomFromText('POLYGON(...)')` ile hatalı bir nesne yaratılır ve `ST_MakeValid` ile düzeltilir.

---

## [Ders 7] 11:00 - 11:50 | Projeksiyonlar ve Mekansal İlişkiler

### [11:00 - 11:25] SRID ve Projeksiyon Sistemleri
**(Kritik Soru: Geography veri tipi ile Geometry arasındaki hesaplama farkı nedir?)**

**Teorik Anlatım:**
"Küresel yüzeylerin dijital ekranlara aktarılması SRID ile mümkündür. EPSG:4326 açısal değerler kullanır. Doğru mesafe ölçümleri yapmak için bu verilerin metrik sisteme dönüştürülmesi şarttır. Bu süreç `ST_Transform` komutu kullanılarak yerel projeksiyonlara (EPSG:5254) geçişi sağlar. Geography küresel, Geometry düzlemsel hesaplamalar yapar."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Konya'yı Metrik Sisteme Taşı
*   **Uygulama Adımları:** `SELECT ST_Transform(geom, 5254) FROM konya.mahalleler;` ile tüm veri metrik sisteme projekte edilir.

### [11:25 - 11:50] Mekansal İlişkiler ve JOIN
**(Kritik Soru: ST_Intersects fonksiyonu sorgu optimizasyonunda nasıl konumlandırılır?)**

**Teorik Anlatım:**
"Konumsal analizin asıl katma değeri, bağımsız veriler arasındaki geometrik etkileşimleri tespit etmesidir. `ST_Intersects` veya `ST_Contains` operatörleri SQL'in yapısal `JOIN` komutlarıyla birleştiğinde (Spatial Join), idari sınırlar eşleştirmesi matematiksel kesişimle tespit edilir."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Hastane Hangi Mahallede?
*   **Uygulama Adımları:** Hastane noktaları ile Mahalle poligonları `ST_Intersects` şartıyla JOIN edilir.

---

## [Ders 8] 14:00 - 14:50 | Mekansal Ölçüm ve İleri Analizler

### [14:00 - 14:25] Ölçüm, Centroid ve Buffer
**(Kritik Soru: Etiketleme işlemlerinde neden ST_PointOnSurface tercih edilmelidir?)**

**Teorik Anlatım:**
"Mekansal ölçümlerde en sık karşılaşılan sorunlar yanlış referanslardır. Etiketleme yaparken ağırlık merkezi (`ST_Centroid`) yerine, poligonun içerisine düşmesi garanti edilen yüzey noktası (`ST_PointOnSurface`) tercih edilmelidir. Etki alanı analizlerinde ise `ST_Buffer` ile geometrik genişlemeler hesaplanır."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Yol Uzunluğu ve Tampon Alan (Buffer)
*   **Uygulama Adımları:** Belirli yollar için `ST_Length` hesaplanır ve `ST_Buffer` ile 50 metrelik etki alanı çizilir.

### [14:25 - 14:50] En Yakın N Komşu (KNN)
**(Kritik Soru: Uzaklık temelli sorgularda KNN indeksi nasıl kullanılır?)**

**Teorik Anlatım:**
"Kritik karar alma süreçlerinde (örneğin 'En yakın itfaiye istasyonu nerede?'), tüm veriyi tarayan klasik `ST_Distance` fonksiyonu sistemi kilitler. GiST indeksini doğrudan kullanarak saniyeler içinde sonuç döndüren KNN operatörü (`<->`) kullanılmalıdır. Bu algoritma performansı katlar."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** En Yakın 5 Binayı Bul
*   **Uygulama Adımları:** `ORDER BY geom <-> st_setsrid(st_makepoint(...), 5254) LIMIT 5;` sorgusu çalıştırılır.
