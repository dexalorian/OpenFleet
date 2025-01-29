<script lang="ts" setup>
import { onMounted } from 'vue';
import { useTemplateRef, ref } from 'vue';
import { usePtrLineCoords } from './main';
import { watch } from 'vue';
import { boolean } from 'zod';
import { watchEffect } from 'vue';

type Line = { id: Number, from: Number[], to: Number[], visible: Boolean } 

const props = defineProps( { lines: Array<Line> })
// const ptrLineCoords = usePtrLineCoords()
const canv = ref(null)
let ctx = null;

// watch( () => ptrLineCoords.visible , () => 
//   {ptrLineCoords.visible ? null : ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)})

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
    }
  } else {
    console.error('Canvas element is not available');
  }

  watchEffect(() => {

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  props.lines?.forEach( (e) => {

    if (true) {
      // ctx.moveTo(0,0)
     ctx.beginPath();
    ctx.moveTo(e.pointXY[0], e.pointXY[1]); ctx.lineTo(e.thumbXY[0], e.thumbXY[1]); ctx.stroke();
    } else {
      // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

  })

   
 } )

    }

)
 


</script>

<template>
        <canvas ref="canv" style="display: flex; position: absolute; 
        background: none; pointer-events: none; " >
        </canvas>
</template>