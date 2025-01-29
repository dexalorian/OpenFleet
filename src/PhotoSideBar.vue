<script setup lang="ts">
import { nextTick } from "vue";
import PhotoSideBarItem from "./components/PhotoSideBarItem.vue"

import { useMyPhotos } from "./main";
import { useTemplateRef, onMounted } from "vue"
import { watch } from "vue";
import { provide, ref } from "vue";
import Photo from "./components/Photo.vue";
import { watchEffect } from "vue";
import { inject, toRaw } from "vue";
import { onUpdated } from "vue";

const myPhotos = useMyPhotos()
const botbar = useTemplateRef('bottombar')

// botbar.value.on

const emit = defineEmits(['scroll'])

watch( () => myPhotos.photos,  () => {
      console.log('photos changed ', myPhotos.photos)
    
      nextTick(
            
            () => {
           

                  console.log('scroll ',botbar.value.scrollWidth )
                  
                  if (botbar.value) {
                  botbar.value.scrollLeft = botbar.value.scrollWidth  
                  GetThumbsXY()
                  
            }
            }) 
            

            
            
})

onMounted( () => {
      console.log('before nextick')
      nextTick(
            () => {
                  console.log('before getThumbs')
                  GetThumbsXY()
                  console.log('after getThumbs')
            }
      )
      
})



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
      console.log(' photoSidebar size ', botbar.value?.clientWidth)
}
      // console.log('PhotoSide ', ThumbsRectBuffer)

// botbar.value.$el.on


// console.log('ref ', PhotoThumbRef.value)
</script>


<template>
        <div ref="bottombar" @scroll="(e) => GetThumbsXY()"  class="bg-white h-36 flex  flex-row gap-2 overflow-x-scroll overflow-y-clip  relative w-auto ">
    

              <PhotoSideBarItem @mounted="() => GetThumbsXY()" v-for="i in myPhotos.photos" ref="Thumbs" class="flex relative" 
                  :photoID = "i.id" :key="i" :imgsrc="`http://localhost:3000/photo/${i.filename}`"/>
        </div>



</template>