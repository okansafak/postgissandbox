# Ders 3: Matematiksel Odak ve Ağırlık Merkezi (ST_Centroid & ST_PointOnSurface)

**[Giriş / Hook]**
Rusya, Türkiye veya düzensiz bir L şeklindeki orman arazisi... Veritabanınızda bu yapılar binlerce köşesi olan devasa çokgenler olarak yaşar. Ancak web uygulamanızın haritasını açtığınızda kullanıcıların gözünde bu ülkeler sadece ortalarında duran minik, tekil bir etiketten ibarettir. O halde, bir orman arazisini temsil eden o tek "mükemmel nokta" nerededir?

**[Teori / Kavramsal Çerçeve]**
Bir poligonun veya geometri koleksiyonunun uzaydaki "matematiksel ağırlık merkezini" bulmak, analitikte veriyi sadeleştirme taktiklerinden biridir. `ST_Centroid` fonskiyonu, o coğrafi nesneye bir fiziksel plaka gibi davranır ve onu parmağınızın ucunda yatay olarak dengede tutabileceğiniz kusursuz koordinatı bulur ve size yepyeni bir Nokta (Point) objesi döner.

Ancak ortada büyük bir mühendislik tuzağı vardır: Nesne "Hilal Ay", "C" veya "L" harfi gibiyse, geometrinin ağırlık merkezi (denge noktası) o objenin kendi sınırlarının dışına çıkıp havada (veya rakip ülkenin sınırları içinde) kalabilir! Bir araziyi işaretlediğinizi sanırken pini yandaki arsaya çakmış olabilirsiniz. Bu riskte cerrahi bir emniyet aracı olan `ST_PointOnSurface` devreye girer. Bu fonksiyon size o cisme mutlaka içeriden dokunan garantili bir temsili nokta döner (Ağırlık merkezi olmasa bile).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda hilal/L benzeri agresif bir poligon çiziyor ve iki zekayı aynı anda bu yapıya dikte ediyoruz:
`SELECT `
  `ST_AsText(ST_Centroid(geom)) AS matematik_merkez,`
  `ST_AsText(ST_PointOnSurface(geom)) AS garantili_yuzey_nokta`
`FROM (`
  `SELECT ST_GeomFromText('POLYGON((0 0, 10 0, 10 2, 2 2, 2 10, 0 10, 0 0))', 4326) AS geom`
`) AS L_bina;`

Konsoldaki iki farklı Point değerine bakın. Matematiksel merkez büyük ihtimalle binanın tamamen dışındaki (havadaki) bir boşluk değerine otururken, PointOnSurface motoru güvenli oynayarak iğneyi o "L" binasının çatısından (kesin sınırlardan) asla koparmadı. Etiketleme sistemlerinde bu fark hayati önem taşır.

**[Kapanış]**
Bir poligonun içindeki tekil gücü ve denge noktasını bulduk. Dünyanın hangi köşesinde olursa olsun bir yığını tek bir raptiyeye (etihkete) indirebiliyoruz. Peki ya tam tersi? Tekil ve cılız bir noktanın etrafında devasa bir etki veya güvenlik kalkanı örmek istersek? Sıradaki faza, tampon bölgelere (Buffer) geçiyoruz.