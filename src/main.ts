import './assets/main.css'

import { createApp, ref, watch, reactive, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
import App from './App.vue'
import { routes } from './routes'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({history: createWebHistory(), routes});
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

export const useVideoConnections = defineStore('videoConnections', () => {
  const connections = ref({})
  return { connections }
} )

export const useUser = defineStore('userParams', 
   () => {
      const accessTkn = ref('')
      const refreshTkn = ref('')
      const email = ref('')
      const name = ref('')
      const isAuth = ref(false)
      const id = ref('')

    function reset() {
      console.log('User store reset')
      accessTkn.value = ''
      refreshTkn.value = ''
      email.value = ''
      name.value = ''
      id.value = ''
      isAuth.value = false
    }
      return { accessTkn, refreshTkn, email, name, isAuth, reset }
   }
)

export const useSelGeoPnt = defineStore( 'selectedGeoPoint', 
  () => {
    const lat = ref(0);
    const lng = ref(0);
    const visible = ref(false);
    return { lat, lng, visible }
  } )


//Keeps coords for line rendering 
export const usePtrLineCoords = defineStore('ptrLineCoords', () => {
      const from = ref([0,0]); 
      const to = ref([0,0]);
      const visible = ref(false)
      return { from, to, visible }
    
}) 




app.mount('#app')
