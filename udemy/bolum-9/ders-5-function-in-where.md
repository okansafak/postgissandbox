# Ders 5: Filtrede Darboğaz (Function in WHERE Sendromu ve Çözümlemesi)

**[Giriş / Hook]**
Veritabanında GiST uzamsal indeksinizi kurdunuz; milyonlarca geometriniz EPSG 4326 formatı (derece) ile kayıtlı. Sizden acil bir rapor istendi: "Şu x ve y metrik (EPSG 3857) sınırları içine düşen arabaları bul." Siz de haklı olarak kodunuzun WHERE şartına ufak bir dönüşüm modülü koydunuz: `WHERE ST_Intersects( ST_Transform(geom, 3857), metrik_zarf )`. Ve enter'a bastınız. İşlem beklediğiniz gibi 1 milisaniyede değil, 15 saniyede döndü. O kurduğunuz süper uzamsal indeksinize ne oldu? Neden motor onu görmezden geldi? 

**[Teori / Kavramsal Çerçeve]**
SQL Planlayıcısı (Planner) bir İndeks dedektifidir. Sizin kurduğunuz indeks `geom` sütununun doğrudan ve ham hali üzerindedir. Ancak siz gelip WHERE bloğunun içinde `geom` kolonunu alıp `ST_Transform(geom)` (veya geometriyi değiştiren herhangi bir fonksiyon, örn. `ST_Buffer`) ile sarmalarsanız, motor artık o veriyi orijinal `geom` olarak tanımaz.
"Bu sütun manipüle edilmiş, benim elimdeki indeks buna uymaz" diyerek kurduğunuz o milyonluk indeksi devredışı bırakır (Invalidate Index) ve her satırı ezbere transform (dönüşüm) yapıp kaba kuvvetle (Seq Scan) taramaya başlar.

Bunun kurumsal çözümü basittir. Veriyi çevirmeyin (Transform), **sorduğunuz soruyu (Hedefinizi) tablonun verisine (Orijinal formata) çevirin**. Veya, Bölüm 8'de anlattığımız gibi bu dönüşüm için özel bir "Fonksiyonel İndeks" (Functional Index) kurun.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki yanlış mimariyi ve veritabanı mühendisinin zeki kontrasını kodlayalım:
`-- YANLIŞ VE HANTAL UZAY SORGUSU (İndeksi Yok Eden Kod)`
`EXPLAIN `
`SELECT * FROM araziler `
`-- Kolon dönüştürüldüğü için GIST İndeksi çöpe gider (Seq Scan olur)`
`WHERE ST_Intersects(ST_Transform(geom, 3857), ST_MakeEnvelope(100,100, 200,200, 3857));`

`-- KUSURSUZ VE ZEKİ KONTRA (İndekse Teslim Edilen Kod)`
`EXPLAIN `
`SELECT * FROM araziler `
`-- Kolon (geom) temiz bırakılır. Soru sorulan karşı taraf (Zarf), tablonun formatına(4326) uydurulur!`
`WHERE ST_Intersects(geom, ST_Transform(ST_MakeEnvelope(100,100, 200,200, 3857), 4326));`

İkinci komutta kolon (geom) çıplak kaldığı için GiST indeksi hemen uyanır (`Index Scan` devreye girer) ve hedefin formatı dönüştürülüp karşılaştırıldığı için saniyelerden tasarruf edilir.

**[Kapanış]**
Sistemlerin zekası ne kadar yüksek olursa olsun, o zekayı tetikleyen doğru kelimeler (doğru WHERE kurguları) kullanılmadığında devasa bir silikona dönüşeceklerini ispatladınız. Sadece EXPLAIN diyerek bu hataları gözünüzle yakaladınız. Peki bir web uygulamanız veya yönetim paneliniz (Dashboard) olsaydı ve bu EXPLAIN analizlerini bir makine dilinde, grafiklere dökmek isteseydiniz ne yapardınız? Bölümün zirve noktasında robotların Analiz Raporunu, yani JSON Formatlı Planlayıcıları işleyeceğiz.