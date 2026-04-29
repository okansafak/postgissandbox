# Ders 1: Spagetti mi, Topoloji mi? (Geometry vs. PostGIS Topology)

**[Giriş / Hook]**
Kadastro müdürlüğünde çalışıyorsunuz; iki yan yana parsel çizildi. Görüntüde aralarında sınır paylaşıyor gibiler ama yaklaştıkça, mikroskobik boyutlarda "boşluklar (gaps)" veya üst üste binmeler "çakışmalar (overlaps)" olduğunu fark ediyorsunuz. Bu duruma CBS dünyasında "Spagetti Geometri" denir. Normal `geometry` veri tipindeki her poligon kendi halinde yaşar, komşusunun kenarından habersizdir. Komşu parseli yana kaydırdığınızda, ortak sınır kopar gider. Peki ya o ortak sınırın fiziken "tek bir çizgi" olduğunu veritabanına nasıl anlatırsınız? Karşınızda kurumsal CBS'in kutsal kuralı: `postgis_topology` eklentisi.

**[Teori / Kavramsal Çerçeve]**
Spagetti modelinde (standart PostGIS `geometry` sütununda), iki komşu çokgenin bitişik kenarı veritabanına "iki kez" kaydedilir. Biri A çokgeni için, diğeri B çokgeni için.
"Topoloji (Topology)" mimarisinde ise felsefe tamamen değişir. Topolojide çokgenler veya çizgiler (Geometriler) kaydedilmez. Onun yerine "Düğümler (Nodes), Kenarlar (Edges) ve Yüzeyler (Faces)" kaydedilir.
Komşu olan A ve B parseli var oluşturulurken, aralarındaki ortak sınır "Edge 15" adıyla tek bir kez veritabanına yazılır. A çokgeni "Ben Edge 10, 11 ve 15'ten oluşuyorum" der. B çokgeni "Ben Edge 15, 20 ve 32'den oluşuyorum" der. Eğer Edge 15'i taşırsanız, her iki parsel de otomatik ve pürüzsüzce yer değiştirir. Boşluk (gap) ve bindirme (overlap) ihtimali matematiksel olarak ortadan kalkar!

**[Uygulama / Ekran Gösterimi]**
Ortamımızda öncelikle bu gücü uyandırıyoruz. PostGIS'in çekirdeğinden bağımsız olan bu ikinci devasa mimariyi aktif etmelisiniz:
`-- Topology eklentisini veritabanımıza dahil ediyoruz`
`CREATE EXTENSION IF NOT EXISTS postgis_topology;`

Eklenti aktif edildiğinde, veritabanınızda `topology` adında tamamen yeni ve gizemli bir "şema (schema)" üretilir. O şemanın içerisinde topolojilerinizi yönetecek çekirdek tablolar (`topology`, `layer`) beklemektedir. Artık düz çokgenler değil, kusursuz sınır paylaşımları inşa etmeye hazırız.

**[Kapanış]**
Gördüğünüz gibi, bir parselin komşusunu bilmesi, ortak bir kenarı ittiğinizde diğerinin esnemesi, akıllı bir veri tabanının (Cadastral / Land Registry System) belkemiğidir. Eğer bir devlet veya belediye emlak sistemi yazacaksanız Topoloji kullanmak zorundasınız. Bir sonraki derste ilk Topolojik Evrenimizi, kendi kurallarıyla ve toleranslarıyla sıfırdan "CreateTopology" diyerek nasıl yaratacağımızı öğreneceğiz. Parmaklarınızı esnetin.