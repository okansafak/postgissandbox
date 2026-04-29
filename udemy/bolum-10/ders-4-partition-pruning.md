# Ders 4: Beynin Sessiz Katili (Partition Pruning - Bölüm Budama)

**[Giriş / Hook]**
Tablonuzu aylara (Range) veya Kıtaya (List) göre böldünüz. 20 farklı ufak tablonuz var. Yönetim panelinizden Avrupa'daki bir operasyon için sorguyu ateşlediğinizde, Planner "Ben 20 tablonun 20'sine de gideyim, belki diğer ayda da Avrupa geçiyordur" derse, yaptığınız tüm bu devasa mimari çöp olur. SQL motorunun, sorgunun niyetini (WHERE koşulunu) algılayıp, gereksiz tüm tabloların fişini tarama başlamadan o saniye çekmesine "Partition Pruning" (Bölüm Budama) denir.

**[Teori / Kavramsal Çerçeve]**
`enable_partition_pruning` parametresi açık (ON) olduğunda (PostgreSQL'de genelde default açıktır), Sorgu Planlayıcısı (Query Planner) zekice bir matematik defteri tutar.
Siz `WHERE kita_kodu = 'AV'` derseniz, motor dönüp Master (Ata) tablonun kalıtım ağacına bakar. Orada "AV değeri kargo_avrupa tablosundasır, Amerika ve Asya bunlara dahil değildir" kuralını okur. 
Sorguyu (Execution) anında budar. Gidip Asya tablosunun dosyasını (disk bloğunu) veya indeksini okumaya bile yeltenmez. EXPLAIN raporunuzda `Subplans Removed: 19` (Gereksiz olan 19 tablo silinip çöpe atıldı) gibi büyük bir zafer cümlesi görürsünüz. Bu da 5 milyar satırlık bir devasa aramanın, 200 bin satırlık mini bir operasyona milisaniyeler bazında evrilmesidir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, bir önceki listeli partition (Kıta) alt-mimarisine bir "Pruning" testi atacağız. 
`EXPLAIN ANALYZE `
`SELECT * FROM kargo_pingleri `
`WHERE kita_kodu = 'AV' AND ST_Distance(geom::geography, ST_MakePoint(28,41)::geography) < 5000;`

Konsoldaki çıktıyı yakından okuyalım:
`Append (cost=... rows=...)`
`  -> Seq Scan on kargo_avrupa (cost... rows...)`
`       Filter: (...)`

Dikkat edin: Raporda hiçbir şekilde `kargo_asya` veya `kargo_amerika` kelimesi geçmez. Engine onları listelemedi, filtrelemedi, onlara hiç girmedi. Doğrudan tek bir tablo olan Avrupa diskini taradı ve işlemi bitirdi. Eğer Pruning kapalı olsaydı, raporda 3 tane alt alta Seq Scan görürdünüz ve fatura (Cost) üçe katlanırdı.

**[Kapanış]**
Veritabanı yöneticisinin en büyük silahı olan "okunmayan verinin maliyetsizliği" kuralını (Pruning) kurumsal motorlara yedirdiniz. Artık okumayacağınız veriyi diskin en tozlu köşesinde saklama özgürlüğünüz var. Ancak her disk bloğu veya her Hard Disk (Storage) aynı kalitede / fiyat etiketinde değildir. Sıcak veriyi dünyanın en pahalı diskinde (SSD/NVMe) tutup, ölü veriyi bodrum kattaki ucuz manyetik disklere sürmek isterseniz ne yapacaksınız? Serinin son darbesi Tablespace performanslarında saklı.