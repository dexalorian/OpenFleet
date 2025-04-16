<template>

    <div class="flex flex-col justify-center h-full">
        <form @submit="onSubmit" class="flex flex-col gap-2">
            <FormField v-slot="{ componentField }" name="login">
                <FormLabel>Login</FormLabel>
                <FormItem>
                    <Input placeholder="New login" v-bind="componentField"/>
                </FormItem>

            </FormField>
            <FormField name="pwd" v-slot="{ componentField }">
                <FormLabel>Password</FormLabel>
                <FormItem>
                    <Input placeholder="Password" v-bind="componentField"/>
                </FormItem>
            </FormField>
            <FormField name="email" v-slot="{ componentField }">
                <FormLabel>E-mail</FormLabel>
                <FormItem>
                    <Input placeholder="Email" v-bind="componentField"/>
                </FormItem>

            </FormField>
            <FormField name="phoneNums" v-slot="{ componentField }">
                <FormLabel>Phone number</FormLabel>
                <FormItem>
                    <Input placeholder="Phone number" v-bind="componentField"/>
                </FormItem>

            </FormField>
            <Button type="submit">Sign Up</Button>
        </form>
    </div>

</template>

<script lang="ts" setup>

    import { FormField, FormItem } from '@/components/ui/form';
    import FormControl from '@/components/ui/form/FormControl.vue';
    import { useForm } from 'vee-validate'
    import Input from '@/components/ui/input/Input.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { useRouter } from 'vue-router';
import FormLabel from '@/components/ui/form/FormLabel.vue';

    const router = useRouter()
    const form = useForm()

    const onSubmit = form.handleSubmit(async (values) => {
        console.log(values)
       let res = await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/signup', 
            { body: JSON.stringify( {... values, phoneNums: [ values.phoneNums ]} ), 
            method: 'POST', headers: { "Content-Type": "application/json" } } )

  console.log('Form submitted!', values)
})
   

    

</script>