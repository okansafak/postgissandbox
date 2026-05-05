# PostGIS Akademi: Bölüm 0 - SQL'e Giriş
**1. Gün (2., 3., 4. ve 5. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Açılış] 10:45 - 11:00 | Tanışma ve Beklentiler

### Tanışma ve Ekosistem Analizi
**Eğitmen Notu:** Teknik detaylara girmeden önce ekibin profilini anlamak ve eğitimi bu ihtiyaçlara göre şekillendirmek kritik öneme sahiptir.

**Yöneltilecek Sorular:**
1. **Birim ve Görev:** Hangi birimden geliyorsunuz ve temel çalışma alanınız nedir? (Ulaşım, İmar, Bilgi İşlem, Fen İşleri vb.)
2. **Teknik Tecrübe:** Daha önce SQL veya PostgreSQL ile çalıştınız mı? PostGIS veya genel CBS (GIS) araçlarına (QGIS, ArcGIS vb.) ne kadar aşinasınız?
3. **Veri Yönetimi:** Şu an mekansal verilerinizi nerede tutuyorsunuz? (Shapefile, Excel, Oracle, MSSQL vb.)
4. **Projeler ve İhtiyaçlar:** Aktif projelerinizde mekansal verileri nasıl kullanıyorsunuz? Bu eğitimden sonra veritabanı üzerinde çözmek istediğiniz özel bir problem (analiz, hız, güvenlik vb.) var mı?

---

## [Ders 2] 11:00 - 11:50 | Veritabanı Mantığı ve Veri Tipleri

### [11:00 - 11:15] Açılış Anekdotu ve Veritabanı Nedir?
**(Kritik Soru: Kurumsal ölçekte neden tablolama yazılımları yerine ilişkisel veritabanları tercih edilir?)**

**Teorik Anlatım:**
"Ekim 2020. Pandemi süreci, veri yönetimi altyapılarının küresel ölçekteki güvenilirliğini test eden zorlu bir dönemdi. Türkiye'de sağlık verileri, gelişmiş veritabanı mimarileri üzerinde işlenerek ısı haritalarına yansıtılırken; İngiltere Sağlık Bakanlığı, pozitif vaka kayıtlarını '.xls' formatında tutuyordu. Eski Excel sürümünün 65.536 satır sınırına ulaşması sonucu, sistem herhangi bir uyarı vermeden yeni verileri kaydetmeyi durdurdu. Analizler gösteriyor ki, 16.000'den fazla vaka kaydı sisteme dahil edilemedi ve filyasyon süreçleri ciddi anlamda aksadı. Bu olay, kurumsal ölçekteki kritik verilerin standart ofis programlarıyla yönetilemeyeceğini açıkça ortaya koymaktadır. İlişkisel veritabanları (RDBMS), binlerce kullanıcının eşzamanlı olarak veri okumasına ve yazmasına olanak tanıyan asenkron bir mimari sunar. PostgreSQL, yüksek hacimli verilerin filtrelenmesi süreçlerinde tutarlılığı garanti eder."

**Canlı Uygulama / Görev (5 Dakika):**
*   **Görev:** Mevcut Bağlantıyı ve Rolü Kontrol Et
*   **Uygulama Adımları:** SQL editöründe `SELECT current_user, current_database();` çalıştırılarak `postgres` yetkisi doğrulanır.

### [11:20 - 11:35] Kurulum ve Docker Standardizasyonu
**(Kritik Soru: Geliştirme ortamlarında Docker kullanımının kurumsal faydaları nelerdir?)**

**Teorik Anlatım:**
"Altyapı farklılıkları (dependency hell), yazılım süreçlerindeki en büyük zaman kayıplarından biridir. Standardize edilmiş bir Docker Container, donanımdan bağımsız olarak aynı PostgreSQL ve PostGIS versiyonlarının çalışmasını güvence altına alır. İzole edilmiş bu ortam, kurulum hatalarını minimize ederek doğrudan veri yönetimine odaklanmamızı sağlar."

