<template>
    <li  class="flex py-1 px-0 gap-2 group relative " >
        <div class="flex w-20" >
            <!-- <div class="font-bold flex gap-1">
                <div v-if="props.status == 1" class="bg-green-500 size-2.5 rounded-full" />
            </div> -->
            <div class="text-[7pt] flex w-20 h-fit " :class=" { 'bg-green-200' : props.status == 1 }">{{ id }}</div>  
        </div>
        <div class="flex items-center content-center justify-center 
            relative text-slate-800 pointer-events-none group">
                <div @click.stop="e => emit('menuclick', props.id)" 
                    class="flex absolute group-hover:flex 
                    pointer-events-auto cursor-pointer  bg-green-500">Menu</div>
                <transition name="fade">

                    <div v-if="showmenu"  class="flex z-50 absolute bg-white w-24 min-h-28 
                        overflow-hidden rounded-sm shadow-xl pointer-events-auto">
                        <ul class="flex flex-col gap-2 text-sm w-full z-50 ">
                            <li @click="() => i.cb(props.id)" v-for="i in MenuItems" 
                                class="hover:bg-slate-200 flex w-full p-3 
                                    pointer-events-auto cursor-pointer">{{ i.title }}</li>
                        </ul>
                    </div>

                </transition>

                <video autoplay :id="props.id" ref="vidEl" class="bg-slate-500 rounded-sm w-52 flex"></video>
                
        </div>
    </li>

</template>

<script lang="ts" setup>

import { onMounted } from 'vue'
import { watch, watchEffect, defineModel } from 'vue'
import { ref} from 'vue'

const MenuItems = [
    {title: 'Stop video', cb: () => console.log('Stop video placeholder')},
    {title: 'Unbind vehicle', cb: async (vhcID: string) => {
        console.log("Unbinding", vhcID)
        await fetch(import.meta.env.VITE_SRV_URL + '/manager/unbindvehicle', 
        {method: 'POST', credentials: 'include', body: JSON.stringify({vhcID}), 
        headers: {"Content-Type": "application/json"}})
    } },
    {title: 'Connect', cb: () => console.log('placeholder')},
    {title: 'Fold tile', cb: () => console.log('placeholder')},
]

const vidEl = ref()
defineExpose({ vidEl })
const emit = defineEmits(['menuclick'])

const props = defineProps({ status: Number, id: String, showmenu: Boolean })

// defineEmits()


</script>