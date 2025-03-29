<template>

<li  class="flex border py-2 px-2">
    <div>
        <div class="font-bold flex gap-1">

            <div v-if="props.status == 1" class="bg-green-500 size-3.5 rounded-full" />
        </div>
        {{ id }}
    </div>
    <div class="flex items-center content-center justify-center text-slate-800 pointer-events-auto">
        <!-- <div @click=" () => ViewVhcCam(props.id)" v-if="props.status == 1" 
            class="cursor-pointer bg-orange-700 absolute z-50 justify-center content-center items-center flex gap-1">
            <ion-icon name="videocam" class="size-4"></ion-icon>
            Play</div> -->
    
        <video autoplay :id="props.id" ref="vidEl" class="bg-slate-500 rounded-lg w-36"></video>
    </div>

</li>

</template>

<script lang="ts" setup>

import { ref } from 'vue'

const vidEl = ref()

defineExpose({ vidEl })
const props = defineProps({ status: Number, id: String })
// defineEmits()


</script>