import './assets/main.css'
// import '@types/w3c-web-usb';

import { createApp, ref, watch, reactive, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'

import App from './App.vue'
import Map from './MapPage.vue'
import VehicleIndex  from './VehicleApp/Index.vue'
import AppHeader from './components/AppHeader.vue'
import DriverPage from './DriverApp/Index.vue'
import SignUp from './VehicleApp/SignUp.vue'
import Login from './VehicleApp/Login.vue'

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'App',
    components: {
      default: Map
      // header: AppHeader
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
  },
  {
    path: '/vehicleapp',
    name: 'VehicleApp',
    components: {
      default: VehicleIndex,
    }, 
    // children: [{
    //   path: 'signup',
    //   component: SignUp },
    //   { path: 'login',
    //     component: Login,
    //   },
    //   // { path: '', component: VehicleIndex }
    // ]
  },
  {
    path: '/driverapp',
    name: 'DriverApp',
    components: {
      default: DriverPage
    }
  }
]

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

// export const useVehicles = defineStore('Vehicles', 
//    () => {

//     const vehicles = ref([])
    
//     async function fetchVehicles() {
//       const resp = await fetch( import.meta.env.VITE_BASE_VEHICLE_URL + '/vehicles',  
//         {method: 'GET'});
//       if (resp.status === 404  || resp.status === 401 ) {
//         vehicles.value = []
//         // usePtrLineCoords().visible = false
//       } else {
//         vehicles.value = await resp.json()
//       }
    
//     }

//     return { vehicles, fetchVehicles, useVehicles }
//    }
// )

// const userObj = useUser()
// const VehiclesStore = useVehicles()

// watch( () => userObj.email, () => VehiclesStore.fetchVehicles() )


app.mount('#app')
