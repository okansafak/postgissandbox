# Ders 2: Coğrafi Çarpışma ve Yabancılaşma (ST_Intersects ve ST_Disjoint)

**[Giriş / Hook]**
"Acaba yapımı planlanan bu tünel rotası, mevcut yeraltı şebekemizin herhangi bir noktasıyla kesişiyor mu?" Bu sorunun milyonlarca dolarlık bir tazminata mı yoksa güvenli bir ihaleye mi dönüşeceği, veritabanının "çarpışma" tespitine bağlıdır. Ve uzamsal veri tabanında çarpışma toleranssızdır: Evrende paylaşılan tek bir mikron bile o kırmızı alarmın çalmasına yeter.

**[Teori / Kavramsal Çerçeve]**
`ST_Intersects` (Kesişme), PostGIS operasyonlarının en güçlü, en sık kullanılan ve indeksleri en iyi kullanan dedektörüdür. İki geometrinin iç alanlarının veya dış sınırlarının herhangi bir yerde birbirine değmesi, üstünden geçmesi veya içinde kalması durumlarında sorguyu TRUE ile onaylar. Tünel ile su borusu birbirine sadece teğet dahi geçse sistem alarm verir.
Bu kavramın tam antitezi (zıttı) ise `ST_Disjoint` fonksiyonudur. İki geometrinin evrende bir zerre kadar dahi ortak noktası ("çarpışması") yoksa, tamamen yabancılaşmış, izole edilmiş yapılarsa TRUE değerini döndürür. Biri diğerinin %100 kapsama değil %100 izolasyon garantisidir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda anlık bir felaket senaryosu kurguluyoruz. Bir sulak alan (Polygon) ve doğrudan üzerine çekilmiş bir boru hattı rotası (LineString). Bu yapıların bir çakışma ihtimali var mıdır inceleyelim:
`SELECT ST_Intersects(`
  `ST_GeomFromText('POLYGON((0 0, 5 0, 5 5, 0 5, 0 0))'),`
  `ST_GeomFromText('LINESTRING(4 6, 4 -1)')`
`) AS felaket_var_mi;`

Mantığı hızlıca okuduğunuzda (X=4 noktasından inen dikey doğrunun, sulak alanın sağ sınırını biçerek aşağı süzüleceğini görürsünüz) sistem doğrudan bu ihlali TRUE olarak patlatır. "İçinde" (Contains) değildir, "Üstünden geçip kucağından sarkmıştır". Bu yüzden `Intersects` kapsayıcı bir tarayıcıdır.

**[Kapanış]**
İki uzamsal varlığın en ufak ortaklığında sistemi uyandırmayı başardık. Fakat bu vahşi çarpma algısını bazen inceltmemiz gerekir. Peki ya bu çizgi ormanı kesip, deşip geçmiyor da sadece sınırından sıyırarak yalıyorsa? Yani komşu ise? Gelecek derpte coğrafyanın cerrahi neşterleri olan Touches (Teğet), Crosses (Boydan Boya Kesme) ve Overlaps (Kısmi İşgal) mantıklarını masanın merkezine koyacağız.