import './assets/main.css'

import { createApp, ref } from 'vue'
import { createPinia, defineStore } from 'pinia'

import App from './App.vue'
import Map from './Map.vue'

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'App',
    component: Map, // Renders HomePage as the root '/'
  },
  {
    path: '/login',
    name: 'LoginModal',
    component: Map
  },
]


const router = createRouter({history: createWebHistory(), routes});



const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

export const useUser = defineStore('userParams', 
   () => {
      const accessTkn = ref()
      const refreshTkn = ref ()
      const email = ref('')
      const name = ref('')
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

    // function addPhoto(filename) {
    //     photos.value.push(filename)
    // }

    async function fetchPhotos() {
      const resp = await fetch( import.meta.env.VITE_BASE_URL + '/photos',  {method: 'GET'});
     photos.value = await resp.json()
    }

    return { photos, fetchPhotos }
   }
)
  




app.mount('#app')
