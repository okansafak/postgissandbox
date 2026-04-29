# Ders 3: Vahşi Doğanın Yoğunluk Avcısı (DBSCAN Kümelemesi)

**[Giriş / Hook]**
Emniyet birimleri şehrin suç haritasını önünüze koydu. Binlerce nokta var. "Hangi sokaklarda çete öbeklenmesi var?" sorusunun yanıtı 10 bölge midir, yoksa 85 bölge midir peşin olarak bilemezsiniz. K-Means gibi dikte ettiğiniz bir sayı üzerinden zorlama merkezler yaratamazsınız. Size dağınık noktaları (izole olayları) yok sayacak, ancak "500 metrelik yarıçapa en az 10 olay düşen" yerleri "Riskli Küme" ilan edecek organik bir analiz kası lazımdır. Gürültüyü ezen, yoğunluğu bulan motor: `ST_ClusterDBSCAN`.

**[Teori / Kavramsal Çerçeve]**
DBSCAN (Density-Based Spatial Clustering of Applications with Noise), veride bir sayı değil, bir **Kurallar Bütünü** arar. 
PostGIS'te sadece iki radikal parametre alır: `eps` (Epsilon - Metre veya Radyan cinsinden maksimum arama menzili) ve `minpoints` (Bir grubun "Küme" sayılabilmesi için o eps yarıçapında bulunması gereken asgari nokta adedi). 
Algoritma bir noktaya konar, etrafına bakar. Eğer 500 metrelik `eps` alanı içinde `minpoints` (örn. 10) kadar komşusu varsa hepsini aynı "Küme ID"sine atar ve bu dalgayı komşudan komşuya sıçratarak büyütür. Kimseye değmeyen ve şartı sağlamayan ücra noktalara acımaz; onlara Küme ID olarak `NULL` atar. (Gürültü/Noise). Sizi kirlilikten arındırır ve sadece asıl kriz alanlarına (Çete bölgeleri, sıcak satış öbekleri) odaklandırır.

**[Uygulama / Ekran Gösterimi]**
Ortamımızda suç koordinatlarına (suc_kayitlari) ağır bir DBSCAN filtresi atıyoruz. Verinin projeksiyonu metre bazlı (örneğin 3857) olmalıdır ki, sistem metre ile çalışsın.
`SELECT `
  `-- eps: 500 metre menzil, minpoints: en az 10 vaka`
  `ST_ClusterDBSCAN(geom, eps := 500, minpoints := 10) OVER() AS cete_bolgesi_id,`
  `id,`
  `vaka_turu `
`FROM suc_kayitlari;`

Operasyon tamamlanıp rapor döndüğünde göreceğiniz şey mucizedir. Şehrin %60'ındaki izole ufak tefek suçlar `NULL` yemiş ve çöpe atılmıştır. Fakat diğer satırlarda 1, 2, 3, 4 gibi muazzam, organik ve organik olarak büyümüş suç yuvalarının (kümelerin) sicil numaraları (ID) sıralanmıştır. Küme sayısı 2 mi 200 mü çıktı, bu organik yoğunluğun ta kendisidir.

**[Kapanış]**
Gürültüyü makasladınız ve gerçek kütle çekim merkezlerini organik sınırlarıyla keşfettiniz. Hem hedefe dayalı gruplama (K-Means) hem de iz saptama (DBSCAN) elinizin altında. Peki bu noktaları matematikle değil de, fiziki bir "arazi kaplamasıyla" (Isı haritası gibi) yönetmek; örneğin tüm Los Angeles şehrini devasa arı peteklerine, kusursuz altıgenlere bölüp hangisinde ne kadar taksi çağrısı var saymak isterseniz? Doğa biliminin en güçlü piksellerine, Hexagonal Grid (Altıgen Zemin) modellemesine geçiyoruz.