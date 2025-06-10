<script setup lang="ts">

import { Dialog, DialogContent, DialogFooter, DialogHeader, 
        DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { useForm, ErrorMessage } from 'vee-validate';
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormField, FormLabel } from './components/ui/form';
import { Button } from './components/ui/button';

const form = useForm()
const router = useRouter()
const DoneStageVisible = ref(false)

const open = ref(false)
const props = defineProps({ show: Boolean })
watch( () => props.show, () => open.value = props.show)
const Submit = form.handleSubmit( 

async (val) => {
fetch('/signup', { headers: {'Content-Type': 'application/json'}, 
method: 'POST', credentials: 'include', body: JSON.stringify(val)}).then( )

fetch('/', {})

console.log(val)
DoneStageVisible.value = true

} )
</script>


<template>

    <Dialog v-model:open="open" @update:open="router.push('/')">

        <DialogContent v-if="DoneStageVisible">
            <div>Activation email been sent to your e-mail.
              <br>Click link in the letter to activate account.</div>
            <Button @click="router.push('/')">Done</Button>
        </DialogContent>

            <DialogContent class="max-w-96" v-if="!DoneStageVisible">

              <DialogHeader>
                  <DialogTitle>Sign up</DialogTitle>
    
              </DialogHeader>
                <form @submit.prevent="Submit"> 

              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? 
                    true : false" name="email" >
                <FormLabel>E-mail</FormLabel>
             
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                    <ErrorMessage name="email" />
                  <!-- <FormMessage /> -->

              </FormField>
              <FormField v-slot="{ componentField }" :rules="e => e.length > 2 ? 
                    true : false" name="name" >
                <FormLabel>Your name</FormLabel>
             
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                    <ErrorMessage name="name" />
                  <!-- <FormMessage /> -->

              </FormField>
              <br>
              <FormField v-slot="{ componentField }" :rules="e => 
                    e.length > 2 ?  true : false" name="password">
           
                  <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="Password" v-bind="componentField" />
                  <ErrorMessage name="password"  />
                  <!-- <FormMessage /> -->
           
              </FormField>

              <br>
              <FormField v-slot="{ componentField }" :rules="e => 
                  e.length > 2 ? true : false" name="repassword">
           
                  <FormLabel>Retype password</FormLabel>
                    <Input type="password" placeholder="Retype password" v-bind="componentField" />
                  <ErrorMessage name="repassword"  />
                  <!-- <FormMessage /> -->
           
              </FormField>
                
                <DialogFooter>
                  <Button variant="secondary" @click.prevent=" () => 
                        router.push('/login') ">Back to login</Button>
                  <Button type="submit">Sign up</Button>  
                
                </DialogFooter>
                    
                </form>
                     
            </DialogContent>

    </Dialog>

</template>