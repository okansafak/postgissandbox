# Ders 2: Web'in Coğrafi Formatı ile Konuşmak (GeoJSON İçe Aktarımı ve Dönüşümü)

**[Giriş / Hook]**
Mobil uygulamanızdaki kurye tabletinden veya zengin bir web haritasından dönen veri koordinatları, asla sadece düz bir X ve Y olarak gelmezler. Bütün modern frameworkler sizinle "GeoJSON" isimli çok zengin ve kıvrımlı evrensel bir formatta iletişim kurar. Sisteminizin kapısına bir JSON objesi yığıldığında, PostGIS veritabanınız bu dış formatı kırmadan nasıl okuyacak ve onu nasıl saf geometriye dönüştürecek?

**[Teori / Kavramsal Çerçeve]**
GeoJSON, günümüz internetinde harita nesneleri aktarımı (payload) için fiili standarttır. Bir nokta veya çokgenin tüm geometrik düğümlerini JSON parantezleri ve dizileri (Array) içinde taşıyan yapılandırılmış bir ağdır. 
PostGIS'in bu web diline olan adaptasyonu kusursuzdur: `ST_GeomFromGeoJSON`. Eğer elinize GeoJSON yapısında paketlenmiş ham bir metin gelirse, bu fonksiyon o metnin genetiğini okur ve JSON parantezlerini eriterek veritabanının öz tabanında yaşayan saf bir POLYGON veya LINESTRING formuna dönüştürür. Tersi olarak ise, siz bu veriti istemciye ya da front-end tarafına (Web arayüzüne) göndermek istediğinizde `ST_AsGeoJSON` ile veritabanınız kendi formunu kolayca API diline paketleyiverir. PostGIS burada bir gümrük memuru ve tercüman olarak çalışmaktadır.

**[Uygulama / Ekran Gösterimi]**
Komut panelimize geçiyoruz. API arayüzünden gelen "GeoJSON" formatındaki özel bir bölge sınırını, tablomuza PostGIS geometrisi olarak enjekte edeceğiz:
`INSERT INTO bolgeler_yedek (isim, geom) `
`VALUES (`
  `'Kuzey Marmara Operasyon Zon',`
  `ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[28.1,41.2],[29.5,41.2],[29.5,40.8],[28.1,40.8],[28.1,41.2]]]}'), 4326)`
`);`

Sistem bu JSON karakter dizisini okudu, ne demek istediğini harfiyen anladı, içinden POLYGON kodunu ayrıştırdı ve SRID etiketini de basarak onu PostGIS uzayına kazıdı. Artık bu alanla her türlü uzamsal analitiği yapabilirsiniz. Hem de hiçbir üçüncü parti dönüştürücüye ihtiyaç duymadan.

**[Kapanış]**
Gelen verinin türü ne kadar dolaylı görünürse görünsün, PostGIS'in bu gümrükten başarılı ve pürüzsüz geçiş rotalarını kurmasını sağladık. Oysa gerçek kurumsal dünyalar devasa ve kirli verileri doğrudan ana tablolara şırınga etmezler. Zira verideki bir enlem zehirlenmesi, tüm motorunuzu çökertebilir. Bir sonraki eğitimde kurumsal veri göçmenlerini bekleme salonuna alacağımız defansif bir mühendislik mimarisi olan "Staging (Ara Katman) Paternini" kuracağız.