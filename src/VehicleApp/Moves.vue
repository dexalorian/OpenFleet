<template>

    <div class="h-full justify-center w-full items-center flex flex-col text-xs text-left">
        <div class="flex gap-3 justify-center items-center">
            <Switch class="scale-125" id="debug_geo">
            </Switch>
            <Label for="debug_geo" class="space">Show on map</Label>
        </div>
    </div>

</template>

<script lang="ts" setup>

import Switch from '@/components/ui/switch/Switch.vue';

</script>