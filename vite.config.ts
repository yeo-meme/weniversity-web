import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.125.180.222',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
