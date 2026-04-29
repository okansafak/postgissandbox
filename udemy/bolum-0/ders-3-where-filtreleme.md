# Ders 3: Koşullu Filtreleme ve Veri İzolasyonu (WHERE)

**[Giriş / Hook]**
Veri ambarlarının devasa hacimleri içinde kaybolmamak, gürültüyü gerçek sinyalden ayırabilme kesinliğine bağlıdır. Tüm veriyi listelemek yerine, yalnızca kritik koşulları karşılayan veriyi izole etmek teknik bir zorunluluktur.

**[Teori / Kavramsal Çerçeve]**
SQL’de veri izolasyonu `WHERE` yantümcesi ile sağlanır. Bu mekanizma, projeksiyonu yapılmış ham verinin üzerinden geçen katı mantıksal bir süzgeçtir. İlişkisel veritabanı motoru, tablodaki her bir satırı sırayla alır, `WHERE` bloğunda tanımlanan önermenin o satır için doğru (TRUE) olup olmadığını test eder ve yalnızca bu sağlamayı geçenleri bellekte depolar. Eşitlik (`=`), büyüklük (`>`), çoklu içerik kontrolü (`IN`) veya karakter desen eşleştirme (`LIKE`) gibi net operatörler, söz konusu filtrelemenin algoritmik keskinliğini artırır.

**[Uygulama / Ekran Gösterimi]**
Veritabanı arayüzümüzde (IDE'mizde) bu süzgeci hemen test edelim. Hazır "sehirler" veri setimizi kullanarak sorgumuzu şu şekilde inşa ediyoruz: 
`SELECT id, ad, nufus FROM sehirler WHERE nufus >= 2000000 AND bolge = 'Marmara';`

Sistemi çalıştırdığımızda veritabanı motoru çok net bir operasyon yürütür: Nüfusu 2 milyona eşit ya da büyük olmayan illeri çöpe atar ve bölgesi Marmara dışındaki tüm verileri saniyeden çok daha kısa bir sürede dışarı iter. Karmaşık bir operasyon kuralını, sadece iki mantık operatörüyle makine diline dikte etmiş olduk. Aynı şekilde, birden fazla opsiyonu sınarken `IN` veya metin şablonu ararken `LIKE` filtresinden yararlanabiliriz: `WHERE bolge IN ('Ege', 'Akdeniz')` gibi bir deklarasyonla izolasyonu dilediğimizce esnetebiliriz.

**[Kapanış]**
Filtrelenmiş ve rafine edilmiş bir sonuç kümesi elde ettik. Bir sonraki bölümde, bu sınırlandırılmış veri kümesini okunabilir veya raporlanabilir formatlara sokmayı; sıralama (ORDER BY), limitleme (LIMIT) ve benzersizleştirme (DISTINCT) tekniklerini işleyeceğiz.