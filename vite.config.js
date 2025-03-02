import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['trading-vue-js', 'vue-echarts']
  },
  server: {

    hmr: {
      protocol: "wss",
      // host: "45.9.72.39",
      clientPort: 443,
      port: 5929, 
      path: "/vite_hmr",
    }

    //  hmr: {
    //   // protocol: "ws",
    //   // host: "45.9.72.39",
    //   // clientPort: 5929,
    //   // overlay: false,
    //   // port: 5929, 
    //   // path: "/vite_hmr",
    // }


  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
