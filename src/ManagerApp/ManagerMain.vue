<template>
    <div>
        
        <div class="flex flex-col border p-2 h-full justify-between">
           
            <div class="flex flex-col">
                <p class="font-bold">OpenFleet</p>
                <div class="text-xs text-slate-400">Manager</div>
                <div class="text-xs text-slate-400">{{ manager }}</div>
                
                <div class="py-2">
                    <Dialog>
                        <DialogTrigger as-child>
                            <Button>Add vehicle</Button>
                        </DialogTrigger>
                
                        <DialogContent>
                            <DialogTitle>Connect to vehicle</DialogTitle>
                
                            <label>New vehicle ID</label>
                            <Input placeholder="ID"></Input>
                            <div class="flex flex-row gap-2">
                                <Button @click="() => fetchBindedVehicles()"> Send request </Button>
                                <Button variant="outline"> Cancel </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div class="text-xs">Vehicle list</div>
            </div>


            <Button variant="link" @click="manager.Logout()">Logout</Button>

        </div>



        <Map />

    </div>
</template>

<script setup lang="ts">

    import Map from '@/components/Map.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
import { useManagerStore } from './ManagerPage.vue';
    
    const manager = useManagerStore()



    

    async function fetchBindedVehicles() {
         await fetch( BASE_SRV_URL + '/manager/vehicles' , { method: 'GET', credentials: 'include' }) 
    }


</script>