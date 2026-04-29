# Ders 5: Kümeleme ve Analitik Fonksiyonlar (Aggregate Functions)

**[Giriş / Hook]**
Ham veri kalabalığı sağır edicidir. Yöneticiler binlerce bireysel işlemi tek tek okumaz; onlar eğilimleri, hacimleri ve istatistiksel genellemeleri talep eder. Veri tabanının gerçek gücü, on binlerce satırlık bir kalabalığı bir avuç anlamlı sayıya ve stratejik bir özet tablosuna indirgeyebilmesindedir.

**[Teori / Kavramsal Çerçeve]**
SQL'de detayları makro bir görünüme dönüştüren araçlara Agrega (Kümeleme) fonksiyonları denir. İşlem setini alır, matematiksel bir preslemeye tabi tutar ve geriye konsolide edilmiş tek bir skaler değer döndürür. İlişkisel veritabanının kalbinde yatan bu istatistiksel motor; `COUNT` (adet), `SUM` (toplam), `AVG` (ortalama), `MAX` (maksimum) ve `MIN` (minimum) fonksiyonlarıyla çalışır. Bireysel işlemlerden (mikro operasyon) kurumsal performansa (makro ölçek) geçiş tam olarak bu dilde ve bu aşamada gerçekleşir.

**[Uygulama / Ekran Gösterimi]**
Arayüzümüze geçip organizasyonun mevcut durumunu tek bir sorguyla makro düzeyde okuyalım. Bizden tüm coğrafyadaki toplam demografi raporunu ve medyan göstergeleri çıkarmamız istendi:
`SELECT COUNT(*) AS sehir_sayisi, SUM(nufus) AS toplam_nufus, AVG(alan_km2) AS ortalama_yuzolcum FROM sehirler;`

Konsol ekranındaki sonuca dikkat edin: Veritabanı arkaplanda tüm lokasyon şebekesini tek bir taramayla bitirdi, tüm kayıtları saydı, matematiksel hacimleri birbirine kümülatif olarak ekledi ve milisaniyelik bir sürede üç sütunluk, kristal berrak ve konsolide bir özet vizyonu liderin önüne getirdi. Hem toplam adeti (Count), hem hacmi (Sum) hem de ortalama değeri (Avg) devasa bir veri denizi yerine tek satırda okumuş olduk.

**[Kapanış]**
Görüldüğü gibi sistem, tüm satış ve ciro verisini tek bir yekûn üzerinde birleştirdi. Ancak iş analitiği dünyasında raporlar genelde bu kadar yassı değildir; satışları bölgelere, aylara veya ürün tiplerine göre kırılımlara ayırmamız talep edilir. Bir sonraki derste, bu kümeleme işlemlerine dikey bir boyut kazandıracak ve `GROUP BY` mantığıyla veri segmentasyonunu (gruplamasını) öğreneceğiz.