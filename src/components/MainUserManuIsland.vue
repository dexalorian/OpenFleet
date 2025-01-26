<template>



<router-link to="/login" v-if="!isAuth" >        
        <div class="px-3 gap-2 text-slate-700" style="box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4); pointer-events: all;
        width: fit-content; height: 50px; border-radius: 10px; display: flex; justify-content: center; 
        align-items: center; background-color: white;">
            Login
            <div style="display: flex; justify-content: center; align-items: center; background-color: bisque; width: 38px; height: 38px; border-radius: 50%;">
                <ion-icon name="person" style="color: peru ; width: 18px; height: 18px;" />
               
            </div>
            
        </div>

</router-link>

<router-link to="/logout" v-if="isAuth" >        
        <div class="px-3 gap-2 text-slate-700" style="box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4); pointer-events: all;
        width: fit-content; height: 50px; border-radius: 10px; display: flex; justify-content: center; 
        align-items: center; background-color: white;">
            Logout
            <div style="display: flex; justify-content: center; align-items: center; background-color: bisque; 
            width: 38px; height: 38px; border-radius: 50%;">
                <ion-icon name="person" style="color: peru ; width: 18px; height: 18px;" />
               
            </div>
            
        </div>
    
</router-link>
    

</template>


<script setup lang="ts">

import { useUser } from '@/main';
import { storeToRefs } from 'pinia';

const userObj = useUser()

const { isAuth } = storeToRefs(userObj)

</script>

