# Ders 5: Emsalsiz Budama: Kısmi ve Fonksiyonel İndeksler

**[Giriş / Hook]**
Tablonuzda 5 milyon müşterinin tam konum verisi var. Ancak iş biriminiz sadece "Aktif" ve "Sipariş Bekleyen" statüsündeki 10 bin müşterinin lokasyonunda ağır sorgular çalıştırıyor. Kalan 4 milyon 990 bin pasif müşteri, GIST indeksinizin ağaçlarını lüzumsuz yere şişiriyor, RAM (Bellek) kapasitesini yutuyor. Makinenin her güncellemede bu ölü veriyi indekslemeye çalışmasına neden izin veriyorsunuz? Veritabanı elitleri, indeksi budamayı iyi bilir.

**[Teori / Kavramsal Çerçeve]**
Standart `CREATE INDEX`, tablodaki her satırı istisnasız ağaca kaydeder.
1. `Partial Index` (Kısmi İndeks): İndeks tanımının soununa bir `WHERE` bloğu takılarak yapılır. Veritabanına şunu emredersiniz: "Sadece aktif olan kayıtların geometrilerini ağaca ekle, ölüleri (pasifleri) yok say." RAM kullanımı sarsıcı biçimde düşer, performans roketler.
2. `Functional Index` (Fonksiyonel İndeks): Ham veriyi değil, dönüşüme uğramış formülü indekslemektir. Eğer her sorgunuzda geometrilerin SRID değerini 3857 metrik formatına çeviriyor (`ST_Transform`) ve sorguyu öyle atıyorsanız, indeksiniz 4326 üzerinde kaldığı için asla çalışmayacaktır! Motoru kandırmak için, indeksi `ST_Transform(geom, 3857)` formülünün tam karşılığını donanıma kazıyacak şekilde dikte edersiniz.

**[Uygulama / Ekran Gösterimi]**
Ortamımızdaki teslimat kuryelerini (kuryeler tablosu) ağır bir optimizasyon çemberine sokalım. Sadece "Vardiyada olan" kuryelerin ve doğrudan metrik (3857) değerine formatlanmış hallerini indeksliyoruz:
`-- Fonksiyonel ve Kısmi Bütünsel İndeks`
`CREATE INDEX idx_aktif_kurye_metrik_geom `
`ON kuryeler `
`USING GIST ( ST_Transform(geom, 3857) ) `
`WHERE durum = 'AKTIF';`

Eğer uygulamanız bir gün şu sorguyu sorarsa:
`SELECT isim FROM kuryeler `
`WHERE durum = 'AKTIF' `
`AND ST_DWithin(ST_Transform(geom, 3857), ST_MakePoint(1000, 1000), 500);`

Motor bu formülü ve şartı gördüğü an; gidip koca tabloyu taramaz. Doğrudan bizim yarattığımız özel ve butik `idx_aktif_kurye_metrik_geom` indeks dalına sapar ve ölü kuryeleri (ve eski derecelik EPSG verilerini) tamamen by-pass ederek anında yanıt döner.

**[Kapanış]**
İndeks mimarisini standart şablonlardan çıkarıp, tam iş modelinizin, uygulamanızın kurallarına uygun özel yapılmış terzi işi (tailor-made) zırhlara dönüştürdünüz. Fakat uzamsal indeksinizin ne kadar sağlıklı veya ağacınızın içinin ne kadar çürük (kopuk zarflarla dolu) olduğunu gözünüzle nasıl ölçeceksiniz? Kurumsal sistemlerde "Ben yaptım çalışıyor" denmez, raporlanır. Bir sonraki aşamada indekslerin röntgenini çeken `pg_stat_indexes` dünyasına gireceğiz.