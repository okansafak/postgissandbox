# Ders 4: Sentetik İnşa ve Geometri Kurgulama (Constructor)

**[Giriş / Hook]**
Veri ambarına her zaman dışarıdan hazır ve pürüzsüz çizilmiş poligonlar girmez. Bazı anlarda, şirket veya sistem ham verilerden kendi uzamsal sahasını anlık olarak kurgulamak, matematiği kendisi konuşturmak zorundadır.

**[Teori / Kavramsal Çerçeve]**
Bir tablodaki enlem (lat) ve boylam (lon) sütunlarından nokta çıkarmayı (`ST_MakePoint`) gördük. Ancak bazen daha karmaşık sentetik yapıları anında inşa etmek için Constructor (Yapıcı) fonksiyonlarını kullanırız. Noktalı virgüllerle, metin kodlamalarıyla veya doğrudan dizi koordinatlarla sistemimize şeklini biz veririz. X ekseni boylam, Y ekseni enlem iken, `ST_GeomFromText` standart bir imza metnini (WKT/EWKT) alır ve sisteme gerçek bir kapı (geometri objesi) açar.

Aynı zamanda bir başka fonksiyon ise `ST_MakeEnvelope`'tur ki, iki köşe (Minimum X, Y ve Maksimum X, Y) bilgisini alarak kusursuz bir dikdörtgenin koordinatlarını veya köşelerini çıkartır ve o alanı mühürler. Sınır inşa etme ve kutulama analizinin çekirdeğidir.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde bu yapım fonksiyonlarını test ediyoruz. Öncelikli olarak metin (text) bilgisini sisteme organik bir veriymiş gibi yediriyoruz:
`SELECT ST_GeomFromEWKT('SRID=4326;POLYGON((28 41, 29 41, 29 42, 28 42, 28 41))') AS analitik_alan;`
Bu işlemle sistem doğrudan koordinatların kapalı doğasını anladı. Peki iki köşe koordinatını verip alanı hızlıca çizdirsek nasıl olurdu?
`SELECT ST_SetSRID(ST_MakeEnvelope(28, 41, 29, 42), 4326) AS sinirlar_alan;`

Her iki fonksiyon da saniyenin altında eşit kapsama alanlı, mükemmel geometrileri bizim için tarayıcı belleğine aktardı ve web arayüzünde yansıttı.

**[Kapanış]**
Görüldüğü üzere, kendi algoritmamızı haritada fiziksel olarak konumlandırma safhasını aştık. Uzamsal modeli sisteme yedirme ve inşa etme kodlarına hakimsiniz. Bir sonraki kritik eşik (Metadata) ile elinizdeki belirsiz, var olan bir geometrinin sırrını çözüp, boyutunu ve özelliklerini sorgulayacağız.