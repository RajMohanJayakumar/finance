import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Homepage
  server: {
    host: '0.0.0.0',
    // Handle SPA routing during development
    historyApiFallback: {
      rewrites: [
        { from: /^\/calculators\/.*$/, to: '/index.html' },
        { from: /^\/games\/.*$/, to: '/index.html' },
        { from: /^\/calculator\/.*$/, to: '/index.html' },
      ]
    }
  },
  build: {
    // Ensure proper asset handling
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
