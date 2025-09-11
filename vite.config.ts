import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     viteStaticCopy({
      targets: [
        {
          src: 'dist/index.html',
          dest: '.', 
          rename: '404.html'
        }
      ]
    })
  ],
 
  base: '/facultyscheduler',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
