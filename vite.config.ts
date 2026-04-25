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
        const sunumDir = path.join(__dirname, 'sunum');
        // use('/sunum', handler) → Connect, '/sunum' önekini keser; req.url = '/index.html'
        server.middlewares.use('/sunum', (req, res, next) => {
          const rel = (req.url ?? '/').split('?')[0].replace(/^\/+/, '') || 'index.html';
          const filePath = path.join(sunumDir, rel);
          if (!existsSync(filePath)) return next();
          const mimeMap: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.css':  'text/css; charset=utf-8',
            '.js':   'application/javascript; charset=utf-8',
            '.svg':  'image/svg+xml',
            '.png':  'image/png',
          };
          res.writeHead(200, { 'Content-Type': mimeMap[extname(filePath)] ?? 'text/plain' });
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
