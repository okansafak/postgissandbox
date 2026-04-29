# Ders 1: Kusursuz Okunabilirlik ve Verinin Zihinsel Ambalajı (Clustering'e Giriş)

**[Giriş / Hook]**
Yönetim kuruluna sunduğunuz harita üzerinde 500.000 adet aktif müşteri veya teslimat noktası varsa, ekranda gördüğünüz şey bir "strateji" değil, piksellerden oluşan anlamsız bir renk çorbasıdır. Veri arttıkça görsel anlam azalır. İnsan beyni ve ekran çözünürlükleri tekil binlerce iğneyi algılayamaz; sistemler kalabalıkları mantıklı, yoğun ve yönetilebilir yığınlara veya merkezlere (Cluster) dönüştürmelidir. Kasıtlı bir genelleme sanatı olan Kümeleme (Clustering) çağındayız.

**[Teori / Kavramsal Çerçeve]**
Kümeleme (Clustering), birbirine coğrafi olarak yakın olan veya belirli yoğunluk şartlarını sağlayan dağınık koordinatların, matematiksel ve istatistiksel algoritmalarla ortak bir "Öbek / Merkez Nokta" (Centroid veya Grup) etrafında toplanmasıdır.
Çoğu yazılımcı bu işleme "Front-End" (Tasarım/Arayüz) tarafında, örneğin Leaflet Supercluster veya Mapbox kütüphanelerinde başvurur. Bu yöntem tarayıcıyı yorar, bataryayı tüketir ve milyarlık verilerde istemcinizi anında çökertebilir. Oysa gerçek kurumsal veri bilimcileri, kümeleri doğrudan veritabanı motorunun içinde (In-Database Machine Learning) gruplar. PostGIS tek bir SQL sorgusuyla milyarlarca pini alır, "Bu 50.000 nokta 1 Numaralı Kümedir, bu 100.000 nokta 2 Numaralı Kümedir" diyerek size o saniye salt zekayı ve özet koordinatları servis eder.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, "musteriler" adlı o korkunç 500 bin satırlık tablonun ekrana anlamsızca basılmasını durduruyoruz. Artık "Her mahallenin veya obanın ağırlık merkezini" görselleştirmeyi düşleyeceğiz.
`-- Kümelemeye geçmeden önce verinin zihinsel olarak çökerttiği geleneksel sorgu:`
`SELECT geom FROM aktif_teslimatlar;`
`(Uygulama 500.000 pin çizer, harita siyaha/kırmızıya boyanır, browser donar, analiz sıfırdır)`

Bunu aşmak için PostgreSQL'in kalbindeki istatistiksel PostGIS Uzamsal Algoritmalarını uykusundan uyandıracağız. Bize iki devasa karar mercii eşlik edecek: Hedefi belli olan sabit merkezler (K-Means) ve doğanın vahşi yoğunluğunu arayan radar (DBSCAN). 

**[Kapanış]**
Görüldüğü gibi saf kütlenin gücü, iş zekası (BI) kavramında bir değer ifade etmez. Onu özetleyip yoğunlaştırmak zorundasınız. Peki diyelim ki şirketiniz tüm İstanbul geneline tamı tamına "10 adet Dağıtım Deposu" kurma kararı aldı. Bu 10 depo (Merkez) nereye açılmalı ki, her bir müşteri kendisine en adil ve en kısa mesafedeki depoya atanmış olsun? Karşınızda katı ve diktatöryal bir matematiğin şaheseri: K-Means Algoritması.