# Ders 2: Devleri Atomlarına Ayırmak (ST_Subdivide)

**[Giriş / Hook]**
Veritabanı indeksleri devasa çokgenlerden çok korkar. Sisteminizde dünyanın en büyük ormanı (milyonlarca kırık çizgi) devasa bir poligon (POLYGON) olarak tutuluyor olabilir. "Birisinin evi bu orman içinde mi?" (ST_Intersects) diye sorduğunuzda, GIST indeksi koskoca ormanın Zarfı (BBOX) çok büyük olduğu için neredeyse bütün ülkeyi taramak zorunda kalır. Dev poligonların analitik performansta yarattığı bu karadeliği nasıl kapatırız? Onları parçalayarak. 

**[Teori / Kavramsal Çerçeve]**
Büyük ve binlerce "vertex" (köşe) içeren poligonlar veya çizgiler, Spatial İndekslerde devasa bir Zarf (envelope) olarak yer işgal ettiği için, sahte pozitiflerin (False-Positives) en büyük kaynağıdır. `ST_Subdivide` mimarisi, tek bir süper-kütleyi alır ve onu küçük, 256 köşeyi geçmeyecek şekilde (limit sizin elinizdedir) kusursuz fay hatlarıyla bloklara / kutucuklara keser.

Bir devletin veya koskoca bir denizin hududunu tek bir `satır` olarak değil; 50 farklı satıra bölünmüş komşu hücreler olarak tutarsınız. Uzay indeksi aradığınız noktayı anında o spesifik ufak hücrenin (Zarfın) içinde bulur ve analitik işlem (JOIN, Intersects) devasa şekilde hızlanır. 15 saniye süren sorgular, 10 milisaniyeye (MS) düşer.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, devasa ve binlerce vertexe sahip "Karadeniz_Deniz_Sahasi" kaydını ST_Subdivide ile kiremit benzeri hücrelere indireceğiz:
`-- Devasa Çokgenin Parçalanıp Yeni Tabloya Serilmesi`
`CREATE TABLE deniz_alt_faylari AS`
`SELECT id, isim, ST_Subdivide(geom, 256) AS geom_chunk`
`FROM dev_bolgeler `
`WHERE isim = 'Karadeniz_Denizi';`

`-- İndeksin Yeniden Ateşlenmesi`
`CREATE INDEX idx_deniz_faylari_chunk ON deniz_alt_faylari USING GIST (geom_chunk);`

Artık karşınızda tek bir dinozor değil; 256 noktayı geçmeyen zeki ve küçük alt deniz porsiyonları var. Bir geminin sinyali düştüğünde, motor gidip koca denizi değil, sadece geminin girdiği o ufak zarfı ölçecek.

**[Kapanış]**
Makinenin performans darboğazını cerrahi bir atomlaştırma işlemi ile kalıcı olarak sildiniz. Sadeleştirdik, parçaladık, performansı maksimize ettik. Şimdi perspektifimizi poligonlardan çıkartıp otobanların ve raylı sistemlerin dünyasına (Çizgilere) kaydıracağız. Bir kazanın otoyolun "yüzde kaçıncı kilometresinde" olduğunu dijital olarak nasıl belirleriz? Sıradaki dersimiz "Doğrusal Referanslama" (Linear Referencing).