<script setup lang="ts">
import { inject, onMounted, defineModel, toRaw } from 'vue';
import leaflet, { icon, latLng, Point } from "leaflet"
import { useSelGeoPnt, usePtrLineCoords, useMyPhotos } from '@/main'
import { watchEffect, watch } from 'vue';
import { useSlots, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue';
import LineFrame from '@/LineFrame.vue';
import type { VNodeRef } from 'vue';

const route = useRoute()

let map: leaflet.Map ;

const props = defineProps({
  points: {
    type: Array
  },
  thumbs: {type: Array<any> }
})


let pointsBuffer = ref(null)

watchEffect( () => pointsBuffer.value = props.points )


let pinicon_active = leaflet.divIcon({html: '<div class="pinicon_active"/>', iconSize: [0, 0]})

const selectedGeoPnt = useSelGeoPnt()
const ptrLineCoords = usePtrLineCoords()

let newPnt = ref({});
let line = {};
let lines = ref([])



function putPhotosOnMap(mapcluster) {
  pointsBuffer.value.forEach(
    e => { 
      let newBuffer;
      if (e.lat) {
      const marker: leaflet.Marker = leaflet.marker( { lat: e.lat, lng: e.lng}, {draggable: true} ); 
      marker.on('click', (e) => { e.id='fdfdf'; console.log(e) })
      marker.on('drag', e => {
        newBuffer =  pointsBuffer.value.map( k => k.id === e.target.id ? k = { ... k, ... e.latlng, cha: 'yes'} : {... k} )
        console.log(' newBuffer ', newBuffer)
        // pointsBuffer.value = newBuffer
        lines.value = ThumbsPointsMerge( fetchAllPointsXY(newBuffer), props.thumbs )  

      })
      marker.on('dragend', () => pointsBuffer.value = newBuffer )
      marker.id = e.id
      mapcluster.addLayer(marker)
      } })}

function fetchAllPointsXY(geopoints: Array<any>): any {
  // let kek = geopoints.map( (e) => { map.latLngToContainerPoint({lat: e.lat, lng: e.lng}) })
  let pointsXY = geopoints.map( (e) => { 
    let cords = map.latLngToContainerPoint(e); let obj = { id: e.id, ... cords  }; return obj })
  return pointsXY
}

function ThumbsPointsMerge( points: Array, thumbs: Array ): Array<any> {
  // console.log(' merge ', thumbs.v)
  let map = points.map( (e) => ( { id: e.id , pointXY: [e.x, e.y],  thumbXY: (() => { let tmp = thumbs.filter( k => k.props.photoID === e.id )[0]; return [tmp.screenXY.x, tmp.screenXY.y ] } 
  
  
  )() }  ) )
  
  return map
}


watch( () => props.thumbs , () => {lines.value = 
  ThumbsPointsMerge( fetchAllPointsXY(pointsBuffer.value), props.thumbs ) } )


function fetchThumbXY(id: string): Point {
   let pointXY: Array<Point> = props.thumbs?.filter( e => {
     e.$el.photoID === id 
   })
   return pointXY
}


function fetchAllThumbsXY(): Array<Point> {
   let pointXY: Array<Point>  = props.thumbs
    console.log('Passed props ', props.thumbs)
   return pointXY
}




onMounted(() => {


  map = leaflet.map('map',{
    center: [0, 0], // Initial center
    zoom: 2,
    minZoom: 2,        // Initial zoom
    worldCopyJump: false, // Prevents map duplication when panning
    maxBounds: [
        [-85, -180], // Southwest corner
        [85, 180]    // Northeast corner
    ],
    maxBoundsViscosity: 1.0  // Strictly enforces bounds
})  
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
  map.on('move', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng } ); ptrLineCoords.to = [line.x, line.y]; lines.value = 
    ThumbsPointsMerge( fetchAllPointsXY(pointsBuffer.value), props.thumbs )  }  )
map.on('moveend', e => localStorage.setItem('mapframecoords', map.getCenter().lat+'+'+map.getCenter().lng))
  map.on('zoom', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
    lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]; })
  map.on('zoomstart', (e) =>  {ptrLineCoords.to = [0, 0]})
  map.on('resize', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
    lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]}  )

    lines.value = ThumbsPointsMerge( fetchAllPointsXY(pointsBuffer.value), props.thumbs ) 
    const clusters = leaflet.markerClusterGroup({maxClusterRadius: 50, 
      disableClusteringAtZoom: 15, animate: false})
      
    map.addLayer(clusters)
    // map.eachLayer(e => console.log('map layer ', e))
    addTmpMapPnt()
    watch(selectedGeoPnt, addTmpMapPnt )
    
    // L.featureGroup([marker1, marker2, polyline])
    // .bindPopup('Hello world!')
    // .on('click', function() { alert('Clicked on a member of the group!'); })
    // .addTo(map);

    

    watchEffect( () => {
      
      clusters.clearLayers()
        console.log('map points watcher', pointsBuffer)
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

 <div style="display: flex; width: 100vw; height: 100vh;">
  <LineFrame class="z-20" :lines="lines" />
  <div ref="mapRef" class="flex w-full h-full z-0" id="map"></div>
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