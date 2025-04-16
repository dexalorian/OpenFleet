<template>

    <div>

        <div v-if="succ" id="success_block" class="flex flex-col
            justify-center content-center items-center h-64 gap-6">
            <div class="flex flex-col justify-center items-center">
                <ion-icon class="flex size-12 text-green-400" 
                    name="checkmark-circle"></ion-icon>
                <p class="text-2xl font-bold tracking-tight">Success</p>
                <p class="text-xs">Account successfully been created</p>
            </div>
            <Button type="submit" @click="() => { emit('tologin', 'login') } ">Back to login</Button>

        </div>

        <form v-if="!succ" @submit="onSubmit" class="flex flex-col gap-3">
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
    import { ref } from 'vue';
    import FormLabel from '@/components/ui/form/FormLabel.vue';
    import { toast } from 'vue-sonner';


    const router = useRouter()
    const form = useForm()
    const err = ref(null)
    const succ = ref(false)

    const emit = defineEmits(['tologin']);


    const onSubmit = form.handleSubmit(async (values) => {
        console.log(values)
       let res = await fetch('/signup', 
            { body: JSON.stringify( {... values, phoneNums: [ values.phoneNums ]} ), 
            method: 'POST', headers: { "Content-Type": "application/json" } } )

    console.log('signup resp', await res.text() )
    res.status !== 200 ? toast.error('Sign up error', {position: 'top-center', 
    description: 'Something went wrong due account creation' }) : null
     succ.value = res.status === 200
     
  console.log('Form submitted!', values)
})
   

    

</script>