<template>
        <div class="max-w-2xl min-w-80 w-full h-full flex flex-col">
        
            <div id="anchor_wrapper" class="w-0 h-0 flex flex-col relative self-end bg-orange-500">
                <div class="flex grow-1 justify-center content-center items-center
                absolute z-20 top-3 right-2">
                    <div class="absolute text-slate-300 flex flex-col justify-center
                    items-center gap-2 ">
                    <p class="text-xs">Video</p>
                        <Button class="h-8 text-xs" @click="() => console.log('kekkek')">Start translation</Button>
                    </div>
                    <video ref="videoCnv" autoplay class="object-fill
                    max-w-36 bg-slate-500 pointer-events-none rounded-md shadow-lg shadow-neutral-800" ></video>
                </div>
            </div>
             <MapBox />
            <!-- <Button @click="() => ws.send('Hello from vehicle!')">Hello to WS!]</Button> -->
            <!-- <Button @click="() =>  sendCurrentGeo()">Send geo w WS</Button> -->
    </div>
</template>

<script lang="ts" setup>


import MapBox, { createMapMarker, createMapTrail } from '@/components/Map.vue';
// import MapBox from '@/components/Map.vue';
import Button from '@/components/ui/button/Button.vue';
import { onMounted, ref } from 'vue';
import { useVehicleStore } from './Index.vue';
import { StartWS, ws } from '@/ws';
import { useRouter } from 'vue-router'
import { Polyline, type polyline } from 'leaflet';



const videoCnv = ref<HTMLVideoElement>()
const router = useRouter()
const vehicle = useVehicleStore()


onMounted( () => {
    StartWS('vhc')
    
    let managers = vehicle.getManagers()
    console.log('managers', managers)
    
    let OwnTail: Polyline;
    console.log('ws open')

    ws.onopen = () => {
        // ws.send( JSON.stringify( { type: 'new_geolocation' ,  lat: vehicle.currentGeo.lat, lng: vehicle.currentGeo.lng  } ) )
        console.log('ws oppened')
        const Teltimer = () => {
            ws.send( JSON.stringify( { type: 'telemetry' , data: { lat: vehicle.currentGeo.value.lat, lng: vehicle.currentGeo.value.lng }  } ) )
            setTimeout( () => Teltimer(), 4000 )
        }
        
      Teltimer()
       
    }

    navigator.geolocation.getCurrentPosition( async e => {
            console.log('position getter')
            let marker =  createMapMarker({lat: e.coords.latitude, lng: e.coords.longitude})
            vehicle.currentGeo.value = { lat: e.coords.latitude, lng: e.coords.longitude };
            
        OwnTail =  await createMapTrail([{ lat: e.coords.latitude, lng: e.coords.longitude }]);

        navigator.geolocation.watchPosition( e =>  {
            let date = new Date(e.timestamp)
            vehicle.geoHistory.push({ time: date.toUTCString(), lat: e.coords.latitude, lng: e.coords.longitude })
            marker.setLatLng(vehicle.currentGeo.value)
            OwnTail.addLatLng(vehicle.currentGeo.value)
            OwnTail.on('pointadded', () => console.log('Own tail updated'))
            ws.send( JSON.stringify( { type: 'telemetry',  data: { lat: e.coords.latitude, lng: e.coords.longitude }  } ) )
        })

    }, () => console.log('get locaation error'), {timeout: 10000} )

let startPos = {};


    // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // const peer =  new RTCPeerConnection( { iceServers: [ {urls: 'stun:stun.l.google.com:19302' }] })
    // let track = await  stream.getTracks()[0];
    // const playstream = new MediaStream()
    // playstream.addTrack(track)
    // videoCnv.value.srcObject = playstream
    // videoCnv.value.onplaying = () => {  videoCnv.value?.requestPictureInPicture() }
    // peer.addTrack(track)
    // const offer =  await  peer.createOffer()
    // peer.setLocalDescription(offer)
    // peer.onicecandidate = e => console.log('candidate ', e)
    // peer.onicegatheringstatechange = (e) =>    console.log('sdr offer: ', e)
    
    // setInterval( () =>  navigator.geolocation.getCurrentPosition((e) => ws.send( JSON.stringify( { lat: e.coords.latitude, lng: e.coords.longitude }))), 5000 )
   

} )

 //POST offer to vehicle record


</script>