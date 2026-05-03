# PostGIS Akademi: Docker Veritabanı Kurulum Rehberi

Bu rehber, PostGIS Akademi eğitiminde kullanılan sorguları ve analizleri yerel ortamda çalıştırmak için gerekli olan Docker kurulumunu ve veri seti yapısını açıklar.

## 1. Kurulum Adımları

Eğitim veritabanını ayağa kaldırmak için terminalde `docker-setup` dizinine giderek şu komutu çalıştırın:

```bash
docker-compose up -d
```

Bu komut:
- **PostgreSQL 16** ve **PostGIS 3.4** imajını indirir.
- `konya_egitim` adında bir veritabanı oluşturur.
- `init-db/` klasöründeki SQL dosyalarını sırayla çalıştırarak şema ve gerçekçi örnek verileri yükler.

## 2. Veritabanı Bağlantı Bilgileri

- **Host:** localhost
- **Port:** 5432
- **Database:** konya_egitim
- **User:** egitim
- **Password:** egitim2024

## 3. Veritabanı Şeması ve Veri Yapısı

Veriler mantıksal olarak 3 ana şemaya bölünmüştür:
1. **konya:** Temel belediye verileri (Mahalle, Hastane, Yol).
2. **egitim:** Global veriler ve PostGIS fonksiyon testleri.
3. **analiz:** Büyük veri (IoT), kaza kümeleri ve pgRouting ağı.

### Başlangıç Dosyaları (`init-db/`):

| Dosya Adı | Kapsam | Durum |
|-----------|--------|-------|
| `01-extensions.sql` | PostGIS, pgRouting, Topology eklentileri ve Şemalar | ✅ Hazır |
| `02-konya-base-data.sql` | Gerçek Konya Mahalle, Hastane ve Yol verileri | ✅ Hazır |
| `03-training-geometries.sql` | Global şehirler, Geçersiz geometriler ve Projeksiyon testleri | ✅ Hazır |
| `04-performance-dataset.sql` | 100.000 satırlık IoT verisi ve Partitioning testleri | ✅ Hazır |
| `05-analysis-advanced.sql` | pgRouting ağı, Kaza kümeleri ve RLS politikaları | ✅ Hazır |

## 4. Ek Veri Yükleme (Önemli)

Eğitim sırasında kullanılacak devasa veri setlerini (OSM Binalar, Natural Earth vb.) nasıl indireceğiniz ve veritabanına nasıl aktaracağınız **`data.md`** dosyasında detaylıca anlatılmıştır.

## 5. Doğrulama

Kurulumu doğrulamak için herhangi bir SQL editörüyle bağlanıp şu sorguyu çalıştırın:
```sql
SELECT postgis_full_version();
SELECT * FROM konya.mahalleler;
```
