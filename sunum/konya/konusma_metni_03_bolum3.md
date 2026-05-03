# PostGIS Akademi: Bölüm 3 - Production, Ağ Analizi ve Proje
**Konuşma Metni ve Sahne Notları**

---

### [Açılış Anekdotu - Sahneye Çıkış]
"Uluslararası lojistik ağları yöneten kurumlar, büyük ölçekli optimizasyon problemleriyle her gün yüzleşmektedir. Örneğin, global dağıtım şirketi UPS'in 'Asla sola dönme' kuralı basit bir şoför inisiyatifi değildir; milyonlarca rota ve kesişim noktasının analiz edildiği karmaşık bir ağ algoritmasının (network routing) çıktısıdır. Sağa dönüşlerin optimize edilmesiyle kurum, operasyon sürelerini kısaltırken yıllık yakıt maliyetlerini ve emisyon oranlarını büyük ölçüde düşürmüştür. Bu durum, coğrafi bilgi sistemlerinin yalnızca bir depolama ünitesi değil, verimlilik ve strateji üreten karar destek sistemleri olduğunu göstermektedir. Veriyi anlamlandırıp optimum kararları üretecek ağ algoritmalarını sistemlerimize nasıl entegre edeceğimiz konusuna geçiş yapıyoruz."

---

## Ders İçeriği / Akış Planı

### 3.1 — Mekansal Gruplama ve Yoğunluk Analizi
**(Kritik Soru: Veri kümelerinin analizinde DBSCAN algoritması, geleneksel ısı haritalarına göre hangi analitik üstünlüklere sahiptir? | Görev: Durak Kümeleme ve Yoğunluk Tespiti)**

Büyük ölçekli şehir verilerini anlamlı birimlere ayırmak, stratejik planlamanın ön koşuludur. Dağınık veri noktalarının servis bölgelerine bölünmesi gerektiğinde `KMeans` algoritması matematiksel bir denge sağlar. Ancak suç istatistikleri veya kaza noktaları gibi yoğunluk (density) tabanlı analizler söz konusu olduğunda `DBSCAN` algoritması öne çıkar. Veriler gösteriyor ki, geleneksel ısı haritaları görsel bir izlenim sunarken, DBSCAN algoritmaları bağımsız gürültü verisini (noise) izole ederek karar süreçlerinde kullanılabilecek vektörel kümeler üretir. Analitik verimliliği sağlamak için mekansal kümeleme senaryolarını uyguladıktan sonra, bu noktalar arasında kuracağımız ulaşım ağının prensiplerine odaklanmalıyız.

### 3.2 — pgRouting: Ağ Analizi Temelleri
**(Kritik Soru: Ağ üzerinde çıkmaz sokakların (dead ends) bulunması algoritmik süreci nasıl etkiler? | Görev: Topoloji Hazırla ve Ambulans Rotası Çiz)**

Yol ağları veritabanında salt geometriler olarak tutulsa da, bu çizgilerin üzerinden geçilebilir bir rota oluşturabilmesi için grafik teorisine (Graph Theory) uyarlanması gerekir. `pgRouting` kütüphanesi, çizgileri düğümlere (node) bağlayarak aralarındaki seyahat mesafesini veya zamanını (cost) modellere işler. Mevcut analizler ortaya koyuyor ki, çıkmaz yolların veya kesişmeyen (topology error) çizgilerin temizlenmesi, Dijkstra gibi algoritmaların tutarlı sonuç vermesi için zorunludur. Düğüm noktalarımızı hazırladık ve rotalarımızı kurguladık. Peki, bir aracın belirli bir maliyet bütçesi (zaman/mesafe) ile gidebileceği maksimum erişim alanını nasıl hesaplarız?

### 3.2 — Servis Alanı ve Çoklu Durak (TSP)
**(Kritik Soru: Hizmet erişim alanları belirlenirken, geometrik buffer yaklaşımı neden yanıltıcı sonuçlar doğurur? | Görev: İtfaiye Kapsama Alanı ve Çöp Toplama Rotası)**

Bir acil durum merkezinin 5 dakikalık yanıt süresi (response time) içinde hangi alanlara ulaşabileceği hesaplanırken havadan çizilen dairesel yarıçaplar (buffer) gerçekliği yansıtmaz. Coğrafi engeller ve tek yönlü sokaklar erişimi sınırlar. Bunun yerine `pgr_drivingDistance` fonksiyonu, yol ağının fiziksel kısıtlamalarını hesaba katarak gerçek bir hizmet poligonu oluşturur. Benzer şekilde, çoklu nokta ziyaretleri planlanırken Gezgin Satıcı Problemi (TSP) çözümleri kullanılarak, rotaların maliyeti minimize edilir. Dağıtım ve lojistik optimizasyonunu tamamladıktan sonra, kullanılan kaynak verilerin (yol ve parsel sınırları) geometrik doğruluğunu sistemsel olarak nasıl garanti edeceğimizi belirlemeliyiz.

### 3.3 — PostGIS Topology: Veri Bütünlüğü
**(Kritik Soru: Topoloji kuralları kullanılarak mekansal hatalar (gap/overlap) nasıl proaktif olarak engellenir? | Görev: Şemayı Kur ve Sınırı Düzenle)**

Coğrafi bilgi sistemlerinde veri doğruluğu, üretim ortamının en hassas noktasıdır. Parsellerin veya idari sınırların bağımsız poligonlar olarak çizilmesi, zamanla aralarında boşlukların (gap) veya çakışmaların (overlap) oluşmasına yol açar. Topolojik veri modellerinde ise poligonlar çizilmez; bunun yerine ortak sınır çizgileri (edge) tanımlanır. Komşu parseller aynı çizgiyi paylaştığı için, bir sınır değiştiğinde ilgili tüm yüzeyler otomatik güncellenir. Sistemsel tutarlılığı bu seviyede güvence altına aldıktan sonra, veri güvenliği ve kullanıcı erişim politikalarına geçiş yapıyoruz.

