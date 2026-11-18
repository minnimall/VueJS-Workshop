<template>
    <div>
        <h1>{{ name }}</h1>
        <v-btn color="success" @click="callMain()">Call Main</v-btn>
    </div>
</template>

<script>
import {EventBus } from '@/EventBus'
export default {
    props:['name'],
    methods: {  // สร้าง methods ไว้ให้ตัว นี้ไปดึงใช้ alert ของในตัว methods callAlert ของ Login.vue
        callMain() {
            EventBus.$emit('CallAlertMain') // ชื่อตัว eventbus
        }
    }
}
</script>

<style>

</style>