<template>

<Tabs default-value="login" class="w-full flex flex-col max-w-96">
        <TabsList class="w-full">
            <TabsTrigger value="login" class="w-full">
                Login
            </TabsTrigger>
            <TabsTrigger value="signup" class="w-full">
                Sign Up
            </TabsTrigger>

        </TabsList>

        <TabsContent value="login">
            <Login />
        </TabsContent>
        
        <TabsContent value="signup">
            <SignUp />
        </TabsContent>
    </Tabs>

</template>

<script setup lang="ts">

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Login from './Login.vue';
import SignUp from './SignUp.vue';


</script>