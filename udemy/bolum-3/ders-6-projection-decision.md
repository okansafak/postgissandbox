# Ders 6: Mimari Karar Matrisi - Projeksiyon Seçimi Stratejisi

**[Giriş / Hook]**
Her bilgi sisteminin temeli, verinin ilk diske yazıldığı gün atılır. Bir projenin koordinat sistemini (SRID) yanlış seçerseniz, projeniz aylar sonra on milyonlarca satır veriyle dolduğunda oluşacak "Teknik Borç", yazılımınızı bir saniyede felç edecek kadar yıkıcı bir maliyete ulaşır. Doğru projeksiyon kararı, bir kodlama tercihi değil, sistemin varoluş stratejisidir.

**[Teori / Kavramsal Çerçeve]**
Bir analist veya mimar olarak veritabanı kurulum toplantısındasınız ve verinin depolama genetiğine karar vermek zorundasınız. PostGIS evreninde üç ana arter (yaklaşım) vardır:

1. **Evrensel ve Standart Depolama (Karar: EPSG 4326 / WGS84):** 
   Sistem dünya genelindeki nesneleri (ülkeler, global gemi filosu) barındıracaksa, geometri tipi yerine Geography tipiyle birlikte 4326 referans seçilir. Mobil cihazların (GPS) yolladığı ve API dışa aktarımlarının (GeoJSON) beklediği organik dil budur. Hafıza yükü fazladır ancak evrenseldir.
2. **Görselleştirme İstihbaratı (Karar: EPSG 3857 / Web Mercator):**
   Amacınız analiz yapmaktan ziyade OpenLayers, Leaflet veya Mapbox üzerinde ultra hızlı ısı haritaları, Milyon noktalık cluster (kümeleme) renderları çizdirmekse, veritabanı her seferinde on the fly (anlık) transform yapmasın diye veriyi doğrudan 3857 tabanında depolarsınız. Alan hesabı yanlış çıkar ama görsel çizim milisaniyeler sürer.
3. **Hiper-Yerel Analiz ve Mühendislik (Karar: TUREF 5254 vb.):**
   Sektörünüz Kadastro, Altyapı, Telekom veya Otoyol planlamasıysa; alan hesaplarının (metrekare/hektar) santim şaşmaması lazımsa veriyi global değil o şehrin yerel EPSG dilimi üzerinden (Geometry olarak) kaydeder ve endekslersiniz. Transformasyon işlemini ise veritabanında değil, sadece dışarıya sunarken (veya içeri alırken kapıda) kurgularsınız.

**[Uygulama / Ekran Gösterimi (Özet)]**
Veriyi sisteme ilk kez yaratırken karar mekanizmanız verinin ruhuna entegre edilir:
*Analitik/Global depolama deklarasyonu:*
`CREATE TABLE varliklar (id SERIAL PRIMARY KEY, isim TEXT, konum GEOGRAPHY(Point, 4326));`
*Metrik/Mühendislik depolama deklarasyonu:*
`CREATE TABLE araziler (id SERIAL PRIMARY KEY, parsel_no INT, sinir GEOMETRY(Polygon, 5254));`

Strateji nettir: Saklama yapısını ihtiyaca göre belirle, gerektiğinde sadece çıktı (SELECT) esnasında anlık `ST_Transform` kullanarak farklı arayüzlere (web haritası vb.) yayın yap.

**[Kapanış]**
Harita Projeksiyonları ve Referans Sistemleri (SRID) bölümünü başarıyla geride bıraktık. Düz olanın kavisini, kavisli olanın düzlemini hesaba katma sanatında ustalaştınız. Artık uzayda nerede olduğunuzu kesin bir biçimde biliyorsunuz. Gelecek ve bir sonraki devasa bölümümüzde, nesneleri bir araya getiren "Uzamsal İlişkiler" (Spatial Relationships) bloğuna; iki geometrinin birbiriyle kesişim, kapsama ve temas savaşlarını masaya yatırmaya devasa bir adım atacağız. Analitiğin en ileri seviyesine hazır olun.