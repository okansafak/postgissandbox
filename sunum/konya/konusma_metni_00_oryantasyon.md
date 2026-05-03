# PostGIS Akademi: Giriş ve Oryantasyon
**1. Gün - 1. Ders (10:00 - 10:50)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [10:00 - 10:05] Açılış ve Vizyon Belirleme

**Sahne Metni:**
"6 Şubat 2023. Kahramanmaraş merkezli depremler, afet yönetiminde bilgi koordinasyonunun ne denli hayati olduğunu hepimize gösterdi. Kurtarma operasyonlarının ilk saatlerinde sahadaki ekipler, kapalı yollar veya yıkılan binalar hakkında anlık ve güvenilir bilgiye ulaşmakta zorlandı. Veri mevcuttu; ancak farklı sistemlerde dağınık haldeydi ve tek bir mekansal düzlemde birleştirilemiyordu. Bu süreç, coğrafi referansla ilişkilendirilmeyen verinin kriz anlarında karar alma süreçlerini yavaşlattığını kanıtladı. Doğru bilgi, doğru zamanda ve doğru mekansal bağlamda sunulduğunda hayat kurtarır. Bugün burada, Konya'nın dijital altyapısını bu düzeyde bir analitik kapasiteye ulaştırmak için toplanmış bulunuyoruz."

---

## [10:05 - 10:15] Eğitmen ve Kurumsal Hedefler
**(Kritik Soru: Coğrafi veri sisteminizde sadece görsel bir katman mı, yoksa analitik bir motor mu?)**

**Teorik Anlatım:**
"Konya Büyükşehir Belediyesi'nin dijital altyapısını mekansal analitikle güçlendirecek adımları atıyoruz. Temel amacımız, veriyi salt depolanan bir varlık olmaktan çıkarıp, karar destek mekanizmalarını besleyen aktif bir bileşene dönüştürmektir. Mevcut analizler ortaya koyuyor ki, harita üzerindeki görselleştirmeler, arkasında güçlü bir analitik altyapı bulunmadığında kurumsal ihtiyaçları karşılamakta yetersiz kalır. Ben Okan Şafak. Uzmanlık alanım, açık kaynaklı coğrafi bilgi sistemleri mimarileri üzerine kurumsal çözümler üretmektir. Sistemler, üzerinde çalıştıkları verinin kalitesi ve işlenme kapasitesiyle doğru orantılı çalışır. Amacımız, sıradan bir harita okuyucusu olmak değil; veritabanının derinliklerinde coğrafi zekayı inşa eden mimarlar olmaktır. Peki, kurumsal bir veritabanını akıllı bir mekansal motora dönüştüren teknolojik altyapı nasıl kurgulanır?"

---

## [10:15 - 10:30] Altyapı ve Docker Kurulumu
**(Kritik Soru: Milyonlarca mekansal kayıt yapısal olarak nasıl indekslenir ve yönetilir?)**

**Teorik Anlatım:**
"Sürdürülebilir bir belediyecilik mimarisi, ölçeklenebilir ve güvenilir temellere dayanmalıdır. Sistem modelimiz üç ana bileşen etrafında şekilleniyor: İlişkisel veri yönetiminde endüstri standardı olan PostgreSQL, bu yapıya mekansal veri işleme kabiliyeti kazandıran PostGIS ve sistemle iletişimimizi sağlayan SQL. Veriler gösteriyor ki, Konya gibi geniş bir coğrafyanın artan veri hacmini yönetmek, yüksek performanslı indeksleme mekanizmalarını zorunlu kılar. Ancak bu devasa mimariyi kurmadan önce, hepimizin aynı çalışma ortamında, aynı versiyonlarla çalıştığından emin olmalıyız. İşte bu noktada konteyner mimarisi (Docker) devreye giriyor."

