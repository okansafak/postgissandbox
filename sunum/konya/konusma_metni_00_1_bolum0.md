# PostGIS Akademi: Bölüm 0 - SQL'e Giriş
**1. Gün (2., 3., 4. ve 5. Dersler)**
**Kapsamlı Ders Planı ve Sahne Metni**

---

## [Ders 2] 11:00 - 11:50 | Veritabanı Mantığı ve Veri Tipleri

### [Slayt 1] Kapak: SQL'e Giriş
**(Süre: 3 Dakika)**
**Sahne Metni:**
"Oryantasyon bölümünde PostGIS'in gücünden ve potansiyelinden bahsettik. Ancak unutmamalıyız ki PostGIS, temelinde bir PostgreSQL eklentisidir. Tüm o ihtişamlı mekansal analizler, standart SQL dilinin yetenekleri üzerine inşa edilir. Bu yüzden konumsal zekaya geçmeden önce, veritabanı ile konuşma dilimiz olan SQL'in temellerini, SELECT'ten JOIN'e kadar kusursuzlaştırmamız gerekiyor."

### [Slayt 2] 0.1 — Veritabanı Nedir?
**(Süre: 12 Dakika | Soru: Neden Excel yerine Veritabanı?)**
**Sahne Metni:**
"Veritabanı, verilerin yapılandırılmış, güvenli ve hızlı erişilebilir şekilde saklandığı bir yönetim sistemidir. Excel'de aynı anda sadece bir kişi yazabilir ve veri boyutu arttıkça sistem kilitlenir. Veritabanı ise milyonlarca satırı saniyeler içinde işler, binlerce eşzamanlı erişime izin verir ve veri bütünlüğünü korur. Şu an eğitim ortamımızda dünyanın en gelişmiş açık kaynak veritabanı olan PostgreSQL'i kullanıyoruz."

**Canlı Uygulama / Görev (Mevcut Bağlantıyı Kontrol Et):**
*   **Görev:** Hangi yetkiyle hangi veritabanında olduğunuzu teyit edin.
*   **Aksiyon:** Sınıfça SQL ekranına `SELECT current_user, current_database();` yazılır ve çalıştırılır.

### [Slayt 3] 0.2 — Kurulum ve Veri Seti
**(Süre: 15 Dakika | Soru: Docker neden tercih edilir?)**
**Sahne Metni:**
"Eğitim için optimize edilmiş PostgreSQL 16 ve PostGIS 3.4 ortamını kullanıyoruz. Docker kullanmamızın nedeni, 'Benim bilgisayarımda çalışıyordu' sorununu tamamen ortadan kaldırmasıdır. Hepinizin bilgisayarında donanımdan ve işletim sisteminden bağımsız olarak birebir aynı standart veritabanı motoru çalışıyor."

### [Slayt 4] 0.3 — PostgreSQL Veri Tipleri
**(Süre: 20 Dakika | Soru: NUMERIC vs REAL farkı nedir?)**
**Sahne Metni:**
"Doğru analiz, doğru veri tipiyle başlar. Metinler için TEXT, tarihler için DATE kullanırız. Ancak sayılarda dikkatli olmalıyız. NUMERIC tam hassasiyet sağlar ve bütçe/koordinat gibi verilerde şarttır. REAL ise yaklaşık değer saklar ve büyük küsuratlarda yuvarlama hatası yapabilir."

**Canlı Uygulama / Görev (Personel Tablosu Tasarla):**
*   **Görev:** DDL komutuyla yeni bir tablo iskeleti kurun.
*   **Aksiyon:** Sınıfça şu kod yazılarak çalıştırılır:
    ```sql
    CREATE TABLE konya.personel (
      id SERIAL PRIMARY KEY,
      ad TEXT,
      maas NUMERIC,
      giris_tarihi DATE
    );
    ```

---

## [Ders 3] 14:00 - 14:50 | Veri Sorgulama ve Filtreleme

### [Slayt 5] 0.4 — SELECT ve Sütun Seçimi
**(Süre: 15 Dakika | Soru: SELECT veriyi değiştirir mi?)**
**Sahne Metni:**
"Veriyi çağırmanın yolu SELECT'tir. Bu komut diskteki veriyi değiştirmez, sadece sizin istediğiniz kolonların bir kopyasını (görüntüsünü) ekrana getirir. Raporlamalarda sütun isimlerini değiştirmek istersek AS operatörünü kullanırız."

**Canlı Uygulama / Görev (Sütunları Yeniden Adlandır):**
*   **Görev:** Veritabanındaki 'ad' kolonunu daha okunabilir hale getirin.
*   **Aksiyon:** 
    ```sql
    SELECT ad AS "Mahalle", nufus AS "Toplam Nüfus" 
    FROM konya.mahalleler;
    ```

### [Slayt 6] 0.5 — WHERE ile Filtreleme
**(Süre: 20 Dakika | Soru: LIKE ile ILIKE farkı nedir?)**
**Sahne Metni:**
"Milyonlarca kayıt içinden aradığımızı bulmak için WHERE kullanırız. Veritabanı bir WHERE komutu gördüğünde, uygun indeks varsa tüm satırları okumadan doğrudan hedefe gider. Metin aramalarında LIKE büyük/küçük harf duyarlıdır ('Konya' ile 'konya' farklıdır). ILIKE ise duyarsızdır ve arama kolaylığı sağlar."

**Canlı Uygulama / Görev (Karatay Mahallelerini Bul):**
*   **Görev:** Spesifik bir filtreleme yaparak veriyi daraltın.
*   **Aksiyon:** 
    ```sql
    SELECT * FROM konya.mahalleler 
    WHERE ilce = 'Karatay' AND nufus < 1000;
    ```

