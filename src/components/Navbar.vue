<template>
    <nav
        class="sticky top-3 z-50 mx-auto flex w-full max-w-6xl items-center gap-6 rounded-2xl border border-gray-200/80 bg-white/90 px-6 py-3.5 font-kanit shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur"
    >
        <!-- โลโก้ -->
        <router-link :to="{ name: homeRoute }" class="shrink-0">
            <img src="../assets/playzo/logoplayzo.png" alt="PlayZo" class="h-10" />
        </router-link>

        <!-- เมนู -->
        <ul class="nav-menu hidden items-center gap-1 whitespace-nowrap text-sm md:flex">
            <li v-for="item in visibleMenus" :key="item.name">
                <router-link
                    :to="{ name: item.name }"
                    class="rounded-lg px-4 py-1.5 !text-gray-700 transition hover:bg-gray-100 hover:!text-black"
                    exact-active-class="!bg-gray-100 !font-bold !text-black"
                >
                    {{ item.label }}
                </router-link>
            </li>
        </ul>

        <!-- ฝั่งขวา -->
        <div class="nav-right flex shrink-0 items-center" style="gap: 12px; margin-left: auto">
            <!-- ตะกร้า -->
            <button
                v-if="showCart"
                type="button"
                class="cart-btn"
                @click="goCart"
            >
                <v-icon>mdi-shopping-outline</v-icon>
                <span v-if="cartCount > 0" class="cart-badge">
                    {{ cartCount }}
                </span>
            </button>

            <span v-if="showCart" class="hidden h-6 w-px bg-gray-200 sm:block"></span>

            <!-- ล็อกอินแล้ว: โปรไฟล์ + ออกจากระบบ -->
            <template v-if="isLoggedIn">
                <div class="profile">
                    <img
                        src="../assets/แมวมือ.png"
                        alt="avatar"
                        class="h-9 w-9 rounded-full bg-white object-cover ring-1 ring-gray-100"
                    />
                    <div class="profile-text hidden sm:block">
                        <p class="profile-name">{{ displayName }}</p>
                        <p class="profile-role">{{ roleText }}</p>
                    </div>
                </div>

                <v-btn
                    outlined
                    small
                    depressed
                    class="!m-0 !h-10 !min-w-0 rounded-lg !border-gray-200 !bg-white !px-3 !text-xs font-medium !text-gray-600 transition-all duration-200 hover:!border-red-200 hover:!bg-red-50 hover:!text-red-600"
                    @click="logout"
                >
                    <v-icon small left>mdi-logout</v-icon>
                    ออกจากระบบ
                </v-btn>
            </template>

            <!-- ยังไม่ล็อกอิน: ปุ่มเข้าสู่ระบบ -->
            <v-btn v-else outlined small class="rounded-lg bg-white" @click="goLogin">
                เข้าสู่ระบบ
            </v-btn>
        </div>
    </nav>
</template>

<script>
import { cart, clearCart } from "../store/cart";

const ROLE_TEXT = {
    user: "ลูกค้าทั่วไป",
    shop: "ร้านค้า",
    admin: "ผู้ดูแลระบบ",
};

export default {
    name: "AppNavbar",
    data() {
        return {
            menus: [
                { label: "หน้าหลัก", name: "main" },
                { label: "ตะกร้าสินค้า", name: "cart" },
            ],
        };
    },
    computed: {   
        isShop() {
            return this.isLoggedIn && this.user.role === "shop";
        }, 
        isAdmin() {
            return this.isLoggedIn && this.user.role === "admin";
        },
        showCart() {
            return !this.isShop && !this.isAdmin;
        },
        homeRoute() {
            if(this.isShop) return "shop-home";
            if(this.isAdmin) return "admin-home";
            return "main";
        },
        visibleMenus() {
            if (this.isAdmin) {
                return [
                    { label: "แดชบอร์ด", name: "admin-home" },
                    { label: "ผู้ใช้ทั้งหมด", name: "admin-users" },
                    { label: "สินค้าทั้งหมด", name: "admin-products" },
                ];
            }
            if (this.isShop) {
                return [
                    { label: "หน้าหลัก", name: "shop-home" },
                    { label: "สินค้าของฉัน", name: "shop-products" },
                    { label: "ออเดอร์ที่ได้รับ", name: "shop-orders" },
                ];
            }
            const list = [...this.menus];
            if (this.isLoggedIn && this.user.role === "user") {
                list.push({ label: "ออเดอร์ของฉัน", name: "orders" });
            }
            return list;
        },
        isLoggedIn() {
            return !!this.$store.state.token;
        },
        user() {
            return this.$store.state.user || {};
        },
        displayName() {
            return this.user.name || this.user.username || "";
        },
        roleText() {
            return ROLE_TEXT[this.user.role] || "";
        },
        cartCount() {
            return cart.items.reduce((sum, i) => sum + i.qty, 0);
        },
    },
    methods: {
        goCart() {
            this.$router.push({ name: "cart" });
        },
        goLogin() {
            this.$router.push({ name: "login" });
        },
        async logout() {
            await this.$store.dispatch("logout");
            clearCart();
            this.$router.push({ name: "login" });
        },
    },
};
</script>

<style scoped>
.nav-menu {
    flex: 1 1 auto;
}
.nav-right {
    flex: 0 0 auto;
}
.cart-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    max-width: 36px;
    flex: 0 0 36px;
    padding: 0;
    border-radius: 9999px;
    transition: background 0.15s;
}
.cart-btn:hover {
    background: #f3f4f6;
}
.cart-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    box-shadow: 0 0 0 2px #fff;
}
.profile {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
    width: max-content;
}
.profile-text {
    flex: 0 0 auto;
    width: max-content;
    line-height: 1.25;
}
.profile-name {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
}
.profile-role {
    margin: 0;
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
}
</style>