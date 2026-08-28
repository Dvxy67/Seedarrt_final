import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // écoute sur 0.0.0.0 pour être joignable depuis un téléphone sur le même Wi-Fi
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
