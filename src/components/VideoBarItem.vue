<script setup lang="ts">
import { nextTick } from 'vue';
import { watchEffect } from 'vue';
import { onUpdated } from 'vue';
import { onMounted } from 'vue';
import { defineProps, defineExpose, ref } from 'vue';
const props = defineProps({imgsrc: String, photoID: String})
const emit = defineEmits(['mounted'])

const tileCoords = ref([])
const btn_remove: HTMLElement = ref(null)
const imgTile: HTMLElement = ref(null)

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


defineExpose({props , setRemoteBtnPos, hideRemoteBtn} )

</script>

<template>
      <div class="flex relative" @mousemove="setRemoteBtnPos()" @mouseover=""  @mouseleave="hideRemoteBtn()">
        <div id="btn_remove"  ref="btn_remove" class="w-6 h-6 rounded-full bg-slate-700 flex items-center fixed -top-4 justify-center z-50" >
          <ion-icon name="close"  style="color: aliceblue;"></ion-icon>
         </div>
         <img @load="() => emit('mounted') " :src="imgsrc" alt="No image" ref="imgTile" class=" flex max-w-36 max-h-40">
        
        </div>   
      
       


</template>


