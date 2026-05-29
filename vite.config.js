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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        terms: resolve(__dirname, 'src/terms/index.html'),
        privacy: resolve(__dirname, 'src/privacy/index.html'),
      },
    },
  },
})
