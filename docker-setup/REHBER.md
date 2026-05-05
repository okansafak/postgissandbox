# PostGIS Akademi: Docker Veritabanı Kurulum Rehberi

Bu rehber, PostGIS Akademi eğitiminde kullanılan sorguları ve analizleri yerel ortamda çalıştırmak için gerekli olan Docker kurulumunu ve veri seti yapısını açıklar.

## 1. Kurulum Adımları

Eğitim veritabanını ayağa kaldırmak için terminalde `docker-setup` dizinine giderek şu komutu çalıştırın:

```bash
docker compose up -d --build
```

Bu komut:
- **Dockerfile** üzerinden PostGIS, pgRouting ve GDAL (ogr2ogr) araçlarını içeren özel bir imaj derler.
- `konya_egitim` adında bir veritabanı oluşturur.
- `init-db/` klasöründeki SQL ve Shell betiklerini sırayla çalıştırarak şema ve verileri yükler.

## 2. Veritabanı Bağlantı Bilgileri

- **Host:** localhost
- **Port:** 5442
- **Database:** konya_egitim
- **User:** egitim
- **Password:** egitim2024

## 3. Veritabanı Şeması ve Veri Yapısı

Veriler mantıksal olarak 3 ana şemaya bölünmüştür:
1. **konya:** Temel belediye verileri (Mahalle, Hastane, Yol, İlçe Sınırları).
2. **egitim:** Global veriler ve PostGIS fonksiyon testleri.
3. **analiz:** Büyük veri (IoT), kaza kümeleri ve pgRouting ağı.

### Başlangıç Dosyaları (`init-db/`):

| Dosya Adı | Kapsam | Durum |
|-----------|--------|-------|
| `01-extensions.sql` | PostGIS, pgRouting, Topology eklentileri ve Şemalar | ✅ Hazır |
| `02-schema.sql` | Veritabanı tablo yapılarının (DDL) oluşturulması | ✅ Hazır |
| `03-import-geojson.sh` | ogr2ogr ile İl, İlçe, Mahalle ve Yol verilerinin aktarımı | ✅ Hazır |
| `04-base-data.sql` | Temel eğitim verileri (Hastaneler, Örnek Noktalar vb.) | ✅ Hazır |
| `05-training-geometries.sql` | Geometri test verileri ve projeksiyon örnekleri | ✅ Hazır |
| `06-performance-dataset.sql` | 10.000+ satırlık test verisi ve indeks performans testleri | ✅ Hazır |
| `07-analysis-advanced.sql` | pgRouting ağı ve ileri düzey mekansal analizler | ✅ Hazır |
| `08-lesson-import-csv.sql` | CSV Import ve Staging tablo yönetimi dersi | ✅ Hazır |

## 4. Doğrulama

Kurulumu doğrulamak için herhangi bir SQL editörüyle bağlanıp şu sorguyu çalıştırın:
```sql
SELECT postgis_full_version();
SELECT * FROM konya.mahalleler LIMIT 5;
```
