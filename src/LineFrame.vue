<script lang="ts" setup>
import { onMounted } from 'vue';
import { useTemplateRef, ref } from 'vue';
import { usePtrLineCoords } from './main';
import { watch } from 'vue';

const props = defineProps( { from: Array, to: Array, pointVisible: Boolean})
const ptrLineCoords = usePtrLineCoords()
const canv = ref(null)
let ctx = null;

watch( () => ptrLineCoords.visible , () => 
  {ptrLineCoords.visible ? null : ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)})

watch([() => props.from, () => props.to], () => {
  if (ptrLineCoords.visible) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(ptrLineCoords.to[0], ptrLineCoords.to[1]); ctx.stroke();
  }
   
 } )

onMounted(

() => {
    ctx = canv.value.getContext('2d')
    window.addEventListener('resize', (e) => {ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        } )
   
    if (canv.value) {
    if (ctx) {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        if (ptrLineCoords.visible) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ptrLineCoords.to[0], ptrLineCoords.to[1]);
        ctx.stroke();
        }
    }
  } else {
    console.error('Canvas element is not available');
  }

    }

)
 

</script>

<template>
        <canvas ref="canv" class="z-10"  style="display: flex; position: absolute; 
        background: none; pointer-events: none; " >
        </canvas>
</template>