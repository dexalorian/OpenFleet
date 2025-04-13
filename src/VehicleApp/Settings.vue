<template>

    <div class="h-full justify-center w-full items-center flex flex-col text-xs text-left">
        
        <div class="text-left py-4 px-4 flex flex-col w-full gap-2">

                  <div class="flex items-center gap-2">
                    
                    <Switch :model-value="options.common?.debug_geo" @update:model-value="(e) => 
                        { options.common.debug_geo = e }" id="debug_geo"/>
                    <Label for="debug_geo" class="space">Use debug values</Label>
                </div>
                <div class="flex items-center gap-2">
                    
                    <Switch :model-value="options.common?.debug_geo_drag" @update:model-value="(e) => 
                        { options.common.debug_geo_drag = e }"  id="debug_geo_drag"/>
                    <Label for="debug_geo_drag" class="space">Edit location with marker drag</Label>
                </div>
                <div>{{ options.common.debug_geo_drag }}</div>

            <div class="font-bold">Managers:</div>
            <p v-for="mng in vehicle.managers"> {{ mng.manager.id }}</p>
            

        </div>

        <div class="flex flex-col gap-3 w-full px-4">
            <DialogAddMngr />
            <Button @click="() => vehicle.Logout()" class="bg-red-600">Logout</Button>
           
        </div>
    </div>

</template>

<script setup lang="ts">

import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { useOptionsStore, useVehicleStore } from './Index.vue';
import Label from '@/components/ui/label/Label.vue';
import Switch from '@/components/ui/switch/Switch.vue';

import { onMounted } from 'vue';
import DialogAddMngr from './DialogAddMngr.vue';

const vehicle = useVehicleStore()
const options = useOptionsStore()

onMounted( () => { console.log(options.common); 

    
} )

</script>