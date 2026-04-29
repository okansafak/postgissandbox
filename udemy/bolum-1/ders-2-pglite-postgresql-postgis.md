# Ders 2: PGLite, PostgreSQL ve Uzamsal Zeka (PostGIS)

**[Giriş / Hook]**
Veritabanları yüzyıllardır sayıları ve metinleri saklamada kusursuzdur. Ancak onlara "Bana en yakın hastane neresi?" veya "Bu arazinin içinden hangi nehirler geçiyor?" diye sorduğunuzda klasik mimariler sessiz kalır. Ta ki sisteme uzamsal bir beyin nakledilene kadar.

**[Teori / Kavramsal Çerçeve]**
Arka planda çalışan motorumuz PostgreSQL, dünyanın en saygın, açık kaynaklı ilişkisel veritabanı yönetim sistemidir. Bizim platformumuzda bu motor, *PGLite* formunda, tarayıcınızın içinde hafifletilmiş ama tam yetkili bir biçimde çalışır. Ancak PostgreSQL kendi başına coğrafyayı bilmez. Bir koordinat onun için sadece sıradan bir ondalıklı sayıdır. 
İşte PostGIS, PostgreSQL'e enjekte edilen bir mekansal (spatial) eklentidir. Veritabanına yeni veri tipleri (geometri, coğrafya) ve bu tipleri anlayıp işleyebilecek yüzlerce analitik fonksiyon (`ST_Contains`, `ST_Distance` vb.) kazandırır. Kısacası PostgreSQL sistemi ayakta tutan omurga, PostGIS ise ona coğrafyayı kavratan uzamsal lobdur.

**[Uygulama / Ekran Gösterimi]**
Sistemimizin iki farklı lobunu test edelim. Önce omurganın versiyonunu sorgulayalım:
`SELECT version();`
Bu komut bize standart PostgreSQL çekirdeğinin PGLite üzerindeki sürümünü raporlar.
Şimdi uzamsal lobun (eklentinin) aktif olup olmadığını ve kapasitesini doğrulayalım:
`SELECT postgis_full_version();`
Çıktıyı incelediğinizde, sistemin PROJ (projekson motoru) ve GEOS (geometri motoru) gibi sofistike haritacılık kütüphaneleriyle tam entegre olduğunu göreceksiniz. Uzamsal zeka aktif ve hesaplama yapmaya hazır.

**[Kapanış]**
Sistemin beyninin iki yarısını da doğruladık. Artık emrimizde coğrafyayı anlayan bir makine var. Gelecek derste, bu makinenin dış dünyayı (yolları, binaları, sıcaklık dağılımlarını) hangi mantıksal modellerle algıladığını (Vektör ve Raster kavramlarını) masaya yatıracağız.