# PostGIS Akademi: Bölüm 1 - Spatial SQL Fundamentals
**Konuşma Metni ve Sahne Notları**

---

### [Açılış Anekdotu - Sahneye Çıkış]
"Orman yangınlarıyla mücadelede eski yaklaşımlar, sadece rüzgarın yönüne ve gözleme dayalı müdahale planlarından ibaretti. Raporlamalar, etkilenen hektar bazında sayısal özetlerle sınırlı kalıyordu. Günümüzde ise modern afet yönetim merkezleri, anlık veri analitiği kullanmaktadır. İnsansız hava araçlarından alınan sensör verileri, arazi eğimi, rüzgar koridorları ve coğrafi engeller gibi parametrelerle mekansal bir veritabanında entegre ediliyor. Veriler gösteriyor ki, bu parametrelerin uzamsal ilişkileri analiz edildiğinde yangının yayılım yönü saatler öncesinden hesaplanabilmektedir. Sayısal veri, mekansal bir zemine oturtulduğunda karar destek mekanizmalarını proaktif hale getirir. Elde edilen bilgiyi coğrafi zeka ile birleştiren bu analitik yapının çalışma prensiplerini incelemeye başlıyoruz."

---

## Ders İçeriği / Akış Planı

### 1.1 — Platform: Docker ve pglite
**(Kritik Soru: İstemci tarafı (client-side) veritabanı çözümleri üretim ortamları için neden yetersiz kalır? | Görev: Docker Container'a Bağlan)**

Konumsal veri işleme sistemlerini yapılandırırken, kullanılacak altyapı aracının seçimi sistemin genel güvenilirliğini etkiler. İstemci tarafında veya tarayıcı belleğinde çalışan hafif çözümler (pglite gibi) eğitim ve prototip aşamaları için uygun olabilir; ancak mevcut analizler ortaya koyuyor ki, yüksek işlem hacmi gerektiren üretim (production) süreçlerinde bu çözümler yeterli performansı sağlayamaz. Bu sebeple eğitimimizi, kurum mimarisine uygun şekilde yapılandırılmış Docker konteynerleri üzerinden gerçekleştireceğiz. Bağlantımızı doğruladıktan sonra, bu sistemin veriyi fiziksel depolama ünitelerinde nasıl yönettiğini analiz edeceğiz.

### 1.2 — PostgreSQL Veri Mimarisi ve Tablespace
**(Kritik Soru: MVCC mimarisi, okuma ve yazma işlemlerinde eşzamanlılığı nasıl sağlar? | Görev: Tablo Alanlarını İncele)**

Veritabanı yöneticileri için, verinin fiziksel olarak diskte nasıl organize edildiğini bilmek performans optimizasyonunun ilk adımıdır. PostgreSQL, farklı veri türlerini ayrı fiziksel konumlara yönlendirmek için `Tablespace` yapısını kullanır. Örneğin, yüksek I/O gerektiren mekansal indeksleri daha hızlı depolama birimlerine taşıyarak sorgu gecikmeleri azaltılabilir. Buna ek olarak, sistemin MVCC mimarisi okuma ve yazma operasyonlarının birbirini engellemesini önleyerek veri bütünlüğünü sağlar. Depolama mantığını anladıktan sonra, bu disk alanlarında işlenecek konumsal varlıkların standartlarını nasıl tanımlamalıyız?

### 1.3 — Geometri Tipleri ve ST_IsValid
**(Kritik Soru: Makine ve insan tarafından okunabilen geometri formatları nelerdir? | Görev: Çoklu Geometri Çiz ve Onar)**

Veritabanları mekansal analizler yaparken standartlaştırılmış geometri tanımlamalarına ihtiyaç duyar. Geometriler, metin formatı olarak WKT (Well-Known Text) veya işlemci performansını artıran ikili format olan WKB (Well-Known Binary) ile depolanır. Ancak veri entegrasyonu süreçlerinde en kritik aşama, içe aktarılan geometrilerin yapısal geçerliliğidir. Kendi üzerine katlanan çizgiler veya çakışan düğüm noktaları (invalid geometries) analiz süreçlerinde hatalı hesaplamalara yol açar. Veriler gösteriyor ki, operasyonel veri setlerinde mutlaka `ST_IsValid` kontrolleri yapılmalı ve sorunlu nesneler `ST_MakeValid` ile onarılmalıdır. Onarılan geometrilerin doğruluğu sağlandığına göre, bu nesnelerin dünya üzerindeki mutlak konumunu nasıl sabitleyeceğiz?

### 1.4 — SRID ve Projeksiyon Sistemleri
**(Kritik Soru: Geography veri tipi ile Geometry veri tipi arasındaki hesaplama farklılığı nedir? | Görev: Konya'yı Metrik Sisteme Taşı)**

Küresel yüzeylerin dijital ekranlara veya veritabanı tablolarına aktarılması projeksiyon sistemleri (SRID) ile mümkündür. GPS sistemlerinin varsayılan standardı olan EPSG:4326 sistemi açısal değerler kullanır. Mevcut analizler gösteriyor ki, doğru mesafe ve alan ölçümleri yapmak için bu verilerin metrik sisteme dönüştürülmesi şarttır. Bu süreç `ST_Transform` komutu kullanılarak gerçekleştirilir ve yerel projeksiyonlara (örneğin EPSG:5254) geçiş yapılır. Sistem, Geography veri tipiyle küresel hesaplamalar, Geometry veri tipiyle ise düzlemsel hesaplamalar gerçekleştirir. Uygun projeksiyon sistemini seçtikten sonra, bu geometrilerin uzaysal ortamdaki karşılıklı ilişkilerini nasıl sorgulayacağız?

### 1.5 — Mekansal İlişkiler ve JOIN
**(Kritik Soru: ST_Intersects ve ST_Contains fonksiyonları sorgu optimizasyonunda nasıl konumlandırılır? | Görev: Hastane Hangi Mahallede?)**

Konumsal analizin asıl katma değeri, bağımsız veriler arasındaki geometrik etkileşimleri tespit etmesidir. İki farklı veri kümesinin sınır veya yüzey çakışmaları, `ST_Intersects` veya `ST_Contains` gibi mantıksal operatörler ile belirlenir. Bu operatörler SQL'in yapısal `JOIN` komutlarıyla birleştiğinde (Spatial Join), bir hastanenin hangi idari sınırlar içerisinde yer aldığı ID eşleştirmesiyle değil, koordinatların matematiksel kesişimiyle tespit edilir. Kurumsal veritabanlarında, mekansal birleştirmeler analitik raporlamanın temel taşıdır. İdari ilişkileri kurduğumuza göre, bu veriler üzerindeki fiziksel ölçüm ve yakınlık analizlerini nasıl yürüteceğiz?

### 1.6 — Ölçüm, Buffer ve KNN
**(Kritik Soru: Uzaklık temelli sorgularda performans kaybını önlemek için KNN indeksi nasıl kullanılır? | Görev: En Yakın 5 Binayı Bul)**

Mekansal ölçüm işlemlerinde en sık karşılaşılan sorunlar, doğru referans noktalarının veya fonksiyonların kullanılmamasıdır. Örneğin, etiketleme işlemlerinde alanın ağırlık merkezi yerine (`ST_Centroid`), poligonun içerisine düşmesi garanti edilen yüzey noktası (`ST_PointOnSurface`) tercih edilmelidir. Etki alanı analizlerinde ise `ST_Buffer` ile geometrik genişlemeler hesaplanır. Kritik karar alma süreçlerinde (örneğin "En yakın itfaiye istasyonu hangisi?" sorgusunda), tüm veriyi tarayan klasik mesafe fonksiyonları yerine, GiST indeksini doğrudan kullanarak saniyeler içinde sonuç döndüren KNN operatörü (`<->`) kullanılmalıdır. Algoritma temelini anladık; peki veri hacmi büyüdükçe bu sorguların performansını nasıl sabit tutacağız? Bölüm 2'de veritabanı optimizasyon stratejilerine odaklanıyoruz.
