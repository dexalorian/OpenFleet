<template>
    <div v-if="manager.isAuth" class="flex h-full w-full">
        
        <div id="sidebar_vhc" class="flex flex-col border p-2 justify-between overflow-scroll">
           
            <div class="flex flex-col">
                <p class="font-bold">OpenFleet</p>
                <div class="text-xs text-slate-400">Manager ID</div>
                <div class="text-xs text-slate-400">{{ manager.manager.id }} 
                </div>
                
                <div class="flex flex-col py-2 gap-1">
                    <DialogAddVehicle />
                    <Button @click="() => ws.send( JSON.stringify( { type: 'broadcast', text: 'cheburek' }) )"> 
                    Cheburek to all vehicles </Button>
                    
                </div>
                <video class="w-44 bg-slate-600" autoplay ref="vidEl"></video>
                <div class="text-xs font-bold">Vehicle list</div>
                <ul class="text-xs">
                    <!-- {{ manager.vehicles.value }} -->
    
                </ul>
            </div>
            <Button variant="link" @click="manager.Logout()">Logout</Button>
        </div>
        <MapBox />

    </div>
</template>

<script setup lang="ts">

    import MapBox, { createMapMarker, createMapTrail } from '@/components/Map.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { useManagerStore } from './ManagerPage.vue';
    import { onMounted, reactive, ref } from 'vue';
    import { fetchBindedVehicles, newVehicle } from '../services'
    import DialogAddVehicle from './DialogAddVehicle.vue';
import { StartWS, ws } from '@/ws';
import { RemoteParticipant, RemoteTrackPublication, Room } from 'livekit-client';



const PlayerEls = ref({})
const vidEl = ref()

const vehicleMarkers = reactive(new Map());
let vehicleTrails = new Map();

const manager = useManagerStore()

StartWS('mng');

function ViewVhcCam(id) {
    const mediaroom =  new Room()
    mediaroom.prepareConnection('https://live.transtaxi.app', manager.mediatoken)
    mediaroom.connect('https://live.transtaxi.app', manager.mediatoken, { autoSubscribe: false})
    console.log('prts', mediaroom)
    // console.log('videl', PlayerEls.value[id])

    mediaroom.on("trackPublished", (e) => {
      
        
        // e.setSubscribed(true)
        console.log("track published", e)
    })


    mediaroom.on("participantConnected", (e: RemoteParticipant) => {
        console.log('participant conn', e.identity)
        let vhcl = manager.vehicles.find( k => k.id === e.identity )
        console.log('tracks', e.trackPublications ) 
        vhcl ? console.log('participant is member', vhcl) : console.log('participant is outsider')
        console.log(manager.vehicles)
        
    }
        )

  
    // mediaroom.on('trackSubscribed', (track, pub, participant) => {
    //     // track.attach(vidEl.value)
    //     track.attach( PlayerEls.value[id] )
    //     console.log('ViewVhcCam track sub')}
    // )

}

onMounted( async () => {
   manager.vehicles = await fetchBindedVehicles("manager")
   // get mediatokens for each vehicle
   console.log(manager.vehicles)
   await manager.GetMediaToken()
//    console.log('refs', PlayerEls.value);
   console.log('vid', PlayerEls.value)
   await ViewVhcCam('<tmp>')
   manager.vehicles.forEach( (e) => {
        if (e?.lat & e?.lng) {
            let newmarker = createMapMarker( { lat: e.lat, lng: e.lng }, "car");
            // newmarker.on('dragend', () => console.log('drag end'))
            vehicleMarkers.set(e.id, { coords: [e.lat, e.lng], marker: newmarker, status: 'pending' })
        } else {
            let newmarker = createMapMarker( { lat: 0.0, lng: 0.0 }, "car");
            vehicleMarkers.set(e.id, { coords: [0, 0], marker: newmarker, status: 'pending' })
            // let newmarker = createMapMarker( { lat: 0, lng: 0 }, "car");
            // newmarker.on('dragend', () => console.log('drag end'));
            // vehicleMarkers.set(e.id, { coords: [e?.lat, e?.lng], marker: newmarker })
        }
   } )

   ws.onmessage = async (e) => {
        const obj = JSON.parse(e.data)
        console.log('income', obj)
        switch (obj.type) {
            case "telemetry":
                vehicleMarkers.get(obj.vhcid).marker.setIcon(vehicleMarkers.get(obj.vhcid).marker.ActiveIcon)
                if (!vehicleMarkers.has(obj.vhcid)) {
                    vehicleMarkers.set(obj.vhcid, { coords: [obj.data.lat, obj.data.lng], 
                        marker: createMapMarker( { lat: obj.data.lat, lng: obj.data.lng }, "car") });
                    vehicleTrails.set( obj.vhcid, { trail: createMapTrail({ lat: obj.data.lat, lng: obj.data.lng }) } )
                    // console.log('trails', vehicleTrails)
                } else {
                    vehicleMarkers.get(obj.vhcid).coords = [obj.data.lat, obj.data.lng]; 
                    vehicleMarkers.get(obj.vhcid).marker.setLatLng({ lat: obj.data.lat, lng: obj.data.lng  });
                    vehicleTrails.has(obj.vhcid) ? vehicleTrails.get(obj.vhcid).trail.addLatLng({ lat: obj.data.lat, lng: obj.data.lng }) : 
                        vehicleTrails.set(obj.vhcid, { trail: createMapTrail({ lat: obj.data.lat, lng: obj.data.lng }) })
                    console.log(' trails ', vehicleTrails.get(obj.vhcid).trail.getLatLngs())
                    }
                break;
            case "status": 
    
                if (obj.status === "offline") {
                    // vehicleMarkers.get(obj.vhcid).marker.setIcon(vehicleMarkers.get(obj.vhcid).marker.DisabledIcon)
                    console.log( obj.vhcID, 'offline')

                    console.log( 'all mrkrs', Array.from(vehicleMarkers.keys()))
                    vehicleMarkers.get(obj.vhcID).status = 'offline'
                  
                } else if (obj.status === "online") {
                    // vehicleMarkers.get(obj.vhcid).marker.setIcon(vehicleMarkers.get(obj.vhcid).marker.DisabledIcon)
                    console.log( obj.vhcID, 'online')
  
                    console.log( 'all mrkrs', Array.from(vehicleMarkers.keys()))
                    vehicleMarkers.get(obj.vhcID).status = 'online'
                  
                }
   
                break;
            default: 
                console.log('unknown ws type')
                break;
        } 
   }
} )




</script>


<style>
/* 
    .probe_flash {
        flex: auto;

        width: 100px;
        height: 100px;
        background-color: aqua;
    } */

</style>