<template>
        <div class="max-w-2xl min-w-80 w-full h-full flex flex-col">
            <div id="anchor_wrapper" class="w-0 h-0 flex flex-col relative self-end bg-orange-500">
                <div class="flex grow-1 justify-center content-center items-center
                absolute z-20 top-3 right-2">
                    <div class="absolute text-slate-300 flex flex-col justify-center
                    items-center gap-2 ">
                    <p class="text-xs">Video</p>
                        <Button class="h-8 text-xs" @click="() => startRTCconn('temp')">Start translation</Button>
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


<script lang="ts">

import { StartWS, ws } from '@/ws';



</script>


<script lang="ts" setup>

import MapBox, { createMapMarker, createMapTrail } from '@/components/Map.vue';
import Button from '@/components/ui/button/Button.vue';
import { onMounted, ref } from 'vue';
import { useOptionsStore, useVehicleStore } from './Index.vue';
import { StartWS, ws } from '@/ws';
import { useRouter } from 'vue-router'
import { Polyline, type polyline } from 'leaflet';
import { nextTick } from 'vue';


const router = useRouter()
const vehicle = useVehicleStore()
const options = useOptionsStore()

window.onbeforeunload = (e) => { vehicle.saveOwnGeo( vehicle.currentGeo.lat, vehicle.currentGeo.lng); e.preventDefault }



const videoCnv = ref<HTMLVideoElement>()

let RTCPeers: RTCPeerConnection[] = []

async function startRTCconn(id: string) {

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
    peer.onicegatheringstatechange = (e) =>   { console.log('sdr offer: ', e); ws.send( JSON.stringify({ type: "sdp_offer", data: offer } ) ) }
    RTCPeers.push((peer))

}



onMounted( async () => {
    StartWS('vhc')
    
    let managers = vehicle.getManagers()

    vehicle.currentGeo = await vehicle.fetchOwnGeo() 
    console.log('geo form db', vehicle.currentGeo)

    let  marker = createMapMarker(vehicle.currentGeo, 'car')

    marker.on('dragend', (k) => { console.log('drag end', k.target.getLatLng(), options.common.debug_geo_drag ); 
            options.common.debug_geo_drag ? ws.send( JSON.stringify( { type: 'telemetry' , data: { lat: k.target.getLatLng().lat, lng: k.target.getLatLng().lng }  } ) ) : null
             })

    console.log('managers', managers)
    
    let OwnTail: Polyline;
    console.log('ws open')

    ws.onopen = () => {
        ws.send( JSON.stringify( { type: 'telemetry' , data: { lat: vehicle.currentGeo.lat, lng: vehicle.currentGeo.lng }  } ) )
            console.log('ws first geo sended')
    //     const Teltimer = () => {
    //         ws.send( JSON.stringify( { type: 'telemetry' , data: { lat: vehicle.currentGeo.value?.lat, lng: vehicle.currentGeo.value?.lng }  } ) )
    //         console.log('ws sended')
    //         setTimeout( () => Teltimer(), 4000 )
    //     }
    //   Teltimer()
       
    }

    navigator.geolocation.getCurrentPosition( async e => {
            console.log('position getter')
    
             marker.setLatLng(vehicle.currentGeo)
             console.log('currgeo', vehicle.currentGeo)
            vehicle.currentGeo = { lat: e.coords.latitude, lng: e.coords.longitude };
            
        OwnTail =  await createMapTrail([{ lat: e.coords.latitude, lng: e.coords.longitude }]);
        setGeoFetcher()

    }, () =>  {console.log('get location error'); setGeoFetcher()}, {timeout: 10000} )




function setGeoFetcher() {

    navigator.geolocation.watchPosition( k =>  {
            console.log('geo watcher event', k)
            if (!options.common.debug_geo_drag) {
                let date = new Date(k.timestamp)
            vehicle.geoHistory.push({ time: date.toUTCString(), lat: k.coords.latitude, lng: k.coords.longitude })
            vehicle.currentGeo = { lat: k.coords.latitude, lng: k.coords.longitude };
            console.log('current geo watcher', vehicle.currentGeo)
            marker.setLatLng(vehicle.currentGeo)
      
            OwnTail.addLatLng(vehicle.currentGeo)
            OwnTail.on('pointadded', () => console.log('Own tail updated'))
            ws.send( JSON.stringify( { type: 'telemetry',  data: { lat: k.coords.latitude, lng: k.coords.longitude }  } ) )
            }
         
        })
}

let startPos = {};




} )

 //POST offer to vehicle record


</script>