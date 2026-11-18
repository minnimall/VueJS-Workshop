<template>
    <div class="font-kanit py-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-xl font-bold text-slate-800">
                    สวัสดี
                    <span class="ml-1 text-3xl text-[#153a5b]">{{ shopName }}</span>
                </h1>
                <p class="mt-1 text-sm text-gray-500">ภาพรวมร้านค้าของคุณ</p>
            </div>
        </div>

        <div v-if="loading" class="py-20 text-center text-gray-500">กำลังโหลด...</div>
        <p v-else-if="errorMsg" class="py-20 text-center text-red-500">{{ errorMsg }}</p>

        <template v-else>
            <!-- สถิติ -->
            <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div  v-for="s in stats"  :key="s.label"  class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4">
                    <img v-if="s.img" :src="s.img" :alt="s.label" class="h-16 w-16 flex-none object-contain"/>
                    <div class="flex-1" :class="s.img ? 'text-center' : ''">
                        <p class="text-sm text-gray-500">{{ s.label }}</p>
                        <p class="mt-1 text-2xl font-medium" :class="s.color || 'text-black'">
                            {{ s.value }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div class="h-fit min-w-0 rounded-2xl border border-solid border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-medium text-black">ออเดอร์ล่าสุด</h2>
                        <router-link
                            :to="{ name: 'shop-orders' }"
                            class="text-xs !text-[#153a5b] hover:!text-black"
                        >
                            ดูทั้งหมด
                            <v-icon x-small>mdi-arrow-top-right</v-icon>
                        </router-link>
                    </div>

                    <p
                        v-if="recentOrders.length === 0"
                        class="py-8 text-center text-sm text-gray-500"
                    >
                        ยังไม่มีออเดอร์
                    </p>

                    <div class="mt-3">
                        <div v-for="o in recentOrders" :key="o._id" class="flex items-center gap-4 border-t border-solid border-gray-100 py-4">
                            <div class="flex flex-none items-center justify-center overflow-hidden"  style="width: 56px; height: 56px; min-width: 56px">
                                <img  v-if="o.product && o.product.image"  :src="imageUrl(o.product.image)" :alt="o.product.name"  class="block h-full w-full object-contain"/>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm text-gray-800">
                                    {{ o.product ? o.product.name : "สินค้าถูกลบแล้ว" }}
                                    <span class="ml-2 text-xs font-bold text-[#153a5b]">
                                        x {{ o.quantity }}
                                    </span>
                                </p>
                                <p class="mt-0.5 text-[10px] text-gray-500">
                                    จาก {{ o.user ? o.user.name : "-" }}
                                </p>
                            </div>

                            <p class="shrink-0 text-sm text-gray-800">
                                ฿ {{ fmt(orderTotal(o)) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="h-fit min-w-0 rounded-2xl border border-solid border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-medium text-black">สินค้าใกล้หมด</h2>
                        <router-link :to="{ name: 'shop-products' }" class="text-xs !text-[#153a5b] hover:!text-black">
                            จัดการ
                            <v-icon x-small>mdi-arrow-top-right</v-icon>
                        </router-link>
                    </div>

                    <p v-if="lowStock.length === 0" class="py-8 text-center text-sm text-gray-500">
                        ไม่มีสินค้าใกล้หมด
                    </p>

                    <div class="mt-3">
                        <div v-for="p in lowStock" :key="p._id" class="flex items-center gap-4 border-t border-gray-100 py-4">
                            <div class="flex flex-none items-center justify-center overflow-hidden" style="width: 48px; height: 48px; min-width: 48px">
                                <img v-if="p.image" :src="imageUrl(p.image)" :alt="p.name" class="block h-full w-full object-contain"/>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm text-gray-800">{{ p.name }}</p>
                                <p class="mt-1 text-xs font-medium" :class="p.stock === 0 ? 'text-red-500' : 'text-orange-500'">
                                    {{ p.stock === 0 ? "หมดแล้ว" : `เหลือ ${p.stock} รายการ` }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
const LOW_STOCK = 5; // ถือว่าใกล้หมดเมื่อเหลือไม่เกินกี่ชิ้น

const STAT_IMG = {
    products: require("../../assets/playzo/จอยplay.jpg"),
    lowStock: require("../../assets/playzo/จอยplay.jpg"),
    orders: require("../../assets/playzo/ตะกร้าา.jpg"),
    revenue: require("../../assets/playzo/มันนี่.jpg"),
};

export default {
    name: "ShopDashboard",
    data() {
        return {
            loading: false,
            errorMsg: "",
            products: [],
            orders: [],
        };
    },
    computed: {
        shopName() {
            const u = this.$store.state.user || {};
            return u.name || u.username || "";
        },
        revenue() {
            return this.orders.reduce((sum, o) => sum + this.orderTotal(o), 0);
        },
        lowStock() {
            return this.products
                .filter((p) => p.stock <= LOW_STOCK)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 5);
        },
        recentOrders() {
            return this.orders.slice(0, 5); // backend เรียงใหม่สุดก่อนแล้ว
        },
        stats() {
            return [
                {
                    label: "สินค้าทั้งหมด",
                    value: this.products.length,
                    img: STAT_IMG.products,
                },
                {
                    label: "สินค้าใกล้หมด",
                    value: this.lowStock.length,
                    color: this.lowStock.length ? "text-red-500" : "text-black",
                    img: STAT_IMG.lowStock,
                },
                {
                    label: "ออเดอร์ทั้งหมด",
                    value: this.orders.length,
                    img: STAT_IMG.orders,
                },
                {
                    label: "ยอดขายรวม",
                    value: `฿ ${this.fmt(this.revenue)}`,
                    img: STAT_IMG.revenue,
                },
            ];
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        fmt(n) {
            return Number(n).toLocaleString();
        },
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },
        orderTotal(o) {
            return o.product ? o.product.price * o.quantity : 0;
        },
        list(res) {
            return Array.isArray(res.data) ? res.data : res.data.data || [];
        },
        async load() {
            this.loading = true;
            this.errorMsg = "";
            const config = {
                headers: { Authorization: `Bearer ${this.$store.state.token}` },
            };
            try {
                const [p, o] = await Promise.all([
                    this.axios.get("http://localhost:3000/api/v1/products/mine", config),
                    this.axios.get("http://localhost:3000/api/v1/orders/mine/shop", config),
                ]);
                this.products = this.list(p);
                this.orders = this.list(o);
            } catch (error) {
                console.log(error);
                this.errorMsg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "โหลดข้อมูลไม่สำเร็จ";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>