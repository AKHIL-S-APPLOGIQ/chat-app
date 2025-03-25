import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/', 
  server: {
    allowedHosts: ['group-chat-simple-backend.vercel.app','6b0e-103-231-117-218.ngrok-free.app', 'all',"*"] ,// Allow specific ngrok host and all hosts
    mimeTypes: {
      'application/javascript': ['js'],
      'text/javascript': ['mjs', 'jsx']
    }
  },
  build: {
    outDir: 'dist',
  },
})
