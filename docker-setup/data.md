# Konya PostGIS Akademi — Veri Hazırlama Rehberi

Bu rehber, sunumlarda (Bölüm 0, 1, 2 ve 3) kullanılan gerçek dünya senaryolarını uygulayabilmeniz için gerekli verilerin temini ve veritabanına aktarımı için hazırlanmıştır.

## 1. Veritabanı ve Şema Yapısı
Eğitim boyunca tüm veriler `konya` veritabanı altında ve `konya` şemasında saklanacaktır.
```sql
-- Docker ortamında otomatik oluşturulur ancak manuel kurulum için:
CREATE DATABASE konya;
\c konya
CREATE SCHEMA konya;
```

---

## 2. Veri Kaynakları ve İndirme Talimatları

### A. OpenStreetMap (OSM) — Overpass Turbo
Konya'nın güncel verilerini çekmek için [Overpass Turbo](https://overpass-turbo.eu/) kullanacağız. Haritayı Konya üzerine getirin ve aşağıdaki sorguları çalıştırıp **GeoJSON** olarak dışa aktarın.

| Tablo Adı | Overpass Sorgu Kodu (Tag) | Dosya Adı |
| :--- | :--- | :--- |
| **konya.mahalleler** | `relation["admin_level"="8"]["name"~"Mahallesi"]` | `mahalleler.geojson` |
| **konya.hastaneler** | `node["amenity"="hospital"]` | `hastaneler.geojson` |
| **konya.osm_yollar** | `way["highway"~"trunk|primary|secondary|tertiary"]` | `yollar.geojson` |
| **konya.osm_binalar**| `way["building"]` | `binalar.geojson` |
| **konya.duraklar**   | `node["highway"="bus_stop"]` | `duraklar.geojson` |

### B. Natural Earth (Global Analizler)
Bölüm 1'deki küresel mesafe ölçümleri için:
1. [Natural Earth](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/populated-places/) sitesinden **Populated Places** (Şehirler) verisini indirin.
2. Dosya adı: `ne_10m_populated_places.shp`

---

## 3. Verileri İçe Aktarma (Import)

### ogr2ogr ile GeoJSON Aktarımı (Önerilen)
GeoJSON dosyalarını Docker konteynerına kopyaladıktan sonra şu komutları çalıştırın:

```bash
# Mahalleleri aktar
ogr2ogr -f "PostgreSQL" PG:"dbname=konya user=postgis password=postgis host=localhost port=5442" \
  mahalleler.geojson -nln konya.mahalleler -lco GEOMETRY_NAME=geom

# Yolları aktar (Ağ analizi için)
ogr2ogr -f "PostgreSQL" PG:"dbname=konya user=postgis password=postgis host=localhost port=5442" \
  yollar.geojson -nln konya.osm_yollar -lco GEOMETRY_NAME=geom
```

### pgRouting (Ağ Analizi) İçin Topoloji Hazırlığı
**Bölüm 3.2**'ye geçmeden önce yollar tablosunu hazırlayın:
```sql
ALTER TABLE konya.osm_yollar ADD COLUMN source INTEGER;
ALTER TABLE konya.osm_yollar ADD COLUMN target INTEGER;
ALTER TABLE konya.osm_yollar ADD COLUMN cost DOUBLE PRECISION;
UPDATE konya.osm_yollar SET cost = ST_Length(geom::geography);
SELECT pgr_createTopology('konya.osm_yollar', 0.00001, 'geom', 'id');
```

---

## 4. Ders-Veri Eşleşme Matrisi

| Sunum Bölümü | Ders / Konu | Kullanılan Tablo | Neden? |
| :--- | :--- | :--- | :--- |
| **Bölüm 1** | 1.4 Projeksiyonlar | `konya.mahalleler` | TM33/UTM dönüşümleri ve alan hesabı için. |
| **Bölüm 1** | 1.5 Mekansal İlişkiler | `konya.hastaneler` | `ST_Intersects` ve `ST_Contains` testleri için. |
| **Bölüm 1** | 1.6 KNN Analizi | `konya.hastaneler` | En yakın 3 hastaneyi bulma (`<->` operatörü). |
| **Bölüm 2** | 2.2 Geometri Basitleştirme | `konya.osm_binalar` | `ST_Simplify` ve `ST_Subdivide` testleri için büyük veri. |
| **Bölüm 2** | 2.3 İndeksleme | `konya.osm_binalar` | GiST vs Seq Scan performans testi. |
| **Bölüm 3** | 3.1 Kümeleme | `konya.duraklar` | `ST_ClusterKMeans` ile durak optimizasyonu. |
| **Bölüm 3** | 3.2 Ağ Analizi | `konya.osm_yollar` | `pgr_dijkstra` ile en kısa rota hesabı. |
| **Bölüm 3** | 3.6 Kapanış Projesi | Tüm Tablolar | Afet anında erişilebilirlik analizi birleştirmesi. |

---

## 5. Önemli İpuçları
*   **SRID Kontrolü:** Aktardığınız tüm verilerin `4326` (WGS84) olduğundan emin olun.
*   **İstatistikler:** Büyük veri yükledikten sonra mutlaka `ANALYZE tablo_adi;` komutunu çalıştırın.
*   **Validasyon:** Verileri yükledikten sonra `SELECT count(*) FROM tablo WHERE ST_IsValid(geom) = false;` ile hata kontrolü yapın.
