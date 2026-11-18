<template>
    <div class="min-h-screen bg-white px-4 py-6">
        <AppNavbar />

        <main class="mx-auto mt-6 w-full max-w-6xl">
        <router-view />
        </main>
    </div>
</template>

<script>
import AppNavbar from "../components/Navbar.vue";

export default {
    name: "MainLayout",
    components: { AppNavbar },
};
</script>