import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  root: 'src',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: 'esnext',
  },
})
