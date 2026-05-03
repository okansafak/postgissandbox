# PostGIS Akademi: Bölüm 3 - Production, Ağ Analizi ve Proje
**3. Gün (11. Ders İkinci Yarısı, 12., 13., 14. ve 15. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 11 - İkinci Yarı] 10:25 - 10:50 | Analitik Kümeleme

### [10:25 - 10:35] Açılış Anekdotu
"Uluslararası lojistik ağları yöneten kurumlar, büyük ölçekli optimizasyon problemleriyle her gün yüzleşmektedir. UPS'in 'Asla sola dönme' kuralı milyonlarca rotanın analiz edildiği karmaşık bir ağ algoritmasının çıktısıdır. Sağa dönüşlerin optimize edilmesiyle yıllık yakıt maliyetleri büyük ölçüde düşürülmüştür. Coğrafi bilgi sistemleri, verimlilik ve strateji üreten karar destek sistemleridir. Veriyi anlamlandırıp optimum kararları üretecek ağ algoritmalarını sistemlerimize entegre ediyoruz."

### [10:35 - 10:50] Mekansal Gruplama ve Yoğunluk Analizi
**(Kritik Soru: DBSCAN algoritması, geleneksel ısı haritalarına göre hangi analitik üstünlüklere sahiptir?)**

**Teorik Anlatım:**
"Büyük ölçekli şehir verilerini anlamlı birimlere ayırmak stratejik planlamanın ön koşuludur. Dağınık veri noktalarının servis bölgelerine bölünmesi gerektiğinde `KMeans` algoritması matematiksel bir denge sağlar. Suç istatistikleri veya kaza noktaları gibi yoğunluk tabanlı analizler söz konusu olduğunda `DBSCAN` algoritması öne çıkar. Geleneksel ısı haritaları görsel bir izlenim sunarken, DBSCAN algoritmaları gürültü verisini (noise) izole ederek karar süreçlerinde kullanılabilecek vektörel kümeler üretir."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Durak Kümeleme ve Yoğunluk Tespiti
*   **Uygulama Adımları:** `ST_ClusterDBSCAN` fonksiyonu kullanılarak 100 metrelik yarıçap içindeki minimum 3 yoğunluk noktası tespit edilir.

---

## [Ders 12] 11:00 - 11:50 | Ağ Analizi ve Rotalama

### [11:00 - 11:25] pgRouting: Ağ Analizi Temelleri
**(Kritik Soru: Ağ üzerinde çıkmaz sokakların bulunması algoritmik süreci nasıl etkiler?)**

**Teorik Anlatım:**
"Yol ağları veritabanında salt geometriler olarak tutulsa da, bu çizgilerin üzerinden geçilebilir bir rota oluşturabilmesi için grafik teorisine (Graph Theory) uyarlanması gerekir. `pgRouting` kütüphanesi, çizgileri düğümlere (node) bağlayarak aralarındaki seyahat mesafesini veya zamanını modellere işler. Çıkmaz yolların veya topoloji hatalarının temizlenmesi, Dijkstra gibi algoritmaların tutarlı sonuç vermesi için zorunludur."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Topoloji Hazırla
*   **Uygulama Adımları:** Yol tablosuna `source` ve `target` kolonları eklenerek `pgr_createTopology` komutu ile bir ağ yapısı kurulur.

### [11:25 - 11:50] En Kısa Yol (Dijkstra) Hesaplaması
**(Kritik Soru: Rota hesaplamasında maliyet (cost) faktörü zaman mı yoksa mesafe mi olmalıdır?)**

**Teorik Anlatım:**
"Düğümlerimiz hazır olduğunda, Dijkstra algoritması başlangıç noktasından hedefe giden en düşük maliyetli o kusursuz rotayı milisaniyeler içinde çizer. Maliyet faktörü sadece metre cinsinden uzunluk değildir; hız limitleri ve yol türleri de bu maliyeti doğrudan etkiler."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Ambulans Rotası Çiz
*   **Uygulama Adımları:** `pgr_dijkstra` komutu kullanılarak A noktasından B noktasına en hızlı giden yol hesaplanıp harita üzerinde gösterilir.

---

## [Ders 13] 14:00 - 14:50 | Optimizasyon ve Veri Bütünlüğü

### [14:00 - 14:20] Servis Alanı ve Çoklu Durak (TSP)
**(Kritik Soru: Hizmet erişim alanları belirlenirken, geometrik buffer yaklaşımı neden yanıltıcı sonuçlar doğurur?)**

**Teorik Anlatım:**
"Bir acil durum merkezinin 5 dakikalık yanıt süresi içinde hangi alanlara ulaşabileceği hesaplanırken havadan çizilen dairesel yarıçaplar gerçekliği yansıtmaz. `pgr_drivingDistance` fonksiyonu, yol ağının fiziksel kısıtlamalarını hesaba katarak gerçek bir hizmet poligonu oluşturur. Çoklu nokta ziyaretleri için ise Gezgin Satıcı Problemi (TSP) algoritmaları kullanılır."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** İtfaiye Kapsama Alanı
*   **Uygulama Adımları:** İtfaiye istasyonundan hareketle 5 dakikalık (veya 500 cost) sürüş poligonu `pgr_drivingDistance` ve `ST_ConcaveHull` birleşimiyle çizdirilir.

