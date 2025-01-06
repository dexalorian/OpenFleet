<script setup>
import PhotoSideBarItem from "./components/PhotoSideBarItem.vue"

import { useMyPhotos } from "./main";

const myPhotos = useMyPhotos()

</script>


<template>

        <div style="background-color: white; z-index: 999; height: 120px; display: flex; flex-direction: row; margin: 10px; gap: 6px; overflow-y: hidden;">
            
        <div v-for="i in myPhotos.photos" :key="i">
            <PhotoSideBarItem  :imgsrc="`http://localhost:3000/photo/${i}`"/>
        </div>

           
       
        </div>

</template>