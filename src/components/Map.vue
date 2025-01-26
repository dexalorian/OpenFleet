<script setup lang="ts">
import { inject, onMounted } from 'vue';
import leaflet, { icon } from "leaflet"
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import { watchEffect, watch } from 'vue';
import { useSlots, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue';

const route = useRoute()

const props = defineProps({
  mapPoints: {
    type: Array
  }
})

let pinicon_active = leaflet.divIcon({html: '<div class="pinicon_active"/>', iconSize: [0, 0]})

const selectedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()

let newPnt = ref({});
let line = {};

function putPhotosOnMap(mapcluster) {
  mapcluster.cle
  props.mapPoints.forEach(
    e => { 
      if (e.lat) {
      const marker = leaflet.marker( { lat: e.lat, lng: e.lng  }, {draggable: true} ); 
      mapcluster.addLayer(marker)
      }
    }
  )
}



onMounted(() => {
  
  const map = leaflet.map('map')  
  localStorage.getItem('mapframecoords') ? map.setView(localStorage.getItem('mapframecoords').split('+'), 
  localStorage.getItem('zoom')) : map.setView({lat: 52.104326, lng: 23.707570}, 15);
  leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  map.zoomControl.setPosition('bottomright');
  map.on('click', () => {
   clusters.removeLayer(newPnt)
   ptrLineCoords.visible = false
    
  })
  map.on('contextmenu', (e) => { ptrLineCoords.visible = true; selectedGeoPnt.visible = true; selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng; } )
  map.on('zoomend', e => localStorage.setItem('zoom', map.getZoom()))
  map.on('move', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
    lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y];
}  )
map.on('moveend', e => localStorage.setItem('mapframecoords', map.getCenter().lat+'+'+map.getCenter().lng))
  map.on('zoom', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
    lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]})
  map.on('zoomstart', (e) =>  {ptrLineCoords.to = [0, 0]})
  map.on('resize', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
    lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]}  )

    const clusters = leaflet.markerClusterGroup({maxClusterRadius: 50, 
      disableClusteringAtZoom: 15, animate: false})
      
    map.addLayer(clusters)
    // map.eachLayer(e => console.log('map layer ', e))
    addTmpMapPnt()
    watch(  selectedGeoPnt, addTmpMapPnt )
  


    // L.featureGroup([marker1, marker2, polyline])
    // .bindPopup('Hello world!')
    // .on('click', function() { alert('Clicked on a member of the group!'); })
    // .addTo(map);

    // putPhotosOnMap(clusters)

    watch( () => props.mapPoints , () => {
      clusters.clearLayers()
        console.log('map points watcher', props.mapPoints)
      putPhotosOnMap(clusters)
      // map.eachLayer(e => console.log('map layer ', e))
      addTmpMapPnt()
        } )
  

function addTmpMapPnt() {
    if (newPnt) {
     clusters.removeLayer(newPnt)
     newPnt = null
    }
    if (selectedGeoPnt.visible) {

      let marker = leaflet.marker( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng}, 
    {icon: pinicon_active, draggable: true} )
    line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } )
      ptrLineCoords.to = [line.x, line.y]
     clusters.addLayer(marker)
     newPnt = marker

    }
  

}





})


</script>

<template>

<div class="map" ref="mapRef" style="display: flex; width: 100vw; height: 100vh;" id="map">

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