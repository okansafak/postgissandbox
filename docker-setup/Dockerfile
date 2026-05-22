FROM postgres:16-bookworm

RUN apt-mark hold postgresql-16 postgresql-client-16 \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
       postgresql-16-postgis-3 \
       postgresql-16-postgis-3-scripts \
       postgresql-16-pgrouting \
       postgresql-16-h3 \
       postgresql-16-wal2json \
       postgresql-server-dev-16 \
       build-essential \
       git \
       ca-certificates \
       gdal-bin \
    && git clone --depth=1 https://github.com/df7cb/pg_dirtyread.git /tmp/pg_dirtyread \
    && cd /tmp/pg_dirtyread && make && make install \
    && rm -rf /tmp/pg_dirtyread \
    && rm -rf /var/lib/apt/lists/*
