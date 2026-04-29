# Ders 1: Uzamsal Maliyetin Ölçümü (ST_Distance ve Uzaklık Analitiği)

**[Giriş / Hook]**
Lojistik ve tedarik zincirinde mesafe, doğrudan paraya veya zamana denktir. Eğer veritabanınız iki deponuz veya iki operasyonel aracınız arasındaki net fiziki mesafeyi hesaplayamıyorsa; sizin lojistik rotalarınız maliyetli bir kör uçuşa dönüşür. 

**[Teori / Kavramsal Çerçeve]**
Daha önceki bölümde işlediğimiz `ST_DWithin`, iki nesnenin "belirli bir menzil içinde olup olmadığını" sorgulayan çok hızlı bir 'Evet/Hayır' kalkanıydı. İndeks kullanır ve matematiğe girmez. Ancak ticari bir yol haritası çizerken, bize menzil değil kesin bir "fatura" lazımdır. Bu hesabı doğrudan `ST_Distance(A, B)` fonsiyonu yapar.
Bu fonksiyon, iki geometrinin birbirine fiziki olarak *en yakın* olan noktaları arasındaki minimal doğruyu bulur ve onu ölçer. Hatırlanması gereken yegane mühendislik kuralı şudur: Eğer girdiğiniz veriler derece bazındaki `Geometry(4326)` ise çıkan sonuç "derece" olur ve çöptür. Matematiksel bir metraj istiyorsanız, girdileri hesaplama anında yerel bir metrik koda (örn. `ST_Transform` ile EPSG:3857 veya Türkiye için EPSG:5254) çevirmeli ya da kaba ama küresel `Geography` tipine cast etmelisiniz.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki komut merkezine dönüyoruz. Elimizde iki şehir var: Ankara ve İstanbul. Onların birbirine olan kuş uçuşu mesafesini kilometre bazında, en güvenilir küresel cetvelle hesaplıyoruz:
`SELECT ST_Distance(`
  `ST_SetSRID(ST_MakePoint(28.97, 41.01), 4326)::geography,`
  `ST_SetSRID(ST_MakePoint(32.85, 39.93), 4326)::geography`
`) / 1000 AS ankara_istanbul_km_farki;`

Sistemi çalıştırdığınız an, arka plandaki coğrafi zeka dünyanın elipsoit eğrisini hesaba katar ve size 349 küsur kilometrelik net bir uzamsal maliyet döner. O iki nokta birbiriyle an itibarıyla ticari ve analitik bir bağ kurmuş oldu.

**[Kapanış]**
İki nokta arasındaki görünmez ipi metrik bir değere çevirdik. Peki elimizdeki veri sadece noktalar değil de; devasa bir arsa, bir otoyol ağı veya sınırları belirlenmiş mülkiyetlerse? O zaman mesafe kadar "boyut" ve "çevre" de yaşamsal bir veri halini alır. Gelecek derste `ST_Area` ve `ST_Length` ile hacimleri ölçmeye geçiş yapacağız.