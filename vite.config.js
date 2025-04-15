import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['trading-vue-js', 'vue-echarts']
  },
  build: {
    target: 'esnext' // or 'esnext' for modern
  },
  server: {

    // hmr: {
    //   protocol: "wss",
    //   // host: "45.9.72.39",
    //   clientPort: 443,
    //   port: 5929, 
    //   path: "/vite_hmr",
    // }

     hmr: {
      protocol: "ws",
      clientPort: 5929,
      port: 5929, 
      path: "/vite_hmr",
    }


  },
  // css: {
  //   // postcss: {
  //   //   plugins: [tailwind(), autoprefixer()],
  //   // },
  // },
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
