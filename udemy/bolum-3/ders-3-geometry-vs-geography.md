# Ders 3: Düzlem Matematiği (Geometry) vs. Küre Matematiği (Geography)

**[Giriş / Hook]**
İstanbul'dan New York'a düz bir harita üzerinde cetvelle çizeceğiniz en kısa çizgi, gerçek dünyada feci bir pilotaj hatasıdır. Uçaklar düz rotaları değil, kürenin eğimini takip eden büyük çember (Great Circle) rotalarını kullanırlar. Veritabanınız dünyayı bir masaüstü gibi mi görüyor, yoksa yuvarlak bir elipsoit gibi mi? Analitik başarınız bu soruya vereceğiniz tipe bağlıdır.

**[Teori / Kavramsal Çerçeve]**
PostGIS'te veriyi kodlamanın iki temel zıt kutbu (tipi) vardır: 
1. **Geometry (Kartezyen Düzen):** Dünyayı düz, kağıt bir masa gibi alır. Pisagor teoremiyle alan ve mesafe hesaplar. Çok hızlıdır, ancak birimi neyse o şekilde işlem yapar. Dereceli global verilerde (4326) mesafe sorarsanız size metre değil "0.5 derece" gibi saçma analitik çıktılar döner. Üzerinde 300'den fazla fonksiyon çalışır.
2. **Geography (Küresel Düzen):** Dünyanın yuvarlak olduğunu ve kavisleri hesaba katar. "WGS 84" sferoid modeli üzerinden matematiksel bir tur atar. Hep metre cinsinden dönüş yapar, kusursuz küresel mesafe çıkarır ama Geometry tipine göre çok daha ağırdır. Üzerinde sadece belli başlı 20-30 temel fonksiyon (ST_Distance, ST_Area vb.) çalışır.

**[Uygulama / Ekran Gösterimi]**
Ortam arayüzümüzde bu iki aklın kapışmasını test ediyoruz. İstanbul (29, 41) ve Ankara (32, 39) arasındaki mesafeyi ölçüyoruz. Önce düzlemsel ve cahil motorla (Geometry) soralım:
`SELECT ST_Distance(ST_SetSRID(ST_MakePoint(29.0, 41.0), 4326), ST_SetSRID(ST_MakePoint(32.0, 39.0), 4326)) AS dik_mesafe_derece;`
Sistem "3.6 derece" döner. Bu iş dünyasında okunmaz ve kullanılamaz bir birimdir. 

Şimdi aynı koordinatları kürenin gerçeğini bilen zeka sistemine (`geography` veri tipine) cast (dönüştürme) ederek soralım:
`SELECT ST_Distance(ST_SetSRID(ST_MakePoint(29.0, 41.0), 4326)::geography, ST_SetSRID(ST_MakePoint(32.0, 39.0), 4326)::geography) / 1000 AS kuresel_mesafe_km;`
Bu formül anında yeryüzünün yayını hesaplayıp bize 342 Kilometre gibi ticari matematiğe uygun, somut bir uzaklık raporlar.

**[Kapanış]**
Görüldüğü gibi Geography tipi mesafeyi km/metreye çeviren sihirli bir bastondur. Bizi yerel projeksiyonlardan bir nebze kurtarır ancak büyük veri setlerinde sistemi yorar. Eğer milyonlarca poligon kesecekseniz ve hız arıyorsanız, verinizi metrik (yerel) projeksiyonlara çevirip hızlı olan Geometry tipinde yola devam etmelisiniz. Bir sonraki derste bu çeviri (projeksiyon transformasyonu) işlemini masaya yatıracağız: Sadece etiketi değiştirmek ile veritabanını yeniden hesaplatmak (Transform) arasındaki yaşamsal farkı inceleyeceğiz.