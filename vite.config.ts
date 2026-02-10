import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'mobx', 'mobx-react-lite'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
