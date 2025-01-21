<script setup>
import { nextTick } from "vue";
import PhotoSideBarItem from "./components/PhotoSideBarItem.vue"

import { useMyPhotos } from "./main";
import { useTemplateRef, onMounted } from "vue"
import { watch } from "vue";

const myPhotos = useMyPhotos()
const botbar = useTemplateRef('bottombar');

watch( () => myPhotos.photos,  () => {
      console.log('photos changed ', myPhotos.photos)
    
      nextTick(
            () => {
                  
                  if (botbar.value) {
                  botbar.value.scrollLeft = botbar.value.scrollWidth
            }

            }) 
})

</script>


<template>
        <div ref="bottombar" style="background-color: white; height: 140px; display: flex; flex-direction: row; 
            gap: 6px; overflow-y: hidden; overflow-x: auto; width: 100vw;">
        <div  v-for="i in myPhotos.photos" :key="i">
              <PhotoSideBarItem v-if="i.filename"  :imgsrc="`http://localhost:3000/photo/${i.filename}`"/>
        </div>

        </div>

</template>