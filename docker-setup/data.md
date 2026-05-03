# Konya PostGIS Akademi — Veri Hazırlama Rehberi

Bu rehber, sunumlarda (Bölüm 0, 1, 2 ve 3) kullanılan gerçek dünya senaryolarını uygulayabilmeniz için gerekli verilerin temini ve veritabanına aktarımı için hazırlanmıştır. Eğitimlerin kusursuz geçmesi için veri altyapısının eksiksiz olması şarttır.

## 1. Veritabanı ve Şema Yapısı
Eğitim boyunca tüm veriler `konya` veritabanı altında saklanacaktır. Temel veriler `konya` şemasında, analiz sonuçları ise `analiz` şemasında tutulacaktır.
```sql
-- Docker ortamında bu adımlar init-db klasöründeki SQL'ler ile otomatik yapılır.
-- Ancak manuel kurulum için:
CREATE DATABASE konya;
\c konya
CREATE SCHEMA konya;
CREATE SCHEMA analiz;
```

---

## 2. Veri Kaynakları ve İndirme Talimatları

### A. OpenStreetMap (OSM) — Overpass Turbo
Konya'nın güncel verilerini çekmek için [Overpass Turbo](https://overpass-turbo.eu/) kullanacağız. Haritayı Konya üzerine getirin ve aşağıdaki sorguları çalıştırıp **GeoJSON** olarak dışa aktarın.

| Tablo Adı | Overpass Sorgu Kodu (Tag) | Ne İçin Kullanılacak? | Dosya Adı |
| :--- | :--- | :--- | :--- |
| **konya.mahalleler** | `relation["admin_level"="8"]["name"~"Mahallesi"]` | Kapsama (Contains), Alan Ölçümü | `mahalleler.geojson` |
| **konya.ilce_sinirlari**| `relation["admin_level"="6"]` | ST_Subdivide ve Partitioning | `ilceler.geojson` |
| **konya.hastaneler** | `node["amenity"="hospital"]` | JOIN, Buffer, KNN (<->) | `hastaneler.geojson` |
| **konya.osm_yollar** | `way["highway"~"trunk\|primary\|secondary\|tertiary"]` | pgRouting, Linear Referencing | `yollar.geojson` |
| **konya.osm_binalar**| `way["building"]` | GiST İndeks, ST_Simplify | `binalar.geojson` |
| **konya.duraklar**   | `node["highway"="bus_stop"]` | ST_ClusterKMeans (Bölüm 3) | `duraklar.geojson` |

### B. Örnek CSV Dosyaları (Bölüm 2 İçin)
Bölüm 2'deki "Staging ve Batch Processing" örneği için bir adet CSV dosyasına ihtiyacımız olacak.
*   **İhtiyaç:** `veri.csv` adında, içerisinde Konya'daki sahte kaza veya olay verileri bulunan bir dosya.
*   **Hazırlık:** Bu dosyayı docker container içerisine kopyalayarak `COPY konya.temp_tablo FROM 'veri.csv' WITH (FORMAT csv, HEADER);` komutunu test edeceğiz.

---

## 3. Verileri İçe Aktarma (Import) Stratejileri

### ogr2ogr ile Aktarım (Terminalden)
GeoJSON dosyalarını PostGIS'e aktarmanın en hızlı yoludur. Docker terminaline (veya lokal terminalinize) girerek çalıştırın:

```bash
# Mahalleleri aktar
ogr2ogr -f "PostgreSQL" PG:"dbname=konya user=postgis password=postgis host=localhost port=5442" \
  mahalleler.geojson -nln konya.mahalleler -lco GEOMETRY_NAME=geom

# Yolları aktar (Ağ analizi için kritik)
ogr2ogr -f "PostgreSQL" PG:"dbname=konya user=postgis password=postgis host=localhost port=5442" \
  yollar.geojson -nln konya.osm_yollar -lco GEOMETRY_NAME=geom
```

### pgRouting (Ağ Analizi) İçin Topoloji Hazırlığı (Bölüm 3.2 Öncesi)
`osm_yollar` tablosunu pgRouting'in anlayabileceği Node-Edge yapısına dönüştürmek:
```sql
ALTER TABLE konya.osm_yollar ADD COLUMN source INTEGER;
ALTER TABLE konya.osm_yollar ADD COLUMN target INTEGER;
ALTER TABLE konya.osm_yollar ADD COLUMN cost DOUBLE PRECISION;

-- Maliyet (cost) olarak uzunluk hesaplanıyor
UPDATE konya.osm_yollar SET cost = ST_Length(geom::geography);

-- Topoloji inşası (Bu işlem yolların birbirine bağlandığı düğümleri oluşturur)
SELECT pgr_createTopology('konya.osm_yollar', 0.00001, 'geom', 'id');
```

---

## 4. Tam Kapsamlı Ders-Veri Eşleşme Matrisi

| Eğitim Modülü | İşlenen Konu / Analiz | Hedef Tablo(lar) | İşlem ve Amacı |
| :--- | :--- | :--- | :--- |
| **Bölüm 0** | WHERE, GROUP BY, LIMIT | `konya.mahalleler` | Nüfusa göre sıralama, ilçeye göre gruplama. |
| **Bölüm 0** | LEFT JOIN | `hastaneler` + `mahalleler` | Hastanesi olmayan mahalleleri bulma. |
| **Bölüm 1** | ST_Transform | `konya.mahalleler` | EPSG:4326'dan yerel EPSG'ye (Metrik) geçiş. |
| **Bölüm 1** | ST_Intersects, ST_Contains | `hastaneler` + `mahalleler` | Hastane hangi ilçede/mahallede düşüyor? |
| **Bölüm 1** | KNN Operatörü (`<->`) | `konya.osm_binalar` | En yakın 5 binayı hızlıca bulma. |
| **Bölüm 2** | ST_Subdivide | `konya.ilce_sinirlari` | Devasa ilçe poligonunu performans için parçalama. |
| **Bölüm 2** | &&, EXPLAIN ANALYZE | `konya.osm_binalar` | Bounding Box testi ve indeks kullanımının incelenmesi. |
| **Bölüm 2** | Partitioning (Tablo Bölümleme)| `konya.mahalleler` (İlçe bazlı) | Veriyi fiziksel disklere ayırarak hızlandırma (Pruning). |
| **Bölüm 3** | ST_ClusterKMeans / DBSCAN | `konya.duraklar` / Kazalar | Nokta verilerinden yoğunluk bölgeleri çıkarma. |
| **Bölüm 3** | pgr_dijkstra | `konya.osm_yollar` | İki nokta arası en kısa ve optimum rotanın bulunması. |
| **Bölüm 3** | ST_HexagonGrid | `konya.mahalleler` | Konya haritasını petek (h3) gridlerine bölme. |

---

## 5. Eğitmen İçin Kritik Kontrol Listesi
*   **SRID Uyumu:** İndirdiğiniz tüm GeoJSON verilerinin `EPSG:4326` (WGS84) olduğundan emin olun. Transform işlemleri eğitim sırasında yapılacaktır.
*   **Tablo Şişmesi (Bloat):** Eğitim öncesi tablo güncellemeleri yaptıysanız, indeks bozulmalarını engellemek için eğitime girmeden önce mutlaka `VACUUM ANALYZE;` komutunu çalıştırın.
*   **Validasyon:** Öğrencilere `ST_MakeValid` komutunu uygulamalı göstermek için `konya.ilce_sinirlari` tablosuna kasıtlı olarak hatalı bir poligon (self-intersection) ekleyebilirsiniz.
