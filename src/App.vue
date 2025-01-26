<script setup lang="ts">

import { watch, ref, onMounted, provide, reactive } from 'vue';
import { useRoute } from 'vue-router'
import LoginDialog from './LoginDialog.vue';
import SignUpDialog from './SignUpDialog.vue';
import { useMyPhotos, usePtrLineCoords, useUser } from './main';
import LogoutDialog from './LogoutDialog.vue';


const userObj = useUser()
const route = useRoute()
const showLogin = ref(false)
const showSignup = ref(false)
const showLogout = ref(false)
const SharedMapId = ref({})

provide('sharedmapID', SharedMapId)

onMounted(
async () => {

  if (!userObj.isAuth) {
   let e = await fetch(import.meta.env.VITE_BASE_URL + '/auth', {method: 'POST', 
   credentials: 'include', headers: {'Content-Type': 'application/json'}})
   let res = await e.json()
      res.valid ? userObj.isAuth = true : userObj.isAuth = false

      if (res.defaultMap) {
        console.log('def map', res.defaultMap) 
        SharedMapId.value = res.defaultMap; 
      } else {
        // await fetch('  ')
        console.log('no default map, error ', res)
      }

  } 
        
})

watch( () => userObj.isAuth, async  () => {

   let e = await fetch(import.meta.env.VITE_BASE_URL + '/auth', {method: 'POST', 
   credentials: 'include', headers: {'Content-Type': 'application/json'}})
 
   let res = await e.json()
      res.valid ? userObj.isAuth = true : userObj.isAuth = false

      if (res.defaultMap) {
        console.log('def map', res.defaultMap) 
        SharedMapId.value = res.defaultMap; 
      } else {
        // await fetch('  ')
        console.log('no default map, error ', res)
      }
      useMyPhotos().fetchPhotos()
})

watch( () => route.path, e => {
console.log('path changed to ',route.path)
  if (e === '/signup') {
    console.log('path changed to signup')
    showLogout.value = false;
      showSignup.value = true
      showLogin.value = false
  } else if (e === '/login') {
    console.log('path changed to login')
    showLogin.value = true
    showLogout.value = false;
    showSignup.value = false
  } else if (e === '/') {
    showLogin.value = false;
    showLogout.value = false;
    showSignup.value = false;
  } else if ( e === '/logout') {
    showLogout.value = true;
    showLogin.value = false;
    showSignup.value = false;
  }
 
}

)

</script>

<template>
  <LogoutDialog :show="showLogout"/>
  <LoginDialog v-model="showLogin"/>
  <SignUpDialog :show="showSignup" />
  <router-view name="header"/>
  <router-view />
</template>
