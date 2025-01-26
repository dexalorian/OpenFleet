
<script setup lang="ts">
import { defineProps } from 'vue';
defineProps({imgsrc: String})



</script>

<template>
    <div class="bg-white w-fit flex content-center items-center">
        <img :src="imgsrc" alt="No image" class="max-w-40">
    </div>

</template>


