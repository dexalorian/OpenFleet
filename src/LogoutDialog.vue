<script setup lang="ts">
import { Button } from './components/ui/button';
import { DialogContent, Dialog, DialogHeader } from './components/ui/dialog';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue'
import { useUser, useMyPhotos, usePtrLineCoords } from './main';


const userObj = useUser()
const myPhotos = useMyPhotos()

const ptrLineCoords = usePtrLineCoords()

const router = useRouter()

const props = defineProps({ show: Boolean })

const open = ref(false)

watch( () => props.show, () => open.value = props.show )


async function GlobalLogout() {
    await fetch(import.meta.env.VITE_BASE_URL+'/logout', { method: 'POST', credentials: 'include' } )
    ptrLineCoords.visible = true
    userObj.reset()
    
    open.value = false
    myPhotos.fetchPhotos()
    router.push('/')
}


</script>

<template>

    <Dialog v-model:open="open" @update:open="router.push('/')" >
            <DialogContent class="max-w-96">
                <DialogHeader>Are your sure?</DialogHeader>
                <Button @click="GlobalLogout">Logout</Button>
            </DialogContent>
    </Dialog>

</template>

