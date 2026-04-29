# Ders 1: Geometrik Hiyerarşi ve Yutulma (ST_Contains ve ST_Within)

**[Giriş / Hook]**
Gerçek dünyada mülkiyet ve yargı yetkisi, kesin sınırlarla ayrılmış alanların içerisine kimin dahil olduğuyla ölçülür. Bir şirketin vergi beyanı, o şirketin merkez binasının hangi belediyenin sınırları içinde bulunduğuna bağlıdır. PostGIS'in en kritik analitik sorusu da burada başlar: "Ben bu alanın tam olarak içinde miyim?"

**[Teori / Kavramsal Çerçeve]**
İki uzamsal alanın (veya bir nokta ile bir alanın) birbiri içindeki hiyerarşik veya fiziksel yutulma ilişkisi iki simetrik fonksiyonla değerlendirilir:
1. `ST_Contains(A, B)`: A geometrisi B geometrisini tamamen ve kusursuz bir şekilde kendi sınırları içine hapsetmişse (yutmuşsa) TRUE döner. A'nın sınırlarından dışarı taşan tek bir nokta bile varsa FALSE döner.
2. `ST_Within(A, B)`: Bu tam tersidir. A geometrisi, B'nin içerisine tamamen hapsolmuş (yutulmuş) durumda mıdır tespiti yapar. `ST_Contains(A, B)` her zaman `ST_Within(B, A)` sonucuna denktir. 

Bu fonksiyonlar, analitik sorgularda bir güvenlik veya yargı zırhı kurar. Hedef kitle analizinde bir AVM'nin hizmet havzası içindeki müşterileri sayarken bu mantıksal süzgeç kullanılır.

**[Uygulama / Ekran Gösterimi]**
Ortam penceremize odaklanıyoruz. Elimizde bir ilçe poligonu ve bunun içinde/dışında test edilecek şube noktaları var. Bunu basit ama kesin bir doğrulama filtresinden geçiriyoruz:
`SELECT ST_Contains( `
  `ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))', 4326), `
  `ST_GeomFromText('POINT(5 5)', 4326) `
`) AS icinde_mi;`

Sonuca bakın. Koordinat düzlemini okuyan sistem, noktanın o matematiksel çerçevenin tam göbeğine (5,5) düştüğünü anında idrak etti ve konsola TRUE döndürdü. Eğer nokta (12, 12) olsaydı o çemberin dışına atılmış, bir yetki alanı ihlali olarak işaretlenmiş (FALSE) olacaktı.

**[Kapanış]**
Tam kapsanmanın (yutulmanın) sınırları çok keskindir. Ancak bazen işler bu kadar steril değildir; iki otoyol projesinin, bir boru hattının ve bir parselin kaderi sadece "tam içeride" olmakta değil, herhangi bir coğrafi parçanın diğerine dokunup dokunmadığı noktasında kilitlenir. Bir sonraki videoda, PostGIS'in en vahşi çarpışma dedektörü olan ST_Intersects ve uzamsal yalnızlığı ölçen ST_Disjoint ile tanışacağız.