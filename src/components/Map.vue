<script lang="ts">
import leaflet, { Circle, icon, LatLng, latLng, Point, type LeafletEvent } from "leaflet"
// import { useSelGeoPnt, usePtrLineCoords} from '@/main'

import { useVehicleStore } from '@/VehicleApp/Index.vue';
import { watch } from "vue";
import { use } from 'echarts';

let map: leaflet.Map ;



export function setViewCenter(lat: number, lng: number, zoom?: number) {
    map.setView([ lat, lng ])
    zoom ? map.setZoom(zoom) : null

  } 
  
export async function createMapMarker(LatLng: LatLng, type: 'car' | 'gasstation' | 'base'): leaflet.Marker {
let icon_html = 
    '<div class="car_wrapper"> <div class="caricon"></div><div class="probe_flash"></div> </div>';
let icon_html_disabled = 
    '<div class="car_wrapper"> <div class="caricon_disabled"></div> </div> </div>';
    
      let carIcon = leaflet.divIcon({ html: icon_html, iconSize: [24, 24], 
      className: 'dummy',
      iconSize: [32, 32], // Adjust size as needed
        })

      let newMarker = leaflet.marker(LatLng, {icon: carIcon, draggable: false} );
 
      newMarker.ActiveIcon =  leaflet.divIcon({ html: icon_html, iconSize: [24, 24], 
      className: 'dummy',
      iconSize: [32, 32], // Adjust size as needed
        })

        newMarker.DisabledIcon =  leaflet.divIcon({ html: icon_html_disabled, iconSize: [24, 24], 
      className: 'dummy',
      iconSize: [32, 32], // Adjust size as needed
        })

        newMarker.setIcon(newMarker.DisabledIcon )

      newMarker.addTo(map);

      return newMarker;


}

export function removeMapTrail(polyline: leaflet.Polyline): leaflet.Polygon {
  polyline.remove()
  
}

export function addMapTrail(polyline: leaflet.Polyline): leaflet.Polygon {

  polyline.addTo(map)

}

export function createMapTrail(pointArray: LatLng[]): leaflet.Polyline {
  console.log('new tail', pointArray)
  let newTrail = new leaflet.Polyline( pointArray, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1,
    lineJoin: 'round'
  })

  const originalAddLatLng = newTrail.addLatLng;
  newTrail.addLatLng = function (latlng) {
  this.fire('pointadded', { latlng });
  console.log('point added to trail')
  return originalAddLatLng.call(this, latlng);
};


newTrail.addTo(map)
  return newTrail
}

</script>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useOptionsStore } from '@/VehicleApp/Index.vue';
  const options = useOptionsStore()
  const props = defineProps(['geobtn'])

      onMounted(() => {
        const vehicle = useVehicleStore();
        map = leaflet.map('map', {
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
      map.on('zoomend', e => localStorage.setItem('zoom', map.getZoom()));
      map.on('moveend', e => localStorage.setItem('mapframecoords', map.getCenter().lat+'+'+map.getCenter().lng));
      
      const mapNavBtn = leaflet.Control.extend( { 
        onAdd: (e) => {
            let btn = leaflet.DomUtil.create('button', 'nav-button');
            btn.onclick = () => setViewCenter(vehicle.currentGeo.lat, vehicle.currentGeo.lng );
           
            btn.textContent = 'Darkcake'
            btn.innerHTML = '<ion-icon name="navigate"></ion-icon>'
            return btn
        }
      } )

       props.geobtn ? new mapNavBtn({ position: 'bottomright'}).addTo(map) : null

     
    })


    // watch( () => options.common.show_trail, (e) => e ? map.removeLayer(Own) );

</script>

<template>
  <!-- <LineFrame class="z-20" :lines="lines" /> -->
  <div class="flex w-full h-full z-0" id="map"></div>

</template>


<style>

/* .rotate {
  position: absolute;
  transform: rotate(30deg);
} */

.nav-button {

    border: 2px solid #9f9f9f;
    background-color: #ffffff;
    color: black;
    cursor: pointer;
    border-radius: 4px;
    font-size: large;

    align-items: center;
    justify-content: center;
    display: flex;
    width: 34px;
    height: 34px;
}

.caricon {
    @apply w-fit z-10;
    background-image: url('/src/assets/caricon_yellow.png');
    position: absolute;
    /* transform: rotate(158deg); */
    background-position: 0% 0%;
    background-size: 12px;
    background-repeat: no-repeat;
    filter: 
        drop-shadow( 1px  0px 0px rgb(12, 16, 44)) 
        drop-shadow(-1px  0px 0px rgb(12, 16, 44))
        drop-shadow( 0px  1px 0px rgb(12, 16, 44)) 
        drop-shadow( 0px -1px 0px rgb(12, 16, 44))
        drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
    width: 14px;
    height: 24px;
}

.caricon_disabled {
    background-image: url('/src/assets/caricon_yellow.png');
    position: absolute;
    /* border: 1px black solid; */
    /* transform: rotate(158deg); */
    background-position: 0% 20%;
    background-size: 14px;
    background-repeat: no-repeat;

    filter: 
        saturate(0%)
        drop-shadow( 1px  0px 0px rgb(12, 16, 44)) 
        drop-shadow(-1px  0px 0px rgb(12, 16, 44))
        drop-shadow( 0px  1px 0px rgb(12, 16, 44)) 
        drop-shadow( 0px -1px 0px rgb(12, 16, 44))
        drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
    width: 24px;
    height: 36px;
    display: flex;
}

.car_wrapper {
  @apply justify-center items-center content-center flex ;
}


@keyframes ping {
  45%, 100% {
    transform: scale(3);
    opacity: 0;
  }
}

.probe_flash {
    @reference flex bg-green-400 rounded-full z-0;
    width: 24px;
    height: 24px;

  /* animation-delay: 5s; */
  animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
    
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