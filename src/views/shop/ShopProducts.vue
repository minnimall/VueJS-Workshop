<template>
    <div class="font-kanit py-8">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-slate-800">สินค้าของฉัน</h1>

            <v-btn dark depressed color="#153a5b" class="rounded-lg" @click="openForm()">
                <v-icon left small>mdi-plus</v-icon>
                เพิ่มสินค้า
            </v-btn>
        </div>
        <p class="mt-1 text-sm text-slate-500">จัดการสินค้าทั้งหมดในร้านค้า</p>

        <div v-if="loading" class="py-20 text-center text-gray-500">กำลังโหลด...</div>
        <p v-else-if="errorMsg" class="py-20 text-center text-red-500">{{ errorMsg }}</p>
        <p v-else-if="products.length === 0" class="py-20 text-center text-gray-500">
            ยังไม่มีสินค้า
        </p>

        <div v-else class="mt-6">
            <div
                class="hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-xs text-gray-500 md:grid"
            >
                <span class="col-span-5">สินค้า</span>
                <span class="col-span-2 text-right">ราคา</span>
                <span class="col-span-2 text-right">คงเหลือ</span>
                <span class="col-span-3 text-right">จัดการ</span>
            </div>

            <div
                v-for="p in products"
                :key="p._id"
                class="grid grid-cols-12 items-center gap-4 border-b border-gray-100 py-4"
            >
                <div class="col-span-12 flex items-center gap-4 md:col-span-5">
                    <!-- กรอบรูปขนาดคงที่ (เท่ากันทุกใบ) -->
                    <div class="thumb">
                        <img v-if="p.image" :src="imageUrl(p.image)" :alt="p.name" />
                        <v-icon v-else color="grey lighten-1">mdi-image-off-outline</v-icon>
                    </div>
                    <router-link
                        :to="{ name: 'product-detail', params: { id: p._id } }"
                        class="text-sm !text-gray-800 hover:!text-gray-500"
                    >
                        {{ p.name }}
                    </router-link>
                </div>

                <p class="col-span-4 text-right text-sm md:col-span-2">
                    ฿ {{ Number(p.price).toLocaleString() }}
                </p>
                <p class="col-span-4 text-right text-sm md:col-span-2">{{ p.stock }}</p>

                <div class="col-span-4 flex justify-end gap-2 md:col-span-3">
                    <button
                        type="button"
                        class="action-btn action-edit"
                        title="แก้ไข"
                        @click="openForm(p)"
                    >
                        <v-icon small>mdi-pencil-outline</v-icon>
                    </button>
                    <button
                        type="button"
                        class="action-btn action-delete"
                        title="ลบ"
                        @click="openDelete(p)"
                    >
                        <v-icon small>mdi-trash-can-outline</v-icon>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: เพิ่ม / แก้ไข -->
        <v-dialog v-model="formDialog" max-width="560" :persistent="saving">
            <div class="font-kanit rounded-2xl bg-white p-6">
                <!-- Header -->
                <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <v-icon color="blue">mdi-information-outline</v-icon>
                    <h2 class="text-lg font-bold text-gray-900">
                        {{ editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า" }}
                    </h2>
                </div>

                <form id="product-form" class="mt-5 space-y-5" @submit.prevent="save">
                    <!-- ชื่อสินค้า -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            ชื่อสินค้า <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model.trim="form.name"
                            type="text"
                            placeholder="เช่น PlayStation 5"
                            class="w-full rounded-lg border border-solid border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- ราคา / คงเหลือ -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                ราคา (บาท) <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.price"
                                type="number"
                                min="0"
                                placeholder="เช่น 1990"
                                class="w-full rounded-lg border border-solid border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                คงเหลือ (ชิ้น) <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.stock"
                                type="number"
                                min="0"
                                placeholder="เช่น 10"
                                class="w-full rounded-lg border border-solid border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <!-- รายละเอียด -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            รายละเอียด
                        </label>
                        <textarea
                            v-model="form.description"
                            rows="5"
                            placeholder="อธิบายสินค้าเพิ่มเติม (ไม่บังคับ)"
                            class="w-full resize-none rounded-lg border border-solid border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        ></textarea>
                    </div>

                    <!-- รูปสินค้า -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            รูปสินค้า
                        </label>
                        <input
                            ref="fileInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="onFile"
                        />

                        <!-- ยังไม่มีรูป -->
                        <div
                            v-if="!preview"
                            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 transition hover:border-blue-400 hover:bg-blue-50"
                            @click="triggerFile"
                        >
                            <v-icon large color="grey">mdi-cloud-upload-outline</v-icon>
                            <p class="mt-3 text-sm font-semibold text-gray-700">
                                คลิกเพื่อเลือกรูปภาพ
                            </p>
                            <p class="mt-1 text-xs text-gray-400">PNG, JPG (ไม่เกิน 10 MB)</p>
                        </div>

                        <!-- มีรูปแล้ว -->
                        <div
                            v-else
                            class="flex items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3"
                        >
                            <div
                                class="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-solid border-gray-300 bg-white"
                            >
                                <img :src="preview" alt="preview" class="h-full w-full object-cover" />
                            </div>
                            <div class="flex flex-col items-start gap-2">
                                <button
                                    type="button"
                                    class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
                                    @click="triggerFile"
                                >
                                    เปลี่ยนรูป
                                </button>
                                <button
                                    v-if="file"
                                    type="button"
                                    class="text-sm text-red-500 transition hover:text-red-700"
                                    @click="clearFile"
                                >
                                    ยกเลิกรูปที่เลือก
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- ปุ่ม -->
                <div class="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        :disabled="saving"
                        class="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
                        @click="formDialog = false"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        :disabled="saving"
                        class="rounded-lg bg-[#153a5b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f2c46] disabled:opacity-60"
                    >
                        {{ saving ? "กำลังบันทึก..." : "บันทึก" }}
                    </button>
                </div>
            </div>
        </v-dialog>

        <!-- Modal: ยืนยันลบ -->
        <v-dialog v-model="deleteDialog" max-width="420" :persistent="deleting">
            <div class="font-kanit rounded-2xl bg-white p-6 text-center">
                <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50"
                >
                    <v-icon large color="red">mdi-trash-can-outline</v-icon>
                </div>
                <h3 class="mt-4 text-lg font-bold text-gray-900">ลบสินค้า?</h3>
                <p class="mt-1 text-sm text-gray-500">การลบไม่สามารถย้อนกลับได้</p>

                <div
                    v-if="target"
                    class="mt-5 flex items-center gap-3 rounded-xl border border-solid border-gray-300 bg-gray-50 p-3"
                >
                    <div class="thumb thumb-sm">
                        <img v-if="target.image" :src="imageUrl(target.image)" :alt="target.name" />
                        <v-icon v-else small color="grey lighten-1">mdi-image-off-outline</v-icon>
                    </div>
                    <span class="text-left text-sm font-medium text-gray-800">
                        {{ target.name }}
                    </span>
                </div>

                <div class="mt-6 flex gap-3">
                    <button
                        type="button"
                        :disabled="deleting"
                        class="flex-1 rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
                        @click="deleteDialog = false"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        :disabled="deleting"
                        class="flex-1 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                        @click="confirmDelete"
                    >
                        {{ deleting ? "กำลังลบ..." : "ลบสินค้า" }}
                    </button>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>
const API = "http://localhost:3000/api/v1/products";
const MAX_SIZE = 10 * 1024 * 1024;

import { toast } from "../../store/toast";

export default {
    name: "ShopProducts",
    data() {
        return {
            loading: false,
            errorMsg: "",
            products: [],

            // modal เพิ่ม/แก้ไข
            formDialog: false,
            editing: null, // สินค้าที่กำลังแก้ไข (null = เพิ่มใหม่)
            saving: false,
            file: null,
            preview: "",
            form: { name: "", price: "", stock: "", description: "" },

            // modal ลบ
            deleteDialog: false,
            deleting: false,
            target: null,
        };
    },
    mounted() { // พอเปิดหน้า จะเรียกโหลดสินค้าของร้านทันที
        this.getProducts();
    },
    methods: {
        authHeader() {
            return { headers: { Authorization: `Bearer ${this.$store.state.token}` } };
        },
        errText(error, fallback) {
            return (
                (error.response && error.response.data && error.response.data.message) ||
                fallback
            );
        },
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },

        async getProducts() { //ดึงข้อมูลสินค้า product 
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(`${API}/mine`, this.authHeader());
                this.products = Array.isArray(data) ? data : data.data || [];
            } catch (error) {
                console.log(error);
                this.errorMsg = this.errText(error, "โหลดสินค้าไม่สำเร็จ");
            } finally {
                this.loading = false;
            }
        },

        // ===== เพิ่ม / แก้ไข =====
        openForm(p = null) {
            this.editing = p;
            this.file = null;
            this.form = p
                ? {
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    description: p.description || "",
                }
                : { name: "", price: "", stock: "", description: "" };
            this.preview = p ? this.imageUrl(p.image) : "";
            this.formDialog = true;
            // ล้างค่า input file เมื่อเปิดใหม่ (input ถูกสร้างหลัง dialog เปิด)
            this.$nextTick(() => {
                if (this.$refs.fileInput) this.$refs.fileInput.value = "";
            });
        },
        triggerFile() {
            if (this.$refs.fileInput) this.$refs.fileInput.click();
        },
        onFile(e) {
            const f = e.target.files[0] || null;
            if (f && f.size > MAX_SIZE) {
                toast.error("ไฟล์รูปต้องไม่เกิน 10MB");
                e.target.value = "";
                return;
            }
            if (!f) return;
            this.file = f;
            this.preview = URL.createObjectURL(f); // แสดงภาพที่จะเพิ่ม
        },
        // ยกเลิกรูปที่เลือกใหม่ → กลับไปใช้รูปเดิม (ถ้ามี)
        clearFile() {
            this.file = null;
            if (this.$refs.fileInput) this.$refs.fileInput.value = "";
            this.preview = this.editing ? this.imageUrl(this.editing.image) : "";
        },
        async save() {
            if (!this.form.name || this.form.price === "" || this.form.stock === "") {
                toast.error("กรุณากรอกชื่อ ราคา และจำนวนคงเหลือ");
                return;
            }

            const fd = new FormData();
            fd.append("name", this.form.name);
            fd.append("price", this.form.price);
            fd.append("stock", this.form.stock);
            fd.append("description", this.form.description || "");
            if (this.file) fd.append("image", this.file);

            this.saving = true;
            try {
                if (this.editing) {
                    await this.axios.put(`${API}/${this.editing._id}`, fd, this.authHeader());
                    toast.success("แก้ไขสินค้าเรียบร้อยแล้ว");
                } else {
                    await this.axios.post(API, fd, this.authHeader());
                    toast.success("เพิ่มสินค้าเรียบร้อยแล้ว");
                }
                this.formDialog = false;
                await this.getProducts();
            } catch (error) {
                console.log(error);
                toast.error(this.errText(error, "บันทึกสินค้าไม่สำเร็จ"));
            } finally {
                this.saving = false;
            }
        },

        // ===== ลบ =====
        openDelete(p) { // เก็บสินค้าที่จะลบใน target แล้วเปิด Modal ยืนยัน
            this.target = p;
            this.deleteDialog = true;
        },
        async confirmDelete() {
            this.deleting = true;
            try {
                await this.axios.delete(`${API}/${this.target._id}`, this.authHeader());
                this.products = this.products.filter((x) => x._id !== this.target._id);
                this.deleteDialog = false;
                toast.success("ลบสินค้าเรียบร้อยแล้ว");
            } catch (error) {
                console.log(error);
                toast.error(this.errText(error, "ลบสินค้าไม่สำเร็จ"));
            } finally {
                this.deleting = false;
            }
        },
    },
};
</script>

