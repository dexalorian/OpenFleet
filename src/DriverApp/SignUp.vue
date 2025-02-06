<template>

    <div>
        Sign up page
        <form @submit.prevent="() => router.go('/')" class="flex flex-col gap-2">
            <FormField name="login">
                <FormItem>
                    <Input placeholder="New login"/>
                </FormItem>

            </FormField>
            <FormField name="password">
                <FormItem>
                    <Input placeholder="Password"/>
                </FormItem>
            </FormField>
            <FormField name="email">
                <FormItem>
                    <Input placeholder="Email"/>
                </FormItem>

            </FormField>
            <FormField name="Email">
                <FormItem>
                    <Input placeholder="Phone number"/>
                </FormItem>

            </FormField>
            <Button>Sign Up</Button>
  

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

const router = useRouter()

const form = useForm()

</script>