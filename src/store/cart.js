import Vue from "vue";

const KEY = "playzo_cart";

const load = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
        return [];
    }
};

export const cart = Vue.observable({ items: load() }); // state ที่ reactive อยู่ในหน่วยความจำ ตอนเริ่มโหลดอ่านจาก localStorage key playzo_cart มาใส่

const save = () => localStorage.setItem(KEY, JSON.stringify(cart.items));

export function addItem(product, qty = 1) {
    const found = cart.items.find((i) => i._id === product._id);
    if (found) {
        found.qty = Math.min(found.qty + qty, product.stock);
        found.stock = product.stock;
    } else {
        cart.items.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
        });
    }
    save();
}

export function setQty(id, qty) {
    const found = cart.items.find((i) => i._id === id);
    if (!found) return;
    found.qty = Math.max(1, Math.min(qty, found.stock));
    save();
}

export function removeItem(id) {
    cart.items = cart.items.filter((i) => i._id !== id);
    save();
}

export function clearCart() {
    cart.items = [];
    save();
}