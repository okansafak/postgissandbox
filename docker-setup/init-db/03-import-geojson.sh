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

# 1. İL SINIRLARI AKTARIMI
# iller_maks.json -> konya.il_sinirlari
echo ">>> İl sınırları aktarılıyor..."
ogr2ogr -f "PostgreSQL" "$DB_CONN" \
    "/docker-entrypoint-initdb.d/data/iller_maks.json" \
    -nln konya.il_sinirlari \
    -nlt MULTIPOLYGON \
    -lco GEOMETRY_NAME=geom \
    -overwrite \
    -progress \
    -sql "SELECT text AS ad FROM features"

# 2. İLÇE SINIRLARI AKTARIMI
# ilceler_maks.json -> konya.ilce_sinirlari
echo ">>> İlçeler aktarılıyor..."
ogr2ogr -f "PostgreSQL" "$DB_CONN" \
    "/docker-entrypoint-initdb.d/data/ilceler_maks.json" \
    -nln konya.ilce_sinirlari \
    -nlt MULTIPOLYGON \
    -lco GEOMETRY_NAME=geom \
    -overwrite \
    -progress \
    -sql "SELECT text AS ad FROM features"

# 3. MAHALLELER AKTARIMI
# mahalle_maks.json -> konya.mahalleler
echo ">>> Mahalleler aktarılıyor (bu işlem biraz sürebilir)..."
ogr2ogr -f "PostgreSQL" "$DB_CONN" \
    "/docker-entrypoint-initdb.d/data/mahalle_maks.json" \
    -nln konya.mahalleler \
    -nlt MULTIPOLYGON \
    -lco GEOMETRY_NAME=geom \
    -overwrite \
    -progress \
    -sql "SELECT text AS ad, source_district_name AS ilce FROM features"

# 4. YOLLAR AKTARIMI (Çoklu İlçe Verisi)
# *_yollar.geojson -> konya.osm_yollar
echo ">>> İlçe yolları aktarılıyor..."
# Tabloyu önce temizle (eğer overwrite isteniyorsa)
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.osm_yollar;"

for f in /docker-entrypoint-initdb.d/data/*_yollar.geojson; do
    filename=$(basename "$f")
    ilce_adi="${filename%_yollar.geojson}"
    echo ">>>> $ilce_adi yolları yükleniyor..."
    
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" \
        -nln konya.osm_yollar \
        -append \
        -lco GEOMETRY_NAME=geom \
        -sql "SELECT name AS ad, highway AS tip, '$ilce_adi' AS ilce FROM features"
done

echo ">>> Veri aktarımı başarıyla tamamlandı."
