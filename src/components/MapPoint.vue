<script setup>

defineProps({lat: Number, lng: Number, cb: Function })


</script>


<template>

 <div @click="cb()" style="background-color: blue; width: 100px; height: 100px; z-index: 999;">Kek</div>

</template>