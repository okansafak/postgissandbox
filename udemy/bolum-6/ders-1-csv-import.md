# Ders 1: Geleneksel Dosyadan Uzamsal Zekaya Geçiş (CSV İçe Aktarımı)

**[Giriş / Hook]**
Veriler daima mükemmel bir veritabanı yedeği olarak gelmezler. Lojistik ortaklarınız veya devlet kurumları, size milyonlarca noktanın enlemini ve boylamını basit kaba bir Excel sayfası veya "virgülle ayrılmış değerler" (.csv) ambalajında teslim edecektir. Koordinatların karakter dizilerinde rehin kaldığı ölü bir dosyayı, canlı bir mekansal indekse nasıl uyandırırsınız? Karşınızda ham veriyi ilk karşılama cephesi: CSV Import.

**[Teori / Kavramsal Çerçeve]**
Bir CSV dosyasının PostGIS ortamına alınması genellikle iki aşamalı bir refraksiyon gerektirir. Öncelikle bu salt metinsel veri yapısı standart kaba PostgreSQL sütunlarına (String ve Float/Numeric olarak) doldurulur. Ardından, enlem (latitude) ve boylam (longitude) değerlerini içeren sayılar, `ST_MakePoint` yardımıyla birleştirilir, `ST_SetSRID` zırhıyla `4326` (WGS84) konum standartlarında geometriye çevrilir ve sisteme "Nokta" objesi olarak mühürlenir. 
Bu aşamada veritabanınız, salt ölü rakamları alıp dünya küresi üzerinde anlam ifade eden uzamsal varlıklara (`Geometry` veya `Geography`) upgrade ederiz. Bu dönüşüm olmadan sistemdeki kayıtlar, defter üzerindeki mürekkep olmaktan öteye gidemez.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda sisteme binlerce acil toplanma alanı notasını yüklediğimizi varsayalım. Ham CSV tablomuzdaki `enlem` ve `boylam` verisini gerçek zekaya (GEOMETRY tipinde yeni bir stüna) dönüştürmek için makineyi şu komutla formatlıyoruz:
`-- 1. ADIM: Orijinal tabloya mekansal bir alan açılır`
`ALTER TABLE toplanma_alanlari ADD COLUMN geom geometry(Point, 4326);`

`-- 2. ADIM: Tüm satırların mevcut metin x/y değerleri işlenerek doldurulur`
`UPDATE toplanma_alanlari `
`SET geom = ST_SetSRID(ST_MakePoint(boylam, enlem), 4326);`

Bu kod bloğu saniyeler içinde çalışıp durur. Ancak faturası büyüktür: O artık sadece bir metin kümesi değil; mesafe ölçeceğiniz, etrafına buffer çekebileceğiniz aktif bir coğrafyadır. 

**[Kapanış]**
Güzellikten ve hiyerarşiden uzak düz bir dosyayı alıp, modern analiz motorumuzun içine başarıyla şırınga ettik. Ancak CSV, uzamsal dünyanın sadece en ilkel alfabesidir. Peki diğer yazılımlar veya web arayüzleri sizden veriyi doğrudan kendi zengin uzamsal standartlarıyla konuşarak gönderirse? İşte bu noktada web haritacılığının evrensel diplomasisine girmemiz gerekecek. Gelecek derste `GeoJSON` yüklemelerini ve nesne dönüşümlerini analiz edeceğiz.