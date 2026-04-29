# Ders 3: Veritabanı Muhasebesi (Cost ve Rows Değerlerini Okumak)

**[Giriş / Hook]**
Finansal tablolarda kar ve zararı okuyamayan bir CFO, şirketi batırır. Aynı şekilde SQL EXPLAIN raporlarında karşınıza çıkan `cost=15.42..3400.10` rakamlarının ne anlama geldiğini bilmiyorsanız, o kodun sunucuya ne kadar hasar verdiğini de bilemezsiniz. Veritabanının kendi iç para birimi olan "Cost" kavramını çözmeye başlıyoruz.

**[Teori / Kavramsal Çerçeve]**
Planner (Sorgu Planlayıcı) raporlarında iki kritik metrik yatar:
1. `Cost (Maliyet)`: Bu değer milisaniye DEĞİLDİR. İşlemcinin sayfa (disk block) okuma yükünü ve CPU dönüşlerini ifade eden soyut bir "Makine Puanı"dır (Veritabanı Para Birimidir). 
   Formül iki rakamdan oluşur: `cost=Başlama_Maliyeti .. Bitiş_Maliyeti`
   Örneğin `cost=0.00 .. 15.42`. İlk rakam (0.00), motorun ilk satırı bulup ekrana basmadan önce yaptığı hazırlık maliyetidir (Index okumak vs). İkinci rakam (15.42) ise motorun işlem bittiğinde ulaştığı Total Faturadır. Eğer ardışık (Sequential) analiz yaparsanız, bu fatura `cost=0.00 .. 158000.54` gibi devasa rakamlara fırlar.
2. `Rows (Satır Tahmini)`: Motorun, bu işlemi yaparken "Tahminen kaç satır yakalarım" diyerek yaptığı hesaptır. Eğer EXPLAIN ANALYZE kullanıyorsanız sistem size iki değer sunar: `rows=10 (Planner tahmini)` ve `actual time=.. rows=1000` (Gerçek gerçekleşen). 

Dünya devi sistemlerdeki en büyük krizler, Planner'ın `rows=10` tahmin edip, indeks kullanmaması ama gerçekte `actual rows=1000000` çıkması ve sistemin kitlenmesinden doğar. (Bu yüzden önceki bölümde ANALYZE komutunu işlemiştik).

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki analiz panosuna maliyet faturası kesiyoruz:
`EXPLAIN `
`SELECT id FROM sehirler `
`WHERE nufus > 5000000;`

Konsoldaki çıktı şudur: `Seq Scan on sehirler (cost=0.00..452.12 rows=3 width=4)`
- 0.00: Başlama maliyeti sıfır, çünkü Seq Scan hiçbir hazırlık yapmaz, bodoslama diskten okumaya başlar.
- 452.12: Diski en alta kadar süpürmenin total faturası. 
- rows=3: Motor zekası "Sadece 3 Megaşehir döneceğim" tahmininde bulunmuş.
- width=4: Verinin RAM'de (Sadece id kolonu (Integer) tutulduğu için) kaç byte kaplayacağı (4 bytes).

**[Kapanış]**
Artık sistemin gizli faturasını okuyabilen tam yetkili bir denetçisiniz (Auditor). Makinenin nasıl düşünüp nelere ne kadar efor (Cost) verdiğini görüyorsunuz. Peki, acemi geliştiricilerin en sık yaptığı ve bu Cost değerlerini milyarlara fırlatan o meşhur Uzamsal Cinayet nedir? Bir sonraki bölümde SQL dünyasının en büyük sabıka raporunu okuyacağız: ST_Distance Anti-Pattern'i (Tuzağı).