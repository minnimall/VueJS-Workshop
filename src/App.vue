<template>
    <v-app>
        <router-view />
        <ToastHost />
    </v-app>
</template>

<script>
import ToastHost from "./components/ToastHost.vue";

export default {
    name: "App",
    components: { ToastHost },
};
</script>