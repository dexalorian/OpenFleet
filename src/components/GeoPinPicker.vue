<script setup lang="ts">
    const props = defineProps({  lat: Number, lng: Number })

    import { ref, watchEffect, watch } from "vue";
    import { useMyPhotos, useSelGeoPnt } from "../main";
    import Button from "./ui/button/Button.vue";
    import Input from "./ui/input/Input.vue";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

    const selPtn = useSelGeoPnt()
    const MyPhotos = useMyPhotos()
    const selectedFile = ref(null);  
    const params = ref({})
    const imgUri: Url = ref(null)

    watchEffect( () => {selectedFile.value  !== null ? imgUri.value  =  URL.createObjectURL(selectedFile.value) :  null; console.log(selectedFile.value)}) 

    const newPhoto = async () => {
        const sendreq = new FormData( )
        sendreq.append('file', selectedFile.value)
        sendreq.append('coords', JSON.stringify({lat: props.lat, lng: props.lng}))
        console.log(JSON.stringify(params.value))
        sendreq.append('params',  JSON.stringify(params.value))

    await fetch(import.meta.env.VITE_BASE_URL + '/upload',  {
        method: 'POST',
        body: sendreq, credentials: 'include', 
    })
    await MyPhotos.fetchPhotos()
    selPtn.visible = false
    // MyPhotos.addPhoto(`${props.lat},${props.lng}.`+selfile.value.name.split('.').at(-1))
    }

</script>

<template >

<!-- .form {
    display: flex; flex-direction: column; position: absolute; gap: 10px; background-color: darkkhaki;  width: 300px; height: fit-content; padding: 10px;

} -->
    
    
    <div class="flex flex-col absolute gap-3 bg-slate-900 w-80 h-fit p-4 text-white rounded-3xl bg-opacity-80 backdrop-blur-sm dark p-0 m-0">

    <Accordion type="multiple" collapsible class="p-0 m-0">
    <AccordionItem value="item-1" class="border-b-0 p-0 m-0"> 
      <AccordionTrigger class="p-0 m-0"><ion-icon name="camera"></ion-icon> <h1 class="text-xs font-bold"  >Upload photo</h1></AccordionTrigger>
      <AccordionContent>

       
    
    <div style="display: flex; gap: 10px; width: fit-content;" class="py-2">
        <img :src=" imgUri " style="background-color: blueviolet; width: 200px; "/></div>

    <form  @submit.prevent="newPhoto" enctype="multipart/form-data" 
    style="display: flex; width: 100%; flex-direction: column; gap: 10px">

        <input type="file" @change=" e => {selectedFile  =  e.target.files[0]} " />


        <div style="display: flex; gap: 3px; width: fit-content;">
            <div class="flex flex-col">
                <label for="lat_input" >Latitude</label>
                <Input  id="lat_input" class="h-8" type="number" :value="lat"/>
            </div>
            <div class="flex flex-col">
                <label for="lat_input" >Longitude</label>
                <Input id="lng_input" class="h-8" type="number" :value="lng"/>
            </div>
     
        </div>

        <!-- <input id="title" type="text" placeholder="Title" v-model="params.title" > -->
        <Input  id="title" placeholder="Title or description" v-model="params.title" />


        <h3 style="margin: 0; padding: 0">Date of shot</h3>
             <Tabs default-value="unknown" class="w-full" v-model="params.shotDateMode">
                <TabsList>
                <TabsTrigger value="exact">
                    Exact date
                </TabsTrigger>
                <TabsTrigger value="spread">
                    Spread
                </TabsTrigger>
                <TabsTrigger value="unknown">
                    Unknown
                </TabsTrigger>
                </TabsList>
                <TabsContent value="exact">
                    <div class="flex flex-col w-full">
                            <label for="title">From</label>
                            <Input  id="shotdate_fromdate" type="date" v-model="params.shotDateBegin" class="w-fit"/> 
                            <!-- <input id="title"  type="date" placeholder="shot date" style="width: 100%;"> -->
                            </div>
                </TabsContent>
                <TabsContent value="spread">
                    <div id="inputs" style="gap:5px; display: flex; width: fit-content;">
                        <div class="flex flex-col">
                            <label for="title">From</label>
                            <Input  id="shotdate_fromdate" type="date" v-model="params.shotDateBegin" class="w-fit"/> 
                            <!-- <input id="title"  type="date" placeholder="shot date" style="width: 100%;"> -->
                            </div>
                        <div class="flex flex-col">
                            <label for="title">To</label>
                            <Input id="shotdate_todate" type="date" v-model="params.shotDateEnd" class="w-full" /> 
                            <!-- <input id="title" type="date" placeholder="shot date" v-model="params.shotDateEnd"  style="width: 100%;" > -->
                        </div>
                        
                    </div>
                </TabsContent>
            </Tabs>

            <h3 style="margin: 0; padding: 0">Time</h3>

            <Tabs default-value="unknown" class="w-full" v-model="params.shotTimeMode">
                <TabsList >
                <TabsTrigger value="exact">
                    Exact time
                </TabsTrigger>
                <TabsTrigger value="spread">
                    Spread
                </TabsTrigger>
                <TabsTrigger value="unknown">
                    Unknown
                </TabsTrigger>
                </TabsList>
                <TabsContent value="exact">
                        <div class="flex flex-col">
                                <label for="shottime_from">From</label>
                                <Input  id="shottime_from" type="time" v-model="params.shotTimeBegin" class="w-fit"/> 
                                <!-- <input id="title"  type="date" placeholder="shot date" style="width: 100%;"> -->
                            </div>
                </TabsContent>
                <TabsContent value="spread">
                        <div style="gap:5px; display: flex; width: fit-content;">
                            <!-- <label for="title">form</label>
                            <input id="title" type="time" placeholder="shot date" v-model="params.shotTimeBegin" style="width: 100%;">
                            <label for="title">to</label>
                            <input id="title" type="time" placeholder="shot date" v-model="params.shotTimeEnd" style="width: 100%;"> -->

                            <div class="flex flex-col">
                                <label for="shottime_from">From</label>
                                <Input  id="shottime_from" type="time" v-model="params.shotTimeBegin" class="w-full"/> 
                                <!-- <input id="title"  type="date" placeholder="shot date" style="width: 100%;"> -->
                            </div>
                            <div class="flex flex-col">
                                <label for="shottime_to">To</label>
                                <Input id="shottime_to" type="time" v-model="params.shotTimeEnd" class="w-full" /> 
                                <!-- <input id="title" type="date" placeholder="shot date" v-model="params.shotDateEnd"  style="width: 100%;" > -->
                            </div>
                        
                        </div>
                </TabsContent>
            </Tabs>


           
        <div>

            <Button type="submit">Upload</Button>
        <!-- <button class="button"  type="submit">Upload</button> -->


        </div>

    </form>
   

      </AccordionContent>
    </AccordionItem>
  </Accordion>
        
       

    </div>

</template>


<style>

Input {
    @apply h-8 flex
}


input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverts the color (useful for dark mode) */
  opacity: 0.7; /* Adjust transparency */
  cursor: pointer;
}

/* Input[type="date"], Input[type="time"] { @apply h-8 } */

</style>