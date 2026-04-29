# Ders 6: Sistem Röntgeni ve Ölçüm Raporları (pg_stat_indexes)

**[Giriş / Hook]**
"Sistem yavaşladı, sanırım indeks bozuldu." Kurumsal veritabanı yönetiminde "sanırım" kelimesine yer yoktur. Bir indeksin yaratılması, onun sonsuza kadar mükemmel işleyeceği anlamına gelmez. Satırlar silinip yenileri eklendikçe, uzamsal GIST ağacının içi kuruyan dallar, bozuk veya geçersiz sayfa boşluklarıyla dolar. Peki, devasa uzay ağacınızın verimlilik grafiğini (kaç defa kullanıldığını, ne kadar ölü alan barındırdığını) C-Level bir toplantıda kanıtlamak (röntgenini çekmek) isterseniz nereye bakmalısınız?

**[Teori / Kavramsal Çerçeve]**
Postgres çekirdeği muazzam bir izleme ve istatistik casus ağıyla donatılmıştır. Bizim ilgileneceğimiz ana rapor masası: `pg_stat_user_indexes` sistem görünümüdür (View).
Bu görünüm sistemdeki tablolarınıza dair şunları dikte eder: "Bu tabloya X kez sorgu atılmış, Y kez benim uzamsal (GiST) indeksim kullanılarak tabloya hiç inilmeden (Index Scan) yanıt dönmüş. Z defasında ise indeks bir işe yaramamış ve motor Seq Scan (kaba kuvvetle) satırları okumuş." 
Eğer devasa bir indeks yarattıysanız ama o indeksin "kullanılma" (`idx_scan`) istatistiği aylardır sıfırda (0) yatıyorsa, o indeks yanlıştır, boştur veya uygulamanız yanlış veri tipine (`::text` üzerinden vb.) sorgu basıyordur. Ölü indeks disk alanınızı ve `UPDATE` işlemlerinizi mahveden bir asalak durumuna düşmüştür.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda sisteme inerek kendi ellerimizle yarattığımız GiST indeksinin performans karnesini (KPI) anlık olarak çekiyoruz:
`SELECT `
  `relname AS tablo_adi, `
  `indexrelname AS indeks_adi, `
  `idx_scan AS kac_kez_kullanildi, `
  `idx_tup_read AS indeks_uzerinden_okunan_satir, `
  `idx_tup_fetch AS canli_tablodan_toplanip_gelen_satir`
`FROM pg_stat_user_indexes `
`WHERE indexrelname = 'idx_sehirler_geom';`

Bu röntgen çıktısında `idx_scan` değeriniz yüksek, `idx_tup_read` değerleri makul seviyelerdeyse sistem saat gibi işliyor deöektir. Ama `idx_scan = 0` görüyorsanız, sistem kurduğunuz zıhrın vizyonsuz olduğunu ve motorun onu görmezden geldiğini fısıldamıştır. Silin veya doğru bir Partial/Functional yapıda baştan yazın.

**[Kapanış]**
Görmediğiniz ve raporlayamadığınız bir şeyi iyileştiremezsiniz prensibini kusursuzca sağladık. Sizin kurduğunuz uzamsal indekslerin kullanım oranlarını ispatlama yeteneğiniz var. Fakat sisteminizdeki indeks harikadır da, veritabanı motoru aptallaştığı için o indeksi bırakıp Sequential Scan komutlarına mı kaçıyordur? Veritabanının beyni (Planner) verinin şeklinden ve rotasından habersizse en iyi indeksi bile reddeder. Bölüm finalinde Planner zekasını güncel tutan en kritik komutu ateşleyeceğiz: `ANALYZE`.