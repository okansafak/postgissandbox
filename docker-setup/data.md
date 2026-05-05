# Konya PostGIS Akademi — Veri Hazırlama ve Yönetim Rehberi

Bu rehber, eğitim boyunca kullanılan verilerin temini, yapısı ve veritabanına aktarımı için hazırlanmıştır. Eğitimlerin kusursuz geçmesi için veri altyapısı `docker-setup` içerisinde hazır olarak sunulmaktadır.

## 1. Veri Organizasyonu ve Otomasyon

Eğitim verileri artık `docker-setup/init-db/data/` klasörü altında merkezi olarak yönetilmektedir. Docker ayağa kalktığında bu veriler otomatik olarak ilgili tablolara aktarılır.

### Kurulum ve Başlatma
```bash
cd docker-setup
docker compose up -d --build
```
*Not: `--build` bayrağı, pgRouting ve GDAL araçlarını içeren özel imajın derlenmesini sağlar.*

---

## 2. Mevcut Veri Setleri (Hazır Gelenler)

Aşağıdaki veriler `init-db/data/` klasöründe mevcuttur ve kurulumla birlikte otomatik yüklenir:

| Tablo Adı | Kaynak Dosya | Açıklama / Kullanım Alanı |
| :--- | :--- | :--- |
| **konya.il_sinirlari** | `iller_maks.json` | Türkiye il sınırları (Büyük ölçekli analizler) |
| **konya.ilce_sinirlari**| `ilceler_maks.json` | Konya ilçe sınırları (ST_Subdivide, Partitioning) |
| **konya.mahalleler** | `mahalle_maks.json` | Konya mahalle sınırları (Spatial Joins, Aggregations) |
| **konya.osm_yollar** | `*_yollar.geojson` | Karatay, Meram, Selçuklu ve Çumra yol ağları (pgRouting) |
| **konya.staging_import**| `nufus.csv` | Ham nüfus verisi (Bölüm 2: CSV Import & Staging) |

---

## 3. Ek Veri İndirme Talimatları (Egzersizler İçin)

Öğrencilerin kendi verilerini çekebilmeleri için aşağıdaki kaynaklar önerilir:

