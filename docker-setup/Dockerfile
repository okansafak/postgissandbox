FROM postgres:16.2-bookworm

RUN apt-mark hold postgresql-16 postgresql-client-16 \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
       postgresql-16-postgis-3 \
       postgresql-16-postgis-3-scripts \
       postgresql-16-pgrouting \
       postgresql-16-h3 \
       gdal-bin \
    && rm -rf /var/lib/apt/lists/*
