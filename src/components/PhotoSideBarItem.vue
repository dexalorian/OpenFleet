
<script setup>
import { defineProps } from 'vue';
defineProps({imgsrc: String})

</script>

<template>
    <div style="background-color: whitesmoke; min-width: 120px;  
    display: flex; justify-content: center;  align-items: center;">
        <img :src="imgsrc" alt="No image" style="max-width: 100px;">
    </div>

</template>