### [11:35 - 11:50] PostgreSQL Veri Tipleri
**(Kritik Soru: NUMERIC ve REAL veri tipleri arasındaki yapısal fark nedir?)**

**Teorik Anlatım:**
"Veri kalitesi, uygun veri tipinin seçimiyle başlar. Finansal veriler gibi kesinlik gerektiren durumlarda, yuvarlama hatalarına açık olan `REAL` veya `FLOAT` tipleri yerine, hassasiyeti yüksek `NUMERIC` tipi kullanılmalıdır. Standart metinler için `TEXT`, zaman bilgileri için ise coğrafi konum farklılıklarını yönetebilen `TIMESTAMPTZ` tercih edilir. Yapılandırılacak tablolarda uygun veri tiplerinin kullanılması, sorgu performansını doğrudan etkileyecektir."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Personel Tablosu Tasarla
*   **Uygulama Adımları:** `CREATE TABLE personel (id SERIAL PRIMARY KEY, ad TEXT, maas NUMERIC, ise_giris DATE);` komutu yazılarak temel DDL yetkinliği kazanılır.

---

## [Ders 3] 14:00 - 14:50 | Veri Sorgulama ve Filtreleme

### [14:00 - 14:15] SELECT ve Sütun Seçimi
**(Kritik Soru: Okuma işlemleri veritabanı üzerinde kilitlenmeye yol açar mı?)**

**Teorik Anlatım:**
"Veritabanıyla iletişimin temel bileşeni `SELECT` komutudur. Bu komut salt okunur bir işlem gerçekleştirir ve disk üzerindeki orijinal veriyi değiştirmez. PostgreSQL'in MVCC mimarisi sayesinde okuma işlemleri, yazma işlemlerini engellemeden eşzamanlı olarak yürütülebilir. Ancak kurum içi raporlamalarda tüm tabloyu (`SELECT *`) çağırmak ağ bandı açısından verimsizdir."

**Canlı Uygulama / Görev (5 Dakika):**
*   **Görev:** Sütunları Yeniden Adlandır (Alias)
*   **Uygulama Adımları:** `SELECT ad AS "Mahalle Adı", nufus AS "Toplam Nüfus" FROM konya.mahalleler;`

### [14:15 - 14:35] WHERE ile Filtreleme
**(Kritik Soru: Metin filtrelemelerinde LIKE ve ILIKE operatörleri ne zaman tercih edilmelidir?)**

**Teorik Anlatım:**
"Analitik süreçlerin verimliliği, filtrelenen verinin doğruluğuna bağlıdır. `WHERE` koşulu, sunucu tarafında veri kümesini daraltarak ağ trafiğini azaltır ve işlemci yükünü optimize eder. Metin tabanlı sorgulamalarda, büyük/küçük harf duyarlılığı gerektiğinde `LIKE`, duyarsız aramalarda ise PostgreSQL'e özgü olan `ILIKE` operatörü kullanılır."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Karatay Mahallelerini Bul
*   **Uygulama Adımları:** `SELECT ad, nufus FROM konya.mahalleler WHERE ilce = 'Karatay' AND nufus > 5000;`

### [14:35 - 14:50] ORDER BY ve LIMIT (Sıralama)
**(Kritik Soru: Büyük veri setlerinde LIMIT kullanımı donanım kaynaklarını nasıl korur?)**

**Teorik Anlatım:**
"İş zekası raporlarında genellikle verinin tamamı değil, en belirgin olan belirli bir yüzdesi talep edilir. Sorgu sonuçlarını istemci (client) tarafında sıralamak bellek kapasitesi açısından verimsizdir. `ORDER BY` komutu kullanılarak veri sunucu seviyesinde sıralanmalı ve ardından `LIMIT` operatörüyle sınırlandırılmalıdır."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** En Az Nüfuslu 3 Mahalle
*   **Uygulama Adımları:** `SELECT ad, nufus FROM konya.mahalleler ORDER BY nufus ASC LIMIT 3;`

---

## [Ders 4] 15:00 - 15:50 | Agregasyon ve Gruplama

