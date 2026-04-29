# Ders 2: Katı Matematik ve Sabit Merkezler (K-Means Kümelemesi)

**[Giriş / Hook]**
Elinizde pazar araştırmasından gelen 50 bin potansiyel mağaza lokasyonu var. CEO masaya yumruğunu vurup "Bana Türkiye çapında 15 adet Bölge Müdürlüğü noktası belirle; her müşteri en yakın bölgeye atansın ve lojistik maliyetimiz dibe vursun" diyor. "15" sayısı kesindir, değişemez. Sizden hiç kimsenin açıkta kalmayacağı ve herkesin en optimum (en yakın) merkezine bağlanacağı bir coğrafi diktatörlük kurmanız isteniyor. Çözüm `ST_ClusterKMeans` motorundadır.

**[Teori / Kavramsal Çerçeve]**
`K-Means` makine öğrenmesi tarihinde en köklü ve pürüzsüz gruplama tekniğidir. Kural basittir: Ona "K" değerini (Kaç adet küme istediğinizi) verirsiniz. PostGIS haritada önce rastgele "K" adet Merkez (Centroid) belirler. 
Daha sonra her bir noktayı kendisine en yakın merkeze bağlar. Bağladıkça merkezlerin yerini "Kendisine atanan noktaların ortalamasına" doğru kaydırır. Bu kaydırma, sistemdeki tüm noktaların, kendi merkezine olan uzaklıklarının karesel hatası minimum olana kadar devam eder. Sonuç, herkesin zorunlu olarak, ama en adil biçimde bir merkeze atandığı kusursuz bir coğrafi matristir. Yalnız unutulmaması gereken nokta; K-Means uzaydaki yalnız kurtları (aykırı çok uzak veya deniz ortasındaki noktaları) bile affetmez, zorla dev bir kümeye dahil edip ortalamayı büker.

**[Uygulama / Ekran Gösterimi]**
Panomuza 50 bin adet kargo koordinatı yüklü. Sisteme tek bir parametre (`15`) vererek her bir kargonun üstüne "Sen Bölge X'e aitsin" mührünü (Cluster ID) vurmasını emrediyoruz:
`SELECT `
  `-- Her satıra K-Means algoritmasının biçtiği ID`
  `ST_ClusterKMeans(geom, 15) OVER() AS bolge_kodu, `
  `id, `
  `isim, `
  `geom `
`FROM kargo_noktalari;`

Sistemi çalıştırdığınız saniyede, her bir satırın karşısında `0` ile `14` arasında bir `bolge_kodu` çıkar (Toplam 15 bölge). Sonrasında bu gruplaşmış veriyi alıp `GROUP BY bolge_kodu` ve `ST_Centroid` fonskiyonlarına sokarsanız; masanıza CEO'nun istediği tamı tamına 15 adet muazzam lojistik deponun GPS koordinatları altın tepside konulmuş olur.

**[Kapanış]**
Dağınık pikselleri kesin ve adil 15 odaya hapsettiniz. Makine sayıyı bildiği için sizin adınıza rotaları minimumda kesti. Ancak ya elinizde önceden belirlenmiş bir "K" (Depo) sayısı yoksa? Diyelim ki bir epidemiyologsunuz ve haritada "Hastalığın yoğunlaştığı doğal salgın merkezlerini" veya "Trafik kazalarının kara noktalarını" arıyorsunuz. Yoğunluk kaç küme çıkacak kimse bilmiyor, 2 de çıkabilir 50 de. İşte o zaman sayı diktatörü K-Means'i bırakıp, vahşi doğanın yoğunluk avcısı DBSCAN'e yöneleceğiz.