<template>
    <div class="pointer-events-none fixed right-4 top-4 z-[9999] flex w-80 flex-col gap-3 font-kanit">
        <transition-group name="toast">
            <div
                v-for="t in items"
                :key="t.id"
                class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg"
                :class="border[t.type]"
                role="status"
            >
                <v-icon small :color="color[t.type]">{{ icon[t.type] }}</v-icon>
                <p class="flex-1 text-sm text-gray-800">{{ t.message }}</p>
                <button class="text-gray-400 hover:text-gray-600" @click="close(t.id)">
                    <v-icon x-small>mdi-close</v-icon>
                </button>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { toasts, dismiss } from "../store/toast";

export default {
    name: "ToastHost",
    data() {
        return {
            icon: {
                success: "mdi-check-circle",
                error: "mdi-alert-circle",
                info: "mdi-information",
            },
            color: { success: "green", error: "red", info: "blue" },
            border: {
                success: "border-green-200",
                error: "border-red-200",
                info: "border-blue-200",
            },
        };
    },
    computed: {
        items() {
            return toasts.list;
        },
    },
    methods: {
        close(id) {
            dismiss(id);
        },
    },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s ease;
}
.toast-enter,
.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>