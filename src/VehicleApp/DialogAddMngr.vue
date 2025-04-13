<template>

    <Dialog v-model:open="showDialog" @update:open="">

        <DialogTrigger as-child>
                <Button>Add mаnager</Button>
        </DialogTrigger>
    
        <DialogContent>
                <DialogTitle>
            Invite manager
        </DialogTitle>
     
             <Input v-model="mngID"  placeholder="Manger ID" />
             <div class="flex flex-row gap-1">
                 <Button @click = "async () => { await bindManager(mngID); vehicle.getManagers() }" > Add </Button>
                 <Button @click = "() => showDialog = false"> Close </Button>
             </div>
        </DialogContent>

    </Dialog>

</template>

<script lang="ts" setup>

import Button from "@/components/ui/button/Button.vue";
import  { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import Input from "@/components/ui/input/Input.vue";
import { bindManager } from "@/services";
import { ref } from "vue"
import { useVehicleStore } from "./Index.vue";

const vehicle = useVehicleStore()

const showDialog = ref(false)
const mngID = ref('')

</script>