<template>
    <div class="font-kanit py-8">
        <h1 class="text-2xl font-bold text-slate-800">ตะกร้าสินค้า</h1>

        <!-- ตะกร้าว่าง -->
        <div v-if="items.length === 0" class="flex flex-col items-center py-10 text-center">
            <img
                src="../../assets/playzo/ตะกร้า.jpg"
                alt="ยังไม่มีสินค้าในตะกร้า"
                class="w-full max-w-md object-contain"
            />
            <p class="mt-4 text-lg text-gray-800">ยังไม่มีสินค้าในตะกร้า</p>
            <router-link
                :to="{ name: 'main' }"
                class="mt-4 inline-block font-bold !text-[#153a5b] hover:underline"
            >
                เลือกซื้อสินค้า
            </router-link>
        </div>

        <div v-else class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- ซ้าย: รายการสินค้า -->
            <div class="lg:col-span-2">
                <div
                    class="hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-xs text-gray-500 md:grid"
                >
                    <span class="col-span-6">สินค้า</span>
                    <span class="col-span-3 text-center">จำนวน</span>
                    <span class="col-span-2 text-right">ราคารวม</span>
                    <span class="col-span-1"></span>
                </div>

                <div
                    v-for="item in items"
                    :key="item._id"
                    class="grid grid-cols-12 items-center gap-4 border-b border-gray-100 py-4"
                >
                    <!-- สินค้า -->
                    <div class="col-span-12 flex items-center gap-4 md:col-span-6">
                        <!-- กรอบรูปขนาดคงที่ (เท่ากันทุกใบ) -->
                        <div class="thumb">
                            <img v-if="item.image" :src="imageUrl(item.image)" :alt="item.name" />
                            <v-icon v-else color="grey lighten-1">mdi-image-off-outline</v-icon>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm text-gray-800">{{ item.name }}</p>
                            <p class="mt-1 text-xs text-gray-500">
                                ฿ {{ fmt(item.price) }} / ชิ้น
                            </p>
                        </div>
                    </div>

                    <!-- จำนวน -->
                    <div class="col-span-5 flex justify-center md:col-span-3 md:justify-center">
                        <div class="qty">
                            <button
                                type="button"
                                class="qty-btn"
                                :disabled="item.qty <= 1"
                                @click="changeQty(item, item.qty - 1)"
                            >
                                <v-icon small>mdi-minus</v-icon>
                            </button>
                            <span class="qty-num">{{ item.qty }}</span>
                            <button
                                type="button"
                                class="qty-btn"
                                :disabled="item.qty >= item.stock"
                                @click="changeQty(item, item.qty + 1)"
                            >
                                <v-icon small>mdi-plus</v-icon>
                            </button>
                        </div>
                    </div>

                    <!-- ราคารวม -->
                    <p class="col-span-5 text-right text-sm text-gray-800 md:col-span-2">
                        ฿ {{ fmt(item.price * item.qty) }}
                    </p>

                    <!-- ลบ -->
                    <div class="col-span-2 text-right md:col-span-1">
                        <button
                            class="text-gray-400 hover:text-red-500"
                            @click="remove(item._id)"
                        >
                            <v-icon small>mdi-close</v-icon>
                        </button>
                    </div>
                </div>

                <router-link
                    :to="{ name: 'main' }"
                    class="mt-6 inline-flex items-center gap-1 text-sm !text-black hover:!text-gray-500"
                >
                    <v-icon small>mdi-chevron-left</v-icon>
                    เลือกซื้อสินค้าต่อ
                </router-link>
            </div>

            <!-- ขวา: สรุปคำสั่งซื้อ -->
            <aside class="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h2 class="text-xl font-bold text-black">สรุปคำสั่งซื้อ</h2>

                <div class="mt-6 space-y-3 text-sm text-gray-600">
                    <div class="flex justify-between">
                        <span>จำนวนสินค้า</span>
                        <span>{{ totalQty }} ชิ้น</span>
                    </div>
                    <div class="flex justify-between">
                        <span>ราคาสินค้า</span>
                        <span>฿ {{ fmt(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>ค่าจัดส่ง</span>
                        <span>ฟรี</span>
                    </div>
                </div>

                <div
                    class="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-black"
                >
                    <span>รวมทั้งหมด</span>
                    <span>฿ {{ fmt(subtotal) }}</span>
                </div>

                <v-btn
                    large
                    block
                    dark
                    color="#153a5b"
                    class="mt-6"
                    :loading="submitting"
                    :disabled="submitting"
                    @click="checkout"
                >
                    ยืนยันคำสั่งซื้อ
                </v-btn>
            </aside>
        </div>
    </div>
</template>

<script>
import { API_BASE } from "../config";
import { cart, setQty, removeItem } from "../../store/cart";
import { toast } from "../../store/toast";

export default {
    name: "Cart",
    data() {
        return {
            submitting: false,
        };
    },
    computed: {
        items() {
            return cart.items;
        },
        totalQty() {
            return this.items.reduce((sum, i) => sum + i.qty, 0);
        },
        subtotal() {
            return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
        },
    },
    methods: {
        fmt(n) {
            return Number(n).toLocaleString();
        },
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `${API_BASE}${path}`;
        },
        changeQty(item, qty) {
            setQty(item._id, qty);
        },
        remove(id) {
            removeItem(id);
        },
        async checkout() {
            const token = this.$store.state.token;
            if (!token) {
                toast.info("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");
                this.$router.push({ name: "login" });
                return;
            }

            this.submitting = true;

            let success = 0;
            // ยิงทีละรายการ เพราะ API รับ 1 product ต่อ 1 order
            for (const item of [...this.items]) {
                try {
                    await this.axios.post(
                        `${API_BASE}/api/v1/products/${item._id}/orders`,
                        { quantity: item.qty },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    removeItem(item._id); // สั่งสำเร็จแล้วเอาออกจากตะกร้า
                    success++;
                } catch (error) {
                    const msg =
                        (error.response && error.response.data && error.response.data.message) ||
                        "เกิดข้อผิดพลาด";
                    toast.error(`${item.name}: ${msg}`, 5000);
                }
            }

            if (success > 0) {
                toast.success(`สั่งซื้อสำเร็จ ${success} รายการ`);
                if (this.items.length === 0) {
                    this.$router.push({ name: "orders" });
                }
            }
            this.submitting = false;
        },
    },
};
</script>

<style scoped>
/* ===== กรอบรูปสินค้า: ขนาดเท่ากันทุกใบ ===== */
.thumb {
    width: 80px;
    height: 80px;
    min-width: 80px;
    max-width: 80px;
    flex: 0 0 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #fff;
}
.thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* เปลี่ยนเป็น cover ถ้าอยากให้รูปเต็มกรอบ (ขอบอาจถูกตัด) */
    display: block;
}
/* ===== ตัวเพิ่ม / ลดจำนวน ===== */
.qty {
    display: inline-flex;
    align-items: center;
    width: 112px;
    height: 36px;
    overflow: hidden;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #fff;
}
.qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 100%;
    flex: 0 0 36px;
    color: #153a5b;
    transition: background 0.15s;
}
.qty-btn:hover:not(:disabled) {
    background: #eef4fb;
}
.qty-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
.qty-btn .v-icon {
    color: inherit !important;
}
.qty-num {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #111827;
}
</style>