<template>
    <form  @submit="onSubmit" class="flex flex-col gap-4">
        <FormField name="login"  v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Login or e-mail</FormLabel>
                <Input placeholder="Login" v-bind="componentField" />
            </FormItem>
        </FormField>
        <FormField name="pwd" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Password" type="password"  v-bind="componentField" />
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
import { useToast } from '@/components/ui/toast';
import { ref } from 'vue'
import { watch } from 'vue';
import { toast } from 'vue-sonner';

const form = useForm()

const router = useRouter()

const manager = useManagerStore()

const err = ref('')


watch( err, (k) =>{
    if (err.value) {
        toast.error('Wrong credentials', {position: 'top-center', 
        description: 'There is no such login/pass pair' });
    }

    console.log('err м',  err.value)
    console.log('err',  k)
    err.value = null;

 }  )

const onSubmit = form.handleSubmit( async (e) => {
    console.log(' form data ', e)
    err.value = await manager.Login(e.login, e.pwd)
   
}
)

</script>