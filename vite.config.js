import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  root: 'src',
  envDir: resolve(__dirname),
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true,
    target: 'esnext',
  },
})
