# Ders 5: Yüksek Trafiğin Orkestrasyonu ve Kapanış (Deployment ve Monitoring)

**[Giriş / Hook]**
"Veritabanınızı yazdık. Tabiatlarına göre ayırdık (Staging, Core, Reference, Network). Taksilerin ham verisini süzdük (ST_Contains). Sıcak bölgeleri petekledik (ST_HexagonGrid). Ve kuryeleri müşteriye en kısa asfalt üzerinden yönlendirdik (pgRouting). Mükemmel. Peki sistem Cuma akşam trafiğinde (Peak Hour) Milyonlarca veri gelirken yanmayacak mı? Indexes yetecek mi? O dev CPU'yu (Vacuum) kim temizleyecek?" İşte sistem mühendisliğinin en tepesindesiniz: Canlı Ortamda Veritabanı İzleme (Deployment & Monitoring).

**[Teori / Kavramsal Çerçeve]**
Biz mekansal CBS uzmanlarıyız, ama sistemlerimiz PostgreSQL üzerinde yaşar.
Canlı bir IUMP (İstanbul Kentsel Hareketlilik) projesini ayakta tutmanın 3 kutsal operasyonu vardır:
1. **İndeks Bakımı (Vacuum & Analyze):** `core.arac_konumlari` saniyede binlerce "UPDATE" alır (MVCC mimarisinde UPDATE demek, eski veriyi çöpe atıp -Bloat- yeni veri eklemektir). Taksiler hareket ettikçe tablonuz donanımsal olarak şişer. Olası bir mekansal sorgu o ölü araba koordinatlarını aramaya çalışır. Haftada bir (veya Autovacuum ile) bu tablo `VACUUM ANALYZE` ile temizlenmek, GIST indekslerinin (`REINDEX`) yeniden dallandırılması (Rebuild) ZORUNLUDUR.
2. **Partitioning (Bölümleme):** "Siparişler" ('musteri_talepleri') tablosunda 5 yıllık veri (100 milyon satır) var. Eski siparişlerle işimiz YOK. Tabloyu "aylara (YYYY_MM) göre" `PARTITION` yaparak PostgreSQL'e, "Ocak sorgusunu Ocak parçasında ara" demeliyiz! (Performansın Altın Kuralı).
3. **Ölçekleme (Scaling/Replicas):** Yazmaya-UPDATE'e izin veren "Master" veritabanı SADECE taksilerden sinyal alır. Haritadan "Heatmap/Analitik" görmek isteyen Analistlerin QGIS sorguları "Read-Replica" (Yalnızca Okuyan, senkron kopyalara) yönlendirilirse, rapor çeken müdür yüzünden taksilerin cihazları timeout yemez.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `core.arac_konumlari` o kadar çok UPDATE (`taksinin_yeri_degisti`) yemiş ki, 10 GB yer kaplıyor ama içi ölü kayıt ("Dead Tuples" - Bloat) dolu. Sisteme oksijen verme komutumuz:

`-- Gece Yarısı Trafiğinde, tüm ölü taksi lokasyonlarını diskten süpür (VACUUM)`
`-- Ve İstatistikleri, Zeki Optimizasyon Sürücülerine yeniden öğret (ANALYZE)`
`VACUUM ANALYZE core.arac_konumlari;`

`-- Mekansal (GIST) indeksler zamanla parçalanır, hız kaybeder. Onu tek parça yeniden yarat!`
`REINDEX INDEX core.idx_arac_konumlari_geom;`

Artık 10 saniye süren Isı Haritası (Heatmap) veya Yakın Taksi (Routing) raporunuz tekrar "20 milisaniyeye (0.02 sn)" düştü! Gemi rotaya oturdu, fırtınayı aştı.

**[Kapanış]**
Gördüğünüz gibi, bir "Programcı" kod yazar işi biter. Bir "Mimari" ise yazdığı yapının, aylar sonra, milyon verilerle, devasa CPU/I-O tıkamalarıyla nasıl savaşacağını (Monitoring/Vacuum) da kurgular. İstanbul Urban Mobility Platform (IUMP) gibi devasa bir "Mekansal Ekosistemin" (Bölüm 15) belkemiği artık ellerinizde. Bu 15 Bölümlük serüven boyunca düz metinleri Milyarder Kentsel Haritalara Dönüştürdünüz. Bilgelik, asfalt, güvenlik ve topoloji sınırlarını yıktınız.
PostGIS Akademi'den mezun oldunuz. Yeni dünya, sizin kodlayacağınız koordinatlara sadık kalacaktır. Tebrikler ve Uzayda bol şanslar.