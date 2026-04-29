# Ders 1: Ölü Verinin Faturası (Bloat ve Vacuum Mimarisi)

**[Giriş / Hook]**
Sisteminizdeki 10 milyonluk "Araç Konumları" tablonuzdan her gün 2 milyon eski kaydı sildiğinizi (DELETE) ve yerlerine 2 milyon yeni satır yazdığınızı düşünün. Veritabanında kayıtlı satır sayısı hiç artmazken, bir ay sonra sunucu diskleriniz neden dolma uyarısı verir, sorgu hızlarınız neden felç olur? İlişkisel veritabanları sil emrini aldığında veriyi aslında yokedip temizlemezler; onu sadece "Mevcut Değil" diyerek maskelerler. Bu biriken ölü hayaletler ordusunun yarattığı asalak tabakaya "Bloat", bu hayaletleri diskinizden kazıyan acımasız mali polise ise "VACUUM" denir.

**[Teori / Kavramsal Çerçeve]**
PostgreSQL, veri güvenliğini sağlamak (MVCC - Multi-Version Concurrency Control) adına bir kaydı güncellediğinde (UPDATE) veya sildiğinde (DELETE), o veriyi diskten fiziksel olarak koparıp atmaz. Sadece o kayda "Bu eski versiyondur, ölüdür" damgası vurur. Siz milyonlarca koordinatı sildiğinizi sanırken, disk blokları ölü satırlarla (Dead Tuples / Bloat) tıka basa dolar. 
Uzamsal (GiST) indeksleriniz de bu ölü geometrilerle şişer, ağacın dalları kurur ama yer kaplamaya devam eder. Bu yıkımı durdurmanın yolu `VACUUM` prosedürüdür. `VACUUM`, tablonuzu tarar ve "Bu satırlar artık kimseye lazım değil" diyerek o disk bloklarını yeni verilerin yazılması için boşaltır. `VACUUM ANALYZE` derseniz hem boşaltır hem de demin bahsettiğimiz istatistikleri (Query Planner oranlarını) günceller. `VACUUM FULL` ise diski tamamen yeniden sıfırdan yazarak (ağır bir ameliyattır, tabloyu kilitler) sistemi ilk günkü kusursuzluğuna dindirmek için kullanılır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki dev yoğunlukta çalışan "kurye_konumlari" tablomuzda biriken ölü veri zehirlenmesini temizlememiz gerekiyor. 
`-- Rutin Bakım: Tabloyu kilitlemeden ölü alanları kullanıma açar ve Planner'ı biler`
`VACUUM ANALYZE kurye_konumlari;`

Fakat tablo "Bloat" yüzünden öylesine şişmiş ve GiST indeksi o kadar parçalanmış ki sistem yinede hantal kalıyorsa, gece yarısı (sistem boştayken) tam cerrahi müdahaleyi başlatırız:
`-- Tüm tabloyu ve indeksleri diskte sıfırdan, pürüzsüz biçimde yeniden yazar (Ağır Kilitleme Yapar)`
`VACUUM FULL kurye_konumlari;`

Sabah geldiğinizde, okuma (Index Scan) işlemlerindeki devasa hafiflemeyi gözlerinizle göreceksiniz.

**[Kapanış]**
Sistemi sadece kodun doğruluğuyla değil, mekanik sağlığıyla, yani disk düzeyinde hücresel temizliğiyle hayatta tutmaya başladınız. Fakat siz "Bloat" silmek için `VACUUM FULL` yapıp 500 Gigabaytlık tabloyu her gece kilitlemeye kalkarsanız, operasyonunuz çöker. Devasa ve silinmeyi bekleyen dev tarihsel verilerle başa çıkmanın vizyoner yolu onları dev tablolar halinde silmek değil, aylara/yıllara "bölmektir". Gelecek aşamada parçala ve yönet sanatının zirvesi: Aralık Bölümlendirme (Range Partitioning) stratejisini kuracağız.