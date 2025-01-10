<script setup lang="ts">
    const props = defineProps({  lat: Number, lng: Number })

    import { log } from "console";
    import { ref, watchEffect, watch } from "vue";
    import { useMyPhotos } from "../main";
    import { title } from "process";

    const MyPhotos = useMyPhotos()
    const selfile = ref(null);  
    const params = ref({})
    const imgUri: Url = ref(null)

    watchEffect( () => {selfile.value  !== null ? imgUri.value  =  URL.createObjectURL(selfile.value) :  null; console.log(selfile.value)}) 

    const newPhoto = async () => {
        const sendreq = new FormData( )
        sendreq.append('file', selfile.value)
        sendreq.append('coords', JSON.stringify({lat: props.lat, lng: props.lng}))
        console.log(JSON.stringify(params.value))
        sendreq.append('params',  JSON.stringify(params.value))

    fetch(import.meta.env.VITE_BASE_URL + '/upload',  {
        method: 'POST',
        body: sendreq
    }).then(() => MyPhotos.fetchPhotos())
    
    

    
    


    
    // MyPhotos.addPhoto(`${props.lat},${props.lng}.`+selfile.value.name.split('.').at(-1))
    }

</script>

<template >
    <div class="form">
        <h1 style="margin: 0; padding: 0;">Upload photo</h1>
    
        <div style="display: flex; gap: 10px; width: fit-content;">
            <img :src=" imgUri " style="background-color: blueviolet; width: 200px; "/></div>

        <form  @submit.prevent="newPhoto" enctype="multipart/form-data" 
        style="display: flex; width: 100%; flex-direction: column; gap: 10px">

            <input type="file" @change=" e => {selfile  =  e.target.files[0]} " />

            <div style="display: flex; gap: 3px; width: fit-content;">
                <input type="number" style="display: flex; width: 100%;" placeholder="Lat" :value="lat">
                <input type="number" style="display: flex; width: 100%;" placeholder="Lng" :value="lng">
            </div>

            <input id="title" type="text" placeholder="Title" v-model="params.title" >
    
            <h3 style=" padding: 0; margin: 0;">Date</h3>
            <div id="mode radio" style="display: flex; flex-direction: row;   align-items: center; ">
                  
                <input id="exact_date" type="radio" name="date" value="exact" v-model="params.shotDateMode" checked>
                <label for="exact_date" >Exact</label>
                <input id="spread_date" type="radio" name="date" value="spread" v-model="params.shotDateMode">
                <label for="spread_date" >Spread</label>

            </div>
                <div id="inputs" style="gap:5px; display: flex; width: fit-content;">
                    <label for="title">form</label>   
                    <input id="title" type="date" placeholder="shot date" v-model="params.shotDateBegin" style="width: 100%;">
                    <label for="title">to</label>
                    <input id="title" type="date" placeholder="shot date" v-model="params.shotDateEnd"  style="width: 100%;" >
                    
                </div>

                <h3 style="margin: 0; padding: 0">Time</h3>
                <div id="mode radio2" style="display: flex; flex-direction: row;
                 align-items: center; padding: 0; margin: 0; ">
                    
                    <input id="exact_time" type="radio" name="time" value="exact" v-model="params.shotTimeMode" checked>
                    <label for="exact_time" >Exact</label>
                    <input id="spread_time" type="radio" v-model="params.shotTimeMode" value="spread" name="time">
                    <label for="spread_time" >Spread</label>
              </div>
          
                <div style="gap:5px; display: flex; width: fit-content;">
                    <label for="title">form</label>
                    <input id="title" type="time" placeholder="shot date" v-model="params.shotTimeBegin" style="width: 100%;">
                    <label for="title">to</label>
                    <input id="title" type="time" placeholder="shot date" v-model="params.shotTimeEnd" style="width: 100%;">
                   
                </div>
               
            <div>
            <button type="submit">upload</button>


            </div>

        </form>
       

    </div>

</template>


<style>

.form {
    display: flex; flex-direction: column; position: absolute; gap: 10px; background-color: darkkhaki;  width: 300px; height: fit-content; padding: 10px; z-index: 999;

}

</style>