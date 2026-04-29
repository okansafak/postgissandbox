# Ders 7: Alevin ve Işığın Muhafızı (ANALYZE ve İstatistik Dağılımı)

**[Giriş / Hook]**
Kusursuz bir SP-GiST indeksiniz var, sorgunuz metrik uyumlu, operasyonunuz jilet gibi. Ancak dün gece tabloya 1 Milyon yeni kurye konumu aktarımı (Bulk Insert) yaptınız. Ertesi gün ofise geldiğinizde sistemin anlamsızca yavaşladığını, motorun devasa indeksi reddedip o hantal Sequence Scan kabusunda takılıp kaldığını görüyorsunuz. Motor neden kurduğunuz şaheser indeksi kullanmamakta direniyor? Çünkü o, indeksle değil; istatistiklerin verdiği algıyla düşünür ve sizin onun algısını "güncellemediğinizi" sanır.

**[Teori / Kavramsal Çerçeve]**
PostgreSQL’in beyni olan Planlayıcı (`Query Planner`), bir sorguyu işlerken her an "İndeksi mi kullansam, yoksa tabloyu tamamen baştan sona mı tarasam?" kumarını hesaplar. Bu kumarı oynarken güvendiği tek şey tablonun "Veri Dağılımı" (Histogram / Frequency) istatistiğidir.
Siz tabloya milyonlarca satır gömdüğünüzde veya sildiğinizde, Planner'ın beynindeki oranlar eskide kalır. Der ki: "Bu tablo dünden kalma, içinde 5 satır var; ufacık 5 satır için indekse girmeye (Index Scan) ne gerek var, tabloyu direkt elle okuyayım". Siz milyon veriyi yığmışsınızdır ama motor dünkü o ufacık hacmi hatırladığı için Seq Scan kararı verir. Bu illüzyonu kırıp istatistiksel şizofreniyi tedavi etmek için tabloya atılan tokadın adı `ANALYZE` komutudur.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki dev veri yığınının ardından Planner'ın beynini yeniden kodlama seansına giriyoruz:
`-- Kaba ve tüm tabloyu kilitsiz tarama gücü`
`ANALYZE kuryeler;`

Bu komut saniyeler sürer, veri değiştirmez, tablo kilitlemez. Tek yaptığı satırların dağılımını, BBOX örtüşmelerini yeniden örnekleyip (`sampling`) sistem casuslarına haber vermektir.
Ardından komutumuzu EXPLAIN ile inceliyoruz:
`EXPLAIN SELECT isim FROM kuryeler WHERE geom && ST_MakeEnvelope(28,40,29,41,4326);`

Eğer daha demin "Seq Scan" e takılıyorsa, motor şimdi beynindeki bulutları atar ve "Ooo burada milyon satır varmış, ben acilen GIST ağacına döneyim" der ve rapor yine gurur verici `Bitmap Index Scan` mertebesine ulaşır.

**[Kapanış]**
Geleneksel Seq Scan hezimetinden başlayıp, GIST ve SP-GIST ağaçlarını ektiğimiz, zarf çarpışması ile hızı tetiklediğimiz ve Planner'ın nörolojsini ANALYZE ile resetlediğimiz, muazzam bir kurumsal performans mühendisliği serüveni olan Bölüm 8'i kusursuz bitirdik. Uzamsal analizi sadece yapmıyor, onu milisaniyelere oturtan bir endüstri standartına sokuyorsunuz. Tüm harita ve veri kurgunuz tamam. Öğrenmeye sıkı sıkıya devam edin. Başarılar dilerim.