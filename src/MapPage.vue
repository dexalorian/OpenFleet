<script setup lang="ts">

import Map from './components/Map.vue';
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import LineFrame from './LineFrame.vue';
import PhotoSideBar from './PhotoSideBar.vue';
import GeoPinPicker from './components/GeoPinPicker.vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { watchEffect, toRaw } from 'vue';
import { provide } from 'vue';
import { useTemplateRef, watch } from 'vue';


const pickedGeoPnt = useSelGeoPnt()

const MyPhotos = useMyPhotos()



const ThumbsRefs = ref([])

provide('Thumbs', ThumbsRefs)


</script>

<template>
    <div style="display: flex; flex-direction: column; height: 100vh; width: 100%;" class="p-0 m-0" >
            <!-- Picker line canvas -->
            
            <!-- Pointers lines canvas -->
          
              <GeoPinPicker ref="" class="z-50" :lat="pickedGeoPnt.lat" :lng="pickedGeoPnt.lng"></GeoPinPicker>
              <Map :thumbs="ThumbsRefs" :points="MyPhotos.photos" class="z-0" />
            <PhotoSideBar/>
    </div>
   
</template>

<style scoped>

@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/inter-Black')
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
