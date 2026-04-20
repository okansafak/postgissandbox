import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import path from 'path';

export default defineConfig({
  plugins: [
    // MDX enforce:'pre' ile react'tan önce çalışmalı
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    // PGlite WASM + PostGIS tar.gz esbuild tarafından bundle'lanmamalı;
    // native ES module olarak serve edilmeli (Faz 0'da öğrenilen kritik kural)
    exclude: ['@electric-sql/pglite', '@electric-sql/pglite-postgis'],
  },
  assetsInclude: ['**/*.tar.gz'],
  worker: {
    format: 'es',
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
