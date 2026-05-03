# Gerçek Veri Kaynakları ve Veritabanına Aktarım Rehberi

Eğitim boyunca PostGIS'in gücünü tam anlamıyla görebilmek için gerçek ve hacimli verilere ihtiyacımız olacak. Bu rehberde, dünyaca bilinen standart veri setlerini ve Konya'nın güncel harita verilerini nasıl indirip sisteminize kuracağınız adım adım açıklanmıştır.

## 1. Natural Earth Verileri (Global Veri Seti)
Natural Earth, dünya çapında ülke sınırları, şehirler, nehirler gibi verileri sunan ücretsiz bir kaynaktır.

### İndirme Adımları:
1. [Natural Earth Downloads](https://www.naturalearthdata.com/downloads/) adresine gidin.
2. **Large scale data, 1:10m** bölümüne tıklayın.
3. **Cultural** kategorisinden şu dosyaları indirin:
   - **Admin 0 - Countries** (Ülke Sınırları) -> "Download countries" (Shapefile olarak inecektir)
   - **Populated Places** (Şehirler) -> "Download populated places"

### Veritabanına Aktarma (shp2pgsql veya ogr2ogr ile):
İndirdiğiniz ZIP dosyalarını bir klasöre çıkartın. Terminalinizde (veya Docker içindeki bash'te) şu komutları kullanarak verileri aktarabilirsiniz:

**Seçenek A: `ogr2ogr` Kullanarak (Önerilen)**
```bash
# Ülkeleri Aktar
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=egitim password=egitim2024 dbname=konya_egitim" \
  ne_10m_admin_0_countries.shp -nln egitim.dunya_ulkeleri

# Şehirleri Aktar
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=egitim password=egitim2024 dbname=konya_egitim" \
  ne_10m_populated_places.shp -nln egitim.dunya_sehirleri
```

**Seçenek B: `shp2pgsql` Kullanarak**
```bash
shp2pgsql -I -s 4326 ne_10m_admin_0_countries.shp egitim.dunya_ulkeleri | psql -U egitim -d konya_egitim -h localhost
```

---

## 2. PostGIS Resmi Eğitim Verisi (NYC Dataset)
PostGIS'in kendi eğitim dökümantasyonunda kullanılan, hazır mekansal ilişkileri barındıran (metro istasyonları, caddeler, mahalleler) New York veri setidir.

### İndirme Adımları:
1. PostGIS eğitim sayfasında veri pakedi (data bundle) bulunur.
2. Doğrudan indirme linki: [postgis-workshop-2020.zip](https://postgis.net/workshops/postgis-intro/data/postgis-workshop-2020.zip) (Eğer link değişmişse eğitim dökümanından kontrol edin).
3. ZIP'i çıkarttığınızda içinde `nyc_data.backup` adında bir PostgreSQL yedek dosyası göreceksiniz.

### Veritabanına Aktarma (`pg_restore` ile):
Bu dosya bir "Custom" format yedeğidir. Terminalden şu şekilde aktarabilirsiniz:
```bash
pg_restore -h localhost -p 5432 -U egitim -d konya_egitim -1 nyc_data.backup
```

---

## 3. OpenStreetMap / Overpass Turbo (Gerçek Konya Verileri)
Konya'nın güncel mahalle sınırları, hastaneleri ve yollarını çekmek için en iyi yöntem Overpass Turbo kullanmaktır.

### İndirme Adımları:
1. [Overpass Turbo](https://overpass-turbo.eu/) adresine gidin.
2. Haritayı Konya üzerine kaydırın.
3. Sol taraftaki sorgu ekranına ihtiyacınıza göre aşağıdaki kodları yapıştırın:

**A. Konya Merkez İlçeleri (Poligon)**
```overpass
[out:json][timeout:25];
// Konya sınırları içinde Selçuklu, Meram, Karatay ilçeleri
area["name"="Konya"]->.searchArea;
(
  relation["admin_level"="6"]["name"~"Selçuklu|Meram|Karatay"](area.searchArea);
);
out body;
>;
out skel qt;
```

**B. Konya Ana Yolları (LineString)**
```overpass
[out:json][timeout:25];
area["name"="Konya"]->.searchArea;
(
  way["highway"~"trunk|primary|secondary"](area.searchArea);
);
out body;
>;
out skel qt;
```

**C. Konya Binaları (Performans ve ST_Simplify Testleri İçin Büyük Veri)**
```overpass
[out:json][timeout:50];
area["name"="Konya"]->.searchArea;
(
  way["building"](area.searchArea);
);
out body;
>;
out skel qt;
```

**D. Noktasal Veriler (Kümeleme / DBSCAN Analizi İçin)**
*Örn: Tüm eczaneler ve kafeler*
```overpass
[out:json][timeout:25];
area["name"="Konya"]->.searchArea;
(
  node["amenity"~"pharmacy|cafe"](area.searchArea);
);
out body;
>;
out skel qt;
```

4. Üst menüden **"Çalıştır (Run)"** butonuna basın. Haritada verilerin geldiğini göreceksiniz.
5. Üst menüden **"Dışa Aktar (Export)"** butonuna basın.
6. Veri formatı olarak **"GeoJSON"** seçin ve dosyayı bilgisayarınıza kaydedin (Örn: `konya_ilceler.geojson`, `konya_yollar.geojson`).

### Veritabanına Aktarma (`ogr2ogr` ile):
GeoJSON formatını veritabanına doğrudan tablo olarak yazmak çok kolaydır:

```bash
# İlçeleri Aktar
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=egitim password=egitim2024 dbname=konya_egitim" \
  konya_ilceler.geojson -nln konya.osm_ilceler

# Yolları Aktar
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=egitim password=egitim2024 dbname=konya_egitim" \
  konya_yollar.geojson -nln konya.osm_yollar
```

> **pgRouting İçin Önemli Not (Ağ Analizi):** 
> Yolları `ogr2ogr` ile GeoJSON'dan aktardığınızda yollar sisteme sadece "çizgi (LineString)" olarak girer. **Bölüm 3'teki Ağ Analizi (pgRouting)** uygulamalarını yapabilmek için bu çizgilerin başlangıç/bitiş düğümlerini (source/target) oluşturmanız gerekir.
> Bunu yapmak için veriyi aktardıktan sonra PostGIS içinde şu komutu çalıştırmalısınız:
> ```sql
> ALTER TABLE konya.osm_yollar ADD COLUMN source INTEGER;
> ALTER TABLE konya.osm_yollar ADD COLUMN target INTEGER;
> SELECT pgr_createTopology('konya.osm_yollar', 0.00001, 'geom', 'id');
> ```
> *(Alternatif olarak yolları PBF formatında indirip direkt `osm2pgrouting` aracı ile de veritabanına atabilirsiniz).*

> **Docker Kullanımı:** Docker kullanıyorsanız, `ogr2ogr` veya `pg_restore` komutlarını çalıştırmak için terminalden konteynerin içine girebilirsiniz:
> `docker exec -it konya_postgis_db bash`

---

## 4. İndirilen Verilerin Eğitim Bölümlerinde Kullanımı

Verileri başarıyla veritabanına aktardıktan sonra, eğitim sunumlarına (Bölüm 0, 1, 2, 3) paralel olarak bu tabloları şu şekilde kullanacaksınız:

### Bölüm 0 ve Bölüm 1: Mekansal Temeller ve Basit Sorgular
Bu bölümlerde amacımız geometrileri tanımak, alan/mesafe ölçmek ve temel ilişkileri (kesişim vb.) kurmaktır.
*   **Kullanılacak Veriler:** `egitim.dunya_sehirleri`, `egitim.dunya_ulkeleri`, `konya.osm_ilceler`
*   **Örnek Uygulamalar:**
    *   **Mesafe Ölçümü (Geography):** Natural Earth şehir verisini kullanarak Londra ile İstanbul arasındaki mesafeyi ölçmek (`ST_Distance`).
    *   **Alan Hesaplama:** Konya ilçelerinin (`osm_ilceler`) yüzölçümlerini metrekare ve kilometrekare cinsinden hesaplamak (`ST_Area`).
    *   **Mekansal Kesişim:** Hangi ilçelerin birbirine komşu olduğunu veya hangi noktanın hangi poligonun içinde düştüğünü test etmek (`ST_Intersects`, `ST_Within`).

### Bölüm 2: İndeks, Performans ve Büyük Veri İşlemleri
Bu bölümün odak noktası büyük veri setlerinde sorgu sürelerini saniyelerden milisaniyelere düşürmektir.
*   **Kullanılacak Veriler:** `konya.osm_binalar` (Overpass'tan çekilen on binlerce bina poligonu)
*   **Örnek Uygulamalar:**
    *   **GiST İndeksi Testi:** Binalar tablosunda belirli bir alanda arama yaparken (`ST_DWithin`), indeks olmadan (`EXPLAIN ANALYZE`) ne kadar sürdüğünü, indeks oluşturulduktan sonra (`CREATE INDEX idx_binalar ON konya.osm_binalar USING GIST(geom);`) performansın nasıl arttığını göstermek.
    *   **Geometri Basitleştirme:** Karmaşık bina poligonlarını web haritasında hızlı render etmek için nokta sayısını azaltmak (`ST_Simplify` veya `ST_SimplifyPreserveTopology`).

### Bölüm 3: İleri Analiz, Üretim (Production) ve pgRouting
Eğitimin son aşamasında gerçek dünya problemlerine çözümler üreteceğiz.
*   **Kullanılacak Veriler:** `konya.osm_yollar`, Noktasal POI verileri (Eczane/Kafe)
*   **Örnek Uygulamalar:**
    *   **Yoğunluk ve Kümeleme (DBSCAN):** Eczane veya kafelerin nerede yoğunlaştığını, hangi bölgelerde eksik olduğunu görmek için makine öğrenmesi tabanlı kümeleme analizi yapmak (`ST_ClusterDBSCAN`).
    *   **Rota Optimizasyonu (pgRouting):** `pgr_createTopology` ile topolojisi oluşturulmuş `osm_yollar` tablosunu kullanarak, Konya Şehir Hastanesi'nden belirli bir mahalleye gidecek en kısa veya en hızlı ambulans rotasını hesaplamak (`pgr_dijkstra` veya `pgr_astar`).
