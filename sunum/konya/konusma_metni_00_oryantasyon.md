# PostGIS Akademi: Giriş ve Oryantasyon
**1. Gün - 1. Ders (10:00 - 10:50)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Slayt 1] Kapak: PostGIS
**(Süre: 3 Dakika)**

**Sahne Metni:**
"Hoş geldiniz. 6 Şubat depremlerinin bize öğrettiği en acı gerçeklerden biri şuydu: Koordinat düzleminde anlamlandırılamayan, farklı sistemlerde dağınık halde duran veri, kriz anında bir anlam ifade etmez. Doğru bilgi, doğru zamanda ve doğru mekansal bağlamda sunulduğunda hayat kurtarır. Bugün burada, Konya'nın dijital altyapısını bu düzeyde bir analitik kapasiteye ulaştırmak, 'Konumsal verinin gücünü PostgreSQL ile keşfetmek' için toplanmış bulunuyoruz."

---

## [Slayt 2] Eğitmen ve Tanışma
**(Süre: 10 Dakika | Görev: Sınıf Analizi)**

**Sahne Metni:**
"Sürece başlamadan önce kısaca kendimden bahsedeyim. Ben Okan Şafak. 2013'ten beri CBS alanında, açık kaynak teknolojilerle web uygulamaları geliştiriyor ve devasa envanter yönetimi projeleri yürütüyorum. Uzmanlık alanım, standart veritabanlarını akıllı, analitik bir coğrafi zekaya dönüştürmek."

**Canlı Uygulama / Görev (Şimdi Sıra Sizde! 🤝):**
*   **Görev:** Katılımcıların çalıştıkları birimleri ve günlük işlerinde coğrafi veriyi ne yoğunlukta kullandıklarını öğrenmek. 
*   **Aksiyon:** Sınıftan kısa cevaplar alınır (Örn: İmar, Ulaşım, İtfaiye) ve ilerideki örnekler bu birimlere göre şekillendirilir.

---

## [Slayt 3] Altyapı ve Teknoloji
**(Süre: 5 Dakika)**

**Sahne Metni:**
"Sürdürülebilir bir belediyecilik mimarisi, ölçeklenebilir ve güvenilir temellere dayanmalıdır. Kurumsal veritabanı mimarimiz üç ana bileşenden güç alıyor: Dünyanın en gelişmiş açık kaynak ilişkisel veritabanı olan PostgreSQL. Bu depoya mekansal analiz ve topoloji yeteneği katan PostGIS. Ve coğrafi soruları makinelere sormanın en evrensel yolu olan SQL. Veriler gösteriyor ki, Konya gibi geniş bir coğrafyanın artan veri hacmini yönetmek, bu üçlü yapının kurumsal ölçeklenebilirliğiyle mümkündür."

---

## [Slayt 4] Mekansal Veri Tipleri
**(Süre: 7 Dakika)**

**Sahne Metni:**
"Fiziksel dünyayı veritabanında modellemek için Vektör ve Raster olmak üzere iki temel yaklaşımımız var. Eğitimimiz boyunca odaklanacağımız yapı, Vektör Veri. Nokta (Point) ile ağaçları ve durakları; Çizgi (LineString) ile yol ve altyapı ağlarını; Çokgen (Polygon) ile ilçe ve parsel sınırlarını ifade edeceğiz. Vektör yapının en büyük avantajı matematiksel kesinliği ve sınırsız detay sunmasıdır. Raster veriler ise uydu görüntüleri ve yükseklik modelleri gibi sürekli değişen, piksel tabanlı devasa yüzeyleri ifade eder."

---

## [Slayt 5] PostGIS Giriş
**(Süre: 5 Dakika | Soru: 500 Metre İçinde Su Deposu Var Mı?)**

**Sahne Metni:**
"Harita uygulamanız bir soruya saniyeler içinde nasıl yanıt veriyor? Klasik sistemler konumu sadece sayısal bir değer olarak görür. PostGIS ise onu analitik bir obje olarak algılar. Düşünün; Konya Büyükşehir Belediyesi'nin yönetim alanı tam 38.873 kilometrekare. Milyonlarca nesne barındıran bu devasa alan içinde 'Bana en yakın su deposu nerede?' diye sorduğunuzda, veritabanının 1 saniyenin altında cevap verebilmesi, sıradan bir arama değil, bir mühendislik başarısıdır."

---

## [Slayt 6] Neden PostGIS?
**(Süre: 5 Dakika)**

**Sahne Metni:**
"Kurumsal mimaride verimlilik, mevcut sistemleri değiştirmeden onlara yeni yetenekler kazandırmaktan geçer. Zaten güçlü bir PostgreSQL altyapımız var. Tek yapmamız gereken `CREATE EXTENSION postgis;` komutuyla sistemi evrimleştirmek. Bu komut, standart verilerinizi GeoJSON veya WKT gibi evrensel standartlarla uyumlu, 'Kesişiyor mu?' gibi konumsal soruları SQL ile yanıtlayabilen devasa bir analiz motoruna dönüştürür."

---

## [Slayt 7] Temel Kavramlar
**(Süre: 5 Dakika)**

**Sahne Metni:**
"Konumun iki dili vardır. İnsan diliyle 'Selçuklu, Nişantaşı' deriz. Makine dili ise koordinat ve geometri ister. Sistemi kurarken şu üç temel yapı taşını bilmemiz gerekiyor: Birincisi, Geometri Tipleri (Point, Line, Polygon). İkincisi projeksiyon sistemini belirleyen SRID. Ve son olarak sorguları binlerce kat hızlandıran mekanizma: GiST İndeks."

---

## [Slayt 8] Belediye Senaryoları
**(Süre: 8 Dakika)**

**Sahne Metni:**
"Peki bu teknoloji sahada ne işe yarayacak? Bugün PostGIS ile şunları tasarlayabilirsiniz:
1. Afet anında yangın musluklarını 500m yarıçapta anında listeleme.
2. Yeni ruhsat taleplerinde sit alanı çakışmalarını otomatik tespit etme.
3. Otobüs duraklarının mahalleye hizmet kapsama oranını çıkarma.
4. AYKOME altyapı kazılarında fiber optik veya doğalgaz hattı kesişimlerini önleme.
5. Araç takip sistemlerinden alınan devasa verilerle IoT hız koridorları üretme.
6. Yeni bir KOMEK için hedef kitlenin en yoğun olduğu optimum konumu hesaplama.
Sistem sadece veriyi saklamaz, kararları doğrudan şekillendirir."

---

## [Slayt 9] Kapanış ve Bölüm 0'a Geçiş
**(Süre: 2 Dakika)**

**Sahne Metni:**
"Bir veritabanı verini sakladığında değil, verini anladığında güçlü hale gelir. Otuz dakika önce bu cümle soyuttu. Şimdi değil. Altyapının mantığını kurduk. Önümüzdeki 10 dakikalık aradan sonra, doğrudan bu mimarinin dilini öğrenmeye, yani 'Bölüm 0: SQL'e Giriş' adımına geçeceğiz."
