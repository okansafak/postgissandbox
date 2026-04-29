# Ders 5: Yön ve Pusula Zekası (ST_Azimuth ile Radar Açısı)

**[Giriş / Hook]**
Gemi seferlerinde veya havacılık rotalarında araçlarınız haritada sadece A noktasından B noktasına giden bir vektör değildir. Kaptan, otonom sürüş sistemine "x, y konumuna git" demez; "Bana rüzgara göre veya tam Kuzey yıldızına göre olan yelken pusula derece mi (Rotamı), dönüş açımı ver" der. İki geometrik varlık arasındaki bu rotasyonel açıyı (Yön bilgisini) makineden süzüp alamıyorsanız, elinizde bir harita değil sadece ölü bir poster vardır.

**[Teori / Kavramsal Çerçeve]**
Birinci noktadan kalkıp ikinci noktaya doğru harekete geçtiğinizde, hareketinizin Tam Kuzey'e (North Pole - Y Ekseni) göre saat yönünde (Clockwise) çizdiği açı dalgasına "Azimut" denir. 
PostGIS bu askeri veya navigasyonel veriyi dönmek için `ST_Azimuth(A, B)` aracını kullanır.
Dikkat etmeniz gereken, çok temel ama ölümcül olan "Radyan" tuzağıdır. İşlemin çıktısı sizin pusula dereceniz değil, doğrudan Radyan birimidir. Radyanı insanların anlayabileceği 360 yüzlü pusula formatına çevirmek için sonucu `degrees()` fonksiyonu içine sarmalamanız elzemdir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda sıfır (Orijin) noktasında duran bir dronumuzu, kusursuzca kuzey doğuya (5, 5) uçuruyoruz. O saniyede navigasyon kadranında yazan Tam Derece (Compass Bearing) bilgisini çekeceğiz:
`SELECT `
  `ST_Azimuth(`
    `ST_MakePoint(0,0), `
    `ST_MakePoint(5,5)`
  `) AS rotanin_radyan_sekli,`
  `degrees(`
    `ST_Azimuth(`
      `ST_MakePoint(0,0), `
      `ST_MakePoint(5,5)`
    `)`
  `) AS pusula_derecesi_yonu;`

Sistemi ateşlediğinizde ekranın sağ kolonunda net ve pürüzsüz bir `45.0` (Derece) okunur. Sistem Tam Kuzey (0) ile Doğu (90) arasını yarmış, pusulayı KuzeyDoğuya asmıştır. Rotaları artık matematiksel pusulalarla dikte edebiliyorsunuz.

**[Kapanış]**
Detayları sadeleştirdik (Simplify), kütleleri ezip indeks ağacı için parçaladık (Subdivide), otobanlara izdüşüm çaktık (Linear Referencing) ve rotalara pusula açısı bindirdik (Azimuth). Bölüm 7 (Gelişmiş Cerrahi Operasyonlar) ile PostGIS motorundaki salt "alan/mesafe" ölçen temel analistlerin ötesine geçtiniz; artık uzayda geometrinin kendisine şekil veren bir kurumsal veri mimarısınız. 
Veri bilimindeki bu büyük zaferin ardından, rotalarla (Routing) ve A* agoritmalarıyla dünyayı ağ gibi bağlayacağımız (Day 3/Bölüm 8, pgRouting vb) ağ topolojilerine doğru vizyonu genişleteceğiz. Tebrikler.