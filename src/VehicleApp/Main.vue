<template>
        <div class="max-w-2xl min-w-80 w-full h-full flex flex-col">

            <div id="anchor_wrapper" class="w-0 h-0 flex flex-col relative self-end bg-orange-500">
                <div class="flex grow-1 justify-center content-center items-center
                absolute z-20 top-3 right-2">
                    <div class="absolute text-slate-300 flex flex-col justify-center items-center gap-2" 
                        :class="showStartStreamBtn ?  '' : 'hidden' ">
                         <p class="text-xs">Video</p>
                        <Button  class='h-8 text-xs'  @click="() => startMediaRoom()">Start translation</Button>
                    </div>
                    <video ref="videoCnv" autoplay class="object-fill 
                    max-w-xs bg-slate-500 pointer-events-none rounded-md shadow-lg shadow-neutral-800" ></video>
                </div>
            </div>
            
             <MapBox :geobtn="true" />
            <!-- <Button @click="() => ws.send('Hello from vehicle!')">Hello to WS!]</Button> -->
            <!-- <Button @click="() =>  sendCurrentGeo()">Send geo w WS</Button> -->
    </div>
</template>


<script lang="ts">

import { StartWS, ws } from '@/ws';
import { watch } from 'vue';

</script>

<script lang="ts" setup>

import MapBox, { addMapTrail, createMapMarker, createMapTrail, removeMapTrail } from '@/components/Map.vue';
import Button from '@/components/ui/button/Button.vue';
import { onMounted, ref } from 'vue';
import { useOptionsStore, useVehicleStore } from './Index.vue';
import { StartWS, ws } from '@/ws';
import { useRouter } from 'vue-router'
import { Polyline, type LeafletEvent, type polyline, Leaflet, map } from 'leaflet';
import { Room, LocalParticipant, RoomEvent, Track } from 'livekit-client'

const router = useRouter()
const vehicle = useVehicleStore()
const options = useOptionsStore()

const showStartStreamBtn = ref(true)
window.onbeforeunload = (e) => { vehicle.saveOwnGeo( vehicle.currentGeo.lat, 
    vehicle.currentGeo.lng); e.preventDefault }

const videoCnv = ref<HTMLVideoElement>();
  
async function startMediaRoom() {
    const mediaroom = new Room();
    await mediaroom.prepareConnection('https://live.drivetrace.ru', 
        vehicle.mediatoken);
    await mediaroom.connect( 'https://live.drivetrace.ru', 
        vehicle.mediatoken, {autoSubscribe: false})
    console.log('connected to room', mediaroom.name);
    mediaroom.localParticipant.setCameraEnabled(true)
    mediaroom.localParticipant.setMicrophoneEnabled(false)
    const devices = await Room.getLocalDevices('audioinput');
    console.log('LK: devices', devices)

    const localstream = new MediaStream()

    mediaroom.on('localTrackPublished', (pub, participant) => {
        console.log('local track published', pub)
        localstream.addTrack(pub.track.mediaStreamTrack)
        showStartStreamBtn.value = false
    })

    mediaroom.on('participantConnected', e => e.trackPublications.forEach( k => 
        {console.log('track pub', k); k.setSubscribed(true)} ))

    videoCnv.value.srcObject = localstream;
    mediaroom.on('disconnected', () => showStartStreamBtn.value = true)
}

let marker: Leaflet.marker = null;

