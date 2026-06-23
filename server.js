// server.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://rpi.directvision.ru:4001',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api', // оставляем путь как есть
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxy: ${req.method} ${req.url} → http://rpi.directvision.ru:4001${req.url}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`✅ Response: ${proxyRes.statusCode} ${req.url}`);
      },
      error: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
      },
    },
  })
);

// Статические файлы из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - все остальные запросы на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API proxy: /api/* → http://rpi.directvision.ru:4001`);
});
