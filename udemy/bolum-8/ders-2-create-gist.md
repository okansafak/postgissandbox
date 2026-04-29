# Ders 2: Coğrafyanın Bilişsel Ağacı (GiST İndeksi Yaratımı)

**[Giriş / Hook]**
Eğer masanızın üzerinde dağınık halde duran evrakları üst üste rastgele koyarsanız, aradığınız belgeyi bulmanın tek yolu tüm yığını deşmektir. Ancak onları departmanlara, yıllara ve konulara göre iç içe geçen klasörlere (zarflara) koyarsanız, en derindeki bir faturaya üç hamlede ulaşırsınız. PostGIS'in trilyonlarca koordinatı saniyenin binde birinde bulmasını sağlayan o kusursuz klasörleme sisteminin adı GiST'tir (Generalized Search Tree). 

**[Teori / Kavramsal Çerçeve]**
Metinleri ve sayıları klasörlemek kolaydır. GiST indeksinin uzamsal veride yaptığı sihir şudur: Tüm poligonları ve noktaları tek tek kendi etrafına çizilmiş görünmez matematiksel dikdörtgenlere (Bounding Box / Zarf) hapseder. Birbirine yakın olan zarfları, daha büyük bir zarfın, onları da devasa kıtasal bir zarfın içine koyar.
Siz "İstanbul'daki arabaları getir" dediğinizde, motor önce "Dünya" zarfını, sonra "Asya" zarfı es geçip "Avrupa/Anadolu" zarfını, oradan da direkt "İstanbul" zarfını açar. Milyarlarca nokta, üç ağaç dalı atlamasıyla saniyelerden milisaniyelere iner. Bu indeks uzamsal aramanın fiili endüstri standartıdır.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde o hantal tabloya nihayet zeka ve hiyerarşi aşılıyoruz. Dikkat edin, standart `CREATE INDEX` komutundan yapısal olarak ne kadar farklı:
`CREATE INDEX idx_sehirler_geom `
`ON sehirler `
`USING GIST (geom);`

Komut ateşlendi. Motor, `USING GIST` deklarasyonunu gördüğü an, o sütunun geometri olduğunu anlar ve R-Ağacı (R-Tree) mantığıyla tüm zarfları birbirinin içine şifreler.

Aynı sorguyu tekrar koşalım:
`EXPLAIN ANALYZE`
`SELECT id, isim FROM sehirler `
`WHERE ST_Intersects(geom, ST_MakeEnvelope(28.0, 40.0, 29.0, 41.0, 4326));`

Yeni rapor kusursuzdur: `Bitmap Heap Scan... Bitmap Index Scan on idx_sehirler_geom`. Sorgu maliyeti yüz binlerden, bir anda "4" veya "5" işlemci saniyesine (cost) düştü. Arama süresi mikrosaniyeler mertebesinde tamamlandı.

**[Kapanış]**
GIST ağacını diktik ve makinenin anlamsız veri yığınları arasında körlemesine yürümesini (Seq Scan) kalıcı olarak yok ettik. Çoğu harita mühendisi burada durur. Ancak ya elinizde zarflara hapsedilemeyecek kadar farklı bir dağınık veri varsa (örneğin sadece noktalar veya telefon baz istasyonları)? GiST'in ağaç modeli bu durumlarda gereksiz şişmeye (overlap) başlar. Gelecek derste noktaların amansız efendisi, uzay-bölücü SP-GiST indeksini laboratuvarımıza alacağız.