# PostGIS Akademi: Bölüm 1 - Spatial SQL Fundamentals
**2. Gün (6., 7. ve 8. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 6] 10:00 - 10:50 | Mimari, Veri Tipleri ve Geometri

### [Slayt 1] Kapak: Spatial SQL Fundamentals
**(Süre: 2 Dakika)**
**Sahne Metni:**
"Standart SQL yeteneklerimizi pekiştirdik. Artık veritabanımıza coğrafi zeka katmanın zamanı geldi. Bu bölümde, mekansal veritabanı mimarisini, geometri modellerini, dünyanın küreselliği ile ekranın düzlüğünü uzlaştıran projeksiyon sistemlerini ve temel mekansal ilişkileri (Spatial SQL) inceleyeceğiz."

### [Slayt 2] 1.1 — Kuruluma ve Platforma Giriş
**(Süre: 8 Dakika | Soru: Neden pglite yerine Docker?)**
**Sahne Metni:**
"CBS, sadece harita çizmek değil; veriyi konumuyla yönetmektir. İstemci tarafında çalışan hafif çözümler (örneğin tarayıcıda çalışan pglite) prototipler için uygun olsa da, Konya gibi devasa bir şehrin verilerini yönetirken kısıtlıdır. Üretim (production) ortamlarında Docker gibi izole edilmiş, tam ölçekli sunucu mimarilerine ihtiyaç duyarız."

**Canlı Uygulama / Görev (Sürüm Kontrolü Yap):**
*   **Görev:** Sisteminizdeki PostGIS sürümünü not edin.
*   **Aksiyon:** `SELECT postgis_version();` komutunu çalıştırarak eklentinin durumunu kontrol edin.

### [Slayt 3] 1.2 — PostgreSQL Temelleri ve Mimari
**(Süre: 7 Dakika | Soru: Şema kullanımı neden şarttır?)**
**Sahne Metni:**
"Veritabanında hiyerarşi mühimdir. Kurumsal veritabanımızda 'Cluster (Servis) → Database → Schema → Table' dizilimi vardır. Tüm veriyi aynı klasöre atmak yerine Şemalar kullanırız. Şemalar, İmar, Ulaşım, Altyapı gibi farklı birimlerin verilerini izole eder, yetki yönetimini kolaylaştırır."

**Canlı Uygulama / Görev (Şemaları Listele):**
*   **Aksiyon:** `SELECT nspname FROM pg_namespace;` komutuyla mevcut şemaları listeleyin.

### [Slayt 4] 1.2 — Tablespace, MVCC ve İzolasyon
**(Süre: 8 Dakika | Soru: MVCC neden mekansal analizde önemlidir?)**
**Sahne Metni:**
"Performans mimariden doğar. `Tablespace`, örneğin mekansal indeksleri hızlı SSD'lere taşımanıza olanak sağlar. En büyük gücümüz ise MVCC (Multi-Version Concurrency Control) mimarisidir. Devasa bir mekansal analiz (SELECT) saatlerce çalışırken, sahadaki personel veri girişi (INSERT) yapmaya devam edebilir. Okuma ve yazma işlemleri birbirini kilitlemez."

**Canlı Uygulama / Görev (Tablespace Bilgisini Gör):**
*   **Aksiyon:** `SELECT * FROM pg_tablespace;`

### [Slayt 5] 1.3 — Geometri Tipleri
**(Süre: 10 Dakika | Soru: POINT vs MULTIPOINT?)**
**Sahne Metni:**
"Coğrafyayı veritabanına POINT, LINESTRING ve POLYGON gibi temel tiplerle kaydederiz. Bazen bir nesne fiziksel olarak ayrı olsa da mantıksal olarak tek kayıttır (örneğin aynı adadaki iki ayrı orman parçası). Bu durumlarda MULTIPOLYGON veya MULTIPOINT kullanırız."

**Canlı Uygulama / Görev (Poligon Oluştur):**
*   **Aksiyon:** `SELECT ST_GeomFromText('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))');` (Poligon başladığı noktada bitmek zorundadır.)

### [Slayt 6] 1.3 — WKT, EWKT, WKB ve Metadata
**(Süre: 7 Dakika | Soru: Binary (WKB) neden önemlidir?)**
**Sahne Metni:**
"Geometriler, metin formatı olarak WKT, ikili format olan WKB ile depolanır. Binary format veriyi bilgisayarın anladığı dilde tuttuğu için metin dönüşümü gerektirmez. Milyonlarca satırlık okuma yazma işlemlerinde (I/O) çok daha hızlıdır ve hassasiyet kaybı yaşatmaz."

**Canlı Uygulama / Görev (Geometriyi Metin Olarak Gör):**
*   **Aksiyon:** `SELECT ST_AsText(geom) FROM konya.mahalleler LIMIT 1;`

### [Slayt 7] 1.3 — Geçerlilik (ST_IsValid)
**(Süre: 8 Dakika | Soru: Neden geçersiz veri oluşur?)**
**Sahne Metni:**
"Analize başlamadan önceki en kritik adım verinin geçerliliğidir. Kendi üzerine katlanan çizgiler (self-intersection) poligonu geçersiz kılar ve tüm topolojik analizlerinizi hatalı çıkarır. Bu yüzden operasyonel setlerde mutlaka `ST_IsValid` kontrolleri yapılmalıdır."

