<template>
    <div id="limiter" class="max-w-2xl border flex flex-col h-full">

        <div class="flex w-full relative " >
        <video class="w-full border bg-slate-100 relative"></video>
        <p class="text-slate-600 text-sm text-slate-300 border flex h-full w-full absolute justify-center items-center">No video</p>
    </div>
    <div class="p-2 m-2 gap-4 flex flex-col">
        <p class="text-xs text-wrap flex overflow-scroll w-full h-full"> {{ locdes }}</p> 
        <Label class="text-xs">Insert SDP here</Label>
        <Textarea placeholder="Incoming SDP" v-model="inSdp" class="min-h-60" />
        <Button @click="() => createSDPanswer()">Create SDP answer</Button>
       
    </div>

    </div>


</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Button from './components/ui/button/Button.vue';
import { Textarea } from './components/ui/textarea'
import { ref } from 'vue'
 
let inSdp;
let anw;
const locdes = ref(null)

let track;

onMounted( async ( ) => {
    let streams = await navigator.mediaDevices.getUserMedia({video: true})
    track = await streams.getTracks()[0]
    console.log('tracks ', track)
})


async function createSDPanswer() {
    let peer = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google's STUN server
})
    console.log(inSdp)
    peer.setRemoteDescription( JSON.parse(inSdp))
    peer.addTrack(track)
    anw = await peer.createAnswer()
    peer.setLocalDescription(anw)
    console.log('loc des', anw)
    peer.onconnectionstatechange = e => console.log('conn state: ', e)
    peer.onicegatheringstatechange = e => {

        if (peer.iceGatheringState === "complete") {
            locdes.value = JSON.stringify(peer.localDescription)
            console.log("ice gathering complete")
           } 
        }
       
    }



</script>