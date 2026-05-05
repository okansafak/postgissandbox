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
# *_yollar*.geojson -> konya.osm_yollar
echo ">>> İlçe yolları aktarılıyor..."
# Tabloyu önce temizle
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.osm_yollar;"

for f in /docker-entrypoint-initdb.d/data/*_yollar*.geojson; do
    filename=$(basename "$f")
    layer_name="${filename%.geojson}"
    # İlçe adını ayıkla (Örn: selcuklu_yollar_maks -> selcuklu)
    ilce_adi=$(echo "$filename" | cut -d'_' -f1)
    echo ">>>> $ilce_adi yolları yükleniyor ($layer_name)..."
    
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" \
        -nln konya.osm_yollar \
        -append \
        -nlt MULTILINESTRING \
        -lco GEOMETRY_NAME=geom \
        -sql "SELECT text AS ad, 'Bilinmiyor' AS tip, '$ilce_adi' AS ilce FROM \"$layer_name\""
done

# 5. POI (HİS) AKTARIMI
# Tabloyu temizle
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.poi;"

# 5.1 Karma POI Dosyaları (*_poi.geojson)
for f in /docker-entrypoint-initdb.d/data/*_poi.geojson; do
    filename=$(basename "$f")
    ilce_adi="${filename%_poi.geojson}"
    echo ">>>> $ilce_adi karma POI verileri yükleniyor..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -lco GEOMETRY_NAME=geom \
        -sql "SELECT name AS ad, COALESCE(amenity, highway, 'POI') AS kategori, '$ilce_adi' AS ilce FROM \"${filename%.geojson}\""
done

# 5.2 Ayrı POI Dosyaları (Hastane, Okul, Durak, Eczane, Cami, Market, Park vb.)
for type in hastane okul durak eczane cami market park; do
    for f in /docker-entrypoint-initdb.d/data/*_${type}.geojson; do
        [ -e "$f" ] || continue
        filename=$(basename "$f")
        ilce_adi="${filename%_${type}.geojson}"
        # Kategori adını büyük harfle başlat
        kategori=$(echo ${type:0:1} | tr '[:lower:]' '[:upper:]')${type:1}
        echo ">>>> $ilce_adi ${type} verileri yükleniyor..."
        ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -lco GEOMETRY_NAME=geom \
            -sql "SELECT name AS ad, '$kategori' AS kategori, '$ilce_adi' AS ilce FROM \"${filename%.geojson}\""
    done
done

echo ">>> Veri aktarımı başarıyla tamamlandı."
