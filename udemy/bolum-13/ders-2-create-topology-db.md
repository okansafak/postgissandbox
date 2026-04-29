# Ders 2: Topolojik Evreni Yaratmak (CreateTopology)

**[Giriş / Hook]**
Eklentiyi yüklediniz fakat topoloji kendiliğinden çalışan bir "sütun" değildir. `Topoloji`, kendine ait bir evrendir; bağımsız bir "veri şemasıdır" (Schema). Sisteminizdeki ilçeler için "ben ilçelerin sınırlarını topolojiyle koruyacağım" dediğiniz an, sistem sizden bu ilçelerin hangi projeksiyonda yaşayacağını ve "Ne kadar santimetrelik hatayı tek kenar kabul edeceğini (Hata Toleransı)" sorar. Bu, evrensel "Big Bang" anıdır. Bu evreni nasıl başlatırız? `CreateTopology` fonksiyonuyla.

**[Teori / Kavramsal Çerçeve]**
Yeni bir Topoloji alanı oluşturmak, yeni bir Geometri nesnesi oluşturmak kadar basit değildir. Topoloji, kendi kurallarının saklanacağı üç ana tabloyla yaşar:
`node`: Noktalar / Düğümler (Kavşaklar ve köşeler)
`edge_data`: Çizgiler (Kenarlar) / 1 ile 2 arasını bağlayan tel.
`face`: Yüzeyler (İçerisi tamamen kapalı bir kenar ağı poligonudur)
Bu tablolar, belirlediğiniz isimle yaratılan bir Şema (Örn: `ilce_topolojisi`) içine dökülür. Siz de bu evrenin sınırlarına verilerinizi bağlarsınız. 
Tüm bu alt yapıyı oluşturan dev fonksiyon ise `CreateTopology(isim, SRID, Tolerans)` idir.
SRID (Projeksiyon Tipi), Tolerans (Snap / Yapışma eşiği. Örn: 0.5 derseniz, yarım metreden yakın nesneleri veritabanı "Zaten bunlar aynı köşeymiş" deyip şırak diye birbirine lehimler).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, EPSG 3857 (Metrik Harita) projeksiyonuna sadık, 0.1 metre (10 santim) hata payı olan `sehir_evreni` adında yepyeni bir topoloji alanı oluşturuyoruz:

`-- 1. Parametre: 'sehir_evreni' -> Şemanın adı`
`-- 2. Parametre: 3857 -> SRID (Metrik / Web Mercator)`
`-- 3. Parametre: 0.1 -> Tolerance (Kaç birim yakınsa birbiriyle birleşsin)`
`SELECT CreateTopology('sehir_evreni', 3857, 0.1);`

Komut başarıyla dönüğünde SQL ekranında `1` numaralı Topoloji ID'sini göreceksiniz. Ve veritabanınızın (Şemalar/Schemas) altına bakarsanız `sehir_evreni` adında bir klasör ve içinde (edge_data, face, node) adında yepyeni tablolar olduğunu göreceksiniz. Motorumuz çalışıyor.

**[Kapanış]**
Evreni kurdunuz, sınırlarını (SRID) ve yerçekimini (Tolerans) belirlediniz. Ama o evrenin içinde henüz gezegen veya canlı (Veri) yok. Evreniniz boş bir boşluktan ibaret. Bir sonraki derste sıradan (Spagetti) çizgi ve poligonlarımızı, bu kurduğumuz üstün topoloji evrenine katmayı sağlayan sihirli sütunu (AddTopoGeometryColumn) tablolarımıza ekleyeceğiz. Devam.