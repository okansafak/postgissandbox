# Ders 2: Kapıdaki Bekçiler (Roles & Privileges)

**[Giriş / Hook]**
"Süper kullanıcı (`postgres`) şifresi ile QGIS'ten giriş yaptım. Sonra haritayla oynarken yanlışlıkla bir poligonu sileyim derken `istanbul_altyapi` tablosunun tamamını (`DELETE FROM istanbul_altyapi`) çalıştırdım. Son 5 aylık çalışma gitti." Tipik, pahalı ve her şirketin mutlak başına gelen bir felaket hikayesi değil mi? Bunun nedeni, projeyi "Superuser" şifresiyle herkesin kullanımına açmanızdır. Veritabanınız sizin krallığınızdır. Herkes elini kolunu sallayarak kral koltuğuna oturmamalıdır. Krallar, Vezirler ve sadece Camdan Bakması İzinli Halk (Read-Only) yaratmalısınız. Karşınızda: `CREATE ROLE`.

**[Teori / Kavramsal Çerçeve]**
PostgreSQL, kullanıcıları (Users) ve yetki gruplarını (Groups) aynı potada eritir, onlara `ROLE` der.
Bir Role, veritabanına bağlanabilen (`LOGIN` izni varsa) fani bir insandır, ya da şifresi olan bir Python betiğidir.
Elinizde `SU_HATTI_PROJESI` adında devasa bir veritabanı, içinde de `borular` tablosu var. Bu veriye sadece bakan (QGIS üzerinden görüntüleyen) ama düzenleyemeyen "Görselci" bir role ihtiyacınız var:
1. Rol Yaratırsınız (`CREATE ROLE`).
2. Ona Şema üzerinde erişim yetkisi verirsiniz (`GRANT USAGE ON SCHEMA`).
3. Sadece Select (Okuma) yetkisiyle tablonuza dokunmasını izin verirsiniz (`GRANT SELECT ON borular`).

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `borular` tablosu içinde gizli stratejik hatlar barındırıyor. Bir "Stajyer" geldi. O sadece "okuyacak" (Select).
`-- 1. Yeni ve Düşük Yetkili Kullanıcı (Rol) Yaratalım`
`CREATE ROLE stajyer WITH LOGIN PASSWORD '123456';`

`-- 2. Bu çocuğun 'public' şemasındaki objeleri 'kullanmasına' (Görmesine değil, girmesine) izin verelim`
`GRANT USAGE ON SCHEMA public TO stajyer;`

`-- 3. O kritik tabloya SADECE SELECT izni verelim (INSERT, UPDATE, DELETE KESİNLİKLE YOK!)`
`GRANT SELECT ON borular TO stajyer;`

Artık o stajyer "QGIS" ile `123456` şifresiyle bağlandığında, `borular` (ve varsa diğer select izni olan tabloları) çizer. Ancak kalemi / düzenleme ikonunu (Edit Toggle) tıkladığında QGIS "Permission Denied" hatası basacaktır! Kale kapıları dışarıdan kilitlendi!

**[Kapanış]**
Artık sistemden yanlışlıkla veri silinemeyecek bir zırh kurdunuz. Ancak stajyer sadece bakmaya izni olsa dahi... "TÜM TÜRKİYE" boru hattını görebiliyor. Sadece kendi şehrini, sadece "Kadıköyü" görmesi gerekirse ne yapacağız? Her ilçe için ayrı bir "kadikoy_borulari" (1000 ayrı Tablo!) mı açacağız? Hayır! Gelecek ders, veritabanı mühendisliğinin zirvesi: Tek Tablo, Kişiye Özel Satırlar: (Row-Level Security / RLS). Devam ediyoruz.