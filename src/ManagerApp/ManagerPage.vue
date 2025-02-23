<template>
    <div class="flex flex-col h-screen w-full items-center">
        <p>OpenFleet. Manager App</p>
        <RouterView />
    </div>
    
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { watch } from 'vue'

const manager = useManagerStore();
const router = useRouter();

onMounted( async () => {
        await manager.checkAuth()
        console.log( 'isAuth? ', manager.isAuth );
       if (manager.isAuth) {
           router.push({ name: 'manager-main' })
       } else { router.push( { name: 'manager-enter' }) }
   }
)

watch( () => manager.isAuth, () => (manager.isAuth) ? router.push({ name: 'manager-main'})  : router.push({ name: 'manager-enter'})  )

</script>

<script lang="ts"> 

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onMounted } from 'vue';

export const useManagerStore = defineStore('ManagerStore', () => {

    const isAuth = ref(false);
    const manager = ref({}) 
    const vehicles = ref({})

    async function checkAuth() {
        console.log('Checking auth')
        try {
            const res = await fetch( import.meta.env.VITE_SRV_URL + '/manager/auth', {method: 'POST', credentials: 'include'} )
            const resp = await res.json()
            if (resp.valid) {
                isAuth.value = true
                manager.value = resp.manager
            } else {
                isAuth.value = false
                manager.value = null
             }

        } catch { 
        }

    }

    async function SignUp(login: String, pwd: String, email: String, phoneNums: String[]) {
       await fetch(import.meta.env.VITE_SRV_URL+'/manager/signup', {method: 'POST', headers: { "Content-Type": "application/json" }, body: 
       { login , pwd, email, phoneNums } }) 
    }

    async function Logout () {
        const res =  await fetch(import.meta.env.VITE_SRV_URL+'/manager/logout', { method: 'GET', credentials: 'include' } )
        if (res.status === 200) {
            console.log('status ', res.status)
            isAuth.value = false
        }
    }

    async function Login( login: String, pwd: String ) {
        try {
            const res =  await fetch(import.meta.env.VITE_SRV_URL + '/manager/login', {method: 'POST', body: JSON.stringify({login, pwd}), headers: { "Content-Type": "application/json" }, credentials: 'include' })
            const resp = await res.json()
            if (res.status === 200) {
            console.log(resp.id);
            isAuth.value = true
            manager.value = resp
            }
        } catch {
            isAuth.value = false;
            manager.value = {}
        }

       
        // await fetch(window.BASE_SRV_URL+'/manager/login', { method: 'POST', body: JSON.stringify({ login: login, pwd: pwd })})
    }

    return {manager, isAuth, Logout, SignUp, checkAuth, Login, vehicles}
 } )




</script>