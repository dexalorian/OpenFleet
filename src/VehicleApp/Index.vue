<script lang="ts" setup>
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import TabsList from '@/components/ui/tabs/TabsList.vue';
import TabsContent from '@/components/ui/tabs/TabsContent.vue';
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue';
import Login from './Login.vue';
import SignUp from './SignUp.vue'

let BASE_VEHICLE_URL = import.meta.env.VITE_BASE_VEHICLE_URL+'/vehicle'


const router = useRouter()


const useVehicleAuth = defineStore('Vehicle', () => {
    const auth = ref(false);
    const user = ref({})
    async function Login( login: String , pwd: String ) {
       const res =  await fetch( BASE_VEHICLE_URL+'/login', {method: 'POST', body: JSON.stringify({ login, pwd })})
    }
    async function CheckAuth() {
        auth.value =  await fetch(BASE_VEHICLE_URL+'/auth', {method: 'POST'})
    }
    async function SignUp(login: String, pwd: String, email: String, phoneNums: String[]) {
       await fetch(BASE_VEHICLE_URL+'/signup', {method: 'POST', body: { login , pwd, email, phoneNums } }) 
    }

    async function Logout() {
        auth.value =  await fetch(BASE_VEHICLE_URL+'/logout', {method: 'POST'})
    }
    
    return { auth, user, Login, CheckAuth, SignUp }
}) 
 
let inSdp;
let anw;
const locdes = ref(null)

const ws = new WebSocket('http://localhost:8484')
ws.onopen = e => console.log('ws open', e)
ws.onmessage =  e => console.log('msg from serv: ', e)

const SelfLocation = ref(null)

let track;


async function myDevices() {
    let devs =  await navigator.usb.requestDevice({ filters: [] })
    console.log('Devs ', devs)
  return devs
}  

// onMounted( async ( ) => {
//     navigator.geolocation.getCurrentPosition( e => SelfLocation.value = 'Current geo: '+ e.coords.latitude+','+e.coords.longitude, (e) => { SelfLocation.value = 'Geo not allowed'} )
//     navigator.geolocation.watchPosition( e => console.log('Position changed ', e) )


//     let res = await fetch(import.meta.env.VITE_BASE_VEHICLE_URL + '/vehicle/login', 
//         { method: 'POST', headers: {"Content-type": "application/json"},  body: JSON.stringify({email: 'vehicle@mail.com', pwd: 'password123'}) })

//     if (res.status === 200) {
//         let resp = await res.json()
//         console.log('You are logged. ID: ', resp.id )
//     } else { console.log('Not logged') }

// })

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


<template>

    <div class="flex flex-col justify-center items-center border">
        <h1>Vehicle App</h1>
        <Tabs default-value="login" class="w-full">
        <TabsList class="w-full">
            <TabsTrigger value="login" class="w-full">
                Login
            </TabsTrigger>
            <TabsTrigger value="signup" class="w-full">
                Sign Up
            </TabsTrigger>

        </TabsList>

        <TabsContent value="login">
            <Login />
        </TabsContent>
        
        <TabsContent value="signup">
            <SignUp />
        </TabsContent>
    </Tabs>

    </div>




    <!-- <div class="flex flex-col gap-2">
        Vehicle App
        <div class="flex gap-1">
            <Button @click="router.push('/vehicleapp/login')">Login</Button>
            <Button @click="router.push('/vehicleapp/signup')">Sign Up</Button>
        </div>

        
        <router-view />
    </div> -->

</template>



