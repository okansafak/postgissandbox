# Ders 2: Kaba Kuvvete Karşı Cerrahi Müdahale (Seq Scan ve Index Scan)

**[Giriş / Hook]**
Sorgu analizi (EXPLAIN) raporunu okuduğunuzda en üst satırda "Seq Scan" yazdığını görürseniz, geçmiş olsun. Şirketinizin parası ve işlemci gücü o an gözlerinizin önünde eriyip gitmektedir. Çünkü motor "Aradığın şeyi bulmak için tablodaki 15 milyon satırı birinci satırdan sonuncu satıra kadar okumaya başladım" diyordur. Oysa uzmanların masasında o ibare daima "Index Scan" olmak zorundadır.

**[Teori / Kavramsal Çerçeve]**
PostGIS'in veriyi bulmak için seçtiği iki ana yol vardır:
1. `Sequential Scan (Sıralı Tarama)`: Kaba kuvvettir. Tabloda indeks olmadığında, ya da tablo çok küçük olduğunda (50-100 satır), yahut filtre koşulunuz tablonun %80'ini kapsadığında motor diskleri baştan sona kazar. Uzamsal (Spatial) analizlerde bu mimari asla kabul edilemez.
2. `Index Scan / Bitmap Index Scan (İndeks Taraması)`: Cerrahi bir vuruştur. Motor, gidip o devasa GiST uzay ağacına başvurur. İstenilen Zarfın (BBOX) dalını anında bulur ve sadece o koordinatlara denk gelen 3-5 fiziksel tablo bloğunu (sayfasını) okur. 

Bazen raporlarda `Bitmap Index Scan` ve hemen ardında `Bitmap Heap Scan` görürsünüz. Bu, indeksin çok sayıda satır (mesela 5 bin tane) bulduğu ve diskte atlama yapmamak için önce satırların hafızada bir yığın (bitmap) haritasını çıkarıp tek seferde veri tablosuna inme stratejisidir. Harika ve optimize bir reflekstir.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda GiST indeksi kurulu bir tabloya, bir Zarf (BBOX) çarpıştırması gönderiyoruz ve motorun stratejisine bakıyoruz:
`EXPLAIN ANALYZE`
`SELECT isim FROM orman_arazileri `
`WHERE geom && ST_MakeEnvelope(28, 40, 29, 41, 4326);`

Sorgu raporu ekrana dökülür:
`Bitmap Heap Scan on orman_arazileri...`
`  -> Bitmap Index Scan on idx_orman_geom...`

Sistem GIST indeksini (idx_orman_geom) bulmuş `(Index Scan)`, oradan çıkan referanslarla tabloya gidip nokta atışı işlemi `(Heap Scan)` tamamlamıştır. Satırlar milyonları bulsa da, okunan veri sadece indeksten süzülen 10 satırdır. Cerrahi kesik atıldı ve kaba kuvvet devreden çıkarıldı.

**[Kapanış]**
Makinenin zekasının (Index) kaba kuvvete (Seq) nasıl galip geldiğini raporlar üzerinden belgelediniz. Fakat o raporların yanında yazan gizemli sayılar ne demektir? "cost=0.00..14.5 rows=12" ifadesindeki "Cost" gerçekte Türk Lirası mıdır, Dolar mıdır, Milisaniye midir? Analiz sanatının kalbine, Maliyet (Cost) ve Satır (Rows) okumalarına geçiyoruz.