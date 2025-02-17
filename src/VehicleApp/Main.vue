<template>
        <div class="w-full border h-full flex flex-col">
            {{ 'ID: '+ vehicleObj.vehicle.id }}
            <div class="flex grow-1 justify-center content-center items-center">
                <div class="absolute text-slate-300 flex flex-col justify-center items-center gap-2 ">Video
                    <Button @click="() => console.log('kekkek')">Start translation</Button>
                </div>
                <video ref="videoCnv" autoplay class="border object-fill  bg-slate-500 pointer-events-none" ></video>
            </div>
                <Map class="flex grow-3"></Map>
    </div>
</template>

<script lang="ts" setup>
import Map from '@/components/Map.vue';
import Button from '@/components/ui/button/Button.vue';
import type { VideoHTMLAttributes } from 'vue';
import { onMounted, ref } from 'vue';
import { v4 as uuid } from 'uuid'
import { useVehicleAuth } from './Index.vue';
import { watch } from 'vue';
import { watchEffect } from 'vue';
import { nextTick } from 'vue';
const videoCnv = ref<HTMLVideoElement>()

const vehicleObj = useVehicleAuth()

function makeWsConn() {
    const ws = new WebSocket( import.meta.env.VITE_SRV_WS )
    // console.log(document.cookie.split('ws_vhcl_tkn=')[1])
    // ws.onopen = () => {
    //     ws.send(JSON.stringify({ role: 'vehicle', type: 'handshake', 
    //     tkn: document.cookie.split('ws_vhcl_tkn=')[1], 
    //     id: vehicleObj.vehicle.id }))
    // }
}

watch( () => vehicleObj.vehicle.id, () => makeWsConn(), {once: true}  )


onMounted( async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const peer =  new RTCPeerConnection( { iceServers: [ {urls: 'stun:stun.l.google.com:19302' }] })
    let track = await  stream.getTracks()[0];
    const playstream = new MediaStream()
    playstream.addTrack(track)
    videoCnv.value.srcObject = playstream
    videoCnv.value.onplaying = () => {  videoCnv.value?.requestPictureInPicture() }
    peer.addTrack(track)
    const offer =  await  peer.createOffer()
    peer.setLocalDescription(offer)
    peer.onicecandidate = e => console.log('candidate ', e)
    peer.onicegatheringstatechange = (e) =>    console.log('sdr offer: ', e)
} )

 //POST offer to vehicle record


</script>