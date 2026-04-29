# Ders 2: EPSG Kodları ve SRID (Mekansal Referans Kimliği)

**[Giriş / Hook]**
Bir koordinat noktası olan `(28.97, 41.01)` kendi başına anlamsız iki sayıdır. Bu sayıların ne anlama geldiği, birimleri (derece mi, metre mi, mil mi?) ve dünyanın neresini işaret ettikleri, onlara takılan mekan kimlik kartıyla yani SRID (*Spatial Reference Identifier*) ile belirlenir. Sisteme kimliği tanıtmazsanız, veriniz uzay boşluğunda yatan kimsesiz bir enformasyon çöpünden ibarettir.

**[Teori / Kavramsal Çerçeve]**
Dünya çapındaki petrol, harita ve teknoloji şirketleri (Avrupa Petrol Araştırma Grubu - EPSG öncülüğünde), yeryüzündeki tüm projeksiyon senaryolarını ortak bir veritabanında kodlamıştır. Bu kodlara EPSG kodları denir ve PostGIS içinde `SRID` (Mekansal Referans Kimliği) olarak karşılık bulurlar.
- **EPSG:4326 (WGS84):** Dünyanın global GPS standardıdır. Birimi "Derece"dir. Enlem ve boylam kullanılır. 
- **EPSG:3857 (Web Mercator):** Google Maps ve Apple Maps gibi platformların düz ekran gösterim kodudur. Birimi "Metre"dir.

PostGIS sisteminin içinde `spatial_ref_sys` adında devasa ve dokunulmaz bir meta-tablo yaşar. Bu tablo, referans kodlarının (SRID) sistemin içindeki cebirsel dönüşüm metinlerini barındırır. Herhangi bir SRID kimliğini sorguladığınızda motor o tabloya başvurur.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda bu sistemi doğrudan sorgulayalım ve makinenin aklındaki EPSG tanımını inceleyelim:
`SELECT srid, auth_name, auth_srid, proj4text FROM spatial_ref_sys WHERE srid = 4326;`

Ekran çıktısı, kurumun sadece "4326" yazarak aslında motorun arka plandaki karmaşık "WGS 84" projeksiyon şemasını (`+proj=longlat +datum=WGS84 +no_defs`) devreye soktuğunu kanıtlar. Bu, veritabanının o enlemlerin aslında bir metraj değil, radyan dereceler (Angular) olduğunu anlama şeklidir.

**[Kapanış]**
Standartların sistem içindeki karşılığını göz ardı etmeden okuduk. Ancak, eğer elimizdeki veriler (WGS84 - 4326) derece birimindeyse, iki şehir arasındaki mesafeyi nasıl metre cinsinden hesaplayacağız? Bir sonraki derste, küresel matematikle (Geography) düzlemsel matematiği (Geometry) kapıştıracak, hassasiyet ile performans arasındaki büyük mimari seçimi yapacağız.