<template>

<li v-for="v in manager.vehicles" class="flex border py-2 px-2">
    <div>
        <div class="font-bold flex gap-1">

            <div v-if="vehicleMarkers.get(v.id)?.status === 'online'" 
                class="bg-green-500 size-3.5 rounded-full" />
            {{ v?.login }} 
        
        </div>
        {{ v.id }}
    </div>
    <div class="flex items-center content-center justify-center text-slate-800 pointer-events-auto">
        <div @click=" () => ViewVhcCam(v.id)" v-if="vehicleMarkers.get(v.id)?.status === 'online'" 
            class="cursor-pointer bg-orange-700 absolute z-50 justify-center content-center items-center flex gap-1">
            <ion-icon name="videocam" class="size-4"></ion-icon>
            Play</div>
    
        <video autoplay :id="v.id" :ref="e =>  PlayerEls[v.id] = e " class="bg-slate-500 rounded-lg w-36"></video>
    </div>

</li>


</template>

<script lang="ts" setup>

defineProps({ status: Number, id: String })
defineEmits()


</script>