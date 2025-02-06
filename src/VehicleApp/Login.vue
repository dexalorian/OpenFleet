<template>
    Vehicle app Login
    <form @submit="onSubmit">
        <FormField name="login" v-slot="{ componentField }">
            <FormItem>
                <Input placeholder="Login" v-bind="componentField" />
            </FormItem>
        </FormField>
        <FormField name="pwd" v-slot="{ componentField }">
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

const form = useForm()

const onSubmit = form.handleSubmit( async (e) => 
{
   await fetch(import.meta.env.VITE_SRV_URL+ '/vehicle/login', {body: JSON.stringify(e) , headers: { "Content-Type": "application/json" }, method: 'POST'})
}
)

</script>