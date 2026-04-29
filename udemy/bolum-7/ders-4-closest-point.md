# Ders 4: Boşluktaki Temas ve En Yakın İzdüşüm (ST_ClosestPoint)

**[Giriş / Hook]**
Asya kitası ile Avrupa kıtası, İstanbul boğazı ile yarılmış devasa iki ayrı poligondur. Siz, Karayolları Direktörü olarak "Karşı kıyı(poligon) ile beri kıyı(poligon) arasındaki en kısa köprü nereden nereye inşa edilmelidir?" sorusuna yanıt vereceksiniz. `ST_Distance` size 800 metre çeker deyip kestirip atar. Ama o köprünün tam ayaklarının basacağı, o iki kütlenin birbirini "en çok çektiği" uç koordinatlarını milimetrik olarak kim tespit edecek? Bu bir izdüşüm matematiğidir.

**[Teori / Kavramsal Çerçeve]**
Bir geometri B (Avrupa) referans alınarak, diğer geometri A'nın (Asya) ona en çok yaklaştığı noktayı bulmak için `ST_ClosestPoint(A, B)` fonskiyonu kullanılır. 
Bu, analitik mimaride sadece köprü kurmak için değil, "Bir kullanıcının denize en yakın olduğu kıyı şeridi noktasını hesaplamak" için de kritik öneme sahiptir. Kullanıcının oteline (Nokta) referans verilir, devasa sahil şeridine (Çizgi) bakılır. Deniz çizgisi üzerindeki en optimum (yakın) nokta çekip çıkartılır ve "Gideceğiniz En Yakın Plaj Koordinatı: Budur" denir.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüze geçiyoruz. Elimizde, deniz sahilini temsil eden düz bir çizgi ve içerilerde, kumsaldan uzakta duran bir Otel Pini (Noktası) var. Otelden çıkıp en kısa yoldan kumsala ayak bastığımız (en yakın) o o spesifik kumsal noktasını Point olarak çıkartıyoruz:
`SELECT ST_AsText(`
  `ST_ClosestPoint(`
    `-- A: Üzerinde nokta aradığımız hedef sahil çizgisi`
    `ST_GeomFromText('LINESTRING(0 0, 10 0, 20 0)'), `
    `-- B: Referans objemiz (Otel lokasyonu)`
    `ST_GeomFromText('POINT(5 5)') `
  `)`
`) AS en_kisa_yolun_plaj_noktasi;`

Veritabanı dikmeyi 90 derece iner, devasa kum şeridinin neresine basacağınızı milimi milimine kilitler ve size kusursuz izdüşüm noktasını (`POINT(5 0)`) geri döner.

**[Kapanış]**
Görünmeyeni ölçmek bir şeydir, görünmeyenin ayak izini bulmak bambaşka bir zekadır. Uzaydaki en mantıklı bağlantıları `ClosestPoint` sayesinde sağladınız. Peki, o köprüyü çizerken "Hangi açıyla denize yürüyorum, pusulam tam olarak kuzeye göre kaç derece sapmış durumda?" diye sorsam, harita bilimi buna nasıl yanıt verirdi? Serinin pusulası olan Azimut (ST_Azimuth) açısıyla bu eğitim bloğunu sonlandıracağız.