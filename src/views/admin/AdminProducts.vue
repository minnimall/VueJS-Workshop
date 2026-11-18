<template>
    <div class="min-h-screen font-kanit">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <!-- Header -->
            <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-2xl font-bold tracking-tight text-slate-800">
                            จัดการสินค้า
                        </h1>
                    </div>
                    <p class="mt-1 text-sm text-slate-500">
                        ตรวจสอบข้อมูลสินค้า ราคา และจำนวนสินค้าคงเหลือในระบบ
                    </p>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div
                    v-for="c in summaryCards"
                    :key="c.label"
                    class="flex items-center gap-4 rounded-2xl border border-solid border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="stat-img">
                        <img v-if="c.img" :src="c.img" :alt="c.label" />
                        <v-icon v-else :color="c.color" size="36">{{ c.icon }}</v-icon>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-slate-500">{{ c.label }}</p>
                        <p class="mt-1 text-2xl font-bold" :class="c.valueClass">{{ c.value }}</p>
                    </div>
                </div>
            </div>

            <!-- Main Card -->
            <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

                <!-- Toolbar -->
                <div class="border-b border-slate-100 p-5 sm:p-6">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 class="text-base font-semibold text-slate-800">
                                รายการสินค้าทั้งหมด
                            </h2>
                            <p class="mt-1 text-xs text-slate-400">
                                ตรวจสอบสินค้าและข้อมูลร้านค้าที่เป็นเจ้าของ
                            </p>
                        </div>

                        <div class="w-full sm:w-72">
                            <v-text-field
                                v-model="search"
                                placeholder="ค้นหาชื่อสินค้า / ร้านค้า"
                                prepend-inner-icon="mdi-magnify"
                                outlined
                                dense
                                hide-details
                                clearable
                                class="admin-product-search"
                            />
                        </div>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                    <v-progress-circular indeterminate color="#153a5b" size="36" />
                    <p class="mt-3 text-sm text-slate-500">กำลังโหลดข้อมูลสินค้า...</p>
                </div>

                <!-- Error -->
                <div v-else-if="errorMsg" class="flex flex-col items-center justify-center py-16">
                    <v-icon color="red lighten-2" size="40">mdi-alert-circle-outline</v-icon>
                    <p class="mt-3 text-sm text-red-500">{{ errorMsg }}</p>
                    <v-btn outlined small color="#153a5b" class="mt-4 rounded-lg" @click="load">
                        ลองอีกครั้ง
                    </v-btn>
                </div>

                <!-- Empty -->
                <div v-else-if="shown.length === 0" class="flex flex-col items-center justify-center py-20">
                    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                        <v-icon color="grey lighten-1" size="32">mdi-package-variant-closed</v-icon>
                    </div>
                    <p class="mt-3 text-sm font-semibold text-slate-700">ไม่พบสินค้า</p>
                    <p class="mt-1 text-xs text-slate-400">
                        ลองเปลี่ยนคำค้นหาอีกครั้ง
                    </p>
                </div>

                <!-- Product Table -->
                <div v-else class="overflow-x-auto">
                    <div class="min-w-[800px]">

                        <!-- Table Header -->
                        <div class="prod-grid prod-head">
                            <span>สินค้า</span>
                            <span>ร้านค้า</span>
                            <span>ราคา</span>
                            <span>สต็อกสินค้า</span>
                        </div>

                        <!-- Rows -->
                        <div
                            v-for="p in shown"
                            :key="p._id"
                            class="prod-grid prod-row"
                        >
                            <!-- Product -->
                            <div class="flex min-w-0 items-center justify-center gap-3">
                                <div class="thumb">
                                    <img v-if="p.image" :src="imageUrl(p.image)" :alt="p.name" />
                                    <v-icon v-else color="grey lighten-1">
                                        mdi-image-off-outline
                                    </v-icon>
                                </div>

                                <div class="min-w-0">
                                    <router-link
                                        :to="{ name: 'product-detail', params: { id: p._id } }"
                                        class="block truncate text-sm font-light !text-slate-800 transition hover:!text-[#153a5b]"
                                    >
                                        {{ p.name }}
                                    </router-link>
                                </div>
                            </div>

                            <!-- Shop -->
                            <div class="min-w-0">
                                <p class="truncate text-sm text-slate-600">
                                    {{ p.shop ? p.shop.name : "-" }}
                                </p>
                            </div>

                            <!-- Price -->
                            <div>
                                <p class="text-sm font-medium text-slate-800">
                                    ฿{{ Number(p.price || 0).toLocaleString() }}
                                </p>
                            </div>

                            <!-- Stock -->
                            <div class="flex justify-center">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                    :class="Number(p.stock) === 0
                                        ? 'bg-red-50 text-red-600'
                                        : Number(p.stock) <= 5
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'bg-emerald-50 text-emerald-700'"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="Number(p.stock) === 0
                                            ? 'bg-red-500'
                                            : Number(p.stock) <= 5
                                                ? 'bg-orange-400'
                                                : 'bg-emerald-500'"
                                    ></span>
                                    {{ Number(p.stock) === 0 ? "หมดสินค้า" : `${p.stock} ชิ้น` }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    v-if="!loading && !errorMsg"
                    class="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:px-6"
                >
                    <p class="text-xs text-slate-500">
                        แสดง {{ shown.length }} จาก {{ products.length }} รายการ
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { API_BASE } from "../../config";
const STAT_IMG = {
    total: require("../../assets/playzo/จอยplay.jpg"),
    low: require("../../assets/playzo/จอยplay.jpg"),
    out: require("../../assets/playzo/ตะกร้าา.jpg"),
};

export default {
    name: "AdminProducts",
    data() {
        return { loading: false, errorMsg: "", products: [], search: "" };
    },
    computed: {
        lowStockCount() {
            return this.products.filter(
                (p) => Number(p.stock) > 0 && Number(p.stock) <= 5
            ).length;
        },
        outOfStockCount() {
            return this.products.filter(
                (p) => Number(p.stock) <= 0
            ).length;
        },
        shown() {
            const q = this.search ? this.search.trim().toLowerCase() : "";
            if (!q) return this.products;

            return this.products.filter(
                (p) =>
                    String(p.name || "").toLowerCase().includes(q) ||
                    (p.shop && String(p.shop.name || "").toLowerCase().includes(q))
            );
        },
        summaryCards() {
            return [
                {
                    label: "สินค้าทั้งหมด",
                    value: this.products.length,
                    img: STAT_IMG.total,
                    icon: "mdi-package-variant-closed",
                    color: "#153a5b",
                    valueClass: "text-slate-800",
                },
                {
                    label: "สินค้าใกล้หมด",
                    value: this.lowStockCount,
                    img: STAT_IMG.low,
                    icon: "mdi-alert-circle-outline",
                    color: "#ea8a24",
                    valueClass: "text-slate-800",
                },
                {
                    label: "สินค้าหมด",
                    value: this.outOfStockCount,
                    img: STAT_IMG.out,
                    icon: "mdi-package-variant-remove",
                    color: "#dc5050",
                    valueClass: "text-slate-800",
                },
            ];
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `${API_BASE}${path}`;
        },
        async load() {
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    `${API_BASE}/api/v1/admin/products`,
                    { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
                );
                this.products = Array.isArray(data) ? data : data.data || [];
            } catch (error) {
                console.log(error);
                this.errorMsg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "โหลดสินค้าไม่สำเร็จ";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
    /* ===== คอลัมน์ตาราง: กำหนดความกว้างตรง ๆ ===== */
    .prod-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap: 40px;
        align-items: center;
        padding-left: 24px;
        padding-right: 24px;
    }
    .prod-head {
        padding-top: 12px;
        padding-bottom: 12px;
        background: rgba(248, 250, 252, 0.8);
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
    }
    .prod-row {
        padding-top: 14px;
        padding-bottom: 14px;
        border-top: 1px solid #f1f5f9;
        transition: background 0.15s;
    }
    .prod-row:hover {
        background: rgba(248, 250, 252, 0.7);
    }

    .prod-grid > * {
        text-align: center;
    }

    /* ===== กรอบรูปสินค้า: ขนาดเท่ากันทุกใบ ===== */
    .thumb {
        width: 56px;
        height: 56px;
        min-width: 56px;
        max-width: 56px;
        flex: 0 0 56px;
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
        object-fit: contain; /* เปลี่ยนเป็น cover ถ้าอยากให้รูปเต็มกรอบ (ขอบอาจถูกตัด) */
        display: block;
    }

    /* ===== ช่องค้นหา ===== */
    .admin-product-search ::v-deep .v-input__slot {
        min-height: 40px !important;
        border-radius: 12px !important;
        background: #fff !important;
    }
    .admin-product-search ::v-deep input {
        font-family: inherit;
        font-size: 12px;
    }
    .stat-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 84px;
        height: 84px;
        min-width: 84px;
        max-width: 84px;
        flex: 0 0 84px;
    }
    .stat-img img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }
</style>