<template>
        <div class="w-full border h-full flex flex-col">
            {{ 'ID: '+ JSON.stringify(vehicle) }}
            <Button @click="() => ws.send('Hello from vehicle!')">Hello to WS</Button>

            <div class="flex grow-1 justify-center content-center items-center">
                <div class="absolute text-slate-300 flex flex-col justify-center items-center gap-2 ">Video
                    <Button @click="() => console.log('kekkek')">Start translation</Button>
                </div>
                <video ref="videoCnv" autoplay class="border object-fill max-w-md bg-slate-500 pointer-events-none" ></video>
            </div>
             <Map class="flex grow-3"></Map>
    </div>
</template>

<script lang="ts" setup>
import Map from '@/components/Map.vue';
import Button from '@/components/ui/button/Button.vue';
import { onMounted, ref } from 'vue';
import { useVehicleStore } from './Index.vue';
import { StartWS, ws } from '@/ws';
import { useRouter } from 'vue-router'

const videoCnv = ref<HTMLVideoElement>()
const router = useRouter()
const vehicle = useVehicleStore()



onMounted( async () => {
    StartWS('vhc')
    vehicle.getManagers()
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const peer =  new RTCPeerConnection( { iceServers: [ {urls: 'stun:stun.l.google.com:19302' }] })
    let track = await  stream.getTracks()[0];
    const playstream = new MediaStream()
    playstream.addTrack(track)
    videoCnv.value.srcObject = playstream
    videoCnv.value.onplaying = () => {  videoCnv.value?.requestPictureInPicture() }
    peer.addTrack(track)
    const offer =  await  peer.createOffer()
    peer.setLocalDescription(offer)
    peer.onicecandidate = e => console.log('candidate ', e)
    peer.onicegatheringstatechange = (e) =>    console.log('sdr offer: ', e)
    
    // setInterval( () =>  navigator.geolocation.getCurrentPosition((e) => ws.send( JSON.stringify( { lat: e.coords.latitude, lng: e.coords.longitude }))), 6000 )
   

} )

 //POST offer to vehicle record


</script>