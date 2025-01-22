<script setup>

import { watch, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import LoginDialog from './LoginDialog.vue';
import SignUpDialog from './SignUpDialog.vue';
import MainUserMenu from '@/components/MainUserMenu.vue'
import { useUser } from './main';
import LogoutDialog from './LogoutDialog.vue';

const userObj = useUser()

const route = useRoute()

console.log('Cookie ',  document.cookie)

const showLogin = ref(false)
const showSignup = ref(false)
const showLogout = ref(false)

onMounted(
async () => {
  if (!userObj.isAuth) {
   let e = await fetch(import.meta.env.VITE_BASE_URL + '/auth', {method: 'POST' , credentials: 'include', headers: {'Content-Type': 'application/json'}})
   let res = await e.json()
      console.log('dfdfd ', res);
      res.valid ? userObj.isAuth = true : userObj.isAuth = false
  } 
})

watch( () => route.path, e => {
console.log('path changed')
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
  <LoginDialog :show="showLogin"/>
  <SignUpDialog :show="showSignup" />
  <router-view name="header"/>
  <router-view />
</template>
