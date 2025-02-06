<script lang="ts" setup>
import Button from '../components/ui/button/Button.vue';
import { ref } from 'vue';
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from '../components/ui/card'
import { useForm } from 'vee-validate';
import { Form, FormField, FormItem, FormControl } from '../components/ui/form';
import { Input } from '../components/ui/input'

// const form = useForm()

const showLogin = ref(false);
const showSignUp = ref(false);
const showNewVehicle = ref(true)

</script>

<template>

  <div class="flex flex-col max-w-xl h-full bg-slate-50">
     <div v-if="showLogin || showSignUp" class="flex flex-row content-center
     h-14 border px-4 items-center justify-between w-full">
    <Button variant="outline" class="px-2" type="submit"
     @click=" showLogin = false; showSignUp = false ">
     <ion-icon name="chevron-back-outline"></ion-icon></Button>

    Driver app</div>
    <div v-if="showLogin || showSignUp" class="flex flex-col w-full p-1 h-full
    justify-center content-center
    items-center bg-slate-500">
             <!-- Login card -->
        <Card v-if="showLogin" class="p-2 w-full py-2 px-3">
            <div class="flex flex-row w-full justify-between items-center"><CardTitle class="py-3">Login</CardTitle>  
                <p>or <a @click.prevent="" href="/kek" class="underline">Sign Up</a></p>
            </div> 
            
            <form class="flex flex-col gap-2" @submit.prevent="() => console.log('Trying to submit')">
                <FormField name="kek">
                    <FormItem>
                        <FormControl>
                            <Input placeholder="login"/>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField name="kek2">
                    <FormItem>
                        <FormControl>
                            <Input placeholder="password"/>
                        </FormControl>
                    </FormItem>
                </FormField>
                <div class="flex gap-1 flex-row-reverse">
                    <Button type="submit" class="w-full">Login</Button>
                    
                    
                </div>
            
            </form>
        </Card>
            <!-- SignUp card -->
        <Card v-if="showSignUp" class="w-full">
        
            <div class="flex flex-row w-full justify-between items-center pr-3">
                <CardTitle class="p-3 py-5">Sign Up</CardTitle>  
                <p>or <a @click.prevent="" href="/kek" class="underline">Login</a></p>
            </div> 
                    <!-- <CardTitle class="pb-4">Sign Up</CardTitle> -->
            
            <form class="flex flex-col gap-2 px-2" @submit.prevent="() => console.log('Trying to submit')">
                <FormField name="kek3">
                    <FormItem>
                        <FormControl>
                            <Input placeholder="E-mail or phone"/>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField name="kek4">
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Password"/>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField name="kek4">
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Repeat password"/>
                        </FormControl>
                    </FormItem>
                </FormField>
  
            </form>
                <CardFooter class="flex pt-4 flex-row-reverse">
                    <Button type="submit" class="">Sign Up</Button>
                </CardFooter>
        </Card>

        

    </div>

   <div class="flex flex-col gap w-full gap-3 py-4 px-2 h-screen" v-if="!showLogin && !showSignUp">

    
         <div class="flex flex-row justify-between">
    
             <p class="text-xl">Driver's App</p>
             <div id="userpic" class="flex w-10 h-10 bg-slate-300 rounded-full justify-center items-center">
                <ion-icon si name="person"></ion-icon>
             </div>
             
             <div class="flex gap-1">
                <Button @click=" () => { showSignUp = !showSignUp; showLogin = false }" >Sign Up</Button>
                <Button @click=" () => { showLogin = !showLogin; showSignUp = false }" >Login</Button>
             </div>

             
         </div>

         <Card v-if="showNewVehicle">
            <CardTitle>New vehicle</CardTitle>
            <CardContent>
                <form class="flex flex-col gap-2">
                    <Input placeholder="Number"/>
                    <Input placeholder="Number"/>
                    <Input placeholder="Number"/>
                    <Input placeholder="Number"/>
                    <Input placeholder="Number"/>

                </form>
                <Button >Add</Button>
            </CardContent>
        </Card>
         <Button variant="outline">Add new vehicle</Button>

         <div id="ride_list" class="flex flex-col gap-1 text-sm"> 
        <div id="ride_tile" class="bg-white rounded-lg shadow-lg shadow-sky-800/5 min-h-20 border border-opacity-5 p-2 px-3">
            Ride
        </div>
        <div class="text-xl font-bold p-2" >Upcoming</div>
        <div id="ride_tile" class="bg-white rounded-lg shadow-lg shadow-sky-800/5 min-h-20 border border-opacity-5 p-2 px-3">
            Ride
        </div>
        
    </div>

   </div> 
    
</div>


</template>

