<script setup>
import { onMounted } from 'vue';
import { useTemplateRef, ref } from 'vue';
import { usePtrLineCoords } from './main';
import { watch } from 'vue';


defineProps( { from: Array, to: Array} )

const ptrLineCoords = usePtrLineCoords()

const canv = ref(null)


let ctx = null;

watch( ptrLineCoords, () => {ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(ptrLineCoords.to[0], ptrLineCoords.to[1]); ctx.stroke();} )

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
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ptrLineCoords.to[0], ptrLineCoords.to[1]);
        console.log('draw call')
        // Draw the Path
        ctx.stroke();
        
    }
  } else {
    console.error('Canvas element is not available');
  }

    }

)
 

</script>


<template>
        <canvas ref="canv" style="display: flex; position: absolute; z-index: 999; background: none; pointer-events: none; border-style: double; " >
        </canvas>
</template>