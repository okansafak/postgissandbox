# Ders 6: Sağlıklı Veri İnşası ve Geçerlilik Tespiti (Valid Geometry)

**[Giriş / Hook]**
Veritabanı dışsal bir dosyayı veya kullanıcı girdi koordinatını her koşulda sineye çekip belleğe yazar. Fakat o veri içeride "kendi üzerine katlanan, matematiksel kurallara isyan eden" bir geometri formunda ise (kravat veya sekiz çizen bir alan gibi), hesaplamalar (alan hesabı, kesişim kontrolleri vd.) ya ölümcül hatalar verecek ya da yanlış ticari veya mülkiyet raporlarına zemin hazırlayacaktır.

**[Teori / Kavramsal Çerçeve]**
Bir geometrinin sadece syntactial (yazım) olarak doğru olması yetmez, aynı zamanda topolojik (uzamsal düzlemde fiziksel olarak mümkünlük) kurallara da uyması gerekir. `ST_IsValid` fonksiyonu bu veri isyanını tespit eden yargıçtır. Bozuk bir çizimi bulup (`False`), size bunun mantıksal kusurunu ifşa eder (`ST_IsValidReason`). İleri düzey mühendislikte hedef, sadece sistemi okutmak değil bu hatalı formları `ST_MakeValid` komutuyla makinenin zekasına onartmaktır. Birbiriyle çarpışan noktaları tek bir uzam formuna veya parçalı poligon modeline hapsederek, topolojik boğulmayı çözer ve yapıyı analize müsait sağlıklı bir hale büründürür.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda sentetik olarak kusurlu ve kendisiyle (8 rakamı veya kravat şeklinde) kesişen bir poligon çiziyoruz:
`SELECT ST_IsValid(ST_GeomFromText('POLYGON((0 0, 10 10, 10 0, 0 10, 0 0))', 4326)) AS veri_saglikli_mi;`

Sonuç: Sistemin yargıcı `FALSE` döner. Bu hatalı model, alan hesaplamalarında organizasyonu kaosa sürükleyecektir. Aynı koda `ST_IsValidReason` ekleyerek bozulma kökünü (Self-intersection at...) saptarız.
Nihayetinde onu makineye emredip onarıyoruz:
`SELECT ST_AsText(ST_MakeValid(ST_GeomFromText('POLYGON((0 0, 10 10, 10 0, 0 10, 0 0))', 4326))) AS onarilmis_kurgu;`

Sistem kendi kendini kestiği düğümü çözdü ve geometrinin tanımını "Aynı gövdede iki alan" diyebileceği temiz bir `MultiPolygon` formlarına çevirdi. Harika.

**[Kapanış]**
Görüldüğü üzere, sadece bir kayıt memuru değilsiniz, veritabanının cerrahısınız. Kötü huylu geometri modellemelerini tedavi edecek donanıma artık sahipsiniz. Birinci ve İkinci bölümle uzamsal yapıları oluşturmanın ve özelliklerini okuyup iyileştirmenin teknik sınırlarına ulaştınız. Artık bu yapılar birbirinden tamamen izole yaşamak zorunda değil. Üçüncü bölümde nesnelerin birbiri ile olan çatışmalarını, aralarındaki çekim merkezlerini ve Uzamsal İlişkileri (Spatial Relationships) keşfetmeye başlayacağız. Alanımızın analitik devrimine hoş geldiniz.