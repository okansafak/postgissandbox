# PostGIS Akademi: Bölüm 0 - SQL'e Giriş
**Konuşma Metni ve Sahne Notları**

---

### [Açılış Anekdotu - Sahneye Çıkış]
"Ekim 2020. Pandemi süreci, veri yönetimi altyapılarının küresel ölçekteki güvenilirliğini test eden zorlu bir dönemdi. Türkiye'de sağlık verileri, gelişmiş veritabanı mimarileri üzerinde işlenerek ısı haritalarına yansıtılırken; İngiltere Sağlık Bakanlığı, pozitif vaka kayıtlarını '.xls' formatında tutuyordu. Eski Excel sürümünün 65.536 satır sınırına ulaşması sonucu, sistem herhangi bir uyarı vermeden yeni verileri kaydetmeyi durdurdu. Analizler gösteriyor ki, 16.000'den fazla vaka kaydı sistemden silindi ve filyasyon süreçleri ciddi anlamda aksadı. Bu olay, kurumsal ölçekteki kritik verilerin standart ofis programlarıyla yönetilemeyeceğini açıkça ortaya koymaktadır. Karar destek mekanizmalarının güvenilirliği, verinin işlendiği platformun dayanıklılığına bağlıdır."

---

## Ders İçeriği / Akış Planı

### 0.1 — Veritabanı Nedir?
**(Kritik Soru: Kurumsal ölçekte neden tablolama yazılımları yerine ilişkisel veritabanları tercih edilir? | Görev: Mevcut Bağlantıyı Kontrol Et)**

Sistem eğitimimizin ilk adımında veri mimarisinin temellerine iniyoruz. Veriler gösteriyor ki, ilişkisel veritabanları (RDBMS), basit tablolama yazılımlarından yapısal olarak farklıdır. Veritabanı yönetim sistemleri, binlerce kullanıcının eşzamanlı olarak veri okumasına ve yazmasına olanak tanıyan asenkron bir mimari sunar. PostgreSQL, gelişmiş veri bütünlüğü standartları ve işlem güvenilirliği ile öne çıkar. Yüksek hacimli verilerin filtrelenmesi ve indekslenmesi süreçlerinde tutarlılığı garanti eder. İlk adımımız olarak, `SELECT current_user, current_database();` komutunu çalıştırarak sistem bağlantımızı ve yetki seviyelerimizi doğrulayacağız. Güvenilir bir bağlantı kurduktan sonra, çalışma ortamımızın standartlarını nasıl garanti altına alacağımızı incelemeliyiz.

### 0.2 — Kurulum ve Veri Seti
**(Kritik Soru: Geliştirme ortamlarında Docker kullanımının kurumsal faydaları nelerdir?)**

Mevcut analizler ortaya koyuyor ki, altyapı farklılıkları (dependency hell), yazılım süreçlerindeki en büyük zaman kayıplarından biridir. Bu tutarsızlığı gidermek amacıyla eğitim ortamımızı Docker mimarisi üzerine kurguladık. Standardize edilmiş bir Docker Container, donanımdan bağımsız olarak aynı PostgreSQL ve PostGIS versiyonlarının çalışmasını güvence altına alır. İzole edilmiş bu ortam, kurulum hatalarını minimize ederek doğrudan veri yönetimine odaklanmamızı sağlar. Kurulum aşaması tamamlandığında, sisteme kaydedilecek olan bilginin niteliği önem kazanır. Veri yapılandırmasında hangi standartları kullanacağımızı nasıl belirliyoruz?

### 0.3 — PostgreSQL Veri Tipleri
**(Kritik Soru: NUMERIC ve REAL veri tipleri arasındaki yapısal fark nedir? | Görev: Personel Tablosu Tasarla)**

