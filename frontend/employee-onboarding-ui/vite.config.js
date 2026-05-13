import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Enable Fast Refresh
    fastRefresh: true,
    // Optimize babel transforms
    babel: {
      compact: true,
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@api': path.resolve(__dirname, './src/api'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@user': path.resolve(__dirname, './src/user'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    // Enable HTTP/2 for faster loading
    hmr: {
      overlay: true,
    },
    // Optimize dev server
    fs: {
      strict: true,
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'axios-vendor': ['axios'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable default minification (esbuild is faster than terser)
    minify: 'esbuild',
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster cold starts
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    // Force optimization
    force: false,
  },
})
