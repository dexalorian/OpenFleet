<script lang="ts" setup>
import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter()

let inSdp;
let anw;
const locdes = ref(null)

const SelfLocation = ref(null)
let track;
const vehicle = useVehicleStore()

watch(() => vehicle.isAuth, () => 
    vehicle.isAuth ? 
        router.push({ name: 'vehicle-main'}) : router.push({ name: 'vehicle-enter'}) )

async function myDevices() {
    let devs =  await navigator.usb.requestDevice({ filters: [] })
    console.log('Devs ', devs)
  return devs
}  

onMounted(async () => {
        await vehicle.CheckAuth()
        console.log( 'isAuth? ', vehicle.isAuth );
       if (vehicle.isAuth) {
           router.push({ name: 'vehicle-main' })
       } else { router.push( { name: 'vehicle-enter' }) }
   })

async function createSDPanswer() {
    let peer = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google's STUN server
})
    console.log(inSdp)
    peer.setRemoteDescription( JSON.parse(inSdp))
    peer.addTrack(track)
    anw = await peer.createAnswer()
    peer.setLocalDescription(anw)
    console.log('loc des', anw)
    peer.onconnectionstatechange = e => console.log('conn state: ', e)
    peer.onicegatheringstatechange = e => {

        if (peer.iceGatheringState === "complete") {
            locdes.value = JSON.stringify(peer.localDescription)
            console.log("ice gathering complete")
           } 
        }
    }

</script>

<script lang="ts">

export const useVehicleStore = defineStore('VehicleStore', () => {
    const isAuth = ref(false);
    const vehicle = ref({})
    const managers = ref([])
    const owners = ref([])

    async function getManagers() {
        const res = await fetch( import.meta.env.VITE_SRV_URL + '/vehicle/managers', {method: 'GET', credentials: 'include'} )
        const resp = await res.json()
        managers.value = resp.mngrs;
    }

    async function getOwners() {
        const res = await fetch( import.meta.env.VITE_SRV_URL + '/vehicle/owners', {method: 'GET', credentials: 'include'} )
        const resp = await res.json()
        owners.value = resp.mngrs;
    }

    async function Login( login: String , pwd: String ): String {
        try {
            const res =  await fetch( import.meta.env.VITE_SRV_URL +'/vehicle/login', {body: JSON.stringify({login, pwd}), credentials: 'include', method: 'POST'})
            let resp = await res.json()
        if (res.status === 200) {
         console.log('200');
        
        //  console.log(resp.id);
         vehicle.id = resp.id
         console.log(vehicle.id);
         isAuth.value = true
        }
        } catch {
            console.log('login error')
            return  'Login error' 
        }
   
    }

    async function CheckAuth() {
        try {
            const res = await fetch( import.meta.env.VITE_SRV_URL + '/vehicle/auth', {method: 'POST', credentials: 'include'} )
      const resp = await res.json()
      console.log('Checking auth')
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
    async function SignUp(login: String, pwd: String, email: String, phoneNums: String[]) {
       await fetch(import.meta.env.VITE_SRV_URL+'/vehicle/signup', {method: 'POST', body: { login , pwd, email, phoneNums } }) 
    }

    async function Logout() {
        isAuth.value =  await fetch(import.meta.env.VITE_SRV_URL+'/vehicle/logout', {method: 'POST'})
    }

    
    return { isAuth, vehicle, Login, CheckAuth, SignUp, getManagers, getOwners }
}) 

</script>


<template>
    OpenFleet. Vehicle app
    <RouterView class="flex w-full border w-72"/>

</template>



