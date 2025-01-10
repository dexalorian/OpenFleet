<script setup>
import { onMounted } from 'vue'

defineProps({lat: Number, lng: Number, cb: Function })


onMounted( e => console.log('MapPoint mounted')
)

</script>


<template>

 <!-- <div @click="cb()" style="background-color: blue; width: 100px; height: 100px; z-index: 999;">Kek</div> -->

</template>