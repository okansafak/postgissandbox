# Ders 3: Coğrafi Bilgi Sistemleri (CBS): Vektör ve Raster Mimarisi

**[Giriş / Hook]**
Fiziksel dünyayı dijital bir veritabanına sığdırmak, gerçeği belirli matematiksel modellere indirgemeyi gerektirir. Eğer verinizi yanlış bir uzamsal modelle tanımlarsanız, yapacağınız tüm stratejik analizler daha en başından sakatlanmış olur. 

**[Teori / Kavramsal Çerçeve]**
Coğrafi Bilgi Sistemlerinde (CBS / GIS) gerçekliği veritabanına aktarmanın iki temel vizyonu vardır: Vektör ve Raster. 

*Vektör veri modeli*, dünyayı keskin sınırları olan, tanımlanabilir ayrık nesneler olarak görür. Koordinat (X,Y) çiftleri kullanılarak inşa edilirler. Bir hastanenin lokasyonu Nokta (Point) ile, bir otoyol ağı Çizgi (LineString) ile, bir gölün veya parselin kapladığı alan ise Çokgen (Polygon) ile temsil edilir. İlişkisel veritabanlarının (ve PostGIS'in) en güçlü ve en sık kullanıldığı alan bu vektör manipülasyonudur.

*Raster veri modeli* ise dünyayı kesintisiz, akışkan bir yüzey (piksel/hücre matrisi) olarak kodlar. Ortada net bir sınır yoktur. Hava sıcaklığı haritası, uydu fotoğrafları veya dijital yükseklik modelleri raster verinin alanıdır. Her hücre, kendi içinde sıcaklık veya yükseklik gibi tek bir değer barındırır. Vektör "nesnenin nerede olduğunu", Raster ise "ordaki durumun ne olduğunu" tarif eder.

**[Uygulama / Ekran Gösterimi]**
SQL ekranımızda bu konsepti doğrudan kurgulamıyoruz ancak düşünsel bir tasarım yapıyoruz. Örneğin, kurumunuzun okul konumlarını ve bölgelerdeki hava kirliliği seviyesini analiz etmesi gerekiyor. 
Okul binaları kesin koordinatları olan, sayılabilir varlıklardır; bunlar veritabanımızda Nokta (Point) vektör geometrileri olarak depolanacaktır. Hava kirliliği oranı ise şehir geneline yayılan süregelen bir veridir, sınırları net değildir; bu yüzden bu katman uydu/sensör temelli bir Raster dosyasından veya sürekli ısı haritasından (heatmap) beslenecektir. Doğru teknoloji seçimi, doğru veri modellemesiyle başlar.

**[Kapanış]**
Dünyayı dijitale nasıl entegre edeceğimiz kurgusunu oluşturduk. Vektör geometrinin gücünü anladık. Artık teoriden pratiğe, kelimelerden haritaya geçme zamanı. Sonraki adımda, PostGIS ile uzaya ilk noktamızı yerleştirecek ve veritabanı motoruna ilk haritamızı çizdireceğiz.