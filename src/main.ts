import './assets/main.css'

import { createApp, ref, watch } from 'vue'
import { createPinia, defineStore } from 'pinia'
import { onMounted } from 'vue'

import App from './App.vue'
import Map from './MapPage.vue'
import AppHeader from './components/AppHeader.vue'

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { createRouter, createWebHistory } from 'vue-router';
import path from 'path'


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

    function reset() {
      console.log('User store reset')
      accessTkn.value = ''
      refreshTkn.value = ''
      email.value = ''
      name.value = ''
      isAuth.value = false
      

    }

      return { accessTkn, refreshTkn, email, name, isAuth, reset }
   }
)

export const useSelGeoPnt = defineStore( 'selectedGeoPoint', {
    state: () => ({
      lat: 0,
      lng: 0
    })
  } )


//Keeps coords for line rendering 
export const usePtrLineCoords = defineStore('ptrLineCoords', {

    state: () => (
      {from: [0,0], to: [0,0]}
    )
}) 

export const useMyPhotos = defineStore('myPhotos', 
   () => {

    const photos = ref([])
    
    async function fetchPhotos() {
      const resp = await fetch( import.meta.env.VITE_BASE_URL + '/photos',  {method: 'GET', credentials: 'include'});
      console.log('Fetch photos resp status: ', resp.status)
      if (resp.status === 404) {
        photos.value = []
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
