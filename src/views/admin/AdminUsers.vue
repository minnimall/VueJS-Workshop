<template>
    <div class="min-h-screen font-kanit">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <!-- Header -->
            <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-2xl font-bold tracking-tight text-slate-800">
                            จัดการผู้ใช้
                        </h1>
                    </div>
                    <p class="mt-1 text-sm text-slate-500">
                        จัดการข้อมูลสมาชิก ตรวจสอบและอนุมัติบัญชีผู้ใช้งานในระบบ
                    </p>
                </div>

                <!-- <v-btn outlined color="#153a5b" class="rounded-xl" :loading="loading" @click="load">
                    <v-icon left small>mdi-refresh</v-icon>
                    รีเฟรชข้อมูล
                </v-btn> -->
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

            <!-- Main Content -->
            <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

                <!-- Toolbar -->
                <div class="border-b border-slate-100 p-5 sm:p-6">
                    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        <div>
                            <h2 class="text-base font-semibold text-slate-800">
                                รายชื่อผู้ใช้งาน
                            </h2>
                            <p class="mt-1 text-xs text-slate-400">
                                แสดงข้อมูลสมาชิกและจัดการสถานะบัญชี
                            </p>
                        </div>

                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">

                            <!-- Filters -->
                            <div class="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1">
                                <button
                                    v-for="f in filters"
                                    :key="f.value"
                                    class="rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
                                    :class="filter === f.value
                                        ? 'bg-white text-[#153a5b] shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'"
                                    @click="filter = f.value"
                                >
                                    {{ f.label }}
                                    <span
                                        class="ml-1 rounded-md px-1.5 py-0.5 text-[10px]"
                                        :class="filter === f.value ? 'bg-blue-50 text-[#153a5b]' : 'bg-slate-200/70 text-slate-500'"
                                    >
                                        {{ count(f.value) }}
                                    </span>
                                </button>
                            </div>

                            <!-- Search -->
                            <div class="w-full sm:w-64">
                                <v-text-field
                                    v-model="search"
                                    placeholder="ค้นหาชื่อ / Username / เบอร์โทร"
                                    prepend-inner-icon="mdi-magnify"
                                    outlined
                                    dense
                                    hide-details
                                    clearable
                                    class="admin-search"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                    <v-progress-circular indeterminate color="#153a5b" size="36" />
                    <p class="mt-3 text-sm text-slate-500">กำลังโหลดข้อมูลผู้ใช้...</p>
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
                        <v-icon color="grey lighten-1" size="32">mdi-account-search-outline</v-icon>
                    </div>
                    <p class="mt-3 text-sm font-semibold text-slate-700">ไม่พบผู้ใช้</p>
                    <p class="mt-1 text-xs text-slate-400">
                        ลองเปลี่ยนตัวกรองหรือคำค้นหาอีกครั้ง
                    </p>
                </div>

                <!-- User Table -->
                <div v-else class="overflow-x-auto">
                    <div class="min-w-[850px]">

                        <!-- Table Header -->
                        <div class="grid grid-cols-12 items-center gap-3 bg-slate-50/80 px-6 py-3 text-xs font-semibold text-slate-500">
                            <span class="col-span-3">ชื่อผู้ใช้งาน</span>
                            <span class="col-span-2">Username</span>
                            <span class="col-span-2">เบอร์โทรศัพท์</span>
                            <span class="col-span-1">ประเภท</span>
                            <span class="col-span-2">สถานะบัญชี</span>
                            <span class="col-span-2 text-right">จัดการ</span>
                        </div>

                        <!-- Table Rows -->
                        <div
                            v-for="u in shown"
                            :key="u._id"
                            class="grid grid-cols-12 items-center gap-3 border-t border-slate-100 px-6 py-4 transition hover:bg-slate-50/70"
                        >
                            <!-- Name -->
                            <div class="col-span-3 flex min-w-0 items-center gap-3">
                                <div class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-50">
                                    <v-icon color="#153a5b" small>mdi-account-outline</v-icon>
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-semibold text-slate-800">
                                        {{ u.name || "-" }}
                                    </p>
                                    <p class="mt-0.5 text-[10px] text-slate-400">
                                        สมาชิก
                                    </p>
                                </div>
                            </div>

                            <!-- Username -->
                            <p class="col-span-2 truncate text-sm text-slate-600">
                                {{ u.username || "-" }}
                            </p>

                            <!-- Phone -->
                            <p class="col-span-2 text-sm text-slate-600">
                                {{ u.tel || "-" }}
                            </p>

                            <!-- Role -->
                            <div class="col-span-1">
                                <span
                                    class="inline-flex rounded-lg px-2 py-1 text-[11px] font-medium"
                                    :class="{
                                        'bg-blue-50 text-blue-700': u.role === 'user',
                                        'bg-violet-50 text-violet-700': u.role === 'shop',
                                        'bg-slate-100 text-slate-700': u.role === 'admin'
                                    }"
                                >
                                    {{ roleText(u.role) }}
                                </span>
                            </div>

                            <!-- Status -->
                            <div class="col-span-2">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                                    :class="u.approve
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-orange-50 text-orange-600'"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="u.approve ? 'bg-emerald-500' : 'bg-orange-400'"
                                    ></span>
                                    {{ u.approve ? "อนุมัติแล้ว" : "รออนุมัติ" }}
                                </span>
                            </div>

                            <!-- Actions -->
                            <div class="col-span-2 flex justify-end">
                                <v-btn
                                    v-if="!u.approve"
                                    small
                                    dark
                                    depressed
                                    color="#153a5b"
                                    class="rounded-lg !px-3"
                                    :disabled="!!busyId"
                                    @click="openConfirm(u, true)"
                                >
                                    <v-icon left x-small>mdi-check</v-icon>
                                    อนุมัติ
                                </v-btn>

                                <v-btn
                                    v-else-if="u._id !== myId"
                                    small
                                    outlined
                                    color="red"
                                    class="rounded-lg !px-3"
                                    :disabled="!!busyId"
                                    @click="openConfirm(u, false)"
                                >
                                    <v-icon left x-small>mdi-close</v-icon>
                                    ยกเลิก
                                </v-btn>

                                <span v-else class="text-xs text-slate-400">
                                    บัญชีของคุณ
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
                    <p class="text-[11px] text-slate-400">
                        แสดง {{ shown.length }} จาก {{ users.length }} รายการ
                    </p>
                </div>
            </div>
        </div>

        <!-- Modal: ยืนยันอนุมัติ / ยกเลิกการอนุมัติ -->
        <v-dialog v-model="confirmDialog" max-width="420" :persistent="!!busyId">
            <div v-if="target" class="font-kanit rounded-2xl bg-white p-6 text-center">
                <div
                    class="confirm-icon"
                    :class="nextApprove ? 'bg-emerald-50' : 'bg-red-50'"
                >
                    <v-icon large :color="nextApprove ? 'green darken-1' : 'red'">
                        {{ nextApprove ? "mdi-account-check-outline" : "mdi-account-cancel-outline" }}
                    </v-icon>
                </div>

                <h3 class="mt-4 text-lg font-bold text-gray-900">
                    {{ nextApprove ? "อนุมัติผู้ใช้?" : "ยกเลิกการอนุมัติ?" }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{
                        nextApprove
                            ? "ผู้ใช้รายนี้จะสามารถเข้าใช้งานระบบได้"
                            : "ผู้ใช้รายนี้จะกลับไปอยู่ในสถานะรออนุมัติ"
                    }}
                </p>

                <div class="user-card">
                    <div class="user-avatar">
                        <v-icon color="#153a5b" small>mdi-account-outline</v-icon>
                    </div>
                    <div class="user-info">
                        <p class="user-name">{{ target.name || "-" }}</p>
                        <p class="user-sub">
                            @{{ target.username || "-" }} · {{ roleText(target.role) }}
                        </p>
                    </div>
                </div>

                <div class="mt-6 flex gap-3">
                    <button
                        type="button"
                        :disabled="!!busyId"
                        class="flex-1 rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
                        @click="confirmDialog = false"
                    >
                        ปิด
                    </button>
                    <button
                        type="button"
                        :disabled="!!busyId"
                        class="flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
                        :class="
                            nextApprove
                                ? 'bg-[#153a5b] hover:bg-[#0f2c46]'
                                : 'bg-red-500 hover:bg-red-600'
                        "
                        @click="setApprove"
                    >
                        {{ busyId ? "กำลังดำเนินการ..." : nextApprove ? "อนุมัติ" : "ยกเลิกการอนุมัติ" }}
                    </button>
                </div>
            </div>
        </v-dialog>
    </div>
