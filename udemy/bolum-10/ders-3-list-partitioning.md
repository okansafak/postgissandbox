# Ders 3: Kıtasal Böl-ve-Yönet (List Partitioning)

**[Giriş / Hook]**
Uluslararası bir kargo firmasının Global PostGIS Sunucusunu yönetiyorsunuz. Gelen konum pingleri Asya, Avrupa, Amerika ve Afrika kıtalarına dağılmış durumda. Eğer Avrupalı kullanıcı bir harita sorgusu (`ST_DWithin`) attığında, o sorgunun Amerika'daki milyonlarca lojistik verisinin içinde tur atması demek, sistem mimarinizin çökmüş olması demektir. Coğrafyaları ayırmak, tıpkı kıtaları okyanuslarla yarmak gibi; veri bloklarını kesin listelere hapsetmeyi gerektirir.

**[Teori / Kavramsal Çerçeve]**
Range (Aralık) bölümlendirmesi zamanı lineer keserken; Liste Bölümlendirme (List Partitioning) spesifik durum, bölge veya kategori kodlarına göre (örn: kıta adı, bayi kodu, kargo durumu="Teslim Edildi") veriyi izole bloklara böler.
Veriyi parçalarken her kıta (Amerika, Avrupa, Asya) için taptaze, bağımsız tablolar yaratırsınız. Ve en can alıcı mühendislik zaferi şudur: **Her bir alt tablonun indeksleri sadece kendine aittir.** Avrupa alt tablosunun GiST geometrisi sadece Avrupa'yı kapsar. Uzay ağacınız küçük, hafif ve kusursuz yanıt süreleriyle şimşek hızında çalışır. Tüm dünya için oluşturulan o hantal mega GiST ağacından nihayet kurtulmuşsunuzdur.

**[Uygulama / Ekran Gösterimi]**
Panomuza geçip, dev kargo pinglerimizi bölge bazında liste hiyerarşisine oturtuyoruz:
`-- 1. Ata Tablonun Liste Formatında Doğuşu`
`CREATE TABLE kargo_pingleri (`
  `id SERIAL,`
  `geom GEOMETRY(Point, 4326),`
  `kita_kodu VARCHAR(10) NOT NULL`
`) PARTITION BY LIST (kita_kodu);`

`-- 2. Kıtaların Fiziksel Disk Ayrışımı (Çocuklar)`
`CREATE TABLE kargo_amerika PARTITION OF kargo_pingleri FOR VALUES IN ('KA', 'GA');`
`CREATE TABLE kargo_avrupa PARTITION OF kargo_pingleri FOR VALUES IN ('AV');`
`CREATE TABLE kargo_asya PARTITION OF kargo_pingleri FOR VALUES IN ('AS');`

`-- 3. Ayrı Ayrı İndeks Ateşlemesi (Her Kıta Kendi Kutusunda)`
`CREATE INDEX idx_kargo_avrupa_geom ON kargo_avrupa USING GIST(geom);`
`CREATE INDEX idx_kargo_asya_geom ON kargo_asya USING GIST(geom);`

Bu kodların faturası şudur: Avrupa verisi Asya'yı yavaşlatamaz, Asya verisi Avrupa diskini ısıtamaz.

**[Kapanış]**
Gelen verinin türüne ve bölgesine göre sistemi modüler adalara parçaladık. Okyanusları aşıp mega tabloları devirdik. Fakat devirdik de, PostgreSQL'in zeki zihni (Planner), bir kullanıcı gelip "Sadece Asya'daki"leri ara dediğinde gerçekten diğerlerini es geçip o diski uyutacak mı? İşte sistemin en çok iftihar ettiği o kurumsal zeka kalkanını, Partition Pruning (Bölüm Budaması) vizyonunu bir sonraki aşamada göreceğiz.