# Ders 4: Sıralama, Sınırlandırma ve Optimizasyon (ORDER BY, LIMIT, DISTINCT)

**[Giriş / Hook]**
Doğru veriye ulaşmış olmak analitik eylemin yalnızca başlangıcıdır. Çektirilen veriyi karar alıcılar için yorumlanabilir, önceliklendirilmiş ve tekil bir forma dönüştürememek, vizyonsuz bir sunumdan öteye gidemez.

**[Teori / Kavramsal Çerçeve]**
İlişkisel veritabanlarında motor, filtrelediği veriyi varsayılan olarak diske yazıldığı donanımsal sırada veya öngörülemez bir indeks düzeninde döndürür. Sunuma bir düzen dikte etmek için `ORDER BY` komutu kullanılır. Bu ifade, veri kümesini kronoloji, finansal büyüklük veya alfabetik değerlilik üzerinden dizer. `LIMIT`, bellek israfını engelleyen, performansı optimize eden ve veri kümesini baştan koparan güçlü bir frendir. `DISTINCT` ise tekrarlayan veri yığınlarını radikal bir yaklaşımla temizler; sadece yegâne ve benzersiz kombinasyona sahip satırları yüzeye çıkarır.

**[Uygulama / Ekran Gösterimi]**
Sorgu arayüzümüzde bu yapıları birbirine zincirlediğimiz güçlü bir model kuralım. Hedefimiz en kalabalık 5 şehrin dökümünü almak ve bunları yukarıdan aşağıya (azalan sırada) raporlamak:
`SELECT ad, nufus FROM sehirler ORDER BY nufus DESC LIMIT 5;`
Komutu çalıştırdığımızda, sistem bize on binlerce potansiyel şehir kaydı içinden en kalabalık ilk beş demografik işlemi hiyerarşik olarak sunar. 

Bazen ise verinin değil yapısal bilginin peşine düşeriz. Örneğin "Sahip olduğumuz lokasyon demografisinde kaç farklı coğrafi bölgemiz (kategorimiz) var?" sorusu için Distinct kullanılır:
`SELECT DISTINCT bolge FROM sehirler;`
Burada ise veritabanı yorulmayan bir veri temizlikçisi gibi davrandı; mükerrer Marmara ve İç Anadolu kayıtlarını eledi, bize yegane bölgelerimizin dökümünü listeledi.

**[Kapanış]**
Görüldüğü üzere artık veriyi kendi iş planımıza göre eğip bükebiliyoruz. Ne var ki asıl vizyon genişliği veriyi satır satır listelemek değil, onun ifade ettiği genel eğilimi bulmaktır. Gelecek derste veriyi makro düzeyde algılamamızı sağlayacak Aggregation (Kümeleme) fonksiyonlarıyla raporlama pratiklerine geçiş yapacağız.