### 3.4 — Kurumsal Yetki, RLS ve Güvenlik
**(Kritik Soru: Veritabanı güvenlik politikalarında neden veri erişimi satır bazında (Row Level) kontrol edilmelidir? | Görev: Güvenlik Duvarı ve Read-Only Kullanıcı)**

Gelişmiş kurumsal veritabanlarında, kullanıcı yetkilendirmesi tablonun ötesine geçmelidir. Veriler gösteriyor ki, okuma (SELECT) ve yazma (UPDATE/INSERT) yetkilerinin rollerle sınırlandırılması bir zorunluluktur. Ayrıca, Mekansal Satır Bazlı Güvenlik (Row Level Security - RLS) ile farklı bölgelerdeki yöneticilerin yalnızca kendi sorumlu oldukları ilçe veya mahalle sınırlarına ait kayıtları görebilmelerini sağlamak, veri gizliliği politikalarının merkezinde yer alır. Veri bütünlüğünü ve erişim yetkilerini kurguladık. Sistem kesintisi veya veri kaybı risklerine karşı felaket kurtarma senaryolarımızı nasıl planlıyoruz?

### 3.5 — Felaket Kurtarma (PITR) ve Replikasyon
**(Kritik Soru: WAL logları, veri kurtarma operasyonlarında ne tür bir esneklik sağlar? | Görev: Şema Yedeği Al ve Kurtarma Planı Yap)**

İş sürekliliği planlamasında (Business Continuity), veri kaybı toleransı sıfıra yakındır. Sunucu mimarilerinde `pg_dump` gibi mantıksal yedeklemelerin ötesine geçmek gerekir. Sistem logları (WAL) aracılığıyla yapılandırılan Zamanda Geriye Dönüş Kurtarması (Point-In-Time Recovery - PITR), operatör hatalarında veritabanını belirli bir saniyeye kadar geri alabilme olanağı tanır. Ayrıca kritik veriler, uzak sunuculara anlık olarak (Streaming Replication) çoğaltılmalıdır. Felaket senaryoları taslaklarımızı tamamladık. Son olarak, sistemin eşzamanlı kullanıcı trafiği altında sorunsuz işlemesini nasıl güvence altına alacağımıza değinelim.

### 3.5 — PgBouncer ve Canlı İzleme
**(Kritik Soru: Eşzamanlı kullanıcı isteklerinin yoğunlaştığı durumlarda PgBouncer havuzu sunucu sağlığını nasıl korur? | Görev: Havuz Analizi ve Sorguyu Öldür)**

Uygulamaların eşzamanlı (concurrent) trafiği arttığında, her bir istek sunucunun bellek kaynaklarını (RAM) zorlar. Bağlantı havuzlama çözümleri (`PgBouncer`), bu istekleri düzenleyerek sistem kaynaklarını dengeler. Bununla birlikte, uzun süren veya kaynak tüketen bloklayıcı sorguların anlık tespiti için `pg_stat_activity` görünümleri monitörize edilmeli ve operasyon ekipleri müdahale yöntemlerine hakim olmalıdır. Sistem sağlığı ve performans denetimi sağlandığına göre, bu teknolojilerin sahadaki pratik kullanımını test etme aşamasına geçebiliriz.

### 3.6 — Proje: Konya Acil Durum Analizi
**(Kritik Soru: Mekansal veri seti analizlerinin GeoJSON olarak dışa aktarılması sistem entegrasyonuna nasıl katkı sağlar? | Görev: Nüfus Analizi ve Risk Raporu)**

Veri mimarileri ve ağ analizlerini tamamladıktan sonra, üretilen bilginin diğer kurumsal arayüzlerle paylaşılması esastır. Mekansal istatistiklerin `Spatial Join` yardımıyla bir araya getirilip analiz edilmesi ve sonuçların modern web servisleri tarafından doğrudan okunabilmesi için `GeoJSON` formatında sunulması kurumsal entegrasyonun standartları arasındadır. Entegrasyon süreçlerini standartlaştırdıktan sonra, veri akışını farklı bir seviyeye taşıyan mikroservis yaklaşımlarını inceleyeceğiz.

### 3.7 — Capstone: Konya Unified Mobility
**(Kritik Soru: Gerçek zamanlı sistemlerde indeksleme stratejileri veri akışkanlığını nasıl etkiler? | Görev: Mikroservis Planla)**

Eğitim sürecimizin finalinde, PostgreSQL'in sağladığı kararlılık ile modern programlama dillerinin dinamizmini birleştiriyoruz. Gerçek zamanlı (real-time) veri akışlarında oluşabilecek gecikme (latency) sorunları, doğru partition ve indeks yapılandırması ile optimize edilmektedir. Tasarlanan bu mikroservis tabanlı veri platformu, büyük hacimli akışların dahi sorunsuz işlenmesine ve analizine zemin hazırlar.

Kurumsal veritabanı yönetiminin sınırlarını incelediğimiz bu süreçte; ham koordinatların optimize edilmiş tablolara, bu tabloların ise analitik karar destek sistemlerine nasıl dönüştüğünü deneyimledik. Kurulan bu yapı, kurumun mekansal verimlilik hedeflerine ulaşmasında temel mühendislik standardı olarak hizmet edecektir.
