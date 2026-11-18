<template>
    <div class="font-kanit py-8">
        <h1 class="text-2xl font-bold text-slate-800">ออเดอร์ของฉัน</h1>
        <p class="mt-1 text-sm text-slate-500">จัดการออเดอร์ทั้งหมดของลูกค้าที่สั่งซื้อสินค้าของร้าน</p>

        <div v-if="loading" class="py-20 text-center text-gray-500">กำลังโหลด...</div>
        <p v-else-if="errorMsg" class="py-20 text-center text-red-500">{{ errorMsg }}</p>
        <p v-else-if="orders.length === 0" class="py-20 text-center text-gray-500">
            ยังไม่มีออเดอร์
        </p>

        <div v-else class="mt-6">
            <div
                class="hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-xs text-gray-500 md:grid"
            >
                <span class="col-span-4">สินค้า</span>
                <span class="col-span-3">ลูกค้า</span>
                <span class="col-span-1 text-center">จำนวน</span>
                <span class="col-span-2 text-right">ราคารวม</span>
                <span class="col-span-2 text-right">วันที่</span>
            </div>

            <div
                v-for="o in orders"
                :key="o._id"
                class="grid grid-cols-12 items-center gap-4 border-b border-gray-100 py-4"
            >
                <div class="col-span-12 flex items-center gap-3 md:col-span-4">
                    <!-- กรอบรูปขนาดคงที่ (เท่ากันทุกใบ) -->
                    <div class="thumb">
                        <img
                            v-if="o.product && o.product.image"
                            :src="imageUrl(o.product.image)"
                            :alt="o.product.name"
                        />
                        <v-icon v-else color="grey lighten-1">mdi-image-off-outline</v-icon>
                    </div>
                    <p class="text-sm text-gray-800">
                        {{ o.product ? o.product.name : "สินค้าถูกลบแล้ว" }}
                    </p>
                </div>

                <div class="col-span-12 text-sm text-gray-700 md:col-span-3">
                    <p>{{ o.user ? o.user.name : "-" }}</p>
                    <p class="text-xs text-gray-500">{{ o.user ? o.user.tel : "" }}</p>
                </div>

                <p class="col-span-4 text-sm md:col-span-1 md:text-center">x {{ o.quantity }}</p>
                <p class="col-span-4 text-right text-sm md:col-span-2">฿ {{ total(o) }}</p>
                <p class="col-span-4 text-right text-xs text-gray-500 md:col-span-2">
                    {{ dateText(o) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { API_BASE } from "../config";
export default {
    name: "ShopOrders",
    data() {
        return { loading: false, errorMsg: "", orders: [] };
    },
    mounted() {
        this.getOrders();
    },
    methods: {
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `${API_BASE}${path}`;
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
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    `${API_BASE}/api/v1/orders/mine/shop`,
                    { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
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

<style scoped>
/* ===== กรอบรูปสินค้า: ขนาดเท่ากันทุกใบ ===== */
.thumb {
    width: 64px;
    height: 64px;
    min-width: 64px;
    max-width: 64px;
    flex: 0 0 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
}
.thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* เปลี่ยนเป็น contain ถ้าไม่อยากให้รูปถูกตัด */
    display: block;
}
</style>