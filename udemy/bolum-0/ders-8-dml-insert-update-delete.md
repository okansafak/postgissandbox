# Ders 8: Veri Manipülasyonu: Ekleme, Güncelleme ve Silme (DML)

**[Giriş / Hook]**
Sadece veriyi okumak analitik bir disiplin sunar; ancak gerçeklik, olanı sadece gözlemlemekle değişmez. Veriyi bükmek, yenisini eklemek veya çürümüş olanı ortamdan temizleyerek sisteme dokunmak; sistemin salt tüketicisinden, proaktif mimarına geçtiğiniz andır. 

**[Teori / Kavramsal Çerçeve]**
Data Manipulation Language (DML) yani Veri Manipülasyon Dili, sisteme kayıt girme sürecindeki teknik ifadelere denir. Bugüne kadar yalnızca bir raportör şapkasıyla incelediğimiz ilişkisel mimariye, şimdi yaratıcı ve yıkıcı komutlarla hükmedeceğiz. 

Sisteme sıfırdan yeni bir varlık işlemek için `INSERT`; canlı ve halihazırda diskte bulunan veriyi organizasyonun yeni şartlarına uyarlamak için `UPDATE`; artık geçerliliğini yitirmiş olanı belleğin dışına kusursuzca atmak için ise `DELETE` komutunu kurarız. İlişkisel bir konfigürasyonda bu işlemler anlık bir heves değil, işlemin sonuna varana değin yarıda kesilmemesi garanti edilen sıkı kurallar zinciri (ACID) prensibiyle gerçekleşir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda bu yapıyı hızla test edelim. Mevcut veri havuzumuza yeni bir kent/lokasyon dahil oluyor. Bu varlığı sisteme doğrudan biz tanıtacağız:
`INSERT INTO sehirler (ad, bolge, nufus, alan_km2) VALUES ('Eskişehir', 'İç Anadolu', 890000, 13925);` 
Sistem derhal diskin hafızasını tahsis etti ve yeni id değeriyle fiziksel satırı güvenceye aldı.

Yıllar geçtikçe bir demografik değişim (nüfus patlaması) oluştu. Sistemi realiteye hızla adapte edeceğiz.
`UPDATE sehirler SET nufus = 920000 WHERE ad = 'Eskişehir';` 
Önceki konumuz olan `WHERE` yantümcesinin, tüm Türkiye verisini değil, sadece revizyonu hedeflediğimiz 'Eskişehir' sicilini hedefleyişinin makro bir mühendislik eylemi olduğunu burada tekrar kanıtlamış olduk.

Nihai senaryoda, bir organizasyon bu lokasyondan (örneğin kargo hizmetinden veya yönetimden) tamamen vazgeçerse veritabanının da bu yükten arınması gerekir. O zaman operasyon basittir ve nettir:
`DELETE FROM sehirler WHERE ad = 'Eskişehir';`

**[Kapanış]**
İşte bu kadar. Veritabanının felsefesini, gramerini ve işleyiş modelini kalıcı kod satırlarıyla yönetebilmeyi başardık. Artık ham bir SQL satırını okuyabilir, filtreler ve yeni varlıklar tahsis edebilirsiniz. Analitiğin kalbine inerek hazırladığımız bu sıfırıncı bölümle temelleri sağlamlaştırdık. Bir sonraki bölümde standart satırların ötesine geçerek veri kümesine coğrafyanın, iklimin ve mekanın matematiğini ekleyecek; PostGIS vizyonunda konumsal zekayı keşfetmeye başlayacağız. Alanımızın gerçek heyecanı ve meydan okumasına hoş geldiniz.