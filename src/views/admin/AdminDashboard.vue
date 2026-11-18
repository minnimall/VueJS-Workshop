<template>
    <div class="font-kanit py-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-xl font-bold text-slate-800">
                    สวัสดี
                    <span class="ml-1 text-3xl text-[#153a5b]">{{ adminName }}</span>
                </h1>
                <p class="mt-1 text-sm text-gray-500">ภาพรวมทั้งระบบ</p>
            </div>
            <!-- <button
                type="button"
                :disabled="loading"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-solid border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                @click="load"
            >
                <v-icon small :class="loading ? 'animate-spin' : ''">mdi-refresh</v-icon>
                รีเฟรชข้อมูล
            </button> -->
        </div>

        <div v-if="loading && !hasStats" class="py-20 text-center text-gray-500">กำลังโหลด...</div>
        <p v-else-if="errorMsg && !hasStats" class="py-20 text-center text-red-500">{{ errorMsg }}</p>

        <template v-else>
            <p v-if="errorMsg" class="mt-4 rounded-xl border border-solid border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ errorMsg }}
            </p>

            <!-- สถิติ -->
            <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div
                    v-for="s in statCards"
                    :key="s.label"
                    class="flex items-center gap-3 rounded-2xl border border-solid border-gray-200 bg-white px-4 py-4"
                >
                    <div class="stat-img">
                        <img v-if="s.img" :src="s.img" :alt="s.label" />
                        <v-icon v-else :color="s.color" large>{{ s.icon }}</v-icon>
                    </div>
                    <div class="min-w-0 flex-1 text-center">
                        <p class="text-sm text-gray-500">{{ s.label }}</p>
                        <p class="mt-1 text-2xl font-medium" :class="s.valueColor || 'text-black'">
                            {{ s.value }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- รออนุมัติ -->
                <div class="h-fit min-w-0 rounded-2xl border border-solid border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-medium text-black">ผู้ใช้รออนุมัติ</h2>
                        <router-link
                            :to="{ name: 'admin-users', query: { filter: 'pending' } }"
                            class="text-xs !text-[#153a5b] hover:!text-black"
                        >
                            ดูทั้งหมด
                            <v-icon x-small>mdi-arrow-top-right</v-icon>
                        </router-link>
                    </div>

                    <p v-if="!stats.pendingUsers" class="py-8 text-center text-sm text-gray-500">
                        ไม่มีผู้ใช้รออนุมัติ
                    </p>

                    <div v-else class="mt-3 border-t border-solid border-gray-100 pt-4">
                        <div class="flex items-center gap-4">
                            <div class="row-icon bg-amber-50">
                                <v-icon color="amber darken-2">mdi-account-clock-outline</v-icon>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm text-gray-800">
                                    มีผู้ใช้รออนุมัติ {{ formatNumber(stats.pendingUsers) }} คน
                                </p>
                                <p class="mt-1 text-xs font-medium text-orange-500">
                                    กรุณาตรวจสอบบัญชีที่สมัครเข้ามาใหม่
                                </p>
                            </div>
                            <router-link
                                :to="{ name: 'admin-users', query: { filter: 'pending' } }"
                                class="shrink-0 rounded-lg bg-[#153a5b] px-3 py-1.5 text-xs font-medium !text-white transition hover:bg-[#0f2c46]"
                            >
                                ไปอนุมัติ
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- ภาพรวมระบบ -->
                <div class="h-fit min-w-0 rounded-2xl border border-solid border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-medium text-black">ภาพรวมระบบ</h2>
                    </div>

                    <div class="mt-3">
                        <div
                            v-for="r in overview"
                            :key="r.label"
                            class="flex items-center gap-4 border-t border-solid border-gray-100 py-4"
                        >
                            <div class="row-icon" :class="r.bg">
                                <v-icon :color="r.color">{{ r.icon }}</v-icon>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm text-gray-800">{{ r.label }}</p>
                            </div>
                            <p class="ov-value">{{ r.value }}</p>
                            <div class="ov-link-col">
                                <router-link v-if="r.to" :to="r.to" class="ov-link">
                                    จัดการ
                                    <v-icon x-small>mdi-arrow-top-right</v-icon>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { API_BASE } from "../config";
const STAT_IMG = {
    users: require("../../assets/playzo/แมวมือ.png"),
    pending: require("../../assets/playzo/meowapprove.jpg"),
    orders: require("../../assets/playzo/ตะกร้าา.jpg"),
    revenue: require("../../assets/playzo/มันนี่.jpg"),
};
export default {
    name: "AdminDashboard",
    data() {
        return {
            loading: false,
            errorMsg: "",
            stats: {},
        };
    },
    computed: {
        hasStats() {
            return Object.keys(this.stats || {}).length > 0;
        },
        adminName() {
            const u = this.$store.state.user || {};
            return u.name || u.username || "";
        },
        statCards() {
            const s = this.stats || {};
            return [
                {
                    label: "ผู้ใช้ทั้งหมด",
                    value: this.formatNumber(s.users),
                    img: STAT_IMG.users,
                    icon: "mdi-account-group-outline",
                    color: "blue darken-1",
                },
                {
                    label: "รออนุมัติ",
                    value: this.formatNumber(s.pendingUsers),
                    img: STAT_IMG.pending,
                    icon: "mdi-account-clock-outline",
                    color: "amber darken-2",
                    valueColor: s.pendingUsers > 0 ? "text-red-500" : "text-black",
                },
                {
                    label: "ออเดอร์ทั้งหมด",
                    value: this.formatNumber(s.orders),
                    img: STAT_IMG.orders,
                    icon: "mdi-receipt-text-outline",
                    color: "pink darken-1",
                },
                {
                    label: "ยอดขายรวม",
                    value: `฿ ${this.formatNumber(s.revenue)}`,
                    img: STAT_IMG.revenue,
                    icon: "mdi-cash-multiple",
                    color: "green darken-1",
                },
            ];
        },
        overview() {
            const s = this.stats || {};
            return [
                {
                    label: "ร้านค้าทั้งหมด",
                    value: this.formatNumber(s.shops),
                    icon: "mdi-storefront-outline",
                    color: "purple darken-1",
                    bg: "bg-purple-50",
                },
                {
                    label: "ผู้ใช้ทั้งหมด",
                    value: this.formatNumber(s.users),
                    icon: "mdi-account-group-outline",
                    color: "blue darken-1",
                    bg: "bg-blue-50",
                    to: { name: "admin-users" },
                },
                {
                    label: "สินค้าทั้งหมด",
                    value: this.formatNumber(s.products),
                    icon: "mdi-package-variant-closed",
                    color: "teal darken-1",
                    bg: "bg-teal-50",
                    to: { name: "admin-products" },
                },
                {
                    label: "ออเดอร์ทั้งหมด",
                    value: this.formatNumber(s.orders),
                    icon: "mdi-receipt-text-outline",
                    color: "pink darken-1",
                    bg: "bg-pink-50",
                },
            ];
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        formatNumber(value) {
            return Number(value || 0).toLocaleString("th-TH");
        },
        async load() {
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    `${API_BASE}/api/v1/admin/stats`,
                    { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
                );
                this.stats = data.data || data;
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

<style scoped>
/* กรอบไอคอนขนาดคงที่ */
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
.row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    min-width: 44px;
    max-width: 44px;
    flex: 0 0 44px;
    border-radius: 12px;
}
.ov-value {
    margin: 0;
    flex: 0 0 auto;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #1f2937;
}
.ov-link-col {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 0 0 72px;
    width: 72px;
    min-width: 72px;
    height: 20px;
}
.ov-link {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 20px;
    color: #153a5b !important;
}
.ov-link:hover {
    color: #000 !important;
}
</style>