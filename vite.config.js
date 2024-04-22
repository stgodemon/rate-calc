import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        "theme_color": "#fff",
        "background_color": "#fff",
        "display": "standalone",
        "scope": "/",
        "start_url": "/rate-calc",
        "short_name": "StarGrass Assistant",
        "description": "StarGrass Assistant",
        "name": "StarGrass Assistant",
          "icons": [
            {
                "src": "/favicon.png",
                "type": "image/png"
            },
        ],
      },
    })
  ],
  base: 'rate-calc',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})