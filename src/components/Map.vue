<script setup lang="ts">
import { inject, onMounted, defineModel, toRaw } from 'vue';
import leaflet, { icon, latLng, Point, type LeafletEvent } from "leaflet"
import { useSelGeoPnt, usePtrLineCoords} from '@/main'
import { watchEffect, watch } from 'vue';
import { useSlots, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue';


let map: leaflet.Map ;

// const props = defineProps({
//   vehicles: {type: Array},
//   thumbs: {type: Array<any>}
// })

// let pointsBuffer = ref(null)

// watchEffect( () => pointsBuffer.value = props.points )


// let pinicon_active = leaflet.divIcon({html: '<div class="pinicon_active"/>', iconSize: [0, 0]})
// const selectedGeoPnt = useSelGeoPnt()
// const ptrLineCoords = usePtrLineCoords()
// let GeoSelector: leaflet.Marker = ref(null);
// let line = {};
// let lines = ref([])

const BASE_MANAGER_URL = import.meta.env.VITE_BASE_URL


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
  let map = points.map( (e) => (
    { id: e.id , from: [e.x, e.y],  to: (() => { let tmp = thumbs.filter( k => k.props.photoID === e.id )[0]; 
      return [tmp.screenXY.x, tmp.screenXY.y ] 
    } )(), point_visible: true, line_visible: true }  ) )
  
  return map
}


// watch( () => props.thumbs , () => {
//   lines.value = ThumbsPointsMerge( fetchAllPointsXY(pointsBuffer.value), props.thumbs ) 
// })


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

  let carIcon = leaflet.divIcon({ html: '<div class="caricon"></div>', iconSize: [24, 24], 
  className: 'dummy',
  iconSize: [32, 32], // Adjust size as needed
    
   })


   

   
  let layer = leaflet.marker({ lat: '34.23', lng: '44.33' }, {icon: carIcon, draggable: true}  ).addTo(map)
  
    // map.addLayer( layer )

  // map.on('click', () => {
  //  clusters.removeLayer(GeoSelector)
  //  ptrLineCoords.visible = false })
  // map.on('contextmenu', (e) => { ptrLineCoords.visible = true; selectedGeoPnt.visible = true;  selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng; } )
  map.on('zoomend', e => localStorage.setItem('zoom', map.getZoom()))
  // map.on('move', (e) => { 
  //   line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng } ); 
  //   ptrLineCoords.to = [line.x, line.y]; 
  //   lines.value = ThumbsPointsMerge(fetchAllPointsXY(pointsBuffer.value), props.thumbs ) 
  // })

  map.on('moveend', e => localStorage.setItem('mapframecoords', map.getCenter().lat+'+'+map.getCenter().lng))
  // map.on('zoom', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]; })
  // map.on('zoomstart', (e) =>  {ptrLineCoords.to = [0, 0]})
  
  // map.on('resize', (e) =>  {line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, 
  //   lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]} )

    // lines.value = ThumbsPointsMerge( fetchAllPointsXY(pointsBuffer.value), props.thumbs ) 
    // const clusters = leaflet.markerClusterGroup({maxClusterRadius: 50, 
    //   disableClusteringAtZoom: 15, animate: false})
      

      
    // map.addLayer(clusters)
    
    // map.eachLayer(e => console.log('map layer ', e))
   
    // L.featureGroup([marker1, marker2, polyline])
    // .bindPopup('Hello world!')
    // .on('click', function() { alert('Clicked on a member of the group!'); })
    // .addTo(map);
    // watch(pointsBuffer, () => {
      
    //   clusters.clearLayers()
    //     // console.log('map points watcher', pointsBuffer)
    //   putPhotosOnMap(clusters)
    //   // map.eachLayer(e => console.log('map layer ', e))
    //   addGeoSelector()
      
    //     } )
  

function addGeoSelector(): Leaflet.marker {

  if (GeoSelector.value) {
    console.log('selector not added')
    return
  }
    // if (selectedGeoPnt.visible) {
      ptrLineCoords.visible = true; 
      selectedGeoPnt.visible = true; 
      let marker: leaflet.Marker = leaflet.marker( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng}, 
    {icon: pinicon_active, draggable: true} )
    // marker.on('drag', (e) => { selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng;  ptrLineCoords.visible = true; selectedGeoPnt.visible = true;})
    // marker.on('drag', (e) => { ptrLineCoords.visible = true; selectedGeoPnt.visible = true; selectedGeoPnt.lat = e.latlng.lat; selectedGeoPnt.lng = e.latlng.lng;  })
   
    line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng } )
      ptrLineCoords.to = [line.x, line.y]
       marker.on('drag', (e) => { updGeoSelector( e.latlng.lat, e.latlng.lng, true ) })
      
     clusters.addLayer(marker)
     GeoSelector = marker
     console.log('selector added')
    
     return marker

    // }
}
})

// watch( selectedGeoPnt , () => {  GeoSelector.setLatLng( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng});
// line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng  } ); ptrLineCoords.to = [line.x, line.y]; 
      
// } )

function updGeoSelector(lat: Number, lng: Number, visible: true) {
    ptrLineCoords.visible = true; 
    selectedGeoPnt.visible = true; 
    selectedGeoPnt.lat = lat;
    selectedGeoPnt.lng = lng; 
    line = map.latLngToContainerPoint( { lat: selectedGeoPnt.lat, lng: selectedGeoPnt.lng } ); 
    ptrLineCoords.to = [line.x, line.y]; 
}

</script>

<template>

 <div style="display: flex; width: 100vw; height: 100vh;">
  
  <!-- <LineFrame class="z-20" :lines="lines" /> -->
  <div ref="mapRef" class="flex w-full h-full z-0" id="map"></div>
 </div> 


</template>


<style>

/* .rotate {
  position: absolute;
  transform: rotate(30deg);
} */

.caricon {
    background-image: url('/src/assets/caricon_yellow.png');
    position: absolute;
    /* border: 1px black solid; */
    transform: rotate(158deg);
    background-position: 0% 20%;
    background-size: 14px;
    background-repeat: no-repeat;

    filter: 
        drop-shadow( 1px  0px 0px rgb(12, 16, 44)) 
        drop-shadow(-1px  0px 0px rgb(12, 16, 44))
        drop-shadow( 0px  1px 0px rgb(12, 16, 44)) 
        drop-shadow( 0px -1px 0px rgb(12, 16, 44))
        drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
    width: 24px;
    height: 36px;
    display: flex;
}

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