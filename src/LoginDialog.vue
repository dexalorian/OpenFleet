<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { watch, nextTick, onMounted } from 'vue';
import { ref, Teleport } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormMessage, FormControl, Form, FormLabel, FormField, FormItem } from '@/components/ui/form'
import { ErrorMessage, useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router'
import { useUser} from './main';
import { inject } from 'vue';

const userObj = useUser()

const show = defineModel({default: false})
const router = useRouter()

const open = ref(false)
const res = ref({})
// watch( () => props.show, () => {open.value = props.show}  )
const form = useForm()

const Submit = form.handleSubmit( 
  async (val) => {

  res.value = await fetch(import.meta.env.VITE_BASE_VEHICLE_URL + '/login', { headers: {'Content-Type': 'application/json'},
  method: 'POST', credentials: 'include', body: JSON.stringify(val)})

  if (res.value.status === 401) {
    console.log( 'Not authorized' )
  
    form.validate()
  }

  if (res.value.status === 200) {
    const resp = res.value.json()
    userObj.email = resp.email;
    userObj.id = resp.id;
    userObj.isAuth = true   
    open.value = false
    console.log(val)
    router.push('/')

  } 
  // else {useVehicles().fetchVehicles()}

} 

)

</script>

<template>
 
      <Dialog v-model:open="show" @update:open="router.push('/')">
    
        <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
  
        </DialogHeader>

          <form @submit.prevent="Submit">
     
              <FormField v-slot="{ componentField, errors, errorMessage }" :rules="() => {return (res.status === 401) ? 'Wrong creds' : true  }" name="username" >
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                 
                      <Input id="email" type="text" placeholder="shadcn" v-bind="componentField" />
                <ErrorMessage name="username" > {{ errorMessage }} {{ errors[0] }}</ErrorMessage>
   
                </FormItem>

              </FormField>
              
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? true : false" name="password">
                <FormItem>

                  <FormLabel>Password</FormLabel>
                      <Input id="password" type="password" placeholder="shadcn" v-bind="componentField" />
                  <ErrorMessage name="password"/>
                  <!-- <FormMessage /> -->
                </FormItem>
              
              </FormField>
          
                  
           
            </form>
                
            <DialogFooter>
                <Button type="button" @click="Submit">Login</Button> 
                <Button variant="secondary" @click.prevent=" () => router.push('/signup') ">Sign Up</Button>
                
                </DialogFooter>


         


      </DialogContent>

    </Dialog>

</template>