### [15:00 - 15:25] Toplama Fonksiyonları
**(Kritik Soru: NULL değerlerin agregasyon fonksiyonlarındaki etkisi nedir?)**

**Teorik Anlatım:**
"Kurumsal analizlerde bütüncül bir perspektif sağlamak için `COUNT`, `SUM` ve `AVG` gibi agregasyon fonksiyonları kullanılır. İstatistiksel hesaplamalarda veri bütünlüğüne dikkat edilmelidir. Örneğin, `COUNT(*)` tüm kayıtları sayarken, `COUNT(sutun)` sadece içinde veri olan (NULL olmayan) satırları işler. NULL değerlerin analize etkisini göz ardı etmek, hatalı yönetim raporlarına sebep olabilir."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Ortalama Nüfusu Bul
*   **Uygulama Adımları:** Konya geneli toplam ve ortalama nüfus `SELECT SUM(nufus), AVG(nufus) FROM konya.mahalleler;` ile hesaplanır.

### [15:25 - 15:50] GROUP BY ve HAVING
**(Kritik Soru: Agregasyon sonuçları üzerinden filtreleme yapmak için neden WHERE kullanılamaz?)**

**Teorik Anlatım:**
"Veriyi demografik veya coğrafi kategorilere bölmek, analizlerin derinliğini artırır. `GROUP BY` komutu, veriyi ortak özniteliklere göre kümelendirir. Sık karşılaşılan hatalardan biri, gruplanmış verileri `WHERE` komutu ile filtrelemeye çalışmaktır. `WHERE` veri tablodan okunurken, `HAVING` ise veriler gruplandıktan sonra çalışır."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** İlçelere Göre Toplam Nüfus
*   **Uygulama Adımları:** `SELECT ilce, SUM(nufus) FROM konya.mahalleler GROUP BY ilce HAVING SUM(nufus) > 100000;`

---

## [Ders 5] 16:00 - 16:50 | Veri İlişkileri ve Yönetimi

### [16:00 - 16:25] JOIN ve Tablo İlişkileri
**(Kritik Soru: İlişkisel ve mekansal birleştirmeler arasındaki kavramsal fark nedir?)**

**Teorik Anlatım:**
"İlişkisel veritabanlarının temel prensibi, tekrarı önlemek amacıyla veriyi normalize edilmiş şekilde ayrı tutmaktır. Bu veriler `JOIN` komutları ile anlamlı raporlara dönüştürülür. Standart `JOIN` işlemleri ID numaraları gibi mantıksal eşleşmelere dayanırken; ileride göreceğimiz mekansal `JOIN` işlemleri geometrik kesişimler üzerinden hesaplanır."

**Canlı Uygulama / Görev (15 Dakika):**
*   **Görev:** Hastanesi Olmayan Mahalleleri Listele
*   **Uygulama Adımları:** Mahalleler ve Hastaneler tabloları `LEFT JOIN` kullanılarak `hastane.id IS NULL` şartıyla birleştirilir.

### [16:25 - 16:45] Veri Yönetimi (DML)
**(Kritik Soru: Kurumsal veritabanlarında DELETE işlemi neden risk taşır?)**

**Teorik Anlatım:**
"Veri okuma süreci ne kadar güvenliyse, veri manipülasyon (DML) süreci de o kadar dikkat gerektirir. `UPDATE` ve `DELETE` işlemleri kalıcıdır. Koşulsuz (WHERE kullanılmayan) bir güncelleme işlemi tüm verileri bozar. Kurumsal prensipler doğrultusunda, kayıtların fiziksel olarak silinmesi yerine `is_active` gibi bir durum bayrağıyla mantıksal olarak devre dışı bırakılması önerilir."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Yanlış Kaydı Sil
*   **Uygulama Adımları:** Kontrollü bir veri silme veya güncelleme (`UPDATE`) operasyonu gerçekleştirilir.

### [16:45 - 16:50] 1. Gün Kapanış
"Temel SQL yetkinliklerini kurumsal bir perspektifle pekiştirdik. Yarın, bu standart tablolara gerçek mekansal zekayı (PostGIS) katarak devam edeceğiz."
