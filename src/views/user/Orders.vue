<template>
    <div class="font-kanit py-8">
        <h1 class="text-2xl font-bold text-slate-800">ออเดอร์ของฉัน</h1>

        <div v-if="loading" class="py-20 text-center text-gray-500">กำลังโหลด...</div>

        <p v-else-if="errorMsg" class="py-20 text-center text-red-500">{{ errorMsg }}</p>

        <div v-else-if="orders.length === 0" class="py-20 text-center text-gray-500">
            <v-icon large color="grey">mdi-package-variant-closed</v-icon>
            <p class="mt-3">ยังไม่มีออเดอร์</p>
            <router-link
                :to="{ name: 'main' }"
                class="mt-4 inline-block text-sm !text-[#153a5b] underline"
            >
                ไปเลือกซื้อสินค้า
            </router-link>
        </div>

        <div v-else class="mt-6">
            <div
                class="hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-xs text-gray-500 md:grid"
            >
                <span class="col-span-6">สินค้า</span>
                <span class="col-span-2 text-center">จำนวน</span>
                <span class="col-span-2 text-right">ราคารวม</span>
                <span class="col-span-2 text-right">วันที่สั่งซื้อ</span>
            </div>

            <div
                v-for="o in orders"
                :key="o._id"
                class="grid grid-cols-12 items-center gap-4 border-b border-gray-100 py-4"
            >
                <div class="col-span-12 flex items-center gap-4 md:col-span-6">
                    <!-- กรอบรูป: ล็อกขนาดเท่ากันทุกแถว -->
                    <div
                        class="flex-none overflow-hidden rounded-lg border border-gray-200 bg-white"
                        style="width: 64px; height: 64px; min-width: 64px"
                    >
                        <img
                            v-if="o.product && o.product.image"
                            :src="imageUrl(o.product.image)"
                            :alt="o.product.name"
                            class="block h-full w-full object-contain p-1"
                        />
                    </div>

                    <p class="min-w-0 flex-1 text-sm text-gray-800">
                        {{ o.product ? o.product.name : "สินค้านี้ถูกลบแล้ว" }}
                    </p>
                </div>

                <p class="col-span-4 text-sm text-gray-700 md:col-span-2 md:text-center">
                    x {{ o.quantity }}
                </p>

                <p class="col-span-4 text-right text-sm text-gray-800 md:col-span-2">
                    ฿ {{ total(o) }}
                </p>

                <p class="col-span-4 text-right text-xs text-gray-500 md:col-span-2">
                    {{ dateText(o) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrdersView",
    data() {
        return {
            loading: false,
            errorMsg: "",
            orders: [],
        };
    },
    mounted() {
        this.getOrders();
    },
    methods: {
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },
        total(o) {
            const price = o.product ? o.product.price : 0;
            return Number(price * o.quantity).toLocaleString();
        },
        dateText(o) {
            const d = o.createdAt
                ? new Date(o.createdAt)
                : new Date(parseInt(o._id.substring(0, 8), 16) * 1000);
            return d.toLocaleString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        async getOrders() {
            const token = this.$store.state.token;
            if (!token) {
                this.$router.push({ name: "login" });
                return;
            }
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    "http://localhost:3000/api/v1/orders/mine",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.orders = Array.isArray(data) ? data : data.data || [];
            } catch (error) {
                console.log(error);
                this.errorMsg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "โหลดออเดอร์ไม่สำเร็จ";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>