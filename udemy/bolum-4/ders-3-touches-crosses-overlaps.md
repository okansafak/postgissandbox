# Ders 3: Sınır Olayları: Teğet, Kesişim ve Kısmi İşgal (Touches, Crosses, Overlaps)

**[Giriş / Hook]**
Uluslararası bir otoban projesi çizildi. Bir arazi sahibi, otobanın arazisini ortadan ikiye bölerek kullanılamaz hale getirdiğini (Crosses) söylerken; devlet sadece arazinin dış çitiyle yanyana geçildiğini (Touches) iddia ediyor. Hangi tarafın verisi milyonluk kamulaştırma faturasını destekleyecek? İşte veritabanının kesişimi sadece bulması yetmez, "nasıl kesiştiğini" de tahlil etmesi gerekir.

**[Teori / Kavramsal Çerçeve]**
Daha önce işlediğimiz devasa `Intersects` şemsiyesi, çok daha sofistike ve karakteristik parçalara bölünmüştür:
1. `ST_Touches(A, B)`: İki objenin sadece (ve sadece) sınırları temas ediyorsa, iç alanları (gövdeleri) zerre kadar birbirine değmiyorsa TRUE olur. İki mükemmel komşu arsa veya ülkenin birbirine `Touches` ilişkisi vardır.
2. `ST_Crosses(A, B)`: Genelde bir Çizgi (Yol), bir Poligon'u (Arsa) boydan boya deşip geçtiğinde (bölüp çıktığında) gerçekleşir. Geometri diğerinin iç tarafına dalmalı ve sınırından tekrar çıkıp gitmelidir (Köprüler, Raylı Sistemler). 
3. `ST_Overlaps(A, B)`: İki aynı boyutlu geometri (Poligon vs Poligon) birbirinin tamamen "içinde" değildir, ancak belli bir yüzdeyle alan ihlali yaratmıştır: Yani hisse gaspları, binaların araziye belirli bir miktar tecavüzü (örtüşme). Veritabanı "bu objeler aynı boyutta, ikisi de birbirinin bir kısmını yutmuş" dediğinde `Overlaps` durumu sabittir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki komut merkezimize geçelim ve bu hassas sınamayı iki yan yana poligonla deneyelim. Her ikisi de yatay düzlemde birleştirilmiş (10x10'luk iki kare) düşünün, birleşme noktalarından biri (X=10 ekseni) ortak. Biz sisteme şu soruyu yöneltiyoruz:
`SELECT ST_Touches(`
  `ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))'),`
  `ST_GeomFromText('POLYGON((10 0, 20 0, 20 10, 10 10, 10 0))')`
`) AS komsu_mu;`

Sistem saniyesinde TRUE döner. Hiçbir gövde iç içe geçmemiş, sadece hudutta mükemmel bir diplomatik birleşme yaşanmıştır. Eğer o poligon X ekseninde 10 değil 9.5 sınırına dayansaydı iş `Overlaps`'e dönecek ve ticari kavgayı tetikleyecekti.

**[Kapanış]**
Sınırların ihlal biçimini en ileri akademik hassasiyetle modellemeyi başardınız. Ancak fiziksel bir temas, ticaret için şart mıdır? Sadece "yakın" veya "belli bir menzil içerisinde" olmak da analiz edilebilir mi? Bir sonraki dersimizde, performans motorlarını cayır cayır yakan o devasa problemin en optimize çözümüne: Yakınlık tarayıcısı `ST_DWithin` fonksiyonuna geçiyoruz.