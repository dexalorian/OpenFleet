<script setup lang="ts">
import { nextTick } from "vue";
import PhotoSideBarItem from "./components/VideoBarItem.vue"

// import { useVehicles } from "./main";
import { useTemplateRef, onMounted } from "vue"
import { watch } from "vue";
import { inject, toRaw } from "vue";
import { onUpdated } from "vue";
import VideoSideBarItem from "./components/VideoSideBarItem.vue";

// const Vehicles = useVehicles()
const botbar = useTemplateRef('bottombar')

const emit = defineEmits(['scroll'])

// watch( () => Vehicles.vehicles,  () => {
//       console.log('photos changed ')
    
//       nextTick(
            
//             () => {
//                   console.log('scroll ', botbar.value.scrollWidth )
//                   if (botbar.value) {
//                   botbar.value.scrollLeft = botbar.value.scrollWidth  
//                   GetThumbsXY()
                  
//             }
//             }) 
            
// })


const Thumbs = inject('Thumbs')

onUpdated( () => 
nextTick( 
 () => {GetThumbsXY()}
)
)


function GetThumbsXY() {
      
      // ThumbsRectBuffer.value?.forEach( (e, i) => {   e.screenXY = e.$el.getBoundingClientRect(); this[i] = e  })
      let buf
      buf =  Thumbs.value?.map( (e, i, arr) => {  e.screenXY = e.$el.getBoundingClientRect() ; return e })
      // console.log( 'hfdksjahlkj;',  buf[0].screenXY)
      Thumbs.value = buf
      Thumbs.value.forEach( (e) => e.hideRemoteBtn())
      
}     


      // console.log('PhotoSide ', ThumbsRectBuffer)

// botbar.value.$el.on




// console.log('ref ', PhotoThumbRef.value)
</script>


<template>

      <div ref="bottombar" @scroll="(e) => { GetThumbsXY(); }"  class=" flex flex-row w-full  overflow-y-hidden overflow-x-auto bg-lime-600">


            <VideoSideBarItem  class="bg-red-700"></VideoSideBarItem>
            <div v-for="i in myPhotos.photos" :key="i" class=" flex-row bg-lime-600 border-gray-950">
                  
                  <PhotoSideBarItem  @mounted="() => GetThumbsXY()" ref="Thumbs" class="flex z-50"
                          :photoID = "i.id" :key="i" :imgsrc="`http://localhost:3000/photo/${i.filename}`"/>                 
                  
            </div>


            
      
      </div>

</template>