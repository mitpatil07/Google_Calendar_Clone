import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 * 
 * Key settings:
 * - Path aliases for cleaner imports (@/ instead of ../../)
 * - Proxy configuration for API calls during development
 * - Build optimizations
 */
export default defineConfig({
  plugins: [react()],
  
  // Path alias configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Development server configuration
  server: {
    port: 5173,
    open: true, // Auto-open browser
    
    // Proxy API requests to backend during development
    // This avoids CORS issues and mimics production setup
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'axios'],
        },
      },
    },
  },
});