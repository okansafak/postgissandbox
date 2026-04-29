# Ders 5: Sarsılmaz Kurallar ve Geçerlilik (ValidateTopology ve Güvenlik)

**[Giriş / Hook]**
`toTopoGeom` komutunu ateşlediniz, trilyonlarca kırık çizgi (Polygon) birbirinin ucuna 10 santim toleransla (`0.1`) yapışıp lehimlendi (Snap). Ancak veri o kadar kirli ki, bazı parseller 10 santim değil, tam 1 metre birbirinin üzerine binmiş (Overlap). Ya da aralarında 2 metrelik devasa "Sahipsiz Araziler (Gap)" kalmış.
Siz "Topolojim kusursuz" zannedip tapu sistemine yayın yaparsanız, sistem o 1 metrelik çatlağı "Bu bir Edge değil, bir yüzey olmalı" diyerek hata üretir. Peki koskoca Türkiye haritasında, hangi ilçenin, hangi sokağının, hangi parselinin sınırı "kopuk veya birbiri içine geçmiş"? Koordinat gözünüzle aramanız yüz yıl sürer. Gözleriniz PostGIS "ValidateTopology (Topolojiyi Doğrula)" fonksiyonudur.

**[Teori / Kavramsal Çerçeve]**
`ValidateTopology('sizin_topoloji_seminiz')`. Bu amansız bir müfettiştir. Gider topoloji evreninizdeki (`sehir_evreni`) milyonlarca `node` (düğüm), `edge` (kenar) ve `face` (yüzey) tablosunu satır satır tarar.
Kurallar bellidir:
1. İki Face (Yüzey) asla üst üste binemez (Overlap YASAK).
2. Bir Edge (Kenar) havada, boşlukta kalamaz veya kendi içine düyamlanarak (Self-intersect) geçersiz bir kapalı halka olamaz.
3. Node'lar (Düğümler) izole ve anlamsız yerlerde başıboş (Orphan) şekilde bırakılmaz.
ValidateTopology bu matematiği test eder, nerede hata bulursa onun Error Kodunu ve tam olarak hangi Edge/Node/Face ID'sinde olduğunu size tablo (Table set) olarak raporlar. Eğer boş/temiz (`0 rows returns`) dönerse, işte o an Kadastro/Emlak müdürünün yüzündeki gülümsemeyi görüyorsunuz demektir! Mükemmel veri.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda `sehir_evreni` denen o dev topoloji şemamızı teftişten geçiriyoruz:

`-- Topolojimizdeki mantıksal ve geometrik kopuklukları denetlemek için çalıştırıyoruz.`
`SELECT error, id1, id2`
`FROM ValidateTopology('sehir_evreni');`

-- *Örnek Hata Çıktısı (Ekrana Raporlananlar):*
-- error (Metin) | id1 (Kenar veya Yüzey ID) | id2 (Çakıştığı ID)
-- -------------------------------------------------------------
-- "Edge crosses node" | 543 | 920
-- "Face without edges" | 12 | (Null)
-- "Coincident edges" | 1500 | 1501 (İki kenar milimi milimine aynı koordinatta yaratılmış!)

Bu rapora bakarak asıl verilerinize döner, QGIS aracılığıyla bu "Edge ID'lerini" yükler, sorunları elle düzeltirsiniz ve tekrar doğrularsınız.

**[Kapanış]**
Tebrikler. Bölüm 13'ün (Topoloji) sonuna geldiniz. Spagetti çizgilerden (Düz Geometry) çıkıp, "Sınırlarına Saygılı", alanları zekice referanslayan kurumsal `TopoGeometry` evrenine tırmandınız. Hataya (Gap, Overlap) kapalı bir veritabanı mühendisliği (Data Integrity) seviyesini devirdiniz.
Topoloji, veri mimarinizin en "Güvenilir" çatısıdır. Ancak, "Veriniz kurallara uygun (Topology) olsa dahi", bu veriyi **KİMLER GÖREBİLİR?** Tapu müdürü tüm ilçeyi görürken, memur sadece kendi mahallesini nasıl görecek? Hem de bunu uygulama (Backend/Frontend) seviyesinde değil, POSTGRESQL ÇEKİRDEĞİNDE, veri tabanının kalbinde (Row-Level Security / Satır Bazlı Güvenlik) nasıl kilitleyeceğiz? Eğitim serimizin zirvesi ve kapanışı olan Bölüm 14'e, Güvenlik Duvarlarına (RLS & Security) adım atıyoruz. Hazırsanız (Bölüm 14) için 'devam et'.