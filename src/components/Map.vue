<script setup>
import { useTemplateRef } from 'vue';
import { onMounted } from 'vue';
import leaflet, { icon } from "leaflet"
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import { watchEffect, watch } from 'vue';
import { computed } from 'vue';
import { toRaw } from 'vue';
import { storeToRefs } from 'pinia';

let pinicon_active = leaflet.divIcon({html: '<div class="pinicon_active"/>', iconSize: [0, 0]})

const myPhotos = useMyPhotos()
const selectedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()

let newPnt = null;
let line  = {};

function putPhotosOnMap(mapcluster) {
  // console.log(filenames.photos)
  
  myPhotos.photos.forEach(  
      (e, i) => {
       const lenghtofext =  e.split('.')
      const coords  =  e.slice(0, e.length - lenghtofext[3].length-1).split(',')
            let marker = leaflet.marker( { lat: coords[0], lng: coords[1]}, {icon: pinicon_active, draggable: true} )
            mapcluster.addLayer(marker)
      }
  )
}

onMounted(() => {

  const map = leaflet.map('map').setView([52.10566083970132, 23.681348459029937], 15);

    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
  map.zoomControl.setPosition('topright');
  
  map.on('contextmenu', (e) => { selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng } )
  map.on('zoomend', e =>  console.log( map.getZoom()))
  map.on('move', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]}  )
  map.on('zoom', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]})
  map.on('zoomstart', (e) =>  {ptrLineCoords.to = [0, 0]})
  map.on('resize', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]}  )

const clusters = leaflet.markerClusterGroup({maxClusterRadius: 50, disableClusteringAtZoom: 15, animate: false})
map.addLayer(clusters)


watch(selectedGeoPnt, addTmpMapPnt )

watch( myPhotos.photos, () => {clusters.clearLayers(); putPhotosOnMap(clusters ); console.log('redraw triggered');  } )

putPhotosOnMap(clusters)

function addTmpMapPnt() {

  if (newPnt) {
    // clusters.removeLayer(newPnt)
  
    clusters.removeLayer(newPnt)
    console.log('marker removed')
    newPnt = null
    
  }

    let marker = leaflet.marker( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng}, {icon: pinicon_active, draggable: true} )
    line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } )
      ptrLineCoords.to = [line.x, line.y]
     clusters.addLayer(marker)
     newPnt = marker
     console.log(marker)

}


})




</script>


<template>

    <div style="display: flex; flex-direction: column; width: 100%; height: 100vh;  border-color: brown; border-width: 5px;">
            <slot > 

            </slot>
    </div>

</template>


<style>



.pinicon_active {
  width: 16px;
  height: 16px;
  background-color: blue;
  border-radius: 50%;
}

.pinicon_active:hover {
  background-color: brown;
}

</style>