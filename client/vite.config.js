import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_OFFLINE=true bilan qurilganda hamma narsa bitta faylga yigʻiladi
// (statik demo uchun: alohida chunk fayllari kerak boʻlmaydi).
const inlineAll = process.env.VITE_OFFLINE === 'true';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: inlineAll ? { output: { inlineDynamicImports: true } } : {},
  },
  server: {
    port: 5173,
    proxy: {
      // Backend localhost:5050 da turadi. Shuning uchun frontendda faqat "/api" yozamiz.
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
});
