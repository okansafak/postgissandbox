# PostGIS Akademi: Bölüm 2 - Sorgular, İndeks ve Performans
**Konuşma Metni ve Sahne Notları**

---

### [Açılış Anekdotu - Sahneye Çıkış]
"2012 yılında, finans piyasalarının önemli aktörlerinden Knight Capital Group, yeni yazılım güncellemelerini üretim (production) ortamına aktardı. Ancak kod test süreçlerindeki ve veritabanı entegrasyonundaki optimizasyon hataları, sistemin saniyede binlerce hatalı döngü üretmesine yol açtı. Sorunun tespit edilip sistemlerin kapatılması 45 dakika sürdü. Bu süre zarfında, yavaş çalışan sorgular ve denetimsiz mimari sebebiyle kurum 440 Milyon Dolar finansal zarara uğradı. Afet lojistiği veya acil müdahale gibi şehir yönetimine dair kritik operasyonlarda da sistem gecikmelerinin maliyeti büyüktür. Mevcut analizler gösteriyor ki, veritabanı performansı yalnızca bir teknik gereksinim değil, kurumsal sürdürülebilirliğin ve operasyonel güvenliğin ana unsurudur."

---

## Ders İçeriği / Akış Planı

### 2.1 — Veri Yükleme ve Staging
**(Kritik Soru: Büyük veri setlerinin entegrasyonunda Staging yaklaşımı neden gereklidir? | Görev: CSV Yükle ve Staging'den Aktar)**

Kurumsal mimarilerde sistem performansını korumak, veri yükleme aşamasında alınacak stratejik kararlara bağlıdır. Ham verinin doğrudan aktif (production) tablolara yazılması, mevcut indeksleri zorlar ve kullanıcı sorgularında gecikmelere sebep olur. Endüstri standartları doğrultusunda, veriyi öncelikle bir ara belleğe (Staging) almalı ve doğrulama süreçleri tamamlandıktan sonra kontrollü paketler (Batch Processing) halinde ana sisteme aktarmalıyız. `ogr2ogr` veya `COPY` gibi toptan aktarım (bulk insert) araçları bu süreci optimize eder. Veriyi sisteme entegre ettik. Ancak aşırı detaylı ve büyük hacimli vektörel veriler, görüntüleme (render) süreçlerini yavaşlattığında çözümümüz ne olmalıdır?

### 2.2 — Geometri Optimizasyonu (Simplify ve Subdivide)
**(Kritik Soru: ST_Simplify işleminin topolojik bütünlük üzerindeki etkileri nelerdir? | Görev: Smoothing Uygula ve İl Sınırını Böl)**

Mekansal sorgulardaki dar boğazlar genellikle yüksek çözünürlüklü poligonlardan kaynaklanır. Çok sayıda düğüm noktasından (node) oluşan kompleks harita sınırları, indeks arama sürelerini uzatır. `ST_Simplify` ile nokta sayısını azaltmak bir yöntemdir; ancak bitişik parsellerde kullanıldığında sınırlar arasında topolojik boşluklara yol açabilir. Veriler gösteriyor ki, asıl performans kazanımı `ST_Subdivide` ile sağlanır. Bu fonksiyon, devasa bir poligonu belirlenen sınır dahilindeki (örneğin 255 nokta) alt parçalara bölerek GiST indeksinin doğruluğunu ve veri getirme hızını maksimize eder. Ağır veri katmanlarını hafiflettikten sonra, ağ üzerindeki belirli kilometre noktalarını (chainage) nasıl hesaplayacağımızı inceleyelim.

### 2.2 — Doğrusal Referanslama (Linear Referencing)
**(Kritik Soru: Doğrusal Referanslamada kullanılan M koordinatının analitik işlevi nedir? | Görev: Orta Nokta Bul ve En Yakın Sınırı Tespit Et)**

Karayolları, altyapı boru hatları veya demiryolları gibi ağ verileri analiz edilirken X ve Y koordinatları tek başına yetersiz kalır. Bir güzergah boyunca ölçüm yapmak için M (Measure) koordinatına ihtiyaç duyarız. Doğrusal referanslama (Linear Referencing) yöntemiyle, bir noktanın çizgi üzerindeki izdüşümünü (`ST_ClosestPoint`) ve yön açısını (`ST_Azimuth`) yüksek bir doğrulukla hesaplayabiliriz. Bu işlem altyapı arızalarının tespiti için hayati önem taşır. Geometrilerimizi ölçeklendirip referanslandırdık. Şimdi sistemin bu yüksek hacimli koordinat verisini filtrelerken nasıl bir arama stratejisi izlediğine bakalım.

### 2.3 — İndeksleme ve Bounding Box Operatörleri
**(Kritik Soru: Mekansal sorgularda Bounding Box (&&) operatörünün maliyet avantajı nedir? | Görev: İndeks Oluştur ve Kutu Sorgusu Yap)**

PostGIS'in sorgu yeteneğinin temeli GiST (Generalized Search Tree) mimarisine dayanır. Karmaşık topolojik işlemler (örneğin kesişim kontrolü) yüksek işlemci gücü gerektirir. Bunu optimize etmek için veritabanı, geometriyi kapsayan sanal bir zarf (Bounding Box) oluşturur ve önce bu zarfların birbiriyle çakışıp çakışmadığını (`&&` operatörü ile) test eder. Veriler gösteriyor ki, zarf seviyesinde yapılan bu ön eleme, gereksiz matematiksel hesaplamaları önleyerek performansı önemli oranda artırır. Arama stratejimiz belirlendi. Peki veritabanı motorunun, indeks kullanımını istatistiksel verilere göre nasıl yönlendirdiğini biliyor muyuz?

### 2.3 — Partial İndeksler ve ANALYZE
**(Kritik Soru: Sorgu planlayıcısının veritabanı istatistiklerini güncel tutması neden kritiktir? | Görev: Partial İndeks Kur ve İndeksleri Takip Et)**

Tüm tablo üzerine oluşturulan indeksler yazma maliyetlerini artırır. Kurumsal süreçlerde sadece belirli koşulları sağlayan, örneğin `is_active = true` olan kayıtları indekslemek (Partial İndeks) disk I/O operasyonlarını ciddi ölçüde azaltır. Ancak oluşturduğunuz indeksler tek başına yeterli değildir; PostgreSQL'in istatistik havuzunun güncel olması gerekir. `ANALYZE` komutu düzenli çalıştırılmadığında, sorgu planlayıcısı indeksleri kullanmaktan vazgeçebilir. İstatistiksel sağlığı güvenceye aldığımıza göre, yazılan bir sorgunun performans metriklerini adım adım nasıl ölçebileceğimizi analiz etmeliyiz.

### 2.4 — EXPLAIN ANALYZE ve Sorgu Planlaması
**(Kritik Soru: Sorgu planlamasındaki Tahmin (Planning) ile Gerçek (Execution) süreleri arasındaki sapmalar ne anlama gelir? | Görev: Plan Çıkart ve Maliyet Düşür)**

Mekansal SQL operasyonlarında performansı değerlendirmenin analitik yöntemi `EXPLAIN ANALYZE` komutudur. Bu araç, yazılan sorgunun çalışma algoritmasını (Execution Plan) ortaya koyar. Sequential Scan (Tüm Tablo Okuması) mı yapılıyor, yoksa veri doğrudan Index Scan ile mi hedefleniyor? Mevcut analizler ortaya koyuyor ki, yüksek maliyetli sorguların incelenmesi ve darboğazların tespit edilmesi, veri altyapılarının sürdürülebilirliği için zorunludur. Sorgu planlarını inceledik. Bu aşamada, mekansal veritabanı geliştirmelerinde en sık rastlanan tasarım hatalarından birini nasıl çözeceğimize bakalım.

### 2.4 — ST_Distance Anti-Pattern
**(Kritik Soru: Yakınlık analizlerinde DWithin fonksiyonu indeks performansını nasıl optimize eder? | Görev: Sorguyu Düzenle ve YAML Çıktısı Al)**

Mekansal SQL yazımındaki en yaygın performans hatası (anti-pattern), mesafe kontrollerinde `ST_Distance` fonksiyonunun filtre (WHERE) koşulunda kullanılmasıdır. Bu yaklaşım GiST indeksini göz ardı ederek sistemin tam tablo araması yapmasına neden olur. Optimum mimarilerde, çap kontrolü yapan ve indeksi tetikleyen `ST_DWithin` fonksiyonu standart kabul edilmelidir. Performans iyileştirmelerini sağladık ve sorgu anatomisini çözdük. Peki, aktif olarak güncellenen veri tablolarında, fiziksel disk alanının zamanla gereksiz yere büyümesini nasıl engelleriz?

### 2.5 — VACUUM, Bloat ve Partitioning
**(Kritik Soru: Veritabanı yönetiminde Partition Pruning, büyük hacimli sorguları nasıl hızlandırır? | Görev: Bakım Planla ve Partition Oluştur)**

PostgreSQL mimarisi güncellenen veya silinen satırları diskten anında silmez (MVCC); bu da tabloların zamanla gereksiz büyümesine (Bloat) neden olur. `VACUUM` süreçleri bu alanları yeniden kullanılabilir hale getirir. Diğer bir performans stratejisi ise Tablo Bölümleme (Partitioning) yöntemidir. Konya örneğinde, veriyi tek bir tablo yerine ilçelere göre fiziksel bölümlere ayırdığımızda; sorgu motoru sadece talep edilen bölüme bakar ve diğerlerini görmezden gelir (Partition Pruning). Performans süreçlerimizi standardize ettiğimize göre, bu verimli altyapı üzerinde ağ teorisi ve ileri analitik algoritmalarını kurmak için hazırız.