onMounted( async () => {
  
    StartWS('vhc')
    let managers = vehicle.getManagers()
    vehicle.currentGeo = await vehicle.fetchOwnGeo() 
    console.log('geo form db', vehicle.currentGeo)
    vehicle.mediatoken = await vehicle.getMediaToken(managers)
    console.log('media tkn:', vehicle.mediatoken)
    console.log('src obj', videoCnv.value?.srcObject)
    marker = await createMapMarker(vehicle.currentGeo, 'car')
    marker.setIcon(marker.ActiveIcon)

    marker.on('dragend', (k) => { console.log('drag end', k.target.getLatLng(), 
        options.common.debug_geo_drag ); 
            let coords = k.target.getLatLng();
            console.log(k.target.getLatLng())
            true ? ws.send( JSON.stringify( { type: 'telemetry' , 
            data: { lat: k.target.getLatLng().lat, lng: k.target.getLatLng().lng }  } ) ) : null
            OwnTail.addLatLng( k.target.getLatLng())
            let date = new Date();
                vehicle.geoHistory.push({ time: date.toLocaleTimeString(), 
                    date: date.toLocaleDateString(), lat: coords.lat, lng: coords.lng })
                vehicle.currentGeo = { lat: coords.lat, lng: coords.lng };
             })

    let OwnTail: Polyline;

    ws.onopen = () => {
        ws.send( JSON.stringify( { type: 'telemetry', 
        data: { lat: vehicle.currentGeo.lat, lng: vehicle.currentGeo.lng }  } ) )
    //     const Teltimer = () => {
    //         ws.send( JSON.stringify( { type: 'telemetry' , data: { lat: 
    //          vehicle.currentGeo.value?.lat, lng: vehicle.currentGeo.value?.lng }  } ) )
    //         console.log('ws sended')
    //         setTimeout( () => Teltimer(), 4000 )
    //     }
    //   Teltimer()
       
    }

    ws.onmessage = (e) => {
        console.log('ws msg', e.data)
        let json = JSON.parse(e.data)
        if (json.command === 'send_telemetry') {

            ws.send( JSON.stringify( { type: 'telemetry', 
            data: { lat: vehicle.currentGeo.lat, lng: vehicle.currentGeo.lng }  } ) )
            ws.send( JSON.stringify( { type: 'status',  vhcID: user.id,  status: 1 } ) )

        }

    }
    navigator.geolocation.getCurrentPosition( async (e) => {
            console.log('position getter')
            ws.send(JSON.stringify( { type: 'telemetry',  data: 
                { lat: e.coords.latitude, lng: e.coords.longitude }  }  ))
            vehicle.currentGeo = { lat: e.coords.latitude, lng: e.coords.longitude };
            let date = new Date();
            vehicle.geoHistory.push({ time: date.toLocaleTimeString(), 
                date: date.toLocaleDateString(), lat: e.coords.latitude, 
                    lng: e.coords.longitude })
             marker.setLatLng(vehicle.currentGeo)
             console.log('currgeo', vehicle.currentGeo,  e.coords)
            vehicle.currentGeo = { lat: e.coords.latitude, lng: e.coords.longitude };
            marker.setLatLng( { lat: e.coords.latitude, lng: e.coords.longitude })
            
        OwnTail =  await createMapTrail([{ lat: e.coords.latitude, lng: e.coords.longitude }]);
        setGeoFetcher()

    }, () =>  {console.log('get location error'); setGeoFetcher(); }, {timeout: 10000} )


function setGeoFetcher() {
    navigator.geolocation.watchPosition( k =>  {

            if (!options.common.debug_geo_drag) {
                let date = new Date(k.timestamp);
                vehicle.geoHistory.push({ time: date.toLocaleTimeString(), 
                    date: date.toLocaleDateString(), lat: k.coords.latitude, lng: k.coords.longitude })
                vehicle.currentGeo = { lat: k.coords.latitude, lng: k.coords.longitude };
                console.log('current geo watcher', vehicle.currentGeo);
                marker.setLatLng(vehicle.currentGeo);
                OwnTail.addLatLng(vehicle.currentGeo);
                OwnTail.on('pointadded', () => console.log('Own tail updated'));
                ws.send( JSON.stringify( { type: 'telemetry',  data: { lat: k.coords.latitude, 
                    lng: k.coords.longitude }  } ) ); 
            }

        })
}

let startPos = {};

watch( () =>  options.common.debug_geo_drag,  (e) => {
    console.log('switch')
    e ? marker.dragging.enable() : marker.dragging.disable()
} )


localStorage.getItem('settings')?.length > 0 ? options.common = 
JSON.parse(localStorage.getItem('settings')) : null


watch( options, (e) => {
    localStorage.setItem('settings', JSON.stringify(e.common))
})




watch( () => options.common.show_trail, (e) => {
    e ? addMapTrail(OwnTail) : removeMapTrail(OwnTail)
} )


console.log('current geo state:', vehicle.currentGeo)



} )



 //POST offer to vehicle record


</script>