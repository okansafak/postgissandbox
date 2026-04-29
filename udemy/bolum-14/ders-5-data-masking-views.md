# Ders 5: Optik Yanılsama ve Veri Sansürü (Data Masking ve Geometri Maskesi)

**[Giriş / Hook]**
"Genelkurmay'dan" veya "İSKİ'den" size "Tüm İstanbul'un Su Hattı ve Lojistik Tesis" katmanı (Table) verildi. İçinde santimetre hassasiyetle çizilmiş `polygon` verileri var. "Bu veriyi Web Haritanıza (Açık Portal / Stajyer QGIS'ine) koyun. Vatandaş binalarını ve nerede hat olduğunu 'kabaca' görsün. Ama ASLA, gerçek bir teröristin veya sabotajcının vananın milimetrik koordinatını `ST_AsText()` diyerek almasını İ-S-T-E-M-İ-Y-O-R-U-Z!" dediklerinde ne yapacaksınız? "Gizli olanı veritabanından RLS ile (satır bazlı) SİLEMEZSİNİZ, çünkü ekranda (Web GIS) vatandaş o boruyu görmek / binayı görmek zorunda." İşte bu ikilem, "Kişiye göre veriyi sildirme" değil, "Veriyi bozma/sansürleme (Masking)" sanatını, Security Definer mekanikliğini doğurur.

**[Teori / Kavramsal Çerçeve]**
Maskeleme, gerçek tabloya `SELECT` yetkisini YASAKLAMAKTIR (`REVOKE ALL ON tesisler TO halk`). Sonra, "Sadece maskeli halini" (Views - Görünüm) yaratmaktır.
Postgres, `VIEW` (Sanal Tablolar) yaratmanıza izin verir. View, arka planda bir SQL koşarak sanki yeni bir tabloymuş gibi davranır. Yöneticiniz gerçek `tesisler` tablosunda çalışırken, Stajyeriniz/Halk rolü `v_tesisler_sansurlu` isimli görünüme (`VIEW`) bakmaya Zorlanır.
Sansürleme (Obfuscation), PostGIS fonksiyonlarıyla harika entegredir. Çok keskin geometrileri `ST_Simplify` (Noktaları eksilt) veya `ST_SnapToGrid` (Milimetrik değerleri "Boz/Yuvarla", örneğin 50 metre ızgaraya oturt) gibi aletlerle yıpratırsınız.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `askeri_tesisler` (veya `su_hatlari`) var, içinde `hassas_geom` (Poligon) var.

`-- 1. Kimse ANA TABLOYA ulaşamasın (YASAK! Superuser Hariç)`
`REVOKE ALL ON askeri_tesisler FROM public;`

`-- 2. Sansür Cihazını (VIEW) Üretiyoruz.`
`-- 'stajyerler' ya da 'halk', şeklin bozulmuş halini görecek.`
`CREATE VIEW v_tesisler_sansurlu AS`
`SELECT `
`  id, `
`  isim, `
`  -- ST_Simplify(geom, 50): Şeklin kırılımlarını 50 metre toleransla YOK ET (Basitleştir).`
`  -- ST_SnapToGrid(..., 100): Hassas koordinatları 100 metre (Kaba) bir ızgaraya oturt, boz! `
`  ST_SnapToGrid(ST_Simplify(hassas_geom, 50), 100) AS sansurlu_geom`
`FROM askeri_tesisler;`

`-- 3. Stajyere/Halka sadece bu BOZUK VE SANAL (View) tabloya erişim izni verelim!`
`GRANT SELECT ON v_tesisler_sansurlu TO stajyer;`

Artık "Stajyer" QGIS'ten girip `v_tesisler_sansurlu` tablosuna çift tıkladığında, haritada binayı (su vanasını) "görür". Ancak gördüğü bina/vana, gerçek koordinatından en az 50 ila 100 metre kaymış (SnapToGrid), köşeleri silinmiş, şekli amorfleşmiş (Simplify) sahte/bozuk bir piksel yığınıdır! Eğer sabotajcı QGIS'in altına inip o noktanın koordinatını çıkarıp oraya operasyona giderse, karşısına bomboş bir çöl tarlası çıkacaktır. Asıl veri, veritabanının zırhlı "askeri_tesisler" tablosunda SuperUser (`postgres`) harici kimsenin erişemeyeceği şekilde kilitli yatmaktadır.

**[Kapanış]**
Zafer! Siz veritabanından bir tablo açıp koordinat ekleyen biri değilsiniz. Siz artık Roller (Roles) atayan, Güvenlik Duvarı (RLS) kurgulayan, gerektiğinde İstihbarat maskeleriyle (Masking ve View) sadece istenen verinin "kırpılmış" halini dışarı servis eden (SecOps) bir Kurumsal PostGIS Mimarı oldunuz. Bu aşamayla birlikte Eğitimin Tüm Teorik, Mimari ve Defansif Zırhlarını (Bölüm 1 - Bölüm 14) tamamladık.
Sırada, sadece öğrendiğiniz bu devasa gücü gerçek hayatta nasıl ayağa kaldıracağınızı, sıfırdan "İstanbul Uber Taksi ve Kurye Uygulaması" (Backend/Sunucu/Uygulama Mimarisi) kurgulayarak somutlayacağımız **Büyük Final Projesi (Capstone Project)** var. Eğitimimizin altın çağı olan Proje Geliştirme safhasına yürümeye hazırsınız.