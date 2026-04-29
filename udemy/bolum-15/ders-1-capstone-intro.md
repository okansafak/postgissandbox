# Ders 1: Büyük Final (Capstone) Projesine Giriş: IUMP Mimarisi

**[Giriş / Hook]**
Eğitim boyunca satır satır komutlar yazdınız, geometriyi büktünüz, endekslerle performansı uçurdunuz ve güvenlik duvarları çektiniz. Peki ama gerçek dünyada, "Bize Uber, Getir veya Yemeksepeti gibi devasa bir uygulamanın arka planını (Backend) PostGIS ile tasarla" dediklerinde masaya nasıl oturacaksınız? Tekil fonksiyonlar işe yaramaz, "Mimari Vizyon" gerekir. Karşınızda Istanbul Urban Mobility Platform (IUMP) - İstanbul Kentsel Hareketlilik Platformu. Bu eğitimin son bölümü bir ders değil, sizin "Başmühendis" olduğunuz bir savaş odasıdır.

**[Teori / Kavramsal Çerçeve]**
Bir kentsel hareketlilik (Taksi / Kurye / Scooter) platformu üç temel ayaktan oluşur:
1. **Hareket Eden Varlıklar (Dinamic Geometries):** Saniyede bir konum güncelleyen taksiler/kuryeler (Sürekli INSERT/UPDATE, Yüksek I/O). Table: `arac_konumlari`.
2. **Statik Hizmet Bölgeleri (Polygons / Geofences):** İlçe sınırları, yasaklı bölgeler, teslimat alanları. Table: `hizmet_bolgeleri`.
3. **Yol Ağları ve Topoloji (Edges/Nodes):** pgRouting ile hesaplanacak sokak ve trafik ağları. Table: `istanbul_yollar`.
Bu üç farklı veri tabiatı (Çok hızlı değişen, Sabit kalan, Matematiksel ağ olan) aynı veritabanında yaşarken, mimariyi çöktürmemek için Şema (Schema) ayrımına gitmek zorundasınız.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda yeni, tertemiz bir veritabanı açıyor ve "Uygulamamızı" modüllere ayırarak şemalandırıyoruz:

`-- 1. IUMP Proje Veritabanı ve Eklentiler`
`CREATE DATABASE iump_db;`
`\c iump_db`

`CREATE EXTENSION postgis;`
`CREATE EXTENSION pgrouting;`
`CREATE EXTENSION postgis_topology;`

`-- 2. Kurumsal Şema (Schema) Mimarisinin İnşası`
`CREATE SCHEMA stg;     -- Staging (Dışarıdan gelen ham kirli veriler için)`
`CREATE SCHEMA core;    -- Core (Taksi konumları, müşteri siparişleri, canlı veriler)`
`CREATE SCHEMA ref;     -- Reference (Sabit sınırlar, mahalleler, posta kodları)`
`CREATE SCHEMA network; -- Network (pgRouting yol ağları ve topolojiler)`

Artık "public" şemasında çöp biriktiren acemi bir geliştirici değilsiniz. Verileri tabiatına göre `stg`, `core`, `ref` ve `network` odalarına ayıran bir yöneticisiniz.

**[Kapanış]**
Temel iskeleti kurdunuz. Veritabanının odaları hazır. Ama odalar bomboş. Bu odalara saniyede binlerce koordinatın, taksi sinyalinin ve müşteri siparişinin akacağı "Veri Besleme ve Kalite Kontrol" (Data Ingestion & Staging) mekanizmasını kurmamız gerekiyor. Kemerlerinizi bağlayın, boru hatlarını açıyoruz (Ders 2).