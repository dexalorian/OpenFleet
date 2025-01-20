<script setup>
import { useTemplateRef } from 'vue';
import { onMounted } from 'vue';
import leaflet, { icon } from "leaflet"
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import { watchEffect, watch } from 'vue';
import { useSlots, ref } from 'vue';


import { useRoute } from 'vue-router'

const route = useRoute()



let pinicon_active = leaflet.divIcon({html: '<div class="pinicon_active"/>', iconSize: [0, 0]})

const myPhotos = useMyPhotos()
const selectedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()

let newPnt = null;
let line  = {};
const el_slots = ref([])

function putPhotosOnMap(mapcluster) {
  console.log('put photos on map 1 ', myPhotos.photos)
  myPhotos.photos.forEach(
    e => { 
      if (e.lat) {
        console.log('try add to map')
      const marker = leaflet.marker( { lat: e.lat, lng: e.lng  }, {draggable: true} ); 
      mapcluster.addLayer(marker)
      }
     
    }
  )
}

onMounted(() => {
 
  el_slots.value = useSlots().default()
  const map = leaflet.map('map')
  localStorage.getItem('mapframecoords') ? map.setView(localStorage.getItem('mapframecoords').split('+'), localStorage.getItem('zoom')) : map.setView({lat: 52.104326, lng: 23.707570}, 15);
  leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  map.zoomControl.setPosition('bottomright');
  map.on('contextmenu', (e) => { selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng } )
  map.on('zoomend', e => localStorage.setItem('zoom', map.getZoom()))
  map.on('move', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y];
}  )
map.on('moveend', e => localStorage.setItem('mapframecoords', map.getCenter().lat+'+'+map.getCenter().lng))
  map.on('zoom', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]})
  map.on('zoomstart', (e) =>  {ptrLineCoords.to = [0, 0]})
  map.on('resize', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]}  )

    const clusters = leaflet.markerClusterGroup({maxClusterRadius: 50, disableClusteringAtZoom: 15, animate: false})
    map.addLayer(clusters)

    watch(selectedGeoPnt, addTmpMapPnt )
    watch( () => myPhotos.photos , () => {console.log('redraw triggered'); clusters.clearLayers(); putPhotosOnMap(clusters);  } )

    putPhotosOnMap(clusters)

    el_slots.value.forEach( e => {
      if (e.props) {
       const marker = leaflet.marker( { lat: e.props?.lat, lng: e.props?.lng  }, {draggable: true} ); 
      clusters.addLayer(marker)
     }
  })

function addTmpMapPnt() {
  if (newPnt) {
    // clusters.removeLayer(newPnt)
    clusters.removeLayer(newPnt)
    console.log('marker removed')
    newPnt = null
  }

    let marker = leaflet.marker( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng}, 
    {icon: pinicon_active, draggable: true} )
    line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } )
      ptrLineCoords.to = [line.x, line.y]
     clusters.addLayer(marker)
     newPnt = marker
}

console.log('myPhotos.photos', myPhotos)


})


</script>

<template>

<div class="map"  style="display: flex; width: 100vw; height: 100vh;" id="map">

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