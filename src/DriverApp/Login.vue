<template>
    Driver app Login
    <form>
        <FormField name="login">
            <FormItem>
                <Input placeholder="Login"/>
            </FormItem>
        </FormField>
        <FormField name="pwd">
            <FormItem>
                <Input placeholder="Password"/>
            </FormItem>
        </FormField>
        <Button>Login</Button>
    </form>

</template>

<script lang="ts" setup>

import { FormControl, FormItem, FormField } from '@/components/ui/form';
import { useForm } from 'vee-validate';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';

const form = useForm()

</script>