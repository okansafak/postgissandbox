# Ders 1: Projeksiyon İhtiyacı – Küreyi Düzleme Sığdırmak

**[Giriş / Hook]**
Üç boyutlu bir kürenin yüzeyini kırıştırmadan, yırtmadan veya esnetmeden iki boyutlu düz bir kağıda yayamazsınız. Bu basit fiziksel imkânsızlık, haritacılığın ve uzamsal analitiğin en büyük sorununu doğurur: Harita projeksiyonları. Gerçekliği düzleme aktarırken her zaman bir bedel ödersiniz; mesele, hangi bedeli (alanı mı, açıyı mı, mesafeyi mi) feda etmeyi seçeceğinizdir.

**[Teori / Kavramsal Çerçeve]**
Dünya, kutuplardan hafifçe basık karmaşık bir elipsoittir. Ancak bilgisayar ekranları ve veri yönetim arayüzleri dümdüzdür (Kartezyen X ve Y eksenleri). Küresel dünyadaki (Enlem ve Boylam) verileri bu yüzeye matematiksel olarak yansıtmaya "Projeksiyon" denir. 
Navigasyon yapıyorsanız açıları koruyan Mercator projeksiyonunu kullanırsınız; ancak bu projeksiyon, Grönland'ı Afrika kıtası boyutunda göstererek feci bir alan illüzyonu yaratır. Eğer gayrimenkul veya orman alanı analizi yapıyorsanız, alan büyüklüğünü koruyan eşit alanlı projeksiyonlara (Equal-Area) geçiş yapmalısınız. Yanlış projeksiyon üzerinde hesaplanan bir arazi metrekare değeri sizi milyonluk ticari davalarla karşı karşıya bırakabilir.

**[Uygulama / Ekran Gösterimi]**
Veritabanı komut satırına geçtiğimizde, sistem bu matematiksel kararı bize bırakır. Projeksiyonun felsefesini SQL kodlamasında doğrudan görmeyiz, ancak her ürettiğimiz koordinatta bu sistemi beyan etmediğimiz takdirde motorun (PostGIS'in) boşlukta kalacağını biliriz. Önceki derslerde kullandığımız `4326` rakamı (WGS84), herhangi bir düzleştirme işlemi (projeksiyon) yapmadan dünyanın küresel enlem-boylam sistemini ham biçimde kullandığımızın deklarasyonudur.

**[Kapanış]**
Problemi teşhis ettik: Yuvarlak bir dünyayı düz ekrana sığdırmak zorundayız ve her çözümün kendine has bir distorsiyon (bozulma) matematiksel formülü var. Gelecek derste, dünya çapında kabul gören binlerce farklı projeksiyon formülünün nasıl standartlaştırıldığını ve bizim bunları veritabanına sadece 4 veya 5 haneli bir kod dizisiyle (SRID/EPSG) nasıl bildirdiğimizi inceleyeceğiz.