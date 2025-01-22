<script setup>
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
    userObj.reset()
    await fetch(import.meta.env.VITE_BASE_URL+'/logout', { method: 'POST', credentials: 'include' } )
    myPhotos.fetchPhotos()
    router.push('/')
    open.value = false
    ptrLineCoords.visible = false
    
}


</script>

<template>

    <Dialog v-model:open="open" @update:open="() => router.push('/')">

            <DialogContent class="max-w-96">
                <DialogHeader>Are your sure?</DialogHeader>
                <Button @click="GlobalLogout">Logout</Button>
            </DialogContent>

    </Dialog>

</template>

