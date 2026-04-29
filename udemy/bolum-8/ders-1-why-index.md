# Ders 1: Hızın Ekonomisi ve Felaket Taramaları (Neden İndeks?)

**[Giriş / Hook]**
Kurumunuzun 50 milyon satırlı araç takip veritabanına, "Ataşehir ilçesinde şu an hangi araçlar var?" sorgusunu attığınızı düşünün. Motor, Ataşehir civarındaki ilk 10 arabayı bulmak için geriye kalan 49.999.990 arabanın lokasyonunu tek tek okumak zorunda kalıyorsa, bu bir mühendislik fiyaskosudur. Bu kaba kuvvete "Sequential Scan" (Sıralı Tarama) denir ve her çalıştırıldığında şirketinize işlemci saati, elektrik ve müşteri memnuniyetsizliği olarak geri döner. Optimizasyonun kalbi olan "İndeksleme" mimarisine adım atıyoruz.

**[Teori / Kavramsal Çerçeve]**
Bir kitapta aradığınız spesifik bir konuyu bulmak için birinci sayfadan son sayfaya kadar okumazsınız; arkadaki "İndeks" sayfasına (Dizin) bakar, kelimenin hangi sayfalarda olduğunu o saniye bulur ve sadece o sayfalara gidersiniz.
İlişkisel veritabanları sayısal verileri (B-Tree vb.) indekslerle zekice sıralar. Ancak uzamsal veri (Koordinatlar, Enlem/Boylam, Poligonlar) tek boyutlu değildir. "5", "4"ten büyüktür ama "(28.1, 41.2)" noktası "(29.0, 40.0)" noktasından büyük müdür? Uzamsal dünyada sıralama (büyüklük-küçüklük) kavramı kaotiktir. Bu çok boyutlu geometri kaosu geleneksel indeksleri kilitler. Bu yüzden PostGIS, coğrafyaya özel, nesneleri bir "Ağaç Dallarında Zarflama" felsefesiyle çalışan R-Ağacı (R-Tree) tabanlı yepyeni bir uzamsal motor kullanmak zorundadır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda, milyonlarca noktanın indekslenmemiş ham bir tablosunda felaketi EXPLAIN komutu ile doğrudan gözlemliyoruz:
`EXPLAIN ANALYZE`
`SELECT id, isim `
`FROM dev_araclar `
`WHERE ST_Intersects(geom, ST_MakeEnvelope(28.0, 40.0, 29.0, 41.0, 4326));`

Konsola düşen yıkıcı raporu okuyun: `Seq Scan on dev_araclar (cost=0.00..340050.21 rows=15 width=12)`. Motor, küçücük bir alan için koca tabloyu baştan sona silip süpürdü. Yüzlerce milisaniye, hatta saniyeler kaybedildi.

**[Kapanış]**
Geleneksel veritabanı kaba kuvvetinin uzamsal boyutlarda nasıl çuvalladığını gördünüz. Otoyolda şeritleri kontrolsüzce işgal edemezsiniz. Sistemi, geometrileri kutulara ve zarflara hapseden, coğrafyayı bir ağaca çeviren o devasa araca, GiST (Generalized Search Tree) mimarisine teslim etmemiz gerekiyor. Sıradaki derste bu ağacı köklerinden inşa edeceğiz.