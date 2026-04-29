# Ders 3: Uzayı Kadranta Bölmek (SP-GiST İndeksi)

**[Giriş / Hook]**
Eğer elinizdeki veri koca koca şehir sınırları, boru hatları veya göllerse GiST indeksi mükemmel çalışır. Ancak ya veritabanınız, üst üste binen ve sürekli hareket eden yüz milyonlarca GPS noktasından, atılan milyonlarca sensör (IoT) sinyalinden veya çakışan teslimat lokasyonlarından ibaretse? Klasik GiST indeksi bu noktaları zarfladıkça, o zarflar sürekli birbiriyle çakışır (overlap) ve R-Ağacının performansı sönmeye başlar. Böylesi yoğun noktasal şoklara karşı, uzayı kusursuz kutucuklara bölen keskin bir cerrah lazımdır.

**[Teori / Kavramsal Çerçeve]**
Uzay-Bölümlemeli Genelleştirilmiş Arama Ağacı, yani `SP-GiST` (Space-Partitioned GiST), özellikle birbirinin üzerine binmeyen (non-overlapping) yapılarda, quad-tree (dörtlü-ağaç) felsefesiyle çalışır.
GiST, nesnelerin etrafına kutu çizerken; SP-GiST doğrudan dünyayı 4 eşit parçaya böler. Sonra o parçalardan dolu olanını bir daha 4'e böler, onu bir daha 4'e böler.
Eğer veriniz sadece *NOKTA* (Point) geometri tipindeyse, bu indeks türü klasik GiST'e göre inanılmaz derecede daha az yer kaplar ve özellikle yoğun noktasal aramalarda işlemciyi çok daha az yorar. Kurumsal ölçekte IoT (Nesnelerin İnterneti), araç takip ve mobil konum verisi ambarlarının mimarları SP-GiST'i baş köşede tutar.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `arac_sinyalleri` adındaki tabloda 50 milyon adet saf nokta (Point) verimiz var. Klasik hantal ağacı reddediyor, uzay-bölümlemeli (Quad-Tree) kurumsal zırhımızı inşa ediyoruz:
`CREATE INDEX idx_sinyaller_spgist `
`ON arac_sinyalleri `
`USING SPGIST (geom);`

Komut bittiğinde, arka planda PostGIS veriyi zarflara koyup birbirinin üstüne yığmayı bıraktı. Bunun yerine koordinat sitemini keskin gridlere, hücrelere ve kadrantalara kırdı. Bir aracın 5 metre karelik bir gridde olup olmadığını sormak artık bir matematiksel hesap değil; o hücrenin adresini sormaya dönüştü.

**[Kapanış]**
Saf nokta verilerinin yönetiminde, klasik giST ambalajlamasının yerine, mekanı jilet gibi dilimleyen SP-GiST zekasını entegre ettiniz. Endüstriyel seviyede optik performans ayarlarına tam olarak hakim olmaya başladınız. Peki, bu indekslerin ne zaman devreye girip ne zaman girmediğini PostGIS arka planda tam olarak nasıl ölçüyor? Sistemin çekirdeğinde zarfları (BBOX) çarpıştıran o sessiz `&&` operatörünün felsefesi nedir? Bir sonraki basamakta makinenin ilk savunma hattını, Zarf Çarpışması (BBOX Operator - &&) kuralını işleyeceğiz.