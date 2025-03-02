<template>

<Tabs default-value="login"  class="  flex flex-col w-full px-4 content-center justify-center">
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

</template>

<script setup lang="ts">

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Login from './Login.vue';
import SignUp from './SignUp.vue';


</script>