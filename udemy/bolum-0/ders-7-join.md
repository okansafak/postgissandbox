# Ders 7: İlişkisel Bütünlük: Tablo Birleştirme İşlemleri (JOIN)

**[Giriş / Hook]**
Sağlıklı, ölçeklenebilir ve operasyonel bir veritabanı, şirket çalışanlarının özlük dosyasıyla o ay alınan ofis ekipmanlarının fatura dökümünü asla aynı fiziki tabloda depolamaz. Ayrı şemalarda tutulan bu enformasyon yapbozunu raporlama anında kusursuzca ve dinamik bir biçimde vizyona yansıtan zamk, ilişkisel veri mimarisinin temel vaadi ve gücüdür.

**[Teori / Kavramsal Çerçeve]**
SQL’i, basit bir veri dili olmaktan çıkarıp karar destek mekanizmalarının beynine dönüştüren olgu `JOIN` (tablo birleştirme) işlemidir. Tablolar, ilişkisel mimaride birbirinden yalıtılmış varlıkları temsil eder. Ancak aralarındaki mantıksal yapı, genellikle birbiriyle örtüşen kimlik (Primary ve Foreign Key) alanları üzerinden kilitlenir. Bir `INNER JOIN` komutu motor üzerinde çalıştığında, sistem iki farklı tabloda da matematiksel buluşma şartını sağlayan satırları yan yana yatay şekilde diker ve karşımıza bütünleşik bir veri sunar. Yöneticinin sipariş kodunu (Siparişler Tablosu) görürken aynı satırda müşterinin ismini (Müşteriler Tablosu) görmesini sağlayan köprü `JOIN`'dir.

**[Uygulama / Ekran Gösterimi]**
Arayüzümüze (IDE) tekrar odaklanıyoruz. Bizden örneğin "hangi şehrin, hangi büyük coğrafi kısımda (Batı veya Doğu Anadolu)" olduğunu gösteren analitik ve iki kanallı bir rapor isteniyor; ancak bu detaylar `sehirler` ile `bolgeler` tablolarımızda ayrık durumda tutulmakta.
`SELECT s.ad, s.nufus, b.bolum FROM sehirler s INNER JOIN bolgeler b ON s.bolge_id = b.id;`

Çıktıda sonucu derhal inceleyelim: Motor her bir şehir kaydını belleğe çekti, kendisine atanmış `bolge_id` değerini aldı, "b" aliasıyla çağırdığı `bolgeler` tablosundaki orijinal kimlik (id) alanıyla saniyenin altında bir hızla taradı (`ON` koşulu eşleşmesi). Neticesinde Bursa şehriyle Batı bölümü bilgisini, Erzurum şehriyle Doğu bölümü bilgisini sanki en başından bu yana aynı kolonlarmış gibi yekpare bir formda ekrana yansıttı.

**[Kapanış]**
`JOIN` komutları veritabanı okuma pratiğinin şahikasıdır; çünkü gerçek dünya, ilişkilerden (relation) ibarettir. Şu ana kadar anlatılan tüm derslerde sistemi "okuma" statüsünde tuttuk. İzledik, raporladık, sorguladık (`SELECT`). Ancak bir sistem yalnızca okunarak yönetilemez; ona müdahale de edilmelidir. Gelecek ve bu bölümün son videosunda veritabanında gerçekliğin yaratılmasına (`INSERT`), revize edilmesine (`UPDATE`) ve sistemden tahliyesine (`DELETE`) odaklanacağız.