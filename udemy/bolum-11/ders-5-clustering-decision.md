# Ders 5: Zeka Laboratuvarı ve Strateji Matrisi (Clustering Decision)

**[Giriş / Hook]**
Masanızda milyonlarca nokta var. Pazarlama müdürü "Bölgelere ayır" diyor, Lojistik müdürü "Tam olarak 10 adet depo yerleştir" diye bağırıyor, Veri bilimci ise "Bilinmeyen anormal yoğunlukları, yasa dışı toplanmaları bul" diyor. Eğer elinizdeki paha biçilemez veriye, sorunun tabiatına aykırı bir Kümeleme (Clustering) algoritması uygularsanız, doğru veriden "sahte ve yıkıcı" şirket stratejileri doğurursunuz. PostGIS mimarı olarak, hangi silahı ne zaman çekeceğinize karar verme anındayız: Strateji Matrisi.

**[Teori / Kavramsal Çerçeve]**
Bir projede veri bilimi eylemini başlatmadan önce tabloya aşağıdaki üç mutlak kural setiyle bakılır:
**1. Dağıtım ve Franchise Hedefleri (K-Means):**
Eğer hedefiniz sayıyı dikte etmekse (Örn: "Benim İstanbul'a sadece 5 tane baz istasyonu dikme bütçem var, en adil şekilde nereye dikeyim?"). Yalnız kurtları ve okyanus ortasındaki sapan verileri yok sayamazsanız (`Her müşteri bir merkeze atanmak zorundaysa`), seçeceğiniz tek yol `ST_ClusterKMeans`'tir. Adil, zorunlu ve matematiktir.

**2. Organik Krizler ve İzolasyon, Suç Analitiği (DBSCAN):**
Kaç merkezin çıkacağını önceden bilmiyorsanız. Bir yoğunluk limiti (Minimum sayı) belirleyip, o limite ulaşmayan veriyi "Kirlilik (Noise) = NULL" olarak çöpe atmayı umuyorsanız ve organik büyüme şekillerini izliyorsanız (`ST_ClusterDBSCAN`). Salgın hastalıklarda 3 hastanın yan yana olması önemsizken 50 hastanın 100 metrekarede olması salgındır.

**3. A/B Testing, Yüzey Kaplaması ve Heatmaps (Hexagonal/Square Grids):**
Eğer amacınız noktaları kendi içinde değil de, "toprağı / yüzeyi" objektif piksellere bölmekse. 100 adet taksi ile 100 adet scooter'ı, aynı altıgen bal peteklerine düşürüp kıyaslamak, yönetimsel ekranlarda ve renk skalalarında izole coğrafi komşuluklar örmekse. (`ST_HexagonGrid` ve `Spatial JOIN`).

**[Uygulama / Ekran Gösterimi]**
Bu bir SQL yazım seansı değil, vizyon süzgecidir. Kodlardan ve tablolardan ziyade, bir harita uygulamasının salt bir enlem/boylam deposu olmaktan çıkıp, o devasa PostGIS uzayının doğrudan "Karar Destek Sistemi - DSS" haline dönüştüğü andır. Uygulamanızın arka planına (Backend) bu algoritmaları API yardımıyla dinamik bağlarsanız, yöneticiniz web arayüzünden "Bana 4 depo at" dediğinde arka planda K-Means çalışır; "Sıcak noktaları bul" dediğinde DBSCAN uyanır.

**[Kapanış]**
Dağınık kaos yığınlarını, salt bilimin zarafetiyle anlamlı stratejik adalara bölmeyi (Bölüm 11) tamamladınız. Artık makine öğrenmesinin en can alıcı kısımlarını doğrudan veritabanı motorunun disk sınırları içinde devirebiliyorsunuz. Sıradaki faz (Eğitimimizin Final Bloğu), bu kümelerin, noktaların ve lojistik merkezlerin arasına artık "Asfaltı ve Yolları" döşeyeceğimiz (Routing, A* ve Ağ Analizi), araçlarımızı o yollarda dolaştıracağımız Ağ Topolojisine giden yoldur. Veri biliminde kalırsanız hiçbir strateji kaybolmaz. Başarılar dilerim.