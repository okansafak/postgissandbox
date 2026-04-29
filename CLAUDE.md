# PostGIS Akademi - YZ (AI) Asistan Rehberi

Bu proje, kullanıcılara doğrudan tarayıcı üzerinden interaktif bir şekilde PostGIS ve PostgreSQL öğreten bir React/Vite uygulamasıdır. İçerisinde in-browser PostgreSQL (PGLite) barındırır ve mekan-tabanlı (spatial) verileri OpenLayers üzerinden haritalandırır.

## 🚀 Proje Komutları

- **Geliştirme Sunucusu:** `npm run dev` (Vite)
- **Derleme (Build):** `npm run build` (TypeScript derlemesi + Vite build)
- **Önizleme (Preview):** `npm run preview`
- **Linter:** `npm run lint`

## 🛠 Teknoloji Yığını (Tech Stack)

- **Platform:** React 19, TypeScript, Vite
- **Veritabanı:** `@electric-sql/pglite` ve `@electric-sql/pglite-postgis` (WebAssembly tabanlı In-Browser PostgreSQL)
- **Harita:** OpenLayers (`ol`)
- **Stil & UI:** Tailwind CSS, `clsx`, `tailwind-merge`, Radix UI (Tabs, Tooltip), Lucide React, Panel yönetimi için `react-resizable-panels`
- **Durum Yönetimi (State):** Zustand (`zustand`)
- **Kod/SQL Editörü:** CodeMirror (`@uiw/react-codemirror`, `@codemirror/lang-sql`)
- **İçerik (Dersler):** MDX (`@mdx-js/react`, `remark-gfm`)
- **Router:** React Router DOM v6

## 📂 Dizin Yapısı ve Mimari Özet

- `src/components/`
  - `editor/` - `SqlEditor.tsx` (Kullanıcının SQL kodu yazdığı CodeMirror editörü)
  - `map/` - `SpatialMap.tsx` (Mekansal sorgu sonuçlarının OpenLayers ile çizildiği harita)
  - `results/` - `ResultTable.tsx` ve `ExplainPlan.tsx` (SQL sorgu sonuçları ve analiz)
  - `lesson/` - Eğitim modülü bileşenleri (`CurriculumSidebar.tsx`, MDX içeriği)
  - `ui/` - Ortak UI bileşenleri / İkonlar
- `src/content/` - Derslerin Markdown/MDX halindeki metinleri (Örn: `day-0`, `day-1` altında modüller).
- `src/pglite/` - WebAssembly PostgreSQL istemcisini (`client.ts`), mock data/fixture'ları (`fixtures.ts`) ve sorgu sonuçlarını GeoJSON'a çeviren yapıyı (`geojson-adapter.ts`) bulundurur.
- `src/store/` - Zustand bazlı merkezi depolar (`editorStore.ts`, `mapStore.ts`, `progressStore.ts`).
- `src/curriculum/` - Eğitim programının ağaç (tree) ve seviye yapısı (`structure.ts`, `progress.ts`).
- `lesson-cards/` - Müfredat içeriği taslak metinleri ve durum takipleri.
- `sunum/` - Eğitmen veya rehber sunumlarına ait HTML/MD dosyaları.

## 💻 Kodlama Standartları ve Kuralları

1. **TypeScript Kullanımı:** 
   - Projenin tamamı TypeScript ile yazılmaktadır. Fonksiyon, State ve Component'lar kesin (strict) olarak tiplendirilmelidir (ör: `interface` veya `type` kullanımı zorunludur).
   - "any" kullanımı kesinlikle en aza indirilmelidir. Özel PostgreSQL ve GeoJSON dönüşleri için uygun `@types/geojson` referansları kullanılmalıdır.

2. **React ve Component Mimarisi:**
   - Sadece Fonksiyonel Component'lar (Functional Components) kullanılmalıdır.
   - İsimlendirmeler PascalCase (Örn: `SpatialMap.tsx`) olmalıdır. Hooks ve yardımcı fonksiyonlar için camelCase kullanılmalıdır.
   - Component'ları iç içe geçirmek yerine modüler ve tekrar kullanılabilir küçük bileşenler hedeflenmelidir (Single Responsibility).

3. **Stil (Tailwind CSS):**
   - Sınıflar, `clsx` ve `tailwind-merge` birleştirilerek temiz ve çakışmasız yazılmalıdır (shadcn/ui yaklaşımında olduğu gibi genelde bir `cn()` veya `utils.ts` içindeki bir yapı ile).
   - Özel component CSS'leri zorunlu olmadıkça kullanılmamalı, her şey Tailwind utility sınıfları ve `index.css` içindeki yapılandırma ile çözülmelidir.

4. **Durum Yönetimi (State):**
   - Lokal veya geçici (ephemeral) durumlar `useState` veya `useReducer` ile yönetilir.
   - Global seviye özellikler, editördeki sorgu verisi, haritadaki layerlar ve kullanıcının dersteki ilerlemesi `Zustand` (%src/store) tarafından yönetilecektir.

5. **Veritabanı Geliştirmeleri (PGLite / PostGIS):**
   - Tüm PostGIS sorguları istemci-tarafında PGLite (WASM) kullanılarak çalıştırılmaktadır. Hiçbir harici backend veritabanı yoktur.
   - Haritada görselleştirilmesi gereken veriler PGLite'tan "GeoJSON" formatında çekilmeli veya `geojson-adapter.ts` üzerinden dönüştürülüp OpenLayers formatına (`ol`) uyarlanmalıdır.
   - Uygulama ilk açıldığında `worker.ts` & PGLite veritabanını boot eder ve gerekli tablolar `fixtures.ts` yardımıyla memory veritabanına basılır.

## 🤖 AI / Ajana (Sana) Tavsiyeler

- Eğer bir SQL sorgusu bozuluyorsa, sorunun `PGLite` içindeki bir PostGIS eklenti eksikliği veya versiyon problemi olup olmadığına dikkat et. Pglite eklentilerinde henüz tam PostgreSQL PostGIS eşdeğeri sağlanmamış fonksiyonlar olabilir.
- Yeni bir eğitim veya ders modülü ekleneceğinde `src/content/` altındaki MDX yapısını ve ardından `src/curriculum/structure.ts` doyasını güncelle.
- UI düzenlemeleri yapıldığında, Tailwind'in sağladığı utility class'larının `react-resizable-panels` sınırları içerisinde duyarlı (responsive) davrandığından emin ol.
- PGLite client sorguları senkrona yakın (çok hızlı) çalışsa da Promises (async/await) ile asenkron mimaride yönetilmelidir.
