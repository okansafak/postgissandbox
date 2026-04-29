# Ders 4: Kurumsal Savunmada Uzamsal Cinayet (ST_Distance Anti-Pattern'i)

**[Giriş / Hook]**
"Merkez depomuza 5 kilometre mesafede olan tüm kuryeleri bulunuz." Harika bir iş senaryosu. Çaylak bir geliştirici gelir, SQL WHERE şartına şunu yazar: `WHERE ST_Distance(depo_nokta, kurye) < 5000`. Test ortamında (100 satırda) kod anında çalışır, iş birimine sunulur. Sistem canlıya çıkıp satır sayısı 5 milyona ulaştığında ise sunucu alev alır ve yanıt süresi dakikalara çıkar. Bu, PostGIS ekosisteminde işlenen en yaygın mühendislik suçudur. 

**[Teori / Kavramsal Çerçeve]**
`ST_Distance` fonksiyonu mükemmel bir matematikçi, ama korkunç bir filtredir. Neden? Çünkü `ST_Distance` (mesafe hesaplama) işlemi GEOMETRİ İNDEKSLERİNİ KULLANAMAZ!
Siz "Mesafe < 5 km" dediğinizde, motor GIST ağaçlarını ve o zeki Zarfları (BBOX) devre dışı bırakır. Dünyanın öbür ucunda, Amerika'daki kurye ile İstanbul'daki kuryenin size olan santimetrik mesafesini tek tek (Sequential Scan) hesaplamak zorunda kalır. Çünkü mesafe hesabı uzamsal kapsama (kutu) operasyonu değildir, kaba kuvvettir.

Çözüm: **ST_DWithin**.
Profesyoneller "Belirli bir menzil içindekileri" ararken asla uzaklık hesabına (`ST_Distance`) girmezler. `ST_DWithin(A, B, 5000)` kullanırlar. Bu sihirbaz şunu yapar: Arkada indeksleri (`&&` operatörü ile) kullanarak 5000 metrelik devasa bir Kutu (Zarf) açar, kutu dışındaki milyonlarca satırı hesaplamadan eler (Kısacası İndeksleri Kullanır), sadece kutunun içine düşen 3-5 talihli satırda mesafe fiziğini (Exact Test) devreye sokar.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda iki farklı yaklaşımı milisaniye farklarıyla çarpıştırıyoruz.
`-- YANLIŞ YAKLAŞIM (Kaba Kuvvet - Anti-Pattern)`
`EXPLAIN ANALYZE`
`SELECT isim FROM sehirler `
`WHERE ST_Distance(geom::geography, ST_MakePoint(28,41)::geography) < 5000;`
`(Uygulama Seq Scan kullanır. Planning: 0.1ms, Execution: Sürekli uzar)`

`-- PROFESYONEL YAKLAŞIM (ST_DWithin Kalkanı)`
`EXPLAIN ANALYZE`
`SELECT isim FROM sehirler `
`WHERE ST_DWithin(geom::geography, ST_MakePoint(28,41)::geography, 5000);`
`(Uygulama Bitmap Index Scan kullanır. Planning: 0.2ms, Execution: 1 Milisaniye)`

İlk sorguda işlemci terlerken, ikinci sorguda GiST indeksi devreye girmiş ve operasyon cerrahi bir hızla tamamlanmıştır.

**[Kapanış]**
Acemi komutların bir veritabanı nasıl felç edebileceğini gördünüz ve otonom bir koruma sistemi (DWithin) geliştirdiniz. Fakat sorgu optimizasyonunda her hata uzaklıktan kaynaklanmaz. Bazen, devasa veriyi bir komutun içine hapsetmek (Where filtresinde ağır fonksiyon çağırmak) makineyi karanlığa gömer. Gelecek dersimizde, WHERE filtrelerindeki manipülasyon facialarını, yani "Function in WHERE" sendromunu çözeceğiz.