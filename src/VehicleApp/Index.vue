<script lang="ts" setup>
import { ref, watch, reactive } from 'vue';
import { defineStore } from 'pinia';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Tabs, TabsList }  from '@/components/ui/tabs';
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue';
import TabsContent from '@/components/ui/tabs/TabsContent.vue';
import Main from './Main.vue'
import Settings from './Settings.vue';
import Moves from './Moves.vue';

const router = useRouter()

let inSdp;
let anw;
const locdes = ref(null)

const SelfLocation = ref(null)
let track;
const vehicle = useVehicleStore()


let link = document.querySelector("link[rel~='icon']");
link.rel = 'icon';
link.href = '/favicon_vhc.png';
document.head.appendChild(link);

watch(() => vehicle.isAuth, () => 
    vehicle.isAuth ? 
        null : router.push({ name: 'vehicle-enter'}) )

async function myDevices() {
    let devs =  await navigator.usb.requestDevice({ filters: [] })
    console.log('Devs ', devs)
  return devs
}  



onMounted(async () => {
        await vehicle.CheckAuth()
       if (vehicle.isAuth) {
        //    router.push({ name: 'vehicle-main' })
       } else { router.push( { name: 'vehicle-enter' }) }


   })

// async function createSDPanswer() {
//     let peer = new RTCPeerConnection({
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google's STUN server
// })
//     console.log(inSdp)
//     peer.setRemoteDescription( JSON.parse(inSdp))
//     peer.addTrack(track)
//     anw = await peer.createAnswer()
//     peer.setLocalDescription(anw)
//     console.log('loc des', anw)
//     peer.onconnectionstatechange = e => console.log('conn state: ', e)
//     peer.onicegatheringstatechange = e => {

//         if (peer.iceGatheringState === "complete") {
//             locdes.value = JSON.stringify(peer.localDescription)
//             console.log("ice gathering complete")
//            } 
//         }
//     }

const vhc = useVehicleStore()
const options = useOptionsStore()

// watch( options.common,  (e) => localStorage.setItem('settings', JSON.stringify(e)))

// const router = useRouter()

</script>

<script lang="ts">

    import type { LatLng } from 'leaflet';

    export const useOptionsStore = defineStore('Options', () => {
        const common = ref({debug_geo: false, debug_geo_drag: false, show_trail: false})
        return { common }
    })

    export const useVehicleStore = defineStore('VehicleStore', () => {
    const isAuth = ref(false)
    const vehicle = ref({})
    const managers = ref([])
    const owners = ref([])
    const currentGeo = ref({lat: 0, lng: 0})
    const geoHistory = ref([])
    const mediatoken = ref('')

    async function getManagers() {
        const res = await fetch(import.meta.env.VITE_SRV_URL+ '/vehicle/managers', 
        {method: 'GET', credentials: 'include'} )
        const resp = await res.json()
        managers.value = resp.mngrs;
        return resp.mngrs
    }

    async function getOwners() {
        const res = await fetch( '/owners', 
        {method: 'GET', credentials: 'include'} )
        const resp = await res.json()
        owners.value = resp.mngrs;
    }

    async function Login( login: String , pwd: String ): String {
        try {
            const res =  await fetch(import.meta.env.VITE_SRV_URL+ '/vehicle/login', 
                {body: JSON.stringify({login, pwd}), headers: { "Content-Type" : 'application/json' } , 
            credentials: 'include', method: 'POST'})
            const resp = await res.json()
        if (resp.valid) {
         isAuth.value = true;
         vehicle.value = resp.vehicle;

        }
        } catch {
            console.log('login error')
            return  'Login error' 
        }
    }




    async function getMediaToken(room_ids: Array) {
        const resp = await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/mediatoken', 
            { method: 'GET' , credentials: 'include'})
     
        return await resp.json().then( e => e.token )
    }

    async function CheckAuth() {
        try {
        const res = await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/auth', 
        {method: 'POST', credentials: 'include'} )
      const resp = await res.json()
      if (resp.valid) {
        isAuth.value = true;
        vehicle.value = resp.vehicle
      } else {
        isAuth.value = false;
        vehicle.value = null
      }
        } catch {
            e => {
                isAuth.value = false;
                vehicle.value = null
            }
        }
    }

    async function fetchOwnGeo(): LatLng {
       let resp = await fetch(import.meta.env.VITE_SRV_URL+ '/vehicle/getgeo', 
       { method: 'GET', credentials: 'include', headers: { "Content-type": "application/json"}})

       if (resp.status === 200) {
        let e = await resp.json()

           return e
       }
       console.log('from own fetch 404', resp)
      
    }

    async function saveOwnGeo(lat, lng) {
        await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/setgeo', 
        { body: JSON.stringify({ lat: lat, lng: lng }), method: 'POST', credentials: 'include', 
            headers: { "Content-Type": "application/json" }})
    }

    async function SignUp(login: String, pwd: String, email: String, phoneNums: String[]) {
       await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/signup', 
       {method: 'POST', body: { login , pwd, email, phoneNums } }) 
    }

    async function Logout() {
        const resp = await fetch(import.meta.env.VITE_SRV_URL+ '/vehicle/logout', 
        {method: 'GET', credentials: 'include'});

        if (resp.status !== 200) {
            addOfflineLogout('vhc')
        } 
        isAuth.value = false;
        vehicle.value = null;
    }
    
    return { isAuth, 
            vehicle, 
            geoHistory, 
            currentGeo, 
            managers,
            Login, 
            Logout, 
            CheckAuth, 
            SignUp, 
            getManagers, 
            getOwners,
            fetchOwnGeo,
            saveOwnGeo,
            getMediaToken,
            mediatoken }
}) 

</script>


<template>
    <div class=" h-full flex flex-col w-full min-w-80 max-w-lg">
        <div class="text-[8px] font-bold flex gap-2 py-1 items-center content-center">
             OpenFleet. Car app.
            <div class="text-[8px] ">{{ vehicle?.vehicle?.id }}</div>
        </div>
        
        <RouterView  v-if="!vhc.isAuth" class="flex flex-col h-full
         w-full border"/>
        <div v-if="vhc.isAuth" class="flex h-full w-full">
       
            <Tabs class="w-full h-full flex flex-col" default-value="map-page">
                <TabsContent force-mount class="data-[state=inactive]:hidden
                    flex flex-col h-full mt-0" value="map-page">
                 
                        <Main />
                </TabsContent>
                <TabsContent force-mount class="data-[state=inactive]:hidden flex
                    flex-col h-full mt-0" value="profile-page">
                    <Settings />
                </TabsContent>
                <TabsContent force-mount class="data-[state=inactive]:hidden flex
                    flex-col h-full mt-0" value="history-page">
                    <Moves />
                </TabsContent>
                  <TabsList class="w-full *:w-full  flex *:h-12 group-">
                    <TabsTrigger   value="map-page">Map</TabsTrigger>
                    <TabsTrigger  value="history-page">History</TabsTrigger>
                    <TabsTrigger  value="profile-page"><ion-icon class="text-2xl" 
                        name="cog"></ion-icon></TabsTrigger>
                 </TabsList>
            </Tabs>
        </div>
    </div>

</template>