### [14:20 - 14:35] PostGIS Topology: Veri Bütünlüğü
**(Kritik Soru: Topoloji kuralları ile mekansal hatalar (gap/overlap) nasıl proaktif olarak engellenir?)**

**Teorik Anlatım:**
"Coğrafi bilgi sistemlerinde veri doğruluğu esastır. Bağımsız poligonlar zamanla boşluklara (gap) veya çakışmalara (overlap) yol açar. Topolojik modellerde poligonlar çizilmez; ortak sınır çizgileri (edge) tanımlanır. Bir sınır değiştiğinde ilgili tüm yüzeyler otomatik güncellenir."

### [14:35 - 14:50] Kurumsal Yetki ve RLS
**(Kritik Soru: Veritabanı güvenlik politikalarında neden veri erişimi satır bazında kontrol edilmelidir?)**

**Teorik Anlatım:**
"Kullanıcı yetkilendirmesi tablonun ötesine geçmelidir. Mekansal Satır Bazlı Güvenlik (Row Level Security - RLS) ile farklı bölgelerdeki yöneticilerin yalnızca kendi ilçe sınırlarına ait kayıtları görebilmelerini sağlamak, veri gizliliği politikalarının merkezinde yer alır."

---

## [Ders 14] 15:00 - 15:50 | İş Sürekliliği ve Performans

### [15:00 - 15:25] Felaket Kurtarma (PITR) ve Replikasyon
**(Kritik Soru: WAL logları, veri kurtarma operasyonlarında ne tür bir esneklik sağlar?)**

**Teorik Anlatım:**
"İş sürekliliği planlamasında (Business Continuity) veri kaybı toleransı sıfıra yakındır. Sistem logları (WAL) aracılığıyla yapılandırılan Zamanda Geriye Dönüş Kurtarması (PITR), operatör hatalarında veritabanını belirli bir saniyeye kadar geri alabilme olanağı tanır. Kritik veriler uzak sunuculara anlık olarak (Streaming Replication) çoğaltılmalıdır."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Şema Yedeği Al
*   **Uygulama Adımları:** `pg_dump` kullanılarak spesifik bir mekansal tablonun yedeği (backup) alınır.

### [15:25 - 15:50] PgBouncer ve Canlı İzleme
**(Kritik Soru: Eşzamanlı kullanıcı istekleri yoğunlaştığında PgBouncer sunucu sağlığını nasıl korur?)**

**Teorik Anlatım:**
"Eşzamanlı trafik arttığında her istek sunucunun belleğini zorlar. Bağlantı havuzlama (`PgBouncer`) bu istekleri düzenler. Uzun süren bloklayıcı sorguların tespiti için `pg_stat_activity` görünümleri monitörize edilmelidir."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Sorguyu Öldür
*   **Uygulama Adımları:** `SELECT * FROM pg_stat_activity;` ile asılı kalan bir sorgu bulunur ve `pg_terminate_backend(pid)` ile sonlandırılır.

---

## [Ders 15] 16:00 - 16:50 | Final Projesi ve Kapanış

### [16:00 - 16:30] Capstone Projesi: Konya Acil Durum Analizi
**(Kritik Soru: Mekansal veri seti analizlerinin GeoJSON olarak dışa aktarılması entegrasyona nasıl katkı sağlar?)**

**Teorik Anlatım:**
"Eğitim sürecimizin finalinde, PostgreSQL'in kararlılığı ile mekansal zekayı birleştiriyoruz. Milyonlarca satırlık veriyi Spatial Join ile zenginleştirip risk haritalarını çıkartacağız. Üretilen bilginin web servisleri tarafından okunabilmesi için `GeoJSON` formatında sunulması kurumsal entegrasyonun standartlarındandır."

**Canlı Uygulama / Görev (20 Dakika):**
*   **Görev:** Nüfus Analizi ve GeoJSON Çıktı
*   **Uygulama Adımları:** Hastane veya itfaiyeye uzak olan mahallelerin nüfus sayıları SQL ile tespit edilir ve `ST_AsGeoJSON` kullanılarak web servisine hazır hale getirilir.

### [16:30 - 16:50] Kapanış: Unified Mobility ve Vizyon
"Kurumsal veritabanı yönetiminin sınırlarını incelediğimiz bu süreçte; ham koordinatların optimize edilmiş tablolara, bu tabloların ise analitik karar destek sistemlerine nasıl dönüştüğünü deneyimledik. Kurulan bu yapı, Konya'nın mekansal verimlilik hedeflerine ulaşmasında temel mühendislik standardı olarak hizmet edecektir. Katılımlarınız için teşekkür ederiz."
