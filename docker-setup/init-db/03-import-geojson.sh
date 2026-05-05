#!/bin/bash
set -e

# ============================================================
# PostGIS Akademi — 03-import-geojson: Büyük Veri Aktarımı
# ============================================================
echo ">>> Büyük veri aktarımı başlatılıyor..."

DB_CONN="PG:dbname=$POSTGRES_DB user=$POSTGRES_USER password=$POSTGRES_PASSWORD"

# 1. İL SINIRLARI
echo ">>> İl sınırları aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.il_sinirlari;"
ogr2ogr -f "PostgreSQL" "$DB_CONN" "/docker-entrypoint-initdb.d/data/iller_maks.json" \
    -nln konya.il_sinirlari -nlt MULTIPOLYGON -lco GEOMETRY_NAME=geom -append -dialect SQLite \
    -sql "SELECT text AS ad, geometry FROM iller_maks"

# 2. İLÇE SINIRLARI
echo ">>> İlçeler aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.ilce_sinirlari;"
ogr2ogr -f "PostgreSQL" "$DB_CONN" "/docker-entrypoint-initdb.d/data/ilceler_maks.json" \
    -nln konya.ilce_sinirlari -nlt MULTIPOLYGON -lco GEOMETRY_NAME=geom -append -dialect SQLite \
    -sql "SELECT text AS ad, geometry FROM ilceler_maks"

# 3. MAHALLELER
echo ">>> Mahalleler aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.mahalleler;"
ogr2ogr -f "PostgreSQL" "$DB_CONN" "/docker-entrypoint-initdb.d/data/mahalle_maks.json" \
    -nln konya.mahalleler -nlt MULTIPOLYGON -lco GEOMETRY_NAME=geom -append -dialect SQLite \
    -sql "SELECT text AS ad, source_district_name AS ilce, geometry FROM mahalle_maks"

# 4. YOLLAR
echo ">>> İlçe yolları aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.osm_yollar;"
for f in /docker-entrypoint-initdb.d/data/*_yollar*.geojson; do
    [ -e "$f" ] || continue
    filename=$(basename "$f")
    layer_name="${filename%.geojson}"
    ilce_adi=$(echo "$filename" | cut -d'_' -f1)
    if [[ "$filename" == *"_maks"* ]]; then NAME_COL="text"; else NAME_COL="name"; fi
    
    echo ">>>> $ilce_adi yolları yükleniyor ($layer_name) [$NAME_COL]..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.osm_yollar -append -nlt MULTILINESTRING -lco GEOMETRY_NAME=geom -dialect SQLite \
        -sql "SELECT $NAME_COL AS ad, 'Bilinmiyor' AS tip, '$ilce_adi' AS ilce, geometry FROM \"$layer_name\""
done

# 5. POI
echo ">>> POI verileri aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.poi;"

# 5.1 Karma POI
for f in /docker-entrypoint-initdb.d/data/*_poi.geojson; do
    [ -e "$f" ] || continue
    filename=$(basename "$f")
    layer_name="${filename%.geojson}"
    ilce_adi="${filename%_poi.geojson}"
    echo ">>>> $ilce_adi karma POI yükleniyor ($layer_name)..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -nlt POINT -lco GEOMETRY_NAME=geom -dialect SQLite \
        -sql "SELECT name AS ad, COALESCE(amenity, highway, 'POI') AS kategori, '$ilce_adi' AS ilce, ST_PointOnSurface(geometry) AS geometry FROM \"$layer_name\""
done

# 5.2 Ayrı POI
for type in hastane okul durak eczane cami market park itfaiye yangin_vanasi; do
    for f in /docker-entrypoint-initdb.d/data/*_${type}.geojson; do
        [ -e "$f" ] || continue
        filename=$(basename "$f")
        layer_name="${filename%.geojson}"
        ilce_adi="${filename%_${type}.geojson}"
        kategori=$(echo ${type:0:1} | tr '[:lower:]' '[:upper:]')${type:1}
        
        if [[ "$filename" == *"_maks"* ]]; then NAME_COL="text"; else NAME_COL="name"; fi
        
        echo ">>>> $ilce_adi ${type} yükleniyor ($layer_name) [$NAME_COL]..."
        ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.poi -append -nlt POINT -lco GEOMETRY_NAME=geom -dialect SQLite \
            -sql "SELECT $NAME_COL AS ad, '$kategori' AS kategori, '$ilce_adi' AS ilce, ST_PointOnSurface(geometry) AS geometry FROM \"$layer_name\""
    done
done

# 6. BİNALAR
echo ">>> Bina verileri aktarılıyor..."
psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -c "TRUNCATE TABLE konya.osm_binalar;"
for f in /docker-entrypoint-initdb.d/data/*_bina.geojson; do
    [ -e "$f" ] || continue
    filename=$(basename "$f")
    layer_name="${filename%.geojson}"
    echo ">>>> $filename binaları yükleniyor ($layer_name)..."
    ogr2ogr -f "PostgreSQL" "$DB_CONN" "$f" -nln konya.osm_binalar -append -nlt MULTIPOLYGON -lco GEOMETRY_NAME=geom -dialect SQLite \
        -sql "SELECT COALESCE(building, 'Bilinmiyor') AS tip, 1 AS kat_sayisi, geometry FROM \"$layer_name\""
done

echo ">>> Veri aktarımı başarıyla tamamlandı."