**Canlı Uygulama / Görev (Hatalı Veriyi Onar):**
*   **Aksiyon:** Hatalı geometri bulunduğunda `SELECT ST_MakeValid(geom)` ile otomatik onarım işlemi gerçekleştirin.

---

## [Ders 7] 11:00 - 11:50 | Projeksiyonlar ve Mekansal İlişkiler

### [Slayt 8] 1.4 — SRID ve Projeksiyon Sistemleri
**(Süre: 10 Dakika | Soru: EPSG nedir?)**
**Sahne Metni:**
"Dünya yuvarlaktır, ekranlarımız ise düz. Küresel yüzeylerin dijital ekranlara aktarılması projeksiyonlarla (SRID) mümkündür. EPSG, bu sistemleri standardize eden global bir koddur. Dünyayı dereceyle ölçen EPSG:4326 gibi küresel sistemler olduğu gibi, Türkiye için metreyle ölçen yerel EPSG:5255 sistemleri de mevcuttur. PostGIS tüm bu parametreleri `spatial_ref_sys` tablosunda saklar."

**Canlı Uygulama / Görev (Projeksiyon Ara):**
*   **Aksiyon:** `SELECT srtext FROM spatial_ref_sys WHERE srid = 5255;`

### [Slayt 9] 1.4 — Geometry vs Geography Ayrımı
**(Süre: 8 Dakika | Soru: Neden her zaman Geography kullanmıyoruz?)**
**Sahne Metni:**
"Geography tipi küresel matematik kullanır ve ölçümleri her zaman mükemmel bir şekilde metre cinsinden verir. Geometry ise düzlemseldir ve birimi derecedir. Peki neden hep Geography kullanmıyoruz? Çünkü küresel matematik işlemciyi çok yorar ve PostGIS'teki bazı fonksiyonlar Geography'i desteklemez."

**Canlı Uygulama / Görev (Alan Ölç):**
*   **Aksiyon:** `SELECT ST_Area(geom::geography) FROM konya.mahalleler LIMIT 1;`

### [Slayt 10] 1.4 — SetSRID != Transform ve Türkiye Sistemleri
**(Süre: 10 Dakika | Soru: Hangisi koordinatı değiştirir?)**
**Sahne Metni:**
"İki önemli dönüştürme fonksiyonu vardır. `ST_SetSRID` sadece verinin üzerine bir etiket yapıştırır, koordinata dokunmaz. Ancak `ST_Transform` koordinatları matematiksel olarak bir sistemden diğerine hesaplayarak taşır. Konya'daki verimizi Google Maps'e göndermek istersek Transform etmemiz gerekir."

