import Vue from "vue";

export const toasts = Vue.observable({ list: [] });

let uid = 0;

function push(type, message, timeout = 3000) {
    const id = ++uid;
    toasts.list.push({ id, type, message });
    setTimeout(() => dismiss(id), timeout);
}

export function dismiss(id) {
    toasts.list = toasts.list.filter((t) => t.id !== id);
}

export const toast = {
    success: (msg, ms) => push("success", msg, ms),
    error: (msg, ms) => push("error", msg, ms || 4000),
    info: (msg, ms) => push("info", msg, ms),
};