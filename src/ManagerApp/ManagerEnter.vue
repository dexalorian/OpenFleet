<template>
<div class="scale- font-bold text-4xl w-full h-40 gap-1 content-center items-center flex flex-col">
        <div class="flex w-14 h-14 bg-[length:80%] rounded-xl bg-blue-200 bg-[url('/public/car.svg')] bg-center" > </div>
    
        <p class="tracking-tight">DriveTrace</p>
   
        <p class="text-xs font-light">Manager app</p>
    </div>
    <Tabs default-value="login" v-model="activetab" class="w-full flex flex-col max-w-96">
            <TabsList class="w-full">
                <TabsTrigger value="login" class="w-full">
                    Login
                </TabsTrigger>
                <TabsTrigger value="signup" class="w-full">
                    Sign Up
                </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Login  />
            </TabsContent>
            
            <TabsContent value="signup">
                <SignUp @tologin = "(e) => activetab = e"/>
            </TabsContent>
    </Tabs>
    
    </template>
    
    <script setup lang="ts">
    
    import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
    import Login from './Login.vue';
    import SignUp from './SignUp.vue';
    import { ref } from 'vue';
     const activetab = ref()
    
    
    </script>