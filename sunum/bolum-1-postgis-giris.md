---
title: "Bolum 1 - Kuruluma ve Platforma Giris"
subtitle: "Uygulama ile birebir hizali sunum | Day 1 Module 1"
author: "PostGIS Akademi"
sourceModule: "src/content/day-1/module-1"
---

# Bolum 1 Sunumu
## Day 1 - Module 1: Kuruluma ve Platforma Giris

Bu sunum, uygulamadaki su derslerle birebir eslenmistir:
1. lesson-1-welcome.mdx
2. lesson-2-pglite-postgresql-postgis.mdx
3. lesson-3-cbs-vector-raster.mdx
4. lesson-4-first-map.mdx
5. lesson-5-postgis-reference.mdx

---

# Sunum Akis Kurali

Her alt modul su zorunlu sirayla anlatilir:
1. Problem
2. Kavram
3. Ornek
4. Tahmin
5. Uygulamaya gecis
6. Mini gorev

---

# Alt Modul 1
## Platforma Hos Geldin (lesson-1)

### 1) Problem
- Ogrenci platformu ilk gordugunde nereden baslayacagini bilmiyor.

### 2) Kavram
- Uc panel yapisi: icerik, SQL editoru, sonuc (harita/tablo).

### 3) Ornek
- "SELECT 'Merhaba PostGIS!' AS mesaj;" sorgusunu calistirma senaryosu.

### 4) Tahmin
- Soru: "Bu sorgu haritada mi tabloda mi gorunecek?"

### 5) Uygulamaya gecis
- Editoru ac, sorguyu calistir, sonucu alt panelde yorumla.

### 6) Mini gorev
- Kendi adinla bir selamlama sorgusu yaz ve sonucu goster.

---

# Alt Modul 2
## PGlite, PostgreSQL ve PostGIS (lesson-2)

### 1) Problem
- "Kurulum yapmadan neden veritabani calisiyor?"

### 2) Kavram
- PGlite tarayicida calisan PostgreSQL katmanidir.
- PostGIS, PostgreSQL'e mekansal yetenek ekler.

### 3) Ornek
- "SELECT version();"
- "SELECT postgis_full_version();"

### 4) Tahmin
- Soru: "Sadece PostgreSQL olsa harita geometrisi uretebilir miyiz?"

### 5) Uygulamaya gecis
- Iki sorguyu calistirip cikti farklarini okunur sekilde karsilastir.

### 6) Mini gorev
- 2 cumle ile "PostgreSQL" ve "PostGIS" farkini yaz.

---

# Alt Modul 3
## CBS, Vektor ve Raster (lesson-3)

### 1) Problem
- Mekansal veriyi tek tur dusunmek analiz hatasina neden olur.

### 2) Kavram
- Vektor: nokta, cizgi, poligon.
- Raster: hucre tabanli surekli yuzey.

### 3) Ornek
- Okul konumlari -> vektor nokta.
- Sicaklik katmani -> raster.

### 4) Tahmin
- Soru: "Nufus yogunlugu icin vektor mu raster mi daha uygun?"

### 5) Uygulamaya gecis
- Bir use-case secip hangi veri modelini kullanacagini acikla.

### 6) Mini gorev
- 3 farkli kurum verisini (ulasim, saglik, cevre) vektor/raster diye sinifla.

---

# Alt Modul 4
## Ilk Harita (lesson-4)

### 1) Problem
- Ogrenci SQL sonucunun haritaya nasil ciktisini goremezse konu soyut kalir.

### 2) Kavram
- ST_MakePoint(lon, lat)
- ST_SetSRID(..., 4326)

### 3) Ornek
- "SELECT ST_SetSRID(ST_MakePoint(28.979, 41.015), 4326) AS geom;"

### 4) Tahmin
- Soru: "lon/lat sirasi ters yazilirsa nokta nereye duser?"

### 5) Uygulamaya gecis
- Sorguyu calistir, map panelde noktayi bul, koordinati degistir ve tekrar dene.

### 6) Mini gorev
- Kendi sehrin icin bir nokta ciz ve geometrinin gorundugunu kanitla.

---

# Alt Modul 5
## Dokumantasyon Kaslari (lesson-5)

### 1) Problem
- Fonksiyon ezberlemek mumkun degil; dogru referansi hizli bulmak gerekir.

### 2) Kavram
- postgis.net dokumantasyonunda ST_* fonksiyon imzasi okuma.

### 3) Ornek
- ST_Buffer veya ST_Intersects sayfasinda parametre tiplerini inceleme.

### 4) Tahmin
- Soru: "Fonksiyon geometry mi geography mi bekliyor, nasil anlarsin?"

### 5) Uygulamaya gecis
- Dokumandan bir fonksiyon sec ve editorde en basit calisan sorguyu yaz.

### 6) Mini gorev
- Bir ST_* fonksiyonu icin: ne is yapar, girdisi nedir, ciktisi nedir? 3 satir yaz.

---

# Egitmen Akis Notu

Zaman onerisi (toplam 30 dk):
- Alt Modul 1: 5 dk
- Alt Modul 2: 7 dk
- Alt Modul 3: 7 dk
- Alt Modul 4: 6 dk
- Alt Modul 5: 5 dk

Her alt modul sonunda tek bir soru sor:
- "Simdi bunu editorde nasil test ederiz?"

---

# Kapanis ve Sonraki Adim

Bolum 1 ciktilari:
- Ogrenci platform panel akisini bilir.
- PostgreSQL ve PostGIS farkini aciklar.
- Vektor/raster kararini verir.
- Ilk geometriyi haritada gosterir.
- Dokumandan fonksiyon okuyup sorguya donusturur.

Sonraki bolum:
- Day 1 Module 2: Geometri Temelleri.
