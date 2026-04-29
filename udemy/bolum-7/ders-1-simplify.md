# Ders 1: Detayların Maliyeti Bükme Sanatı (ST_Simplify)

**[Giriş / Hook]**
Eğer haritanızda bir ülkenin veya devasa bir gölün sınırlarını gösteriyorsanız ve kullanıcılarınız web sayfasını açtığında tarayıcıları donuyorsa, ortada bir mühendislik vizyonsuzluğu vardır. Yüz binlerce kırık çizgiden oluşan milimetrik hudutlar, bir uydunun kamerasından değil ama bir mobil kullanıcının ekranından bakıldığında anlamsız bir yük, ölü bir piksel yığınıdır. Kaliteden ödün vermeden, veri boyutunu %90 oranında küçültmeyi ve performansı kurtarmayı (Simplify) nasıl başarırsınız?

**[Teori / Kavramsal Çerçeve]**
Geometrilerdeki köşeleri (vertexleri) azaltmak, gereksiz zikzakları matematiksel olarak düzlemek amacıyla "Douglas-Peucker Orotomasyonu" (ve benzeri algoritmalar) kullanılır. PostGIS bu mimariyi size `ST_Simplify` komutu ile sunar. Geometriye bir "tolerans payı" (örneğin 500 metre) verirsiniz; o sapmanın altında kalan tüm gereksiz eğrileri, ufak tırtıkları dümdüz jilet gibi bir kaleme çevirir. Dosya boyutu gigabaytlardan megabaytlara iner.

Fakat zeki analizci tuzaklara düşmez. Normal `ST_Simplify`, o kadar sert kesebilir ki, denize akan ince bir nehir birden bire karayı delip geçebilir, çokgen kendi üstüne binip (Self-Intersection) patlayabilir. Hassas haritacılar her zaman kurumsal savunma kalkanı olan `ST_SimplifyPreserveTopology` varyasyonunu kullanır; köşeler ne kadar silinirse silinsin şeklin topolojik (uzamsal düzlem) varlığı bozulmaz.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki devasa koordinat yığınlarına sahip "ilil sınırları" (bolgeler) tablosuna ağır bir sadeleştirme yapalım:
`SELECT `
  `isim,`
  `ST_NumPoints(geom) AS orjinal_nokta_sayisi,`
  `ST_NumPoints(ST_Simplify(geom, 0.1)) AS kaba_sadelesmis,`
  `ST_NumPoints(ST_SimplifyPreserveTopology(geom, 0.1)) AS emniyetli_sadelesmis`
`FROM bolgeler`
`WHERE isim = 'Marmara Sahil Şeridi';`

Sorguyu ateşlediğinizde göreceğiniz tablo şok edicidir. Orijinali 15.000 noktaya sahip devasa kıyı şeridi, sadece 350 noktaya inmiş, lakin son kolondaki (Preserve Topology) versiyon hiçbir anakaranın diğerine binmesine izin vermemiştir. Ağ optimizasyonunuzu sağladınız.

**[Kapanış]**
Gereksiz engebeleri yok ettik ve performansı dirilttik. Peki ya şeklin doğallığına dokunmamanız gerekiyorsa? Diyelim ki bir orman poligonu "2 milyon noktaya" sahip ve hiçbiri silinemez. O zaman sadeleştireme yapamazsınız, onu zekice yutulabilir zarflara bölüştürmeniz gerekir. Bir sonraki derste veritabanı kilitlenmelerinin panzehiri olan Geometrik Parçalama'yı (Subdivide) öğreneceğiz.