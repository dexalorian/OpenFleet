import './assets/main.css'

import { createApp, ref, watch, reactive, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
import { onMounted } from 'vue'

import App from './App.vue'
import Map from './MapPage.vue'
import AppHeader from './components/AppHeader.vue'

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'App',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/login',
    name: 'LoginModal',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/signup',
    name: 'SignUpModal',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/logout',
    name: 'LogoutModal',
    components: {
      default: Map,
      header: AppHeader
    }
  }
]

const router = createRouter({history: createWebHistory(), routes});
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)


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

export const useMyPhotos = defineStore('myPhotos', 
   () => {

    const photos = ref([])
    
    async function fetchPhotos() {
      const resp = await fetch( import.meta.env.VITE_BASE_URL + '/photos',  
        {method: 'GET', credentials: 'include'});
      if (resp.status === 404  || resp.status === 401 ) {
        photos.value = []
        // usePtrLineCoords().visible = false
      } else {
        photos.value = await resp.json()
      }
    
    }

    return { photos, fetchPhotos }
   }
)

const userObj = useUser()
const myPhotosStore = useMyPhotos()

watch( () => userObj.email, () => myPhotosStore.fetchPhotos() )


app.mount('#app')
