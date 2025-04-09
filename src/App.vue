<script setup lang="ts">

import { watch, ref, onMounted, provide, reactive } from 'vue';
import { useRoute } from 'vue-router'
import LoginDialog from './LoginDialog.vue';
import SignUpDialog from './SignUpDialog.vue';
import { usePtrLineCoords, useUser } from './main';
import LogoutDialog from './LogoutDialog.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'

const userObj = useUser()
const route = useRoute()
const showLogin = ref(false)
const showSignup = ref(false)
const showLogout = ref(false)
const SharedMapId = ref({})


watch( () => userObj.isAuth, async  () => {
   let e = await fetch(import.meta.env.VITE_BASE_VEHICLE_URL + '/auth', {method: 'POST', 
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
      // useVehicles().fetchVehicles()
})


</script>

<template>
  <router-view />
  <Toaster />
</template>
