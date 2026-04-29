# Ders 2: Veri Tipleri ve Çıktı Projeksiyonu (SELECT)

**[Giriş / Hook]**
Her anlamlı iletişim, tarafların aynı kural setini paylaşmasıyla mümkündür. Veritabanı yönetiminde bu temel taşlar veri tipleridir ve iletişimin ilk operasyonel adımı, veriyi kesin ve hatasız bir şekilde talep etmektir.

**[Teori / Kavramsal Çerçeve]**
İlişkisel veritabanları anarşiyi reddeder; veriyi kesin olarak tanımlanmış, tahmin edilebilir yapılarla işler. Bir metin dizgesi, tam sayı veya bir zaman damgası, sistemin o veriye nasıl davranacağını, diskte ne kadar yer tutacağını belirler. 

Bu katı yapının içinden ihtiyacımız olan enformasyonu çekip almamızı sağlayan yegane araç `SELECT` komutudur. SELECT işlemi, veritabanı biliminde "projeksiyon" olarak adlandırılır. Dev boyutlardaki tabloların sadece sizin karar mekanizmanızın ihtiyaç duyduğu kesitini sahneye yansıtır.

**[Uygulama / Ekran Gösterimi]**
Şimdi genel veritabanı yönetim arayüzümüze geçiyoruz. Ekrandaki sorgu penceremize odaklanalım.
`SELECT * FROM sehirler;` yazıp çalıştırdığımızda, motor bize tüm tablo anatomisini, işlenmemiş ham haliyle geri döndürür. Ancak veri mühendisliği israfı affetmez; iyi bir analist, sistemi gereksiz veri transferiyle yormaz. İstediğimiz kesin sütunları belirterek sorgumuzu rafine ediyoruz: 
`SELECT id, ad, bolge, nufus FROM sehirler;`
Gördüğünüz gibi, Türkiye'nin şehirlerinden oluşan devasa büyüklükteki bir enformasyon bloğu sizin belirlediğiniz iş mantığı sınırlarına çekildi. Projeksiyon yapıldı. Üstelik analiz için ekranda şu komutu vererek `AS` operatörü ile sütun isimlerine okunabilir ve anlamlı takma adlar atayabiliriz:
`SELECT ad AS sehir_adi, bolge AS cografya, nufus AS yasayan_sayisi FROM sehirler;`

**[Kapanış]**
Veriyi projekte ettik ancak henüz onu yatay olarak daraltmadık. Bir sonraki adımda, veri okyanusundan yalnızca belirlediğimiz statik koşulları sağlayan satırları nasıl ayıklayacağımızı, yani `WHERE` komutunun veri izolasyonundaki rolünü ele alacağız.