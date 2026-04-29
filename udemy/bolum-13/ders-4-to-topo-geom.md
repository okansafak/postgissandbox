# Ders 4: Spagetti Geometriyi Ağlara Örmek (toTopoGeom)

**[Giriş / Hook]**
Tablonuza (Örn: `kamu_parselleri`) gururla yeni `tg_geom` (TopoGeometry) sütununu eklediniz. Peki ya o tablonuzdaki diğer sütunda, sizin eski usül, iç içe binmiş, kaymış, çizilmiş çöp "eski" spagetti geometri (`geom`) koordinatlarınız duruyorsa? O milyarlarca spagettilik poligon telini alıp otomatik olarak "Topoloji Evreninize (sehir_evreni)" düğümlerine (`node`), çizgilerine (`edge_data`) ve yüzeylerine (`face`) bölüştürerek, yepyeni bir şekilde bağlayacak ve `tg_geom` sütununa o yeni "Topolojik Kimliklerini" basacak makine nerede? Karşınızda PostGIS'in en mucizevi ve donanıma en ağır gelen çamaşır makinesi: `toTopoGeom` fonksiyonu.

**[Teori / Kavramsal Çerçeve]**
`toTopoGeom(eski_geom, topology_adi, layer_hucresi)`: 
Bir geometriyi (`eski_geom`: POLYGON VEYA LINESTRING) içeri atarsınız. O alır, daha önce yarattığımız "10 santim (0.1)" toleransına göre, diğer şekille milimetrik yaklaşıklıkları olan kenarları "TEK BİR KENAR (Edge)" yapar (Snap to Grid). Topoloji Evrenindeki Node deposuna köşe noktalarını tekil olarak kaydeder. Sonra size "Ben bunu topoloji şemasında Edge 10, 11 ve 12 olarak tasnifledim, al sana referans fişi" diyerek `TopoGeometry` olarak geri verir. Bu `UPDATE` operasyonunu çalıştırdığınız an, spagetti tablonuz "Akıllı, Birbirine Kenetli, Sınır Paylaşan, Kurumsal" bir mimariye terfi eder. Veri tabanının çarkları devasa bir hesaplama döndürür (Büyük alanlarda aylar bile sürebilir).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `kamu_parselleri` tablosundaki `geom` (eski usul spagetti sütunu) var. Onu yepyeni, elit `tg_geom` (az önce açtığımız TopoGeometry sütununa) update edeceğiz.
(1. Katman (Layer) olduğunu önceki `AddTopoGeometryColumn` sonucumuzda `1` geldiği için biliyoruz!)

`-- 'kamu_parselleri' tablosunu satır satır Topoloji'ye aktarıyoruz:`
`-- Eski 'geom' okunacak, Yeni topoloji makinesine (sehir_evreni) atılacak, Layer 1 olarak.`
`UPDATE kamu_parselleri`
`SET tg_geom = toTopoGeom(geom, 'sehir_evreni', 1);`

Tebrikler. Bu UPDATE komutu bittikten sonra "eski spagetti geom" sütununu sonsuza kadar `DROP` edebilirsiniz. Artık her parsel yüzeyi, sadece "Face ID'lerinden" oluşur. Parsellerinizin arasında boşluk yoktur. Arama motorunuz "Hangi parsellerin kenarları ortak?" (ST_Touches) sorusunu Koordinat (Matematik/CPU/Float) arayarak bulmaz. Veritabanının `edge_data` tablosuna bakar: "A parselinde Edge14 var, B parselinde de Edge14 var. O zaman bunlar ortaktır = TRUE" diyerek bir saniyede Milyonlarca Join'i anında cevaplar (İndeks (Integer) kıyaslamasıyla!).

**[Kapanış]**
Evren kuruldu, veri tipleri atandı, sıradan çizgiler akıllı ağlara (Topolojiye) UPDATE edildi. Ancak PostGIS mimarlığında en korkulan şey, dışarıdan gelen (ya da kullanıcının bilmeden değiştirdiği) bir kaydın bu "Kusursuz Birleşimi" bozup bozmadığıdır. Sınırlar patladı mı? Delikler açıldı mı? O kopuk çizgileri sistemden nasıl ihraç edeceğiz, hataları nasıl bulacağız? Sistem hataları ve Onarım: `ValidateTopology`. Ders 5 ile Topolojiyi ve Kalite Kontrolü zirveye taşıyoruz.