</template>


<script>
import { API_BASE } from "../../config";
const ROLE_TEXT = { user: "ลูกค้า", shop: "ร้านค้า", admin: "แอดมิน" };

const STAT_IMG = {
    all: require("../../assets/แมวมือ.png"),
    pending: require("../../assets/playzo/meowapprove.jpg"),
    approved: require("../../assets/playzo/meowappro.jpg"),
};

export default {
    name: "AdminUsers",
    data() {
        return {
            loading: false,
            errorMsg: "",
            users: [],
            filter: this.$route.query.filter === "pending" ? "pending" : "all",
            search: "",
            busyId: "",
            filters: [
                { label: "ทั้งหมด", value: "all" },
                { label: "รออนุมัติ", value: "pending" },
                { label: "อนุมัติแล้ว", value: "approved" },
            ],

            // modal ยืนยัน
            confirmDialog: false,
            target: null,
            nextApprove: true,
        };
    },
    computed: {
        myId() {
            const u = this.$store.state.user;
            return u ? u._id : "";
        },
        shown() {
            const q = this.search ? this.search.trim().toLowerCase() : "";
            return this.users.filter((u) => {
                if (this.filter === "pending" && u.approve) return false;
                if (this.filter === "approved" && !u.approve) return false;
                if (!q) return true;
                return [u.name, u.username, u.tel].some((v) =>
                    String(v || "").toLowerCase().includes(q)
                );
            });
        },
        summaryCards() {
            return [
                {
                    label: "ผู้ใช้ทั้งหมด",
                    value: this.count("all"),
                    img: STAT_IMG.all,
                    icon: "mdi-account-group-outline",
                    color: "#153a5b",
                    valueClass: "text-slate-800",
                },
                {
                    label: "รออนุมัติ",
                    value: this.count("pending"),
                    img: STAT_IMG.pending,
                    icon: "mdi-account-clock-outline",
                    color: "#ea8a24",
                    valueClass: "text-slate-800",
                },
                {
                    label: "อนุมัติแล้ว",
                    value: this.count("approved"),
                    img: STAT_IMG.approved,
                    icon: "mdi-account-check-outline",
                    color: "#15966b",
                    valueClass: "text-slate-800",
                },
            ];
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        authHeader() {
            return { headers: { Authorization: `Bearer ${this.$store.state.token}` } };
        },
        roleText(r) {
            return ROLE_TEXT[r] || r;
        },
        count(f) {
            if (f === "pending") return this.users.filter((u) => !u.approve).length;
            if (f === "approved") return this.users.filter((u) => u.approve).length;
            return this.users.length;
        },
        async load() {
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    `${API_BASE}/api/v1/admin/users`,
                    this.authHeader()
                );
                this.users = Array.isArray(data) ? data : data.data || [];
            } catch (error) {
                console.log(error);
                this.errorMsg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "โหลดผู้ใช้ไม่สำเร็จ";
            } finally {
                this.loading = false;
            }
        },

        // เปิด modal ยืนยัน
        openConfirm(u, approve) {
            this.target = u;
            this.nextApprove = approve;
            this.confirmDialog = true;
        },

        // กดยืนยันใน modal
        async setApprove() {
            const u = this.target;
            if (!u) return;

            this.busyId = u._id;
            try {
                await this.axios.patch(
                    `${API_BASE}/api/v1/admin/users/${u._id}/approve`,
                    { approve: this.nextApprove },
                    this.authHeader()
                );
                u.approve = this.nextApprove;
                this.confirmDialog = false;
            } catch (error) {
                console.log(error);
                alert(
                    (error.response && error.response.data && error.response.data.message) ||
                        "ดำเนินการไม่สำเร็จ"
                );
            } finally {
                this.busyId = "";
            }
        },
    },
};
</script>

<style scoped>
    .admin-search {
        border-radius: 12px;
    }

    .admin-search ::v-deep .v-input__slot {
        border-radius: 12px !important;
        min-height: 40px !important;
        background: #fff !important;
    }

    .admin-search ::v-deep input {
        font-family: inherit;
        font-size: 12px;
    }

    .admin-search ::v-deep .v-input__icon {
        font-size: 18px;
    }

    .confirm-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        min-width: 64px;
        max-width: 64px;
        flex: 0 0 64px;
        margin: 0 auto;
        border-radius: 9999px;
    }
    .user-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 20px;
        padding: 12px;
        text-align: left;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #f9fafb;
    }
    .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        min-width: 40px;
        max-width: 40px;
        flex: 0 0 40px;
        border-radius: 9999px;
        background: #eef4fb;
    }
    .user-info {
        flex: 1 1 auto;
        min-width: 0;
    }
    .user-name {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .user-sub {
        margin: 2px 0 0;
        font-size: 12px;
        color: #6b7280;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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