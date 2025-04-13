<template>

    <div>

        <form @submit="onSubmit" class="flex flex-col gap-3">
            <FormField v-slot="{ componentField }" name="login">
                
                <FormItem>
                    <FormLabel>Login</FormLabel>
                    <Input placeholder="New login" v-bind="componentField"/>
                </FormItem>

            </FormField>
            <FormField name="pwd" v-slot="{ componentField }">
                
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input placeholder="Password" v-bind="componentField"/>
                </FormItem>
            </FormField>
            <FormField name="email" v-slot="{ componentField }">
               
                <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <Input placeholder="Email" v-bind="componentField"/>
                </FormItem>

            </FormField>
            <FormField name="phoneNums" v-slot="{ componentField }">
               
                <FormItem>
                    <FormLabel>Phone number</FormLabel>
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
       let res = await fetch(import.meta.env.VITE_SRV_URL+ '/manager/signup', 
            { body: JSON.stringify( {... values, phoneNums: [ values.phoneNums ]} ), 
            method: 'POST', headers: { "Content-Type": "application/json" } } )

  console.log('Form submitted!', values)
})
   

    

</script>