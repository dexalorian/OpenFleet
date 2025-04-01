<template>
    <div v-if="manager.isAuth" class="flex h-full w-full">
        
        <div id="sidebar_vhc" class="flex flex-col border p-2 justify-between overflow-scroll">
           
            <div class="flex flex-col">
                <p class="font-bold">OpenFleet</p>
                <div class="text-xs text-slate-400">Manager ID</div>
                <div class="text-xs text-slate-400">{{ manager.manager.id }} 
                </div>
                
                <div class="flex flex-col py-1 gap-1">
                    <DialogAddVehicle />
                    <Button @click="() =>  ViewVhcCam('<tmp>')">Connect to general room</Button>
                    <Button @click="() => mediaroom.disconnect(true)">Leave room</Button>
                    
                </div>
                <div class="text-xs font-bold">Vehicle list</div>
                <ul class="text-xs">
                    <VhcSideItem v-for="[k, v] in manager.vehicles" :id="v.id" :status="v.status" ref="vidEls" />
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
import VhcSideItem from "./components/VhcSideItem.vue"
import { RemoteParticipant, RemoteTrackPublication, Room } from 'livekit-client';
import { Table } from 'lucide-vue-next';
import { watch } from 'vue';

const vidEls = ref([])

const vehicleMarkers = reactive(new Map());
let vehicleTrails = new Map();

const manager = useManagerStore()

StartWS('mng');

let mediaroom;



function ViewVhcCam(id) {
    mediaroom =  new Room()

    mediaroom.on('connectionStateChanged', e => console.log(" LiveKit conn state", e))
    
    mediaroom.prepareConnection('https://live.transtaxi.app', manager.mediatoken)
    mediaroom.connect('https://live.transtaxi.app', manager.mediatoken, { autoSubscribe: false})


     mediaroom.on("connected", () => {  
        mediaroom.remoteParticipants.forEach( e => {

            e.trackPublications.forEach( pub => {
                  if  ( (manager.vehicles.has(e.identity)) && !pub.isSubscribed) {
                        pub.setSubscribed(true)
                        e.on("trackSubscribed", (track) => {
                            const tmpidx = vidEls.value.findIndex( x => x.vidEl.id === e.identity)
                            vidEls.value[tmpidx].vidEl.srcObject = new MediaStream([track.mediaStreamTrack]);
                        })
                  } else {
                    console.log('already subscribed to', pub)
                    vidEls.value[elIdx].vidEl.srcObject = new MediaStream([pub.track?.mediaStreamTrack]);
                  }
            } )

        } )

     }  )

    mediaroom.on("trackPublished", (e, participant) => {
        // e.setSubscribed(true)
        console.log("track published", e)
        console.log("all active members", mediaroom.remoteParticipants)
        if  (manager.vehicles.has(participant.identity)) {

            e.setSubscribed(true)

            participant.on("trackSubscribed", (track) => {    
                const elIdx = vidEls.value.findIndex( e => e.vidEl.id === participant.identity )
                vidEls.value[elIdx].vidEl.srcObject = new MediaStream([track.mediaStreamTrack]);
             })

        } else {console.log('not subscrbed', participant.identity)}

       
    })

    mediaroom.on("participantConnected", (e: RemoteParticipant) => {
        console.log('participant conn', e.identity)
        let vhcl = manager.vehicles.has( e.identity )
        console.log('tracks', e.trackPublications ) 
        vhcl ? console.log('participant is member', vhcl) : console.log('participant is outsider')

        
    }
        )
  
    // mediaroom.on('trackSubscribed', (track, pub, participant) => {
    //     // track.attach(vidEl.value)
    //     track.attach( PlayerEls.value[id] )
    //     console.log('ViewVhcCam track sub')}
    // )

}


onMounted( async () => {
   const receivedVehs = await fetchBindedVehicles("manager")

   receivedVehs.forEach( e => manager.vehicles.set(e.id, e))

   
   
   // get mediatokens for each vehicle
   console.log(manager.vehicles)
   await manager.GetMediaToken()


   manager.vehicles.forEach( async (e) => {
        if (e?.lat & e?.lng) {
            let newmarker = await createMapMarker( { lat: e.lat, lng: e.lng }, "car");
            // newmarker.on('dragend', () => console.log('drag end'))
            vehicleMarkers.set(e.id, { coords: [e.lat, e.lng], marker: newmarker, status: 2 })
        } else {
            let newmarker = await createMapMarker( { lat: 0.0, lng: 0.0 }, "car");
            vehicleMarkers.set(e.id, { coords: [0, 0], marker: newmarker, status: 2 })
            // let newmarker = createMapMarker( { lat: 0, lng: 0 }, "car");
            // newmarker.on('dragend', () => console.log('drag end'));
            // vehicleMarkers.set(e.id, { coords: [e?.lat, e?.lng], marker: newmarker })
        }

    console.log("map cars icons", vehicleMarkers)
   } )

  

   ws.onmessage = async (e) => {
        const obj = JSON.parse(e.data)
        console.log('income', obj)
        switch (obj.type) {
            case "telemetry":
                vehicleMarkers.get(obj.vhcID).marker.setIcon(vehicleMarkers.get(obj.vhcID).marker.ActiveIcon)
                if (!vehicleMarkers.has(obj.vhcID)) {
                    vehicleMarkers.set(obj.vhcID, { coords: [obj.data.lat, obj.data.lng], 
                        marker: createMapMarker( { lat: obj.data.lat, lng: obj.data.lng }, "car") });
                    vehicleTrails.set( obj.vhcID, { trail: createMapTrail({ lat: obj.data.lat, lng: obj.data.lng }) } )
                    // console.log('trails', vehicleTrails)
                } else {
                    vehicleMarkers.get(obj.vhcID).coords = [obj.data.lat, obj.data.lng]; 
                    vehicleMarkers.get(obj.vhcID).marker.setLatLng({ lat: obj.data.lat, lng: obj.data.lng  });
                    vehicleTrails.has(obj.vhcID) ? vehicleTrails.get(obj.vhcid).trail.addLatLng({ lat: obj.data.lat, lng: obj.data.lng }) : 
                        vehicleTrails.set(obj.vhcID, { trail: createMapTrail({ lat: obj.data.lat, lng: obj.data.lng }) })
                    console.log(' trails ', vehicleTrails.get(obj.vhcID).trail.getLatLngs())
                    }
                break;
            case "status": 
    
                if (obj.status === 0) {
                    vehicleMarkers.get(obj.vhcID).marker.setIcon(vehicleMarkers.get(obj.vhcID).marker.DisabledIcon)
                    console.log( obj.vhcID, 'offline')

                    console.log( 'all mrkrs', vehicleMarkers)
                    vehicleMarkers.get(obj.vhcID).status = 0
                    manager.vehicles.get(obj.vhcID).status = 0
                  
                } else if (obj.status === 1) {
                    vehicleMarkers.get(obj.vhcID).marker.setIcon(vehicleMarkers.get(obj.vhcID).marker.ActiveIcon)
                    console.log( obj.vhcID, 'online')
  
                    console.log( 'all mrkrs', vehicleMarkers)
                    vehicleMarkers.get(obj.vhcID).status = 1
                    manager.vehicles.get(obj.vhcID).status = 1
        
                  
                }
   
                break;
            default: 
                console.log('unknown ws type')
                break;
        } 
   }

   console.log("vidEls", vidEls)
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