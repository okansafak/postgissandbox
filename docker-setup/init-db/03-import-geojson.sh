#!/bin/bash
set -e

# ============================================================
# PostGIS Akademi — 03-import-geojson: Büyük Veri Aktarımı
# Çalıştırılma Sırası: 3/6 (01-schema.sql sonrası)
# ============================================================
# Bu betik, ogr2ogr aracını kullanarak büyük GeoJSON dosyalarını
# veritabanına aktarır.

echo ">>> Büyük veri aktarımı başlatılıyor (GeoJSON -> PostGIS)..."

# Veritabanı bağlantı dizesi (Docker environment değişkenlerinden alınır)
DB_CONN="PG:dbname=$POSTGRES_DB user=$POSTGRES_USER password=$POSTGRES_PASSWORD"

# 1. İLÇE SINIRLARI AKTARIMI
# ilceler_maks.json -> konya.ilce_sinirlari
echo ">>> İlçeler aktarılıyor..."
ogr2ogr -f "PostgreSQL" "$DB_CONN" \
    "/docker-entrypoint-initdb.d/ilceler_maks.json" \
    -nln konya.ilce_sinirlari \
    -nlt MULTIPOLYGON \
    -lco GEOMETRY_NAME=geom \
    -lco FID=id \
    -lco OVERWRITE=YES \
    -sql "SELECT text AS ad FROM features"

# 2. MAHALLELER AKTARIMI
# mahalle_maks.json -> konya.mahalleler
echo ">>> Mahalleler aktarılıyor (bu işlem biraz sürebilir)..."
ogr2ogr -f "PostgreSQL" "$DB_CONN" \
    "/docker-entrypoint-initdb.d/mahalle_maks.json" \
    -nln konya.mahalleler \
    -nlt MULTIPOLYGON \
    -lco GEOMETRY_NAME=geom \
    -lco FID=id \
    -lco OVERWRITE=YES \
    -sql "SELECT text AS ad, source_district_name AS ilce FROM features"

echo ">>> Veri aktarımı başarıyla tamamlandı."
