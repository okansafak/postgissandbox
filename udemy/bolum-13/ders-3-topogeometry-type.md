# Ders 3: Yepyeni Bir Veri Tipi (TopoGeometry ve Sütun Yapısı)

**[Giriş / Hook]**
"Sokaklar" veya "Parseller" tablonuza normalde `geometry` tipinde bir sütun eklediniz ve içine binlerce koordinat doldurdunuz. Peki ya bu tablonuzun, yarattığınız o kusursuz, "hiç boşluğu olmayan birbirine bitişik" topolojik evren (`sehir_evreni`) ile tanışmasını nasıl sağlarsınız? Siz hala düz `geom` sütunu kullanırsanız o veri Spagetti kalmaya devam eder. PostGIS'in en elit veri tiplerinden birine terfi etme vaktiniz geldi: `topogeometry`. Bu bir sütun değil, bir krallıktır. Bir ilçeyi "Benim kenarlarım şunlardır, düğümlerim bunlardır" diye topoloji şemalarına kaydedişidir.

**[Teori / Kavramsal Çerçeve]**
`AddGeometryColumn` fonksiyonunu yıllarca kullandınız. Şimdi onun gelişmiş kuzeni `AddTopoGeometryColumn` ile tanışın.
`AddTopoGeometryColumn`, veritabanınızda var olan (veya yeni açtığınız) bir tabloya öyle sihirli bir sütun ekler ki, o sütunun veri tipi `topogeometry` olur. Bu sütun, içine asla "MULTIPOLYGON(((35 44...)))" tutmaz!
Onun yerine, `sehir_evreni` şemasındaki Face 1, Face 2, Edge 10 gibi topolojik kimlik numaralarından (`{topology_id, layer_id, topo_id, type}`) oluşan ufacık bir kimlik (Pointer/Referans) listesi tutar. Bu sayede tablonuz o devasa karmaşanın içindeki "Ben şu kenarlardan oluşan parselim" beyanını sisteme yazar. Şema `sehir_evreni`'dir, tablonuz ise onun bir aktörüdür (Layer 1).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `kamu_parselleri` adında boş bir tablomuz var. Bu tablomuzda bir `id` ve `isim` var, fakat henüz şekli yok. O şeklin bildiğiniz kopuk çizimli (geometry) değil, topolojiyle örülü (topogeometry) olmasını sağlayacağımız o devrimsel an:

`-- 1. Parametre: 'sehir_evreni' (Daha önce CreateTopology ile açtığımız şema)`
`-- 2. Parametre: 'public' (Bulunduğumuz asıl tablo şeması)`
`-- 3. Parametre: 'kamu_parselleri' (Tablonun kendisi)`
`-- 4. Parametre: 'tg_geom' (Yeni topolojik sütunumuzun adı!)`
`-- 5. Parametre: 'POLYGON' (Parça parça kenarlardan 'yüzey' üretecek)`
`SELECT AddTopoGeometryColumn(`
`  'sehir_evreni',`
`  'public',`
`  'kamu_parselleri',`
`  'tg_geom',`
`  'POLYGON'`
`);`

Sorgu döndüğünde ekranda `1` yazar. Bu, evreninizdeki 1. Katman (Layer) olduğunu kanıtlar. Asıl veriniz olan "kamu_parselleri" tablosunun yeni `tg_geom` adında, daha önce hiç görmediği `topogeometry` veri türüyle donatılmış, yüzeyi topoloji şemasıyla "Sponsorlu" hale getirilmiş bir hücreye sahip olduğunu görürsünüz!

**[Kapanış]**
Evreni (CreateTopology) kurdunuz ve içine dünyalı parsel tablonuzu kaydettirdiniz (AddTopoGeometryColumn). Peki bu güce, eski nesil spagetti `geom` verinizi "Otomatik olarak dönüştürüp, kenarlarına ve köşelerine ayrıştırarak (Snap) Topolojiye" nasıl dökersiniz? PostGIS'in en ağır matematiksel operasyonlarından birine, Dönüştürücü (toTopoGeom) makinesine (Ders 4) yaklaşıyoruz. Devam edelim.