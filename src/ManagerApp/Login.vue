<template>
    Manager app Login
    
    <form @submit="onSubmit">
        <FormField name="login" v-slot="{ componentField }">
            <FormLabel>Login or e-mail</FormLabel>
            <FormItem>
                <Input placeholder="Login" v-bind="componentField" />
            </FormItem>
        </FormField>
        <FormField name="pwd" v-slot="{ componentField }">
            <FormLabel>Password</FormLabel>
            <FormItem>
                <Input placeholder="Password" v-bind="componentField" />
            </FormItem>
        </FormField>
        <Button type="submit">Login</Button>
    </form>

</template>

<script lang="ts" setup>

import { FormControl, FormItem, FormField } from '@/components/ui/form';
import { useForm } from 'vee-validate';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import { useRouter } from 'vue-router';
import { useManagerStore } from './ManagerPage.vue';

const form = useForm()

const router = useRouter()

const manager = useManagerStore()



const onSubmit = form.handleSubmit( async (e) => {
    console.log(' form data ', e)


    manager.Login(e.login, e.pwd)

   
}
)

</script>