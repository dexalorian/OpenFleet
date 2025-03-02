<template>
    <div v-if="manager.isAuth" class="flex h-full w-full">
        
        <div class="flex flex-col border p-2 justify-between">
           
            <div class="flex flex-col">
                <p class="font-bold">OpenFleet</p>
                <div class="text-xs text-slate-400">Mandssager</div>
                <div class="text-xs text-slate-400">{{ manager.manager.id }} 
                    
                </div>
                
                <div class="flex flex-col py-2 gap-1">
                    <DialogAddVehicle />
                    <Button @click="() => ws.send('Hello')">Send some to WS</Button>
                    <Button @click="() => ws.send( JSON.stringify( { type: 'broadcast', text: 'cheburek' }) )"> Cheburek to all vehicles </Button>
                </div>
                <div class="text-xs font-bold">Vehicle list</div>
                <ul class="text-xs">
                    <!-- {{ manager.vehicles.value }} -->
                    <li v-for="v in manager.vehicles.value">
                        <p class="font-bold">{{ v?.login }} </p>
                        {{ v.id }} 
                    </li>
                </ul>
            </div>
            <Button variant="link" @click="manager.Logout()">Logout</Button>
        </div>
        <MapBox />

    </div>
</template>

<script setup lang="ts">

    import MapBox, { createMapMarker } from '@/components/Map.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { useManagerStore } from './ManagerPage.vue';
    import { onMounted } from 'vue';
    import { fetchBindedVehicles, newVehicle } from '../services'
    import DialogAddVehicle from './DialogAddVehicle.vue';
import { StartWS, ws } from '@/ws';
import { Marker, marker, type LeafletEvent } from 'leaflet';

let vehicleMarkers = new Map();

const manager = useManagerStore()

StartWS('mng');

onMounted( async () => {
   manager.vehicles.value =  await fetchBindedVehicles("manager")

   manager.vehicles.value.forEach( (e) => {

        vehicleMarkers.set(e.id, { coords: [e.lat, e.lng], marker: createMapMarker( { lat: e?.lat | 0, lng: e?.lng | 0 }, "car") });
   } )

   


   ws.onmessage = (e) => {
        const obj = JSON.parse(e.data)
        console.log('income', obj)
        switch (obj.type) {
            case "telemetry":
                if (!vehicleMarkers.has(obj.vhcid)) {
                    vehicleMarkers.set(obj.vhcid, { coords: [obj.data.lat, obj.data.lng], marker: createMapMarker( { lat: obj.data.lat, lng: obj.data.lng }, "car") });
                      
                } else {vehicleMarkers.get(obj.vhcid).coords = [obj.data.lat, obj.data.lng]; vehicleMarkers.get(obj.vhcid).marker.setLatLng({ lat: obj.data.lat, lng: obj.data.lng  })}
                break;
            case "status": 
                if (obj.status === "offline") {
                    vehicleMarkers.get(obj.vhcid).marker.setIcon(vehicleMarkers.get(obj.vhcid).marker.DisabledIcon)
                }
                break;
            default: 
                console.log('unknown ws type')
                break;
        } 
   }
} )




</script>