### [Slayt 7] 0.6 — ORDER BY ve LIMIT (Sıralama)
**(Süre: 15 Dakika | Soru: Neden LIMIT 1000000 yazmamalıyız?)**
**Sahne Metni:**
"Veriyi sunucu tarafında ORDER BY ile sıralayıp, LIMIT ile sadece ilk N satırı getirmek performansı korur. Eğer LIMIT kullanmadan milyonlarca veriyi çekmeye kalkarsanız, ağ üzerinden devasa veriyi taşımak hem sunucuyu hem de ağ trafiğini kilitler."

**Canlı Uygulama / Görev (En Az Nüfuslu 3 Mahalle):**
*   **Görev:** Sıralama ve sınırlandırma işlemini bir arada yapın.
*   **Aksiyon:** 
    ```sql
    SELECT ad, nufus FROM konya.mahalleler 
    ORDER BY nufus ASC LIMIT 3;
    ```

---

## [Ders 4] 15:00 - 15:50 | Agregasyon ve Gruplama

### [Slayt 8] 0.7 — Toplama Fonksiyonları
**(Süre: 25 Dakika | Soru: COUNT(*) vs COUNT(sutun) farkı nedir?)**
**Sahne Metni:**
"Milyonlarca satırı tek bir değere özetlemek için COUNT, SUM, AVG gibi fonksiyonlar kullanırız. Burada ince bir detay vardır: `COUNT(*)` satırda NULL değerler (boşluklar) olsa bile tüm satırı sayar. Ancak `COUNT(sutun)` yaparsanız, sadece o sütunda verisi olanları sayar. Raporlamalarda bu fark çok kritiktir."

**Canlı Uygulama / Görev (Ortalama Nüfusu Bul):**
*   **Görev:** Konya geneli ortalama mahalle nüfusunu hesaplayın.
*   **Aksiyon:** 
    ```sql
    SELECT AVG(nufus) FROM konya.mahalleler;
    ```

### [Slayt 9] 0.8 — GROUP BY ve HAVING
**(Süre: 25 Dakika | Soru: HAVING neden WHERE yerine geçer?)**
**Sahne Metni:**
"Veriyi sadece toplamak yetmez, kategorilerine (örneğin ilçelere) göre kümelemek gerekir. GROUP BY bunu yapar. Ancak gruplanmış sonuçlar üzerinden filtreleme yaparken (Örneğin nüfusu 10 binden büyük ilçeler) WHERE kullanamayız. Çünkü WHERE, gruplama henüz yapılmadan önce çalışır ve toplam değeri bilmez. Bunun yerine gruplamadan sonra çalışan HAVING komutunu kullanırız."

**Canlı Uygulama / Görev (İlçelere Göre Toplam Nüfus):**
*   **Görev:** İlçe bazlı nüfus istatistiğini oluşturup en yüksekten en düşüğe sıralayın.
*   **Aksiyon:** 
    ```sql
    SELECT ilce, SUM(nufus) 
    FROM konya.mahalleler 
    GROUP BY ilce 
    ORDER BY SUM(nufus) DESC;
    ```

---

## [Ders 5] 16:00 - 16:50 | Veri İlişkileri ve Yönetimi

### [Slayt 10] 0.9 — JOIN ve Tablo İlişkileri
**(Süre: 25 Dakika | Soru: JOIN mi Mekansal Join mi?)**
**Sahne Metni:**
"Farklı tablolara dağılmış verileri tek bir raporda birleştirmek için JOIN kullanırız. Standart JOIN işlemi, tabloları ID gibi ortak metin/sayı alanlarıyla bağlar. PostGIS'te göreceğimiz Mekansal JOIN ise, verileri ST_Intersects gibi geometrik çakışmalarla bağlar. Mantık tamamen aynıdır, sadece kriter değişir."

**Canlı Uygulama / Görev (Hastanesi Olmayan Mahalleleri Listele):**
*   **Görev:** LEFT JOIN kullanarak eşleşmeyen kayıtları bulun.
*   **Aksiyon:** 
    ```sql
    SELECT m.ad 
    FROM konya.mahalleler m 
    LEFT JOIN konya.hastaneler h ON h.mahalle_id = m.id 
    WHERE h.id IS NULL;
    ```

### [Slayt 11] 0.10 — Veri Yönetimi (DML)
**(Süre: 20 Dakika | Soru: Neden silmek (DELETE) tehlikelidir?)**
**Sahne Metni:**
"Veri okuma süreci güvenlidir. Ancak INSERT, UPDATE ve DELETE, tablonun fiziksel kaderini belirler. Veritabanında 'Geri Al' (Undo) butonu yoktur. Bir UPDATE komutuna WHERE yazmayı unutursanız tüm veriler bozulur. Profesyonel kurumlarda DELETE kullanılmaz; bunun yerine `is_active = false` yapılarak veri sadece gizlenir."

**Canlı Uygulama / Görev (Yanlış Kaydı Sil):**
*   **Görev:** DML ile kontrollü bir silme işlemi yapın.
*   **Aksiyon:** 
    ```sql
    DELETE FROM konya.mahalleler WHERE ad = 'Yeni Mahalle';
    ```

### [Slayt 12] Kapanış
**(Süre: 5 Dakika)**
**Sahne Metni:**
"Temel SQL iskeletimiz artık hazır. Yarın sabahtan itibaren, bugün öğrendiğimiz bu standart SELECT ve JOIN yapılarına PostGIS zekasını katacağız. Mekansal SQL dünyasına geçiş yapmaya hazırız. Günü burada tamamlıyoruz, katılımınız için teşekkürler."
