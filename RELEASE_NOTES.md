# Release Notes

## 2026-04-25

### Ozet
Bu surumde PostGIS Akademi icerigi kapsamli bicimde genisletildi. Sunum katmani, ders icerikleri ve mufredat yapisi eszamanli guncellendi.

### One Cikanlar
- Sunum portali yeniden duzenlendi ve moduler yapi daha net hale getirildi.
- SQL giris bolumu dahil edilerek egitim akisi baslangic seviyesinden ileri seviyeye uzatildi.
- Day 0-Day 3 araliginda cok sayida yeni MDX ders icerigi eklendi ve mevcut icerikler guncellendi.
- Mufredat yapisi ve gezinme deneyimi (sidebar/lesson rendering) iyilestirildi.

### Sunum (sunum)
- `sunum/index.html` guncellendi.
- Sunum icerik dosyalari eklendi/guncellendi:
  - `sunum/bolum-0.html`
  - `sunum/bolum-1-postgis-giris.md`
  - `sunum/bolum-1.html`
  - `sunum/bolum-2.html`
  - `sunum/bolum-3.html`

### Ders Icerigi (src/content)
- `src/content/day-0` ile `src/content/day-3` arasinda yeni ders dosyalari eklendi.
- Ozellikle day-3 module-7 dahil ileri seviye ders kartlari ve ders icerikleri tamamlandi.

### Uygulama ve Mufredat (src)
- Guncellenen ana alanlar:
  - `src/components/lesson/CurriculumSidebar.tsx`
  - `src/components/lesson/LessonContent.tsx`
  - `src/components/lesson/RunnableBlock.tsx`
  - `src/curriculum/structure.ts`
  - `src/pages/Dashboard.tsx`
- Ders akisi, icerik eslestirme ve arayuzde tutarlilik iyilestirmeleri yapildi.

### Dokumantasyon ve Proje Yapisi
- Proje yonlendirme ve ajan dokumantasyonu guncellendi (`CLAUDE.md`, `.github/agents/*`).

### Uyumluluk
- Bu surumde bilincli bir kirici degisiklik notu bulunmamaktadir.
- Mevcut calisma ortaminda veri/ilerleme saklama mekanizmasi (localStorage) korunmustur.

### Not
Bu notlar son iki committeki kapsamli degisiklik setine gore hazirlanmistir.
