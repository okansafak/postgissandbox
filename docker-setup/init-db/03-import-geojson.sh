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
    -sql "SELECT text AS ad FROM iller_maks"

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
    -sql "SELECT text AS ad FROM ilceler_maks"

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
    -sql "SELECT text AS ad, source_district_name AS ilce FROM mahalle_maks"

# 4. YOLLAR AKTARIMI (Çoklu İlçe Verisi)
# *_yollar.geojson -> konya.osm_yollar
echo ">>> İlçe yolları aktarılıyor..."
# Tabloyu önce temizle
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.osm_yollar;"

for f in /docker-entrypoint-initdb.d/data/*_yollar.geojson; do
    filename=$(basename "$f")
    layer_name="${filename%.geojson}"
    ilce_adi="${layer_name%_yollar}"
    echo ">>>> $ilce_adi yolları yükleniyor ($layer_name)..."
    
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" \
        -nln konya.osm_yollar \
        -append \
        -nlt MULTILINESTRING \
        -lco GEOMETRY_NAME=geom \
        -sql "SELECT text AS ad, 'Bilinmiyor' AS tip, '$ilce_adi' AS ilce FROM \"$layer_name\""
done

# 5. POI (HİS) AKTARIMI (Ayrı Dosyalar Halinde)
# Tabloyu temizle
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.poi;"

# 5.1 Hastaneler (*_hastane.geojson)
for f in /docker-entrypoint-initdb.d/data/*_hastane.geojson; do
    filename=$(basename "$f")
    ilce_adi="${filename%_hastane.geojson}"
    echo ">>>> $ilce_adi hastaneleri yükleniyor..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -lco GEOMETRY_NAME=geom \
        -sql "SELECT name AS ad, 'Hastane' AS kategori, '$ilce_adi' AS ilce FROM \"${filename%.geojson}\""
done

# 5.2 Okullar (*_okul.geojson)
for f in /docker-entrypoint-initdb.d/data/*_okul.geojson; do
    filename=$(basename "$f")
    ilce_adi="${filename%_okul.geojson}"
    echo ">>>> $ilce_adi okulları yükleniyor..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -lco GEOMETRY_NAME=geom \
        -sql "SELECT name AS ad, 'Okul' AS kategori, '$ilce_adi' AS ilce FROM \"${filename%.geojson}\""
done

# 5.3 Duraklar (*_durak.geojson)
for f in /docker-entrypoint-initdb.d/data/*_durak.geojson; do
    filename=$(basename "$f")
    ilce_adi="${filename%_durak.geojson}"
    echo ">>>> $ilce_adi durakları yükleniyor..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -lco GEOMETRY_NAME=geom \
        -sql "SELECT name AS ad, 'Durak' AS kategori, '$ilce_adi' AS ilce FROM \"${filename%.geojson}\""
done

echo ">>> Veri aktarımı başarıyla tamamlandı."
