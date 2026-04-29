# Ders 1: Kalenin Son Savunma Hattı (Veritabanı Güvenliğine Giriş)

**[Giriş / Hook]**
Milyon dolarlık tesis koordinatlarınızı, gizli müşteri lokasyonlarınızı PostGIS içerisine yerleştirdiniz. Harika bir Node.js veya Python backend (API) yazdınız ve "Sadece yetkili kullanıcılar API'ye istek yapabilir, güvendeyim" diye arkanıza yaslandınız. Sonra bir stajyer veya kötü niyetli bir veritabanı yöneticisi (DBA) doğrudan pgAdmin veya QGIS ile sizin o devasa veritabanınıza bağlandı (IP tabanlı şifre ile). API kalkanınız anlamsız kaldı; tüm Türkiye altyapı veriniz "Select * from gizli_tesisler" komutuyla saniyeler içinde sızdırıldı. Verinin güvenliği "Yazılımcının" (Web API) omuzlarında bitmez. Gerçek güvenlik, PostgreSQL'in çekirdeğindedir.

**[Teori / Kavramsal Çerçeve]**
Eğer veritabanınıza doğrudan bağlanan bir araç (QGIS, pgAdmin, ogr2ogr, scriptler) varsa, API seviyesindeki JWT (JSON Web Token) veya şifreler işe yaramaz. PostgreSQL der ki: Veriyi koruyacak olan bizzat "Tablodur".
PostGIS projelerinde güvenlik iki ana katmanda kurgulanır:
1. **Roller ve Yetkiler (Roles & Privileges):** Tabloya kim, ne yapabilir? Sadece okuyabilir mi? Veri ekleyebilir mi? (GRANT / REVOKE).
2. **Satır Bazlı Güvenlik (Row-Level Security - RLS):** Tabloya herkes girebilir "ANCAK" sadece kendi birimiyle/koordinatıyla ilgili olan satırları (Row) "görür". Kadıköy memuru tüm istanbul tablosunu sorgulasa bile "Sadece Kadıköy poligonlarını" görür. Diğer veriler fiziksel olarak engellenir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, bir QGIS bağlantısı ile veritabanına girmeye çalışan iki farklı kitle hayal edin. Bir tarafta `admin` (siz), diğer tarafta `misafir` veya `kadikoy_belediyesi`. Veri tek bir tablo (`istanbul_altyapi`). Eğer siz bu tabloya "Herkes okusun ama kimse silmesin" derseniz, temel PostgreRolleri devreye girer. Eğer "Herkes kendi verisini görsün" derseniz RLS devreye girer. Bu bölümde adım adım "Kendi kalesini savunan veritabanları" inşa etmeyi kodlayacağız.

**[Kapanış]**
Gördüğünüz gibi, kurumsal bir CBS (GIS) projesi yapıyorsanız; uygulamanız isterse dünyanın en iyi web arayüzüne sahip olsun, veritabanı açık kaldığı sürece bir Shapefile ihracına (Export) bakar. Bir sonraki derste, PostgreSQL'in güvenlik görevlileri olan `CREATE ROLE` ve salt-okunur (Read-Only) erişim yetkilendirmesiyle (GRANT/REVOKE) tablolarımızı nasıl zırhlayacağımıza bakacağız. Zırhları kuşanın.