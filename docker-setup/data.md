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

### Sınır ve Yol Verileri
| Tablo Adı | Kaynak Dosya | Açıklama / Kullanım Alanı |
| :--- | :--- | :--- |
| **konya.il_sinirlari** | `iller_maks.json` | Türkiye il sınırları (Büyük ölçekli analizler) |
| **konya.ilce_sinirlari**| `ilceler_maks.json` | Konya ilçe sınırları (ST_Subdivide, Partitioning) |
| **konya.mahalleler** | `mahalle_maks.json` | Konya mahalle sınırları (Spatial Joins, Aggregations) |
| **konya.osm_yollar** | `*_yollar*.geojson` | Karatay, Meram, Selçuklu ve Çumra yol ağları (pgRouting) |

### POI (Önemli Noktalar)
| Tablo Adı | Kaynak Dosya | Açıklama / Kullanım Alanı |
| :--- | :--- | :--- |
| **konya.poi** *(hastane)* | `selcuklu_hastane.geojson` | KNN, Spatial Join (Bölüm 1, 3) |
| **konya.poi** *(okul)* | `selcuklu_okul.geojson` | Buffer, Partitioning (Bölüm 2) |
| **konya.poi** *(durak)* | `selcuklu_durak.geojson` | ST_ClusterKMeans (Bölüm 3) |
| **konya.poi** *(eczane)* | `selcuklu_eczane.geojson` | ST_ClusterDBSCAN (Bölüm 3) |
| **konya.poi** *(cami)* | `selcuklu_cami.geojson` | Buffer analizi (Bölüm 1) |

### Diğer Veriler
| Tablo Adı | Kaynak Dosya | Açıklama / Kullanım Alanı |
| :--- | :--- | :--- |
| **konya.staging_import**| `nufus.csv` | Ham nüfus verisi (Bölüm 2: CSV Import & Staging) |

---

## 3. Eksik Veriler (Eklenmesi Gereken)

Ders sunumları incelendiğinde aşağıdaki verilerin içerikte referans alındığı ancak henüz `data/` klasöründe bulunmadığı tespit edilmiştir:

| Eksik Veri | Kullanıldığı Bölüm | Kullanıldığı Senaryo | Overpass Tag |
| :--- | :--- | :--- | :--- |
| **osm_binalar** | Bölüm 1, 2, 3 | KNN, İndeks, Partition, Yoğunluk | `way["building"]` |
| **kazalar** (sentetik) | Bölüm 3 | ST_ClusterDBSCAN, Isı haritası | ✅ *Otomatik üretiliyor (07-analysis-advanced.sql)* |
| **itfaiye** | Bölüm 3 | Rota analizi, Erişim süresi | `node["amenity"="fire_station"]` |
| **parklar** | Bölüm 1, 3 | Yeşil alan ölçümü, HexagonGrid | `way["leisure"="park"]` |
| **marketler** | Bölüm 1 | Ticari erişilebilirlik analizi | `node["shop"~"supermarket\|convenience"]` |

> **Not:** `osm_binalar` en kritik eksiktir — Bölüm 1 (KNN, Spatial Join), Bölüm 2 (GiST İndeks, &&, Partitioning) ve Bölüm 3'te (HexagonGrid yoğunluk) yoğun olarak kullanılmaktadır.

---

## 4. Ek Veri İndirme Talimatları (Egzersizler İçin)

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

**E. Binalar (Kritik — Bölüm 1, 2, 3 İçin Şart)**
```text
[out:json][timeout:90];
area["name"="Selçuklu"]->.a;
way["building"](area.a);
out body; >; out skel qt;
```
*Dosya Adı:* `selcuklu_bina.geojson`
> ⚠️ Bu sorgu büyük veri döner. İlçe başına ayrı indirmek önerilir.

**F. İtfaiye İstasyonları (Bölüm 3 Rota Analizi)**
```text
[out:json];
area["name"="Konya"]->.a;
node["amenity"="fire_station"](area.a);
out body; >; out skel qt;
```
*Dosya Adı:* `konya_itfaiye.geojson`

