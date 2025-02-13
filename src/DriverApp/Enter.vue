<template>
    <Tabs default-value="login" class="flex flex-col border w-full">
            <TabsList class="w-full">
                <TabsTrigger value="login" class="w-full">Login</TabsTrigger>
                <TabsTrigger value="pwd" class="w-full">SignUp</TabsTrigger>
            </TabsList>
    
            
            <TabsContent value="login">
                <Login />
                
            </TabsContent>
            <TabsContent value="pwd">
                <SignUp />
                
            </TabsContent>
        
            </Tabs>
</template>


<script lang="ts" setup>

import {Tabs, TabsTrigger, TabsList, TabsContent} from '@/components/ui/tabs/';
import Login from './Login.vue';
import SignUp from './SignUp.vue';

</script>