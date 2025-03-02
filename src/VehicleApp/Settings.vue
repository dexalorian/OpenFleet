<template>

    <div class="h-full justify-center items-center flex flex-col text-xs text-left">
        
        <div class="text-left py-4 px-4">
            <div class="flex ">
                <div class="flex flex-col">
                    <Label for="lat">Latittude</Label>
                    <Input id="lat" />
                </div>
                <div class="flex flex-col">
                    <Label for="lng">Longitude</Label>
                    <Input id="lng" />
                </div>
                
               
            </div>

            <div class="font-bold">Managers:</div>
            <p v-for="mng in vehicle.managers"> {{ mng.manager }}</p>
            <div> <p class="font-bold">Current position: </p> {{ vehicle.currentGeo.value  }}</div>
            <div class="font-bold">Geo History:</div>
            <div v-for="rec in vehicle.geoHistory" class="text-[8px]"> {{ rec }}</div>
        </div>

        <div class="flex flex-col gap-3 w-full px-4">
            <Button>Add manager</Button>
            <Button @click="() => vehicle.Logout()" class="bg-red-600">Logout</Button>
           
        </div>
    </div>

</template>

<script setup lang="ts">

import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { useVehicleStore } from './Index.vue';
import Label from '@/components/ui/label/Label.vue';



const vehicle = useVehicleStore()



</script>