# Ders 1: Yargıcın Çekiç Darbesi (EXPLAIN vs EXPLAIN ANALYZE)

**[Giriş / Hook]**
Yazdığınız tek satırlık bir SQL kodu, arka planda yüzlerce farklı yoldan çalıştırılabilir. Veritabanınız sizin yazdığınızı doğrudan uygulamaz; onu alır, parçalarına ayırır ve kendi beyninde bir "Maliyet Planı" (Query Plan) oluşturur. Sisteminizin neden yavaşladığını anlamak için kodunuza değil, motorun o kodu nasıl anladığına bakmanız gerekir. İşte, veritabanı mühendisliğinin yalan makinesi ve röntgen cihazı: EXPLAIN ve ANALYZE.

**[Teori / Kavramsal Çerçeve]**
Bir sorgunun başına `EXPLAIN` koyduğunuzda, PostGIS o komutu çalıştırmaz; sadece "Eğer çalıştırsaydım, tahminen şu rotayı izlerdim ve bana bu kadar işlemci gücüne mal olurdu" diyerek bir niyet mektubu sunar. Bu salt teoridir; tablonun güncel durumunu tam yansıtmayabilir.

Eğer komutun başına `EXPLAIN ANALYZE` koyarsanız, motor komutu gerçekten, fiziksel olarak çalıştırır (veriyi diske döker veya okur). Ve size hem "Tahmin Ettiği Maliyeti" (Planning Time) hem de "Gerçekte Ne Kadar Sürdüğünü" (Execution Time) milisaniye hassasiyetinde çarşaf gibi serer. Gerçek dünyada, kurumsal veri ambarlarında bir analistin eli daima bu iki kelimeyle başlar. Yalanlarla değil, gerçek milisaniyelerle çalışır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda masum görünen bir mesafe sorgusunu motorun paneline gönderiyoruz. Orijinal komuttan önce röntgen cihazını (EXPLAIN ANALYZE) devreye sokalım:
`EXPLAIN ANALYZE`
`SELECT isim FROM sehirler `
`WHERE ST_Contains(`
  `ST_GeomFromText('POLYGON((28 40, 29 40, 29 41, 28 41, 28 40))', 4326), `
  `geom`
`);`

Sorguyu ateşlediğinizde çıkan rapor, veritabanının gizli günlüğüdür. Çıktının altında "Planning Time: 0.123 ms" ve "Execution Time: 0.450 ms" verilerini görürsünüz. Eğer planlama 0.1 milisaniye, ancak uygulama (Execution) 50.000 milisaniye sürüyorsa, motor bir vadede tıkanmış ve yanlış yola sapmış demektir.

**[Kapanış]**
Görüldüğü gibi kodun ne döndürdüğüyle değil, o verinin sistemden nasıl koparıldığıyla ilgilenmeye (Sorgu Planlayıcısı - Query Planner) başladık. Motorun bize sunduğu rapordaki ilk satır genellikle ya büyük bir zaferdir ("Index Scan") ya da ölümcül bir hezimettir ("Seq Scan"). Gelecek derste, motorun bu iki devasa yol ayrımında nasıl karar verdiğini ve savaşın galibini (Seq vs Index) inceleyeceğiz.