Veri kalitesi, uygun veri tipinin seçimiyle başlar. Finansal veriler ve bütçe planlamaları gibi kesinlik gerektiren durumlarda, yuvarlama hatalarına açık olan `REAL` veya `FLOAT` tipleri yerine, hassasiyeti yüksek `NUMERIC` tipi kullanılmalıdır. Standart metinler için `TEXT`, zaman bilgileri için ise coğrafi konum farklılıklarını yönetebilen `TIMESTAMPTZ` tercih edilir. Yapılandırılacak "Personel" tablosunda uygun veri tiplerinin kullanılması, ilerleyen süreçlerdeki sorgu performansını doğrudan etkileyecektir. Şemamızı ve veri tiplerimizi tanımladıktan sonra, bu tablolardan istenilen bilgiyi nasıl güvenle sorgulayacağımızı analiz etmeliyiz.

### 0.4 — SELECT ve Sütun Seçimi
**(Kritik Soru: Okuma işlemleri veritabanı üzerinde kilitlenmeye yol açar mı? | Görev: Sütunları Yeniden Adlandır)**

Veritabanıyla iletişimin temel bileşeni `SELECT` komutudur. Bu komut salt okunur bir işlem gerçekleştirir ve disk üzerindeki orijinal veriyi değiştirmez. PostgreSQL'in MVCC (Multi-Version Concurrency Control) mimarisi sayesinde okuma işlemleri, yazma işlemlerini engellemeden eşzamanlı olarak yürütülebilir. Görevimiz kapsamında, `konya.mahalleler` tablosundaki verileri çağıracak ve `AS` ifadesiyle çıktı sütunlarını yeniden adlandıracağız. Ancak kurum içi raporlamalarda tüm tabloyu çağırmak verimsizdir. Büyük veri setleri içerisinden sadece hedef kriterlere uyan kayıtları nasıl izole edeceğiz?

### 0.5 — WHERE ile Filtreleme
**(Kritik Soru: Metin filtrelemelerinde LIKE ve ILIKE operatörleri ne zaman tercih edilmelidir? | Görev: Karatay Mahallelerini Bul)**

Analitik süreçlerin verimliliği, filtrelenen verinin doğruluğuna bağlıdır. `WHERE` koşulu, sunucu tarafında veri kümesini daraltarak ağ trafiğini azaltır ve işlemci yükünü optimize eder. Metin tabanlı sorgulamalarda, büyük/küçük harf duyarlılığı gerektiğinde `LIKE`, duyarsız aramalarda ise PostgreSQL'e özgü olan `ILIKE` operatörü kullanılır. Görevimiz, sadece 'Karatay' ilçesine bağlı mahalleleri izole edecek bir filtre tasarlamaktır. Doğru veriyi ayıkladık. Peki, elde edilen sonuç kümesinin sunucu belleğini zorlamadan kullanıcıya iletilmesini nasıl sağlarız?

### 0.6 — ORDER BY ve LIMIT (Sıralama)
**(Kritik Soru: Büyük veri setlerinde LIMIT kullanımı donanım kaynaklarını nasıl korur? | Görev: En Az Nüfuslu 3 Mahalle)**

İş zekası raporlarında genellikle verinin tamamı değil, en belirgin olan belirli bir yüzdesi talep edilir. Sorgu sonuçlarını istemci (client) tarafında sıralamak, ağ bandı ve bellek kapasitesi açısından verimsizdir. `ORDER BY` komutu kullanılarak veri sunucu seviyesinde sıralanmalı ve ardından `LIMIT` operatörüyle sınırlandırılmalıdır. Bu yaklaşım, sistem kaynaklarının optimum düzeyde kullanılmasını sağlar. Görevimiz doğrultusunda, nüfusu en az olan 3 mahalleyi listeleyeceğiz. Satır bazlı incelemeleri tamamladığımızda, yöneticilerin sıklıkla ihtiyaç duyduğu makro seviyedeki istatistiksel özetleri nasıl üreteceğimize geçebiliriz.

### 0.7 — Toplama Fonksiyonları
**(Kritik Soru: NULL değerlerin agregasyon fonksiyonlarındaki etkisi nedir? | Görev: Ortalama Nüfusu Bul)**

