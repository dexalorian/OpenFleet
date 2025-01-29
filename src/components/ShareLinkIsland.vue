<template>
  
        <div class="px-3 gap-2 text-slate-700 shadow-sm pointer-events-auto 
        w-fit h-12 border-r-8 flex items-center bg-slate-50 w-fit shadow-md text-xs">
        {{ url + '/map?id='+ id }}
        <ion-icon @click="() => console.log('ldkflkdjf')" name="share-outline" style="color: peru ; width: 18px; height: 18px;" />
                
        </div>

</template>

<script setup lang="ts">

import { inject, watch, ref, computed } from 'vue';

const id = inject('sharedmapID')

const url = import.meta.env.VITE_BASE_URL;
// let link = id.value.id + 'd;fojdl;fk;'

</script>