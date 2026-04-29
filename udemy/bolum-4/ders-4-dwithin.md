# Ders 4: Etki Alanı ve Optimal Mesafe Taraması (ST_DWithin)

**[Giriş / Hook]**
Mobil uygulamanızı açtınız ve "Bana 500 metre çapındaki en yakın taksi duraklarını göster" dediniz. Acemi bir yazılımcı, veritabanına o anki konumunuzu merkeze alıp şehirdeki *tüm* milyonlarca taksinin size ne kadar uzaklıkta olduğunu tek tek (Pisagor veya Kavis formülüyle) hesaplatıp sonra 500 metreden küçük olanları filtreletir. Bir süre sonra sunucu ağır hesaplama işlemcilerinin altında çöküp kül olacaktır. Matematik hesaplaması bir zafiyettir, vizyoner mühendislik ise zeki çemberler kurmaktır.

**[Teori / Kavramsal Çerçeve]**
İskambil destesindeki her kağıdı saymak yerine, elinizi doğrudan destenin sonuna vurmanız gerekir. Mesafe sorgularında asla `ST_Distance(A, B) < 500` filtresi (WHERE bloğunda) kullanılmaz. Çünkü motor önce hesaplar, sonra eler. Bizi o cendereden kurtaran sistemin en şık komutu `ST_DWithin(A, B, Mesafe)` kalkanıdır.

`ST_DWithin` arkasında mekansal (spatial) indekslerle kusursuz çalışan bir Bounding Box (Kutu) tarayıcısı taşır. Matematiksel çember kurmaya çalışmadan hemen önce, koordinata sanal bir kare çizdirir; o kare dışında kalan (Örneğin şehrin diğer ucundaki) objelerle doğrudan hesaplamayı es geçer (dışlar). Uzamsal indeks (GIST) okuması yaparak, sistemi matematiksel boğulmadan kurtarıp işlemi milisaniyede tamamlar ve ikilinin belirtilen menzil ('Distance Within') içinde olup olmadığını mantıksal (TRUE/FALSE) bazda şak diye geri çevirir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda bu muazzam hız optimizasyonunu gözümüzde canlandıralım ve şu formülasyonu yazalım: Merkezden 10 birimden yakın mı, değil mi?
`SELECT ST_DWithin(`
  `ST_GeomFromText('POINT(0 0)'),`
  `ST_GeomFromText('POINT(8 5)'),`
  `10`
`) AS kapsama_alaninda_mi;`

Hız testlerini çıplak gözle hissetmeniz belki yerel kurulumlarda (PGLite) zordur ama sistem bu iki noktanın uzaklığını doğrudan indeksleri süzerek taradı ve uzaklığın kök 89 (yaklaşık 9.4) birim olduğunu arkada onaylayıp, 10 birim limiti aşmadığı için TRUE değerine hükmetti. Aynı işlemi yüz bin satırlık tablolarda yaptığınızda saniyelerden mikrosaniyelere düşen bir maliyet tasarrufu görecekseniz.

**[Kapanış]**
Hesaplamalarda veritabanını kaslandırmayı ve optimize etmeyi başardınız. Artık objeler arasındaki o görünmez ve gergin coğrafi bağı nasıl okuyacağınızı çok iyi biliyorsunuz. Geldik asıl ihtişamlı ana: Geleneksel SQL (Bölüm 0) ile Uzamsal yeteneklerin (Bölüm 4) en şık düğünü. Bir sonraki ve bu modülün doruk video seansında; iki tabloyu sadece kimliklerle değil coğrafi temaslarıyla birbirine lehimleyeceğimiz Spatial JOIN (Mekansal İlişki) devrimini yaşayacağız.