### A. OpenStreetMap (OSM) — Overpass Turbo
[Overpass Turbo](https://overpass-turbo.eu/) üzerinden Konya için şu sorguları GeoJSON olarak dışa aktarabilirsiniz:

#### 1. Temel Noktasal Veriler
- **Hastaneler**: `node["amenity"="hospital"]`
- **Duraklar**: `node["highway"="bus_stop"]`
- **Binalar**: `way["building"]`

#### 2. İlçe Bazlı POI Verileri (Hastane, Okul, Durak)
Analizlerde karmaşa olmaması için POI verilerini tiplerine göre ayrı ayrı indirip isimlendirmeniz önerilir:

**A. Hastaneler**
```text
[out:json];
area["name"="Selçuklu"]->.a;
node["amenity"="hospital"](area.a);
out body; >; out skel qt;
```
*Dosya Adı:* `selcuklu_hastane.geojson`

**B. Okullar**
```text
[out:json];
area["name"="Selçuklu"]->.a;
node["amenity"="school"](area.a);
out body; >; out skel qt;
```
*Dosya Adı:* `selcuklu_okul.geojson`

**C. Duraklar**
```text
[out:json]; area["name"="Selçuklu"]->.a;
node["highway"="bus_stop"](area.a);
out body; >; out skel qt;
```
*Dosya Adı:* `selcuklu_durak.geojson`

**D. Camiler (Gelişmiş Sorgu)**
Hem nokta hem de poligon olarak tutulan camileri merkez noktasıyla birlikte indirmek için:
```text
[out:json][timeout:25];
area["name"="Selçuklu"]->.a;
(
  node["amenity"="place_of_worship"]["religion"="muslim"](area.a);
  way["amenity"="place_of_worship"]["religion"="muslim"](area.a);
);
out center;
```
*Dosya Adı:* `selcuklu_cami.geojson`

**E. Diğer Önemli Noktalar (Ders Zenginleştirme)**
Aşağıdaki tabloda verilen tag'leri kullanarak benzer sorgular oluşturabilirsiniz:

| Kategori | Overpass Tag | Örnek Dosya Adı | Analiz Senaryosu |
| :--- | :--- | :--- | :--- |
| **Eczane** | `node["amenity"="pharmacy"]` | `selcuklu_eczane.geojson` | En yakın nöbetçi eczane (KNN) |
| **Cami** | `node["amenity"="place_of_worship"]["religion"="muslim"]` | `meram_cami.geojson` | Hizmet etki alanı (Buffer) |
| **Market** | `node["shop"~"supermarket|convenience"]` | `karatay_market.geojson` | Ticari erişilebilirlik analizi |
| **Park** | `way["leisure"="park"]` | `selcuklu_park.geojson` | Mahalle başına yeşil alan ölçümü |

**Önemli:** Dosya isimleri `[ilce]_[tip].geojson` formatında (Örn: `meram_eczane.geojson`) olmalıdır. Sistem bu isimlerden otomatik olarak ilçe ve kategori bilgisini ayıklayarak `konya.poi` tablosuna yazacaktır.

#### 3. İlçe Bazlı Yol Ağları (pgRouting İçin)
Çumra, Meram, Selçuklu veya Karatay gibi spesifik ilçelerin yol ağlarını indirmek için:

```text
[out:json][timeout:25];
area["name"="Selçuklu"]->.searchArea;
(
  way["highway"~"trunk|primary|secondary|tertiary|residential"](area.searchArea);
);
out body;
>;
out skel qt;
```

**Kayıt Bilgisi:**
- Dosyayı `[ilce_adi]_yollar.geojson` olarak kaydedin (Örn: `karatay_yollar.geojson`).
- Bu veriler otomatik olarak `konya.osm_yollar` tablosuna aktarılacak ve ilçe bilgisi otomatik eklenecektir.

### B. CSV ve Global Veriler
- **USGS Earthquake Data**: [Son 30 Günün Depremleri](https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) (CSV Import testi için ideal).
- **Natural Earth**: [Dünya Şehirleri](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/populated-places/) (Shapefile projeksiyon testleri için).

---

## 4. Veri Aktarım Stratejileri (Eğitim Kapsamı)

### ogr2ogr (GeoJSON -> PostGIS)
Otomatik aktarım betiği (`03-import-geojson.sh`) şu mantıkla çalışır:
```bash
# İlçe yollarını döngüyle ve ilçe adını ekleyerek aktarma örneği:
ogr2ogr -f "PostgreSQL" "$DB_CONN" "karatay_yollar.geojson" \
    -nln konya.osm_yollar -append \
    -sql "SELECT text AS ad, 'Bilinmiyor' AS tip, 'Karatay' AS ilce FROM karatay_yollar"
```

### PostgreSQL COPY (CSV -> Staging)
Bölüm 2'de işlenecek kirli veri temizleme senaryosu:
```sql
-- data/nufus.csv dosyasını staging tablosuna al
COPY konya.nufus_staging FROM '/docker-entrypoint-initdb.d/data/nufus.csv' WITH (FORMAT text);
```

---

## 5. Ders - Veri Eşleşme Matrisi

| Eğitim Modülü | İşlenen Konu | Kullanılan Veri / Tablo |
| :--- | :--- | :--- |
| **Bölüm 0** | SQL Temelleri | `egitim.personel`, `konya.mahalleler` |
| **Bölüm 1** | Spatial Analiz | `konya.mahalleler`, `konya.osm_yollar` (ST_Length, ST_Intersects) |
| **Bölüm 2** | Performans & ETL | `nufus.csv` (Regex), `konya.ilce_sinirlari` (Subdivide, Indeks) |
| **Bölüm 3** | İleri Analiz | `konya.osm_yollar` (pgr_dijkstra), `duraklar` (Clustering) |

---

## 6. Kritik Kontrol Listesi
- **Geometry Type**: Yol verileri `MULTILINESTRING` olarak tutulur. `ogr2ogr` aktarımında `-nlt MULTILINESTRING` kullanılması önerilir.
- **SRID**: Tüm veriler varsayılan olarak `EPSG:4326` (WGS84) koordinat sistemindedir.
- **Dizin Erişimi**: Docker içinde veriler `/docker-entrypoint-initdb.d/data/` yolunda bulunur. SQL komutlarında bu yol kullanılmalıdır.
