<template>

<li  class="flex py-1 px-0 gap-2">
    <div class="flex">
        <div class="font-bold flex gap-1">

            <div v-if="props.status == 1" class="bg-green-500 size-2.5 rounded-full" />
        </div>
       <div class="text-[7pt] flex w-20">{{ id }}</div>  
    </div>
    <div class="flex items-center content-center justify-center text-slate-800 pointer-events-auto">
        <video autoplay :id="props.id" ref="vidEl" class="bg-slate-500 rounded-sm w-72"></video>
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