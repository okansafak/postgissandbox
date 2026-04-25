import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import path from 'path';
import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

export default defineConfig({
  plugins: [
    // MDX enforce:'pre' ile react'tan önce çalışmalı
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react(),
    // sunum/ klasörünü /sunum/ path'inde serve et
    {
      name: 'serve-sunum',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? '';
          if (!url.startsWith('/sunum')) return next();
          const rel = url.slice('/sunum'.length).split('?')[0] || '/index.html';
          const filePath = path.join(__dirname, 'sunum', rel);
          if (!existsSync(filePath)) return next();
          const mime: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
          };
          res.setHeader('Content-Type', mime[extname(filePath)] ?? 'text/plain');
          res.end(readFileSync(filePath));
        });
      },
    },
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