**Canlı Uygulama / Görev (10 Dakika):**
*   **Görev:** Docker altyapısını ayağa kaldırmak ve bağlantı testini gerçekleştirmek.
*   **Uygulama Adımları:**
    1.  Tüm katılımcıların bilgisayarlarında terminal ekranını açmaları istenir.
    2.  `docker-compose up -d` komutu çalıştırılır.
    3.  PostgreSQL konteynerinin 5442 portunda ayağa kalktığı teyit edilir.
    4.  DBeaver veya pgAdmin üzerinden `localhost:5442`, kullanıcı `postgres`, şifre `postgres` ile bağlantı testi yapılır.
*   **Analiz/Yorum:** "Şu an her birinizin bilgisayarında, bulut sunucularında çalışan kurumsal bir veritabanı altyapısının birebir kopyası, dış sistemlerden tamamen izole edilmiş bir şekilde çalışıyor. Altyapıyı standartlaştırdığımıza göre, bu sisteme nasıl veri aktaracağımızı konuşabiliriz."

---

## [10:30 - 10:40] Mekansal Veri Tipleri ve Analiz Mantığı
**(Kritik Soru: Vektör ve Raster modelleri arasındaki yapısal fark nedir?)**

**Teorik Anlatım:**
"Coğrafi bilgi sistemleri, fiziksel dünyayı modellemek için iki temel yaklaşım kullanır: Vektör ve Raster. PostGIS, vektör analitiği üzerine kurgulanmıştır. Nokta, çizgi ve çokgen geometrileri, yolları, binaları ve idari sınırları matematiksel bir kesinlikle tanımlar. Bu model, mesafe, alan ve kesişim hesaplamalarında yüksek hassasiyet sağlar. Raster veri ise, uydu görüntüleri ve yükseklik modelleri gibi sürekli değişen, piksel tabanlı yüzeyleri ifade eder. Kurumsal analizlerimizin büyük bölümü, idari sınırlar ve altyapı şebekeleri arasındaki ilişkileri sorgulamayı gerektirir. Standart veritabanları, koordinat bilgilerini bağımsız sayısal değerler olarak saklar. Konumsal bağlamı kavrama yetenekleri yoktur. PostGIS ise mekansal veriyi bütünleşik bir obje olarak değerlendirir. Analizler gösteriyor ki, belirli bir noktaya 500 metre mesafedeki tesislerin tespiti gibi bir sorgu, standart sistemlerde karmaşık kodlar gerektirirken, PostGIS'te yerleşik fonksiyonlarla milisaniyeler içinde sonuçlanır."

---

## [10:40 - 10:50] Temel Kavramlar ve Kapanış
**(Kritik Soru: GiST İndeks mekanizması, sorgu sürelerini nasıl optimize eder?)**

**Teorik Anlatım:**
"Verinin analiz edilebilir olması için standartlara bağlanması şarttır. Sistemlerimiz WKT (Well-Known Text) ve WKB (Well-Known Binary) formatlarıyla geometrileri tanımlar. Bu geometrilerin yeryüzündeki gerçek konumunu ise SRID (Mekansal Referans Sistemi) belirler. EPSG:4326 küresel koordinatları, EPSG:5254 ise Konya'nın da içinde bulunduğu bölge için metrik hassasiyeti ifade eder. Tüm bu verinin hızla işlenmesini sağlayan asıl unsur GiST indekslemedir. GiST indeksi veriyi uzamsal kutulara (Bounding Box) bölerek arama maliyetini ciddi oranda düşürür. Etkin bir sistem, veriyi depolamanın ötesine geçerek karar destek mekanizmalarını beslemelidir. İmar planlamasında çakışma kontrollerinin otomatikleştirilmesi veya ulaşım ağlarının hizmet alanlarının hesaplanması, mekansal SQL'in bize sunduğu yeteneklerdir. Kurumsal verimlilik, süreçlerin standartlaştırılması ve otomatize edilmesiyle sağlanır."

**Ders Sonu Kapanış:**
"Mekansal analitiğin teorik çerçevesini ve altyapısını başarıyla kurduk. Ancak sistem, kendisine sorulan doğru sorular kadar akıllıdır. 10 dakikalık aranın ardından, veritabanı yönetiminin temel kurallarına (SQL) geçerek süreci nasıl işleteceğimize odaklanacağız."
