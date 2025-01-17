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
import { watch } from 'vue';
import { ref, Teleport } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormMessage, FormControl, Form, FormLabel, FormField, FormItem } from '@/components/ui/form'
import { ErrorMessage, useForm } from 'vee-validate';
import { log } from 'console';
import { useRoute, useRouter } from 'vue-router'


const props = defineProps({ shown: Boolean })
const router = useRouter()



const kek = ref(false)

watch( () => props.shown, () => {kek.value = !kek.value; console.log('dfldfldfldlf')}  )

const form = useForm()
const Submit = form.handleSubmit( 

async (val) => {
fetch(import.meta.env.VITE_BASE_URL + '/login', { headers: {'Content-Type': 'application/json'}, 
method: 'POST', credentials: 'include', body: JSON.stringify(val)}).then( )
console.log(val)

} 

)

</script>

<template>
 
      <Dialog v-model:open="kek" @update:open="() => router.push('/')">
    
        <DialogContent class="max-w-96">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
  
        </DialogHeader>

          <form @submit.prevent="Submit" >
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? true : false" name="username" >
                <FormLabel>E-mail</FormLabel>
             
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                    <ErrorMessage name="username" />
                  <!-- <FormMessage /> -->

              </FormField>
              <br>
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? true : false" name="password">
           
                  <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="shadcn" v-bind="componentField" />
                  <ErrorMessage name="password"  />
                  <!-- <FormMessage /> -->
           
              </FormField>
                
                <DialogFooter>
                  <Button variant="secondary" @click.prevent=" ">Sign Up</Button>
                  <Button type="submit">Login</Button>
                
                </DialogFooter>

          </form>



      </DialogContent>

     
 

    </Dialog>



</template>