<style scoped>
/* ===== กรอบรูปสินค้า: ขนาดเท่ากันทุกใบ ===== */
.thumb {
    width: 72px;
    height: 72px;
    min-width: 72px;
    max-width: 72px;
    flex: 0 0 72px;
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
.thumb-sm {
    width: 48px;
    height: 48px;
    min-width: 48px;
    max-width: 48px;
    flex: 0 0 48px;
    border-radius: 10px;
}

/* ===== ปุ่มแก้ไข / ลบ ===== */
.action-btn {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
}
.action-edit {
    background: #eef4fb;
    color: #153a5b;
}
.action-edit .v-icon {
    color: #153a5b !important;
}
.action-edit:hover {
    background: #153a5b;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(21, 58, 91, 0.25);
}
.action-edit:hover .v-icon {
    color: #fff !important;
}
.action-delete {
    background: #fef0f0;
}
.action-delete .v-icon {
    color: #e53935 !important;
}
.action-delete:hover {
    background: #e53935;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(229, 57, 53, 0.3);
}
.action-delete:hover .v-icon {
    color: #fff !important;
}

/* ===== Modal เพิ่ม/แก้ไข ===== */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    color: #fff;
    background: linear-gradient(135deg, #153a5b 0%, #1f5a8c 100%);
}
.modal-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.18);
}
.close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    transition: background 0.15s;
}
.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}
.field-label {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
}

/* โซนอัปโหลดรูป */
.upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    border: 2px dashed #c7d2de;
    border-radius: 14px;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.15s ease;
}
.upload-zone:hover {
    border-color: #153a5b;
    background: #eef4fb;
}
.preview-box {
    width: 112px;
    height: 112px;
    flex: 0 0 112px;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
}
.preview-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* ===== Modal ลบ ===== */
.warn-circle {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fef0f0;
}
.target-card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 10px 12px;
    border: 1px solid #f3d6d6;
    border-radius: 12px;
    background: #fffafa;
}
</style>