# Ders 5: Lokalin Kesinliği - Türkiye Koordinat Sistemleri (TUREF / TM)

**[Giriş / Hook]**
Global bir strateji, masada iyi görünür ama sahada baraj temeli atmaya kalktığınızda sizi hüsrana uğratır. Küresel (WGS84 - 4326) veya Web (3857) projeksiyonlarıyla bir arazinin metrekare büyüklüğünü veya iki bina arasındaki milimetrik mesafeyi hesaplayamazsınız; dünya o noktalarda sandığınız kadar düz değildir. Gerçek mühendislik gücü, yerel projeksiyonlara inmektir.

**[Teori / Kavramsal Çerçeve]**
Projeksiyonlardaki distorsiyonu (bozulmayı) minimize etmenin tek yolu, projeksiyon merkezini (odak noktasını) çalışacağınız alanın tam ortasına konumlandırmaktır. Türkiye özelinde, ülkenin yatay genişliğinden ötürü tek bir projeksiyon bile hata payları yaratır. Bu sebeple Türkiye, Transversal Mercator (TM) yöntemiyle her biri 3 derecelik (veya 6 derecelik) genliğe sahip dikey dilimlere (Zone) ayrılmıştır.

TKGM (Tapu Kadastro) ve yerel belediyeler ITRF96 / TUREF (Turkish Reference Frame) datumu üzerine kurulu TUREF TM dilimlerini kullanır. İstanbul TM30 (EPSG:5254), Ankara TM33 (EPSG:5255), Erzurum TM42 (EPSG:5258) gibi yerel ve hiper-kesin koordinat düzlemleri içinde çalışır. Bu sistemlerin merkezi referansı metre birimidir ve bozulma santimetre bazındadır. Mimari bir hesap, parselasyon, yol projesi veya altyapı ağı mutlaka sahanın ilgili EPSG koduna "Transform" tabidir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda global GPS verisini, İstanbul/Marmara kurumsal standartlarına (EPSG:5254 - TM30) tercüme edelim. Örneğin Boğaziçi bölgesinde bir parsel merkez noktamız olsun:
`SELECT ST_AsText(ST_Transform(ST_SetSRID(ST_MakePoint(29.02, 41.04), 4326), 5254)) AS istanbul_tm30_nokta;`

Çıktıda devasa X ve Y metrik koordinat düzlemini okursunuz (Örn: `POINT(417456 4543788)`). Bu noktadan itibaren, bu veri üzerine `ST_Area` (Alan) veya `ST_Distance` (Mesafe) kurguladığınızda sistem geometri (kartezyen) tabanlı hızda ve sıfıra yakın (milimetrik) hata payı ile size doğrudan organik metraj dönüşü verecektir. `Geography` veritipinin aşırı yük getiren kavis hesabına ihtiyacımız kalmadı, çünkü haritayı tam da bulunduğumuz şehrin tepe noktasından pürüzsüzce düzleştirdik.

**[Kapanış]**
İhtiyacımız olan son puzzle parçasını (Yerel Dilimleri) sistemimize dâhil ettik. Mühendisliğin ve lokasyon analizlerinin Türkiye standartlarında nasıl çalışması gerektiğinin teorik ve pratik bilgisini aldınız. Bölümün son kapanış videosunda ise, devasa bir uzamsal yazılım projesi başlatırken hangi projeksiyonla yola çıkılacağının mimari ve stratejik karar haritasını özetleyeceğiz.