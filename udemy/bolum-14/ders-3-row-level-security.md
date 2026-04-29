# Ders 3: Görünmez Duvarlar (Row-Level Security / RLS Temelleri)

**[Giriş / Hook]**
"Veritabanımızdaki `musteriler_lokasyon` tablomuzu, şirketteki yüzlerce Kuryeye (Mobil Ugulama) ve 39 İlçe Temsilcisine QGIS bağlantısıyla verdik. Sadece `SELECT` (Okuma) iznine sahipler. Ancak, Kadıköy Belediye Koordinatörü neden 'Beşiktaş' temsilcisinin gizli abonelerinin lokasyonunu görebiliyor ki?"
Yanlış mühendis, ilçe sayısı kadar (`tablo_besiktas, tablo_kadikoy..`) boşu boşuna "39 Adet" tablo oluşturup, programlamayı kaosa sürükler. Mimar mühendis ise tek bir Ana Tablo açar, PostgreSQL'in Satır Seviyesi Güvenlik Motorunu (`RLS`) devreye sokar: "Kullanıcı adı *kadikoy* ise, sadece satırında *kadikoy* yazan koordinatları görür. Gerisi sistemden sihirbaz gibi buharlaşır ve QGIS ekranına dökülmez!"

**[Teori / Kavramsal Çerçeve]**
RLS (Row-Level Security), tablonuzdaki her bir "Row" (Kayıt, Satır) bazlı çalışan dev bir Zindancıdır. Sistem şöyle çalışır:
1. İlgili tabloda RLS mekanizmasını aktif edersiniz: (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). O an itibaren Superuser haricindeki "Herkes İçin" tablo kapkaranlık boş (0 Satır) döner!
2. Sonra bu tabloya bir (Policy / Politika) kural zinciri yazarsınız.
"Bu tabloyu `SELECT` (Çekerken) eden kişinin Giriş Adı (`current_user`) ile, satırın `ilce_adi` sütunu eşitse göster (True), değilse karanlığa göm (False)!"
3. Gelen kullanıcı sadece "Hak Ettiği ve Mantığın ONAY VERDİĞİ" satırları çeker. Başka satırlar asla ağ (Network / Web Socket) üzerinden bilgisayarına inmez, performans ziyan edilmez.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `borular` tablosu var, içinde "sahip_ilce" sütununda (Örn: kadikoy, uskudar) yazıyor. Gidip QGIS veya API ile `kadikoy` kullanıcı adıyla login olduk diyelim:

`-- 1. Zindancıyı (RLS) Tablonun Üzerine Uyandıralım (Tesisler Karardı!)`
`ALTER TABLE borular ENABLE ROW LEVEL SECURITY;`

`-- 2. Devlete (Database) Yeni Bir "Seçme/Okuma" Politikası Yasalaştırıyoruz:`
`-- 'sadece_kendi_ilcesini_gor' adli bir yasa (Policy)`
`CREATE POLICY sadece_kendi_ilcesini_gor ON borular`
`  FOR SELECT`
`  USING (sahip_ilce = current_user);`

*Bu komuttan sonra `kadikoy` isimli role sahip kurye, tabloya `SELECT * FROM borular` dese dahi, sistem (Database Engine) o sorguyu milisaniyede yakalar ve arkasına zehirli bir `WHERE sahip_ilce = 'kadikoy'` fırlatır! O kişi, diğer 38 ilçenin Milyonlarca Metre borusu olduğunu ASLA göremez de bilemez de!*

**[Kapanış]**
Tablolar parçalanmadı, indexler şişmedi (Tek bir merkez tablodan milyonlarca kişinin sadece kendi bölgesini indirmesi sağlandı). Ve bunu yapan yazılım (Node/Python) değil, PostgreSQL C-çeliği bir çekirdeği! Peki ama her projenin verisinde (Örn: Kazalar, Hırsızlıklar, Sokak Köpekleri) `ilce_ismi` diye bir TEXT sütunu harika bir şekilde hazır mı durur? Hayır! Sizde sadece o vakanın `geometry` (Point) koordinatı vardır!
O halde satır bazlı filtreleme yaparken (RLS Politikasında), kullanıcının "Girdiği Şekle Göre" mi (Spatial RLS) kural yazacağız? Kesinlikle. Mekansal Filtrelerin zirvesi Ders 4: Spatial Row-Level Security!