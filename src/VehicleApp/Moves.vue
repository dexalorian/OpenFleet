<template>

    <div class="h-full w-full flex flex-col text-xs text-left p-4 gap-4">
        <div> <p class="font-bold">Current position: </p> 
            <p> lat: {{ vehicle.currentGeo.lat }}</p>
            <p> lng: {{ vehicle.currentGeo.lng }}</p>
           
        </div>
        <div class="flex gap-3">
            <Switch v-on:update:model-value="(e) => options.common.show_trail = e" :model-value="options.common.show_trail" class="scale-125" id="show_on_map">
            </Switch>
            <Label for="show_on_map" class="space">Show on map</Label>
        </div>

    <Table>
        
        <TableHeader>
            <TableRow>
                <TableHead class="w-[100px]">
                Time
                </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Coordinates</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>


        <TableRow v-for="e in vehicle.geoHistory">
            <TableCell class="font-light text-xs">{{ e.time }}</TableCell>
            <TableCell class="text-xs">{{ e.date }}</TableCell>
            <TableCell class="text-xs">{{ e.lat + ' '+ e.lng }}</TableCell>
            
        </TableRow>
        </TableBody>
  </Table>
         
    </div>

</template>

<script lang="ts" setup>
    import { Table,TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell  } from '@/components/ui/table'
    import Switch from '@/components/ui/switch/Switch.vue';
    import { useOptionsStore, useVehicleStore } from './Index.vue';

    const vehicle = useVehicleStore();
    const options = useOptionsStore()


</script>