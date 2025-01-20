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
import { watch, nextTick } from 'vue';
import { ref, Teleport } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormMessage, FormControl, Form, FormLabel, FormField, FormItem } from '@/components/ui/form'
import { ErrorMessage, useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router'
import { useUser } from './main';

const userObj = useUser()

const props = defineProps({ show: Boolean })
const router = useRouter()

const open = ref(false)

watch( () => props.show, () => {open.value = props.show}  )

const form = useForm()
const Submit = form.handleSubmit( 
  async (val) => {
  fetch(import.meta.env.VITE_BASE_URL + '/login', { headers: {'Content-Type': 'application/json'}, 
  method: 'POST', credentials: 'include', body: JSON.stringify(val)}).then( e =>  {userObj.email = e.body.email; userObj.isAuth = true})
  console.log(val)
  open.value = false
  router.push('/')
 


} 


)

</script>

<template>
 
      <Dialog v-model:open="open" @update:open="() => router.push('/')">
    
        <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
  
        </DialogHeader>

          <form @submit.prevent="Submit" >
     
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? true : false" name="username" >
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="shadcn" v-bind="componentField" />
                    </FormControl>
                
                <ErrorMessage name="username" />
   
                </FormItem>
              

              </FormField>
              
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? true : false" name="password">
                <FormItem>

                  <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="shadcn" v-bind="componentField" />
                    </FormControl>
                    
                  <ErrorMessage name="password"  />
                  <!-- <FormMessage /> -->
                </FormItem>
              
           
              </FormField>
            </form>
                
                <DialogFooter>
                  <Button variant="secondary" @click.prevent=" () => router.push('/signup') ">Sign Up</Button>
                  <Button  @click="Submit">Login</Button>  
                
                </DialogFooter>

         


      </DialogContent>

    </Dialog>

</template>