**Canlı Uygulama / Görev (Web Mercator'a Çevir):**
*   **Aksiyon:** `SELECT ST_Transform(geom, 3857) FROM konya.mahalleler LIMIT 1;`

### [Slayt 11] 1.5 — Mekansal İlişkiler (Contains, Within, Intersects)
**(Süre: 8 Dakika | Soru: Contains vs Within?)**
**Sahne Metni:**
"Konumsal analizin asıl yeteneği veri kümelerinin birbirleriyle ilişkisidir. `ST_Intersects` iki nesne birbirine temas ediyor mu diye bakar. `Contains` (kapsar) ve `Within` (içinde kalır) aynı durumun iki farklı bakış açısıdır. Mahalle binayı kapsar (Contains), bina mahallenin içindedir (Within)."

**Canlı Uygulama / Görev (Kesişen Alanları Bul):**
*   **Aksiyon:** `SELECT m.ad FROM konya.mahalleler m WHERE ST_Intersects(m.geom, 'POLYGON(...)');`

### [Slayt 12] 1.5 — İleri İlişkiler (Touches, Crosses, DWithin)
**(Süre: 7 Dakika | Soru: ST_Touches neyi yakalamaz?)**
**Sahne Metni:**
"Komşuluk ilişkilerini ararken `ST_Touches` kullanırız. Ancak nesneler birbirinin üzerine biniyorsa veya tamamen içindeyse Touches çalışmaz, sadece sınırdan teması kabul eder. Mesafe ararken ise `ST_DWithin` kullanmak hayati önem taşır çünkü indeksi kullanır."

**Canlı Uygulama / Görev (Kesişen Yolları Bul):**
*   **Aksiyon:** `SELECT * FROM konya.osm_yollar WHERE ST_Crosses(geom, 'LINESTRING(...)');`

### [Slayt 13] 1.5 — JOIN ile Mekansal İlişki
**(Süre: 7 Dakika | Soru: Mekansal Join neden pahalıdır?)**
**Sahne Metni:**
"Standart SQL dersinde verileri ID'ler üzerinden JOIN etmiştik. Şimdi ise konumları üzerinden birleştiriyoruz. Mekansal Join çok güçlüdür ancak pahalıdır. Çünkü iki tablodaki binlerce geometri tek tek birbiriyle kıyaslanır. İndeksleme olmadan bu işlem sistemi felç edebilir."

**Canlı Uygulama / Görev (Hastane-Mahalle Join Yap):**
*   **Aksiyon:** `SELECT h.ad, m.ad FROM konya.hastaneler h JOIN konya.mahalleler m ON ST_Within(h.geom, m.geom);`

---

## [Ders 8] 14:00 - 14:50 | Mekansal Ölçüm ve İleri Analizler

### [Slayt 14] 1.6 — Ölçüm (Distance, Area, Perimeter)
**(Süre: 10 Dakika | Soru: ST_Length neden derecedir?)**
**Sahne Metni:**
"PostGIS, mesafe, alan ve çevre uzunluğunu saniyeler içinde hesaplar. Ancak SRID'niz 4326 ise `ST_Length` size sonucu derece cinsinden verecektir. Bunu engellemek için ya `ST_Transform` ile metrik bir sisteme çevirmeli ya da doğrudan `::geography` türüne anlık dönüşüm (cast) yapmalısınız."

**Canlı Uygulama / Görev (Yol Uzunluğu Ölç):**
*   **Aksiyon:** `SELECT ST_Length(geom::geography) FROM konya.osm_yollar LIMIT 5;`

### [Slayt 15] 1.6 — Centroid vs PointOnSurface
**(Süre: 8 Dakika | Soru: Etiketleme için hangisi seçilmeli?)**
**Sahne Metni:**
"Analizlerde poligonların ağırlık merkezini bulmak sıklıkla gerekir. Ancak hilal veya U harfi gibi şekillerin ağırlık merkezi (`ST_Centroid`) poligonun dışına düşebilir. Bu nedenle etiket basarken her zaman `ST_PointOnSurface` kullanılmalıdır. Bu fonksiyon, garantili olarak poligonun içinden bir nokta döndürür."

**Canlı Uygulama / Görev (Yüzey Noktasını Bul):**
*   **Aksiyon:** `SELECT ST_AsText(ST_PointOnSurface(geom)) FROM konya.mahalleler LIMIT 1;`

### [Slayt 16] 1.6 — Buffer, Union ve Intersection
**(Süre: 10 Dakika | Soru: Buffer her zaman poligon mu döner?)**
**Sahne Metni:**
"Eğer bir boru hattının 50 metre sağına ve soluna tampon bölge kurmak istiyorsanız `ST_Buffer` kullanırsınız. Kaynak geometri nokta veya çizgi dahi olsa, Buffer her zaman bir poligon döner. `ST_Union` geometrileri birleştirirken, `ST_Intersection` kesişim alanlarını kesip çıkarır."

**Canlı Uygulama / Görev (İki Mahalle Birleştir):**
*   **Aksiyon:** `SELECT ST_Union(geom) FROM konya.mahalleler WHERE ad IN ('A', 'B');`

### [Slayt 17] 1.6 — Envelope ve ConvexHull
**(Süre: 10 Dakika | Soru: Envelope vs ConvexHull?)**
**Sahne Metni:**
"Karmaşık geometrilerin performansını artırmak için onları kapsayan dış hatlar oluştururuz. `ST_Envelope` nesneyi saran dik bir kutu (Bounding Box) oluşturur. `ST_ConvexHull` ise nesnenin dış uç noktalarından gerilmiş bir lastik bant gibi, dışbükey daha dar bir poligon çizer."

**Canlı Uygulama / Görev (Mahalle Grubunu Sar):**
*   **Aksiyon:** `SELECT ST_ConvexHull(ST_Collect(geom)) FROM konya.mahalleler WHERE ilce = 'Selçuklu';`

### [Slayt 18] 1.6 — En Yakın N Komşu (KNN)
**(Süre: 10 Dakika | Soru: Neden ST_Distance kullanmıyoruz?)**
**Sahne Metni:**
"'Bana en yakın 5 itfaiye istasyonunu bul' sorusuna klasik `ST_Distance` ile cevap ararsanız, veritabanı tüm itfaiye istasyonlarının uzaklığını tek tek hesaplar ve sıralar. Bu çok yavaştır. KNN dediğimiz özel `<->` operatörü ise, doğrudan GiST indeks ağacında dolaşarak matematik hesaplamadan sonucu saniyeler içinde size sunar. İleri düzey analizin sırrı budur."

**Canlı Uygulama / Görev (En Yakın 5 Binayı Bul):**
*   **Aksiyon:** `SELECT id FROM konya.osm_binalar ORDER BY geom <-> 'POINT(...)' LIMIT 5;`

### [Slayt 19] Kapanış
**(Süre: 2 Dakika)**
**Sahne Metni:**
"Mekansal SQL'in temellerini attınız. Artık veriyi sadece görmüyor, geometrik olarak sorguluyor, birbirleriyle ilişkilendiriyor ve ölçüyorsunuz. Bölüm 2'de, veritabanımızı devasa boyutlara taşıdığımızda bu işlerin ne kadar yavaşlayabildiğini görecek ve performans, optimizasyon gibi ileri mühendislik süreçlerine geçeceğiz. Teşekkürler."
