# Ders 6: Makinelere Konuşan Raporlar (EXPLAIN FORMAT JSON)

**[Giriş / Hook]**
Biraz önce EXPLAIN komutuyla gördüğümüz o uzun metinsel hiyerarşiler (-> Seq Scan on ..., -> Bitmap Heap Scan) bir insan mühendisin gözüyle hızlıca okunabilir. Fakat diyelim ki şirket içi bir "PostGIS İzleme ve Performans Dashboardu (Ekranı)" yazıyorsunuz. React (Front-end) uygulamanız veya APM yazılımlarınız, motorun bu İngilizce metnini nasıl anlayacak ve grafiksel bir "Performans Ağacına" nasıl çevirecek? Çözüm evrensel makine anlaşma metni olan JSON çıktısı almaktır.

**[Teori / Kavramsal Çerçeve]**
Modern SQL ve PostGIS, Planner (Planlayıcı) çıktılarını sadece ham ve biçimsiz tekst çizgileri olarak döndürmek zorunda değildir. `EXPLAIN (FORMAT JSON)` deklarasyonu kullandığınızda, PostgreSQL size iç içe geçmiş objelerden oluşan devasa ve kusursuz bir JSON (JavaScript Object Notation) ağacı (payload) gönderir.
Bu ağaçta; `Node Type` (Ağacın tipi: Index Scan), `Total Cost` (Toplam Fatura), `Plan Rows` (Satır Tahmini) gibi yüzlerce statik anahtar (key) bulunur. Bu sayede yazılımcılarınız veya CI/CD boru hatlarınız (Continuous Integration) sistem yavaşlamadan önce bu JSON datalarını çekip okuyarak otomatik uyarı alarmları (Alerts) yaratabilir.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde son test sorgumuzu geleneksel metinle değil, modern uygulama diliyle geri istiyoruz:
`EXPLAIN (FORMAT JSON, ANALYZE)`
`SELECT isim FROM sehirler `
`WHERE ST_Contains(ST_MakeEnvelope(28,40, 29,41, 4326), geom);`

Terminal konsoluna akan veri, okunabilir bir obje setidir:
`[`
  `{`
    `"Plan": {`
      `"Node Type": "Bitmap Heap Scan",`
      `"Relation Name": "sehirler",`
      `"Startup Cost": 4.50,`
      `"Total Cost": 150.12,`
      `"Plan Rows": 12,`
      `"Actual Rows": 8,`
      `"Execution Time": 0.435`
    `}`
  `}`
`]`

Uygulamanız bu paket yapısını (JSON) okur, `Actual Rows` ile `Plan Rows` arasındaki fark açılmışsa "Dikkat, İstatistikler Bozuldu (ANALYZE gerekli)" diyerek sistem yöneticilerine otonom (insansız) Slack veya Mail bildirimi atar. 

**[Kapanış]**
Geliştiricilikten, tam entegrasyon mühendisliğine ve sistem gözlemciliğine (Monitoring) ulaştınız. EXPLAIN komutunu anladınız, indeks savaşlarını çözdünüz, `ST_DWithin` ile uzay cinayetlerini durdurup, sistemi JSON ağıyla dış API'lere sundunuz. Performans ve Optimizasyon Taramaları Bölüm 9'u kusursuz bir başarıyla kapattık. Bu bilgiler, bir harita uygulamasının sadece çalışmasını değil, büyük kitlelere (10 binlerce eşzamanlı anlık kullanıcıya) hata vermeden hizmet etmesini garantileyen kilit taşlarıdır. Eğitim programının bir sonraki yapılarında buluşmak dileğiyle. Başarılar.