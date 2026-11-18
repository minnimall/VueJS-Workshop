<template>
    <div class="font-kanit py-8">
        <h1 class="text-2xl font-bold text-black">
            {{ isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า" }}
        </h1>

        <div v-if="loading" class="py-20 text-center text-gray-500">กำลังโหลด...</div>

        <form v-else class="mt-6 max-w-xl" @submit.prevent="submit">
            <label class="mb-1 block text-sm text-gray-800">ชื่อสินค้า</label>
            <v-text-field v-model.trim="form.name" outlined dense />

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="mb-1 block text-sm text-gray-800">ราคา (บาท)</label>
                    <v-text-field v-model="form.price" type="number" min="0" outlined dense />
                </div>
                <div>
                    <label class="mb-1 block text-sm text-gray-800">จำนวนคงเหลือ</label>
                    <v-text-field v-model="form.stock" type="number" min="0" outlined dense />
                </div>
            </div>

            <label class="mb-1 block text-sm text-gray-800">รายละเอียด</label>
            <v-textarea v-model="form.description" outlined dense rows="4" />

            <label class="mb-1 block text-sm text-gray-800">รูปสินค้า</label>
            <input type="file" accept="image/*" @change="onFile" />

            <div
                v-if="preview"
                class="mt-3 flex h-40 w-40 items-center justify-center rounded-lg border border-gray-200 bg-white"
            >
                <img :src="preview" class="max-h-full max-w-full object-contain" />
            </div>

            <div class="mt-8 flex gap-3">
                <v-btn
                    type="submit"
                    dark
                    color="#153a5b"
                    :loading="saving"
                    :disabled="saving"
                >
                    บันทึก
                </v-btn>
                <v-btn outlined @click="$router.push({ name: 'shop-products' })">ยกเลิก</v-btn>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "ShopProductForm",
    data() {
        return {
            loading: false,
            saving: false,
            file: null,
            preview: "",
            form: { name: "", price: "", stock: "", description: "" },
        };
    },
    computed: {
        isEdit() {
            return !!this.$route.params.id;
        },
    },
    mounted() {
        if (this.isEdit) this.getProduct();
    },
    methods: {
        authHeader() {
            return { Authorization: `Bearer ${this.$store.state.token}` };
        },
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },
        onFile(e) {
            const f = e.target.files[0] || null;
            console.log("selected file:", f);
            if (f && f.size > 10 * 1024 * 1024) {
                alert("ไฟล์รูปต้องไม่เกิน 10MB");
                e.target.value = "";
                return;
            }
            this.file = f;
            if (f) this.preview = URL.createObjectURL(f);
        },
        async getProduct() {
            this.loading = true;
            try {
                const { data } = await this.axios.get(
                    `http://localhost:3000/api/v1/products/${this.$route.params.id}`
                );
                const p = data.data || data;
                this.form = {
                    name: p.name,
                    price: p.price,
                    stock: p.stock,
                    description: p.description,
                };
                this.preview = this.imageUrl(p.image);
            } catch (error) {
                console.log(error);
                alert("โหลดสินค้าไม่สำเร็จ");
                this.$router.push({ name: "shop-products" });
            } finally {
                this.loading = false;
            }
        },
        async submit() {
            if (!this.form.name || this.form.price === "" || this.form.stock === "") {
                alert("กรุณากรอกชื่อ ราคา และจำนวนคงเหลือ");
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
                const url = "http://localhost:3000/api/v1/products";
                const config = { headers: this.authHeader() };
                console.log("file:", this.file);
                for (const [k, v] of fd.entries()) console.log(k, v);
                if (this.isEdit) {
                    await this.axios.put(`${url}/${this.$route.params.id}`, fd, config);
                } else {
                    await this.axios.post(url, fd, config);
                }
                this.$router.push({ name: "shop-products" });
            } catch (error) {
                console.log(error);
                alert(
                    (error.response && error.response.data && error.response.data.message) ||
                        "บันทึกสินค้าไม่สำเร็จ"
                );
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>