<script setup lang="ts">
import { nextTick } from 'vue';
import { watchEffect, watch } from 'vue';
import { onUpdated } from 'vue';
import { onMounted } from 'vue';
import { defineProps, defineExpose, ref } from 'vue';
import { useVideoConnections } from '@/main';
const props = defineProps({imgsrc: String, photoID: String})
const emit = defineEmits(['mounted'])

const tileCoords = ref([])
const btn_remove: HTMLElement = ref(null)
const imgTile = ref(null)
const vid = ref(null)

const videoConns = useVideoConnections()

// watchEffect( tileCoords.value )
// onMounted(
//   () => { console.log('top', btn_remove.value.getBoundingClientRect().x)}
// )


function setRemoteBtnPos() {
  btn_remove.value.style.display = 'flex' 
  btn_remove.value.style.top = imgTile.value.getBoundingClientRect().y - 10 + 'px'
  btn_remove.value.style.left = imgTile.value.getBoundingClientRect().right - 20 + 'px'
}

function hideRemoteBtn() {
  btn_remove.value.style.display = 'none' 
}

watch( () =>  videoConns.connections.value , () => { console.log('MediaStream ', videoConns.connections.value.track ); vid.value.srcObject = new MediaStream( [videoConns.connections?.value.track] ) } )

let mstream;

const iceServers = [
  {
    urls: 'stun:stun.l.google.com:19302'  // Correct format with 'stun://' protocol
  }
];

// onMounted(
//     async () => { 
//        mstream = await navigator.mediaDevices.getUserMedia({video: true}) 
//        console.log( mstream.getTracks() )
//         imgTile.value.srcObject = mstream
//         let peerconn = new RTCPeerConnection({iceServers})
//         peerconn.addTrack(mstream.getTracks()[0])
//         peerconn.onconnectionstatechange = (e) => console.log(e)
//         peerconn.onicecandidate = (e) => console.log('ice candid ',e)
//         let offer = await peerconn.createOffer()
//         peerconn.setLocalDescription(offer)
  
//     }
// )


// const kek = [{connID: '', peercon: RTCPeerConnection}]

defineExpose({props , setRemoteBtnPos, hideRemoteBtn, imgTile} )

</script>

<template>
      <div class="flex relative" @mousemove="setRemoteBtnPos()" @mouseover=""  @mouseleave="hideRemoteBtn()">
        <div id="btn_remove"  ref="btn_remove" class="w-6 h-6 rounded-full bg-slate-700 flex items-center fixed -top-4 justify-center z-50" >
          <ion-icon name="close"  style="color: aliceblue;"></ion-icon>
         </div>
         <video autoplay  @load="() => emit('mounted')" ref="vid" class="flex max-w-36 max-h-40"></video>
         <!-- <img @load="() => emit('mounted') " alt="No image" ref="imgTile" class=" flex max-w-36 max-h-40"> -->
        </div>   
</template>


