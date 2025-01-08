<script setup>

import { onMounted } from 'vue';

import Map from './components/Map.vue';
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import LineFrame from './LineFrame.vue';
import PhotoSideBar from './PhotoSideBar.vue';
import MapPoint from './components/MapPoint.vue';

// const pickedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()
// const MyPhotos = useMyPhotos()

// onMounted(    
//   () =>  {
//         // await MyPhotos.fetchPhotos()
//         MyPhotos.fetchPhotos()
//         // console.log(await MyPhotos.fetchPhotos())
//         console.log(  MyPhotos.photos )
//         console.log(  'dfdfd')
//       // data.forEach( (e) => MyPhotos.addPhoto(e) )
//       }
//  )


onMounted(    
  () =>  {
        console.log('dfdfd')
      // data.forEach( (e) => MyPhotos.addPhoto(e) )
      }
 )

</script>

<template>
    <div style="display: flex; flex-direction: column; height: 100vh; ">
                  <!-- {{ map }} -->
                  <div class="map" style="display: flex; width: 100vw; height: 100vh;" id="map">
          
          <LineFrame :from="ptrLineCoords.from" :to="ptrLineCoords.to" />
              <Map>
                <MapPoint  lat=45.3343433 lng=23.2323232 @click= "() =>  {console.log('kek2')}"  />
                  <MapPoint  lat=45.3343433 lng=23.2323232 @click= "() =>  {console.log('kek2')}"  />
                    <MapPoint  lat=45.3343433 lng=23.2323232 @click= "() =>  {console.log('kek2')}"  />

        
                <!-- <div>odjfljdl;f</div>
                 <div>7890-</div>
                 <div>dflkjhlksdhflk</div>
                 <GeoPinPicker :lat="pickedGeoPnt.lat" :lng="pickedGeoPnt.lng"  /> -->
           
              </Map>
        </div>

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
