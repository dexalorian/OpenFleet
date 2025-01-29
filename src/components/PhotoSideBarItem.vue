
<script setup lang="ts">
import { nextTick } from 'vue';
import { onUpdated } from 'vue';
import { onMounted } from 'vue';
import { defineProps, defineExpose, ref } from 'vue';
const props = defineProps({imgsrc: String, photoID: String})
const emit = defineEmits(['mounted'])

defineExpose({props} )


</script>

<template>
    <div class="bg-white flex items-start relative "> 
        <div class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center absolute -top-3 left-4" >
            <ion-icon name="close"  style="color: aliceblue;"></ion-icon>
        </div>
        <img @load="() => emit('mounted') " :src="imgsrc" alt="No image" ref="imgTile" class="flex min-w-16 max-w-32" >
    </div>

</template>


