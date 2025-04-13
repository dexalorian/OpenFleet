<template>
<div class="flex flex-col w-full px-4 content-center justify-center">
    <div class="scale- font-bold text-4xl w-full h-40 content-center gap-1 items-center flex flex-col">
        <div class="flex w-15 h-15 rounded-full bg-amber-100 bg-[url('/public/car.svg')] bg-[length:80%] bg-center" > </div>
    
        <p class="tracking-tight">Open Fleet</p>
   
        <p class="text-xs font-light">Vehicle app</p>
    </div>
    <Tabs default-value="login"  class="flex flex-col w-full px-4 content-center justify-center">
        <TabsList class="w-full">
            <TabsTrigger value="login" class="w-full">
                Login
            </TabsTrigger>
            <TabsTrigger value="signup" class="w-full">
                Sign Up
            </TabsTrigger>

        </TabsList>

        <TabsContent value="login" class="flex flex-col">
            <Login />
        </TabsContent>
        
        <TabsContent value="signup" class=" flex flex-col">
            <SignUp />
        </TabsContent>
    </Tabs>


</div>


</template>

<script setup lang="ts">

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Login from './Login.vue';
import SignUp from './SignUp.vue';
import type { svg } from 'leaflet';

document.title = 'OpenFleet | Login'

</script>