<template>
    <Dialog v-model:open="showDialog" @update:open="">
        <DialogTrigger as-child>
            <Button>Add vehicle</Button>
        </DialogTrigger>
            
        <DialogContent>
            <DialogTitle>Connect to vehicle</DialogTitle>
                <div v-if="false" class="flex flex-col gap-2 items-center">
                    <CheckCircleIcon class="size-1/6 text-green-500" />
                    <p class="text-lg">Success</p>
                    <div class="flex bg-green-200 justify-center py-1 w-full min-h-16 items-center">ddd{{ msg }} </div>
                    <div class="flex flex-row gap-2 justify-center">
                        <Button @click=" async () =>{ fetchRes.value = await bindVehicle(vhcID);}"> Repeat </Button>
                        <DialogClose>
                            <Button variant="outline" @click="() => showDialog = false"> Done </Button>
                        </DialogClose>
                    </div>
                </div>
                
            <Tabs default-value="exist">
            <TabsList>
                <TabsTrigger value="exist">Existing</TabsTrigger>
                <TabsTrigger value="new">Create new</TabsTrigger>
            </TabsList>

            <TabsContent value="exist">
              
                        Vehicle IDd
                        <Input v-model="vhcID"></Input>
                        <div id="generalError" class="bg-red-200">{{ fetchRes?.error }}</div>
                <div class="flex flex-row gap-2">
                    <Button @click="async () => {  fetchRes =  await bindVehicle(vhcID);}"> Send request </Button>
                    <DialogClose>
                        <Button variant="outline" @click="() => showDialog = false"> Cancel </Button>
                    </DialogClose>
                </div>
            </TabsContent>

            <TabsContent value="new">
                    Login
                    <div class="bg-slate-400 p-3">{{ pwd }}</div>
                <Input v-model="login"></Input>
                <div class="flex flex-row gap-2">

                <Button @click="async () => pwd = await newVehicle(login).then(e => e.pwd)"> Create & get credentials</Button>

                <DialogClose>
                    <Button variant="outline"> Cancel </Button>
                </DialogClose>
                
                </div>
                            </TabsContent>
                </Tabs>
        </DialogContent>
    </Dialog>

</template>

<script setup lang="ts">

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newVehicle, bindVehicle } from '@/services';
import { ref } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const login = ref('')
const  pwd = ref('')
const vhcID = ref('')
const fetchRes = ref({error: ''})

const showDialog = ref(false)

</script>