import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // proxy: {
    //   '/ws': 'http://localhost:8000', // Your FastAPI backend URL
    // },
    allowedHosts: ['ea54-103-231-117-218.ngrok-free.app', 'all'] // Allow specific ngrok host and all hosts
  },
})
