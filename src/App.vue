<script setup>

import { onMounted } from 'vue';

import Map from './components/Map.vue';
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import LineFrame from './LineFrame.vue';
import PhotoSideBar from './PhotoSideBar.vue';
import MapPoint from './components/MapPoint.vue';
import GeoPinPicker from './components/GeoPinPicker.vue';
import MainUserMenu from './components/MainUserMenu.vue'

const pickedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()
const MyPhotos = useMyPhotos()

onMounted(    
  async  () =>  {
        // await MyPhotos.fetchPhotos()
        await MyPhotos.fetchPhotos()
        // console.log(await MyPhotos.fetchPhotos())

      // data.forEach( (e) => MyPhotos.addPhoto(e) )
      }
 )


</script>

<template>
    <div style="display: flex; flex-direction: column; height: 100vh; width: 100%; overflow: hidden;">
                  <!-- {{ map }} -->
                    <MainUserMenu />
                 
                    <LineFrame :from="ptrLineCoords.from" :to="ptrLineCoords.to" />
                    <GeoPinPicker :lat="pickedGeoPnt.lat" :lng="pickedGeoPnt.lng" ></GeoPinPicker>
              <Map>

<!--                
                  <MapPoint :lat=52.03214283467665 :lng=23.876037597656254  />
                  <MapPoint :lat=52.119354046379925 :lng=23.69387017880704  />
                  <MapPoint :lat=52.1006000630478 :lng=23.716388602280972  /> -->

                  <MapPoint v-for="pnt in MyPhotos.photos" ></MapPoint>
                
 
           
              </Map>
       

        <PhotoSideBar></PhotoSideBar>
    </div>
   
</template>

<style scoped>
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
