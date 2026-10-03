import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emitted under frontend/dist so Express can serve built assets
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    // Proxy API calls to Express during Vite HMR (#345/#346).
    // Cookie sessions work via credentials: 'include' against the Vite origin;
    // keep same-origin proxy (do not call Express cross-origin).
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.EXPRESS_PORT || 3000}`,
        changeOrigin: true
      }
    }
  }
})
