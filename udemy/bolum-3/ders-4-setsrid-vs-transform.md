# Ders 4: Etiketleme mi, Dönüşüm mü? (ST_SetSRID vs. ST_Transform)

**[Giriş / Hook]**
Türkçe yazılmış bir dokümanın üstüne "İngilizce" etiketi yapıştırmak, içindeki kelimeleri tercüme etmez; sadece onu okuyacak kişiyi büyük bir yanılgıya sürükler. Uzamsal veritabanı yönetimindeki en yaygın ve en tehlikeli hata, bir geometrinin projeksiyon kimliğini (SRID) basitçe değiştirmekle, o geometrinin matematiksel olarak yeni sisteme dönüştürüldüğünü (Transform) zannetmektir.

**[Teori / Kavramsal Çerçeve]**
İki kritik PostGIS fonksiyonunu cerrahi bir dikkatle ayırmak zorundayız:
1. **ST_SetSRID(geom, srid):** Yalnızca metadata (üst bilgi) etiketidir. Geometrinin içindeki X ve Y sayılarını asla hesaplamaz veya ellemez. Sisteme, "Bu sayılar aslında şu SRID'ye aittir, haberin olsun" der. Genelde sıfırdan sentetik kurguladığınız koordinatlara referans vermek için bir defa kullanılır.
2. **ST_Transform(geom, yeni_srid):** Gerçek matematiksel dönüştürücüdür (Tercüman). Elindeki mevcut geometrinin bir SRID'si varsa, o sayılardan yola çıkarak belirtilen yepyeni SRID'ye geçiş yapar. `(28.97, 41.01)` olan enlem/boylam rakamlarını alır, karmaşık matris hesaplamalarından geçirir, hedef EPSG:3857 (Web Mercator) için metrik karşılıkları olan milyonlu X, Y dizgelerine (`3224921, 5013000`) dönüştürür. 

**[Uygulama / Ekran Gösterimi]**
Ortam penceremizde ölümcül hatanın ve doğru çözümün simülasyonunu yapıyoruz.
*Hatalı Deneme (Etiket Değiştirme):* 
`SELECT ST_AsText(ST_SetSRID(ST_SetSRID(ST_MakePoint(28.97, 41.01), 4326), 3857)) AS yanlis_etiket;`
Motor çıktı olarak yine `POINT(28.97 41.01)` üretir ancak etiketi 3857 (Metre bazlı sistem) olmuştur. Sistemin Web Mercator algısında bu X ve Y metrik algılanır. İstanbul'daki nokta, Afrika kıyılarının çok açığında, Ekvatorun hemen dibinde 28. "metre"ye düşer; gerçeklikten tamamen kopar.

*Doğru Mühendislik (Transformasyon):*
`SELECT ST_AsText(ST_Transform(ST_SetSRID(ST_MakePoint(28.97, 41.01), 4326), 3857)) AS organik_donusum;`
Komutu çalıştırdığımızda çıktı `POINT(3224921.84 5014389.92)` halini alır. Sistem matematiksel harita devrimini sırtlamış, derece konseptinden metre uzamına İstanbul'u kusursuz bir operasyonla tercüme etmiştir. Web haritaları (Google vb.) işte tam olarak bu metrajları kullanarak render (çizim) yapar.

**[Kapanış]**
SetSRID etiketler, Transform ise evrimleştirir. PostGIS analistliğinin anayasası budur. Veriyi global (GPS) ile Web ekranı arasında nasıl tercüme edeceğimizi gördük. Ancak ya operasyon tamamen bölgesel, yerel bir köprü baraj inşaatına aitse? Gelecek ve sondan bir önceki derste, merceği küreselden kendi topraklarımıza (Türkiye Özel EPSG kodlarına) çevireceğiz.