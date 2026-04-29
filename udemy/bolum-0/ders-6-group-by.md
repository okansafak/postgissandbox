# Ders 6: Veri Gruplama Prensipleri (GROUP BY)

**[Giriş / Hook]**
Bütünsel bir bakış açısı organizasyona genel bir fikir verir; ancak asıl rekabet avantajı, bütünü oluşturan parçaların performans kırılımlarını ve farklılıklarını görebildiğiniz zaman başlar. Genel büyüme yerine lokasyon bazlı veya kategori bazlı büyüme raporu sunmak, bir analisti sıradan bir uygulayıcıdan ayıran ince zeka sınırıdır.

**[Teori / Kavramsal Çerçeve]**
`GROUP BY` yantümcesi, kümeleme (aggregate) fonksiyonlarını tablonun bütününe topyekûn uygulamak yerine, veriyi belirlenen spesifik bir sütuna göre homojen alt kümelere (kovalara) ayırmanızı zorunlu kılar. Veritabanı motoru önce veriyi okur, şemadaki aynı kategorik dizinede yer alan kayıtları bir araya getirir ve ardından verdiğiniz matematiksel işlemi (`SUM`, `COUNT` vb.) bu kovalardan her biri için ayrı bir oturumda, izole bir şekilde hesaplar. Analitik raporlamanın ve pivot tabloların veritabanındaki ana vatanı kümülatif segmentasyondur.

**[Uygulama / Ekran Gösterimi]**
Veritabanı arayüzümüzdeki sorgu penceremizde Türkiye demografisinin coğrafi bölgelere göre parçalı ve analitik bir vizyonunu yaratalım:
`SELECT bolge, COUNT(id) AS sehir_sayisi, SUM(nufus) AS toplam_nufus, AVG(alan_km2) AS ort_yuzolcum FROM sehirler GROUP BY bolge ORDER BY toplam_nufus DESC;`

Ekran çıktısına bakın: Sistem "sehirler" tablosunu önce her bir coğrafi bölgesine göre mantıksal lokasyonlara ayrıştırdı, parçalara böldü. Mesela Marmara, Akdeniz, İç Anadolu bloklarını (kovalarını) ayrı ayrı oluşturdu. Hemen ardından her kovanın içine girdi, istatistik işlemini saydı, topladı ve sonuçları liderlik tablosu gibi kümülatif raporladı. Artık şirket nerede daha yoğun bir yatırım yapacağını (bölge nüfusları üzerinden) bilebilir.

**[Kapanış]**
Veriyi tek bir tabloda okuma, gruplama ve istatistik türetme yetisini kalıcı bir pratiğe oturtmuş durumdayız. Ne var ki modern, normalleştirilmiş ilişkisel sistemler tüm operasyonel veriyi aynı tabloda yığmaz; performans (ve tutarlılık) gereği farklı nesnelere böler. Gelecek derste, dağınık tutulan mantıksal varlıkları `JOIN` komutlarıyla nasıl yeniden tek gövdede (birleşik formda) okuyacağımızı ele alacağız.