**G. Diğer Önemli Noktalar (Ders Zenginleştirme)**
Aşağıdaki tabloda verilen tag'leri kullanarak benzer sorgular oluşturabilirsiniz:

| Kategori | Overpass Tag | Örnek Dosya Adı | Analiz Senaryosu |
| :--- | :--- | :--- | :--- |
| **Eczane** | `node["amenity"="pharmacy"]` | `selcuklu_eczane.geojson` | En yakın nöbetçi eczane (KNN) |
| **Cami** | `node["amenity"="place_of_worship"]["religion"="muslim"]` | `meram_cami.geojson` | Hizmet etki alanı (Buffer) |
| **Market** | `node["shop"~"supermarket\|convenience"]` | `karatay_market.geojson` | Ticari erişilebilirlik analizi |
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

## 5. Veri Aktarım Stratejileri (Eğitim Kapsamı)

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

## 6. Ders - Veri Eşleşme Matrisi (Detaylı)

| Eğitim Modülü | İşlenen Konu | Kullanılan Veri / Tablo | Durum |
| :--- | :--- | :--- | :--- |
| **Bölüm 0** | SELECT, WHERE, GROUP BY | `egitim.personel`, `konya.mahalleler` | ✅ Hazır |
| **Bölüm 0** | JOIN | `konya.hastaneler` + `konya.mahalleler` | ✅ Hazır |
| **Bölüm 1** | ST_Intersects, ST_Contains | `konya.mahalleler`, `konya.poi` (hastane) | ✅ Hazır |
| **Bölüm 1** | ST_DWithin, ST_Buffer | `konya.osm_yollar`, `konya.poi` (cami) | ✅ Hazır |
| **Bölüm 1** | KNN (`<->`) | `konya.poi` (hastane, eczane) | ✅ Hazır |
| **Bölüm 1** | Spatial Join (Bina-Mahalle) | `konya.osm_binalar` + `konya.mahalleler` | ⚠️ Bina eksik |
| **Bölüm 2** | CSV Import, Staging, Regex | `nufus.csv` → `konya.staging_import` | ✅ Hazır |
| **Bölüm 2** | ST_Subdivide | `konya.ilce_sinirlari` | ✅ Hazır |
| **Bölüm 2** | GiST İndeks, && operatörü | `konya.osm_binalar` | ⚠️ Bina eksik |
| **Bölüm 2** | Partitioning | `konya.osm_binalar` (İlçe bazlı) | ⚠️ Bina eksik |
| **Bölüm 2** | Linear Referencing | `konya.osm_yollar` | ✅ Hazır |
| **Bölüm 3** | ST_ClusterKMeans | `konya.poi` (durak) | ✅ Hazır |
| **Bölüm 3** | ST_ClusterDBSCAN | `konya.poi` (eczane) | ✅ Hazır |
| **Bölüm 3** | ST_HexagonGrid | `konya.osm_binalar`, `konya.mahalleler` | ⚠️ Bina eksik |
| **Bölüm 3** | pgr_dijkstra | `konya.osm_yollar` | ✅ Hazır |
| **Bölüm 3** | TSP (Çoklu Durak) | `konya.osm_yollar` | ✅ Hazır |
| **Bölüm 3** | Erişim Analizi (İtfaiye) | `konya.poi` (itfaiye) + `osm_yollar` | ⚠️ İtfaiye eksik |

---

## 7. Kritik Kontrol Listesi
- **Geometry Type**: Yol verileri `MULTILINESTRING` olarak tutulur. `ogr2ogr` aktarımında `-nlt MULTILINESTRING` kullanılması önerilir.
- **SRID**: Tüm veriler varsayılan olarak `EPSG:4326` (WGS84) koordinat sistemindedir.
- **Dizin Erişimi**: Docker içinde veriler `/docker-entrypoint-initdb.d/data/` yolunda bulunur. SQL komutlarında bu yol kullanılmalıdır.
- **Öncelikli Eksik**: `osm_binalar` verisi 3 bölümde yoğun olarak kullanılmaktadır; eğitim öncesi mutlaka temin edilmelidir.
