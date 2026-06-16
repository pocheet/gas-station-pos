// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://rpi.directvision.ru:4001',
        changeOrigin: true,
        secure: false,
        // ВАЖНО: Не перезаписываем путь, так как API сервер ожидает /api/v1/...
        rewrite: (path) => path, // Оставляем путь как есть
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err.message);
          });
          proxy.on('proxyReq', (_, req, _res) => {
            console.log('Sending Request:', req.method, req.url, '→', `http://rpi.directvision.ru:4001${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})