Kurumsal analizlerde bütüncül bir perspektif sağlamak için `COUNT`, `SUM` ve `AVG` gibi agregasyon fonksiyonları (Toplama Fonksiyonları) kullanılır. Veriler gösteriyor ki, istatistiksel hesaplamalarda veri bütünlüğüne dikkat edilmelidir. Örneğin, `COUNT(*)` komutu tüm kayıtları sayarken, `COUNT(sütun_adı)` komutu sadece içinde veri olan satırları işler. NULL değerlerin analize etkisini göz ardı etmek, hatalı yönetim raporlarına sebep olabilir. Konya'nın ortalama mahalle nüfusunu hesapladıktan sonra, bu istatistiksel verileri daha anlamlı alt kategorilere nasıl ayıracağımızı incelemeliyiz.

### 0.8 — GROUP BY ve HAVING
**(Kritik Soru: Agregasyon sonuçları üzerinden filtreleme yapmak için neden WHERE kullanılamaz? | Görev: İlçelere Göre Toplam Nüfus)**

Veriyi demografik veya coğrafi kategorilere bölmek, analizlerin derinliğini artırır. `GROUP BY` komutu, veriyi ortak özniteliklere göre kümelendirir. Analizler gösteriyor ki, sık karşılaşılan hatalardan biri, gruplanmış verileri `WHERE` komutu ile filtrelemeye çalışmaktır. `WHERE` veri tablodan okunurken, `HAVING` ise veriler gruplandıktan sonra çalışır. İlçelere göre toplam nüfus kümelerini oluşturacak ve bu kümeleri analiz edeceğiz. Farklı özniteliklere sahip veri kümelerini izole edip grupladık. Peki, birbirlerinden farklı tablolarda duran bu veri setlerini bütüncül bir raporda nasıl birleştireceğiz?

### 0.9 — JOIN ve Tablo İlişkileri
**(Kritik Soru: İlişkisel ve mekansal birleştirmeler arasındaki kavramsal fark nedir? | Görev: Hastanesi Olmayan Mahalleleri Listele)**

İlişkisel veritabanlarının temel prensibi, tekrarı önlemek amacıyla veriyi farklı tablolarda normalize edilmiş şekilde tutmaktır. Ayrı tablolardaki bu veri, `JOIN` komutları ile anlamlı iş zekası raporlarına dönüştürülür. Standart `JOIN` işlemleri ID numaraları gibi mantıksal veya alfabetik eşleşmelere dayanırken; ileride göreceğimiz mekansal `JOIN` işlemleri geometrik kesişimler üzerinden hesaplanır. Mevcut görevimizde `LEFT JOIN` kullanarak, hastane verisi ile eşleşmeyen, yani sağlık altyapısı bulunmayan mahalleleri raporlayacağız. Okuma süreçlerini tamamladığımıza göre, mevcut veriyi güncellerken alınması gereken sistem güvenlik önlemleri nelerdir?

### 0.10 — Veri Yönetimi (DML)
**(Kritik Soru: Kurumsal veritabanlarında DELETE işlemi neden risk taşır? | Görev: Yanlış Kaydı Sil)**

Veritabanında veri okuma (DQL) süreci ne kadar güvenliyse, veri manipülasyon (DML) süreci de o kadar dikkat gerektirir. `UPDATE` ve `DELETE` işlemleri kalıcıdır. Koşulsuz (WHERE kullanılmayan) bir güncelleme işlemi tablodaki tüm verileri etkiler. Kurumsal prensipler doğrultusunda, izlenebilirlik (audit) amacıyla kayıtların fiziksel olarak silinmesi yerine `is_active` gibi bir durum bayrağıyla (flag) mantıksal olarak devre dışı bırakılması önerilir. Temel SQL yetkinliklerini kurumsal bir perspektifle pekiştirdiğimize göre, standart veritabanlarına mekansal analiz yeteneği katmanın detaylarına geçebiliriz.
