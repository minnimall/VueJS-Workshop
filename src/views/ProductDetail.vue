<template>
    <div class="mx-auto w-full max-w-6xl px-6 font-kanit">
        <!-- กำลังโหลด -->
        <div v-if="loading" class="py-20 text-center text-gray-500">
            กำลังโหลด...
        </div>

        <!-- ไม่พบสินค้า -->
        <p v-else-if="!product" class="py-20 text-center text-gray-500">
            {{ errorMsg || "ไม่พบสินค้า" }}
        </p>

        <template v-else>
            <!-- Breadcrumb -->
            <nav class="mt-8 flex items-center gap-2 text-sm">
                <router-link
                    :to="{ name: 'main' }"
                    class="!text-blue-700 hover:underline"
                >
                    หน้าหลัก
                </router-link>
                <span class="text-gray-700">&gt;</span>
                <span class="text-gray-900">{{ product.name }}</span>
            </nav>

            <!-- รายละเอียด -->
            <div class="grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:gap-16">
                <!-- ซ้าย: รูป -->
                <div class="flex items-center justify-center">
                    <img
                        :src="imageUrl(product.image)"
                        :alt="product.name"
                        class="max-h-[22rem] w-full object-contain"
                    />
                </div>

                <!-- ขวา: ข้อมูล -->
                <div>
                    <h1 class="text-2xl font-medium leading-snug text-black">
                        {{ product.name }}
                    </h1>

                    <!-- จำนวนคงเหลือ -->
                    <div class="mt-5 flex items-center justify-between text-gray-800">
                        <span>รายการสินค้าจำนวนคงเหลือ</span>
                        <span>{{ product.stock }} ชิ้น</span>
                    </div>

                    <!-- ราคา -->
                    <p class="mt-6 text-4xl font-bold text-brand text-[#1e2a78]">
                        ฿ {{ Number(product.price).toLocaleString() }}
                    </p>

                    <!-- รายละเอียด -->
                    <h2 class="mt-8 text-base font-normal text-black">รายละเอียดสินค้า</h2>
                    <p class="mt-2 text-xs leading-relaxed text-gray-600">
                        {{ product.description }}
                    </p>

                    <!-- เลือกจำนวน -->
                    <div class="mt-8 flex items-center gap-5">
                        <span class="text-base text-black">จำนวน</span>

                        <div
                            class="inline-flex h-9 items-stretch overflow-hidden rounded border border-gray-300"
                        >
                            <button
                                type="button"
                                class="flex w-10 items-center justify-center bg-gray-50 outline-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                :disabled="qty <= 1"
                                @click="qty--"
                            >
                                <v-icon small>mdi-minus</v-icon>
                            </button>

                            <span
                                class="flex w-12 select-none items-center justify-center border-x border-gray-300 bg-white text-sm text-gray-700"
                            >
                                {{ qty }}
                            </span>

                            <button
                                type="button"
                                class="flex w-10 items-center justify-center bg-gray-50 outline-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                :disabled="qty >= product.stock"
                                @click="qty++"
                            >
                                <v-icon small>mdi-plus</v-icon>
                            </button>
                        </div>
                    </div>

                    <!-- ปุ่ม -->
                    <div class="mt-8">
                        <v-btn
                            large
                            block
                            dark
                            depressed
                            color="#153a5b"
                            class="rounded-lg"
                            :disabled="product.stock === 0"
                            @click="addToCart"
                        >
                            เพิ่มไปยังตะกร้า
                        </v-btn>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { addItem } from "../store/cart";

export default {
    name: "ProductDetail",
    data() {
        return {
            loading: false,
            errorMsg: "",
            product: null,
            qty: 1,
        };
    },
    mounted() {
        this.getProduct();
    },
    methods: {
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },
        async getProduct() {
            this.loading = true;
            try {
                const { data } = await this.axios.get(
                    `http://localhost:3000/api/v1/products/${this.$route.params.id}`
                );
                // รองรับทั้ง { ... } และ { data: { ... } }
                this.product = data.data || data;
            } catch (error) {
                console.log(error);
                this.errorMsg = "โหลดสินค้าไม่สำเร็จ";
            } finally {
                this.loading = false;
            }
        },
        addToCart() {
            addItem(this.product, this.qty);
            this.$router.push({ name: "cart" });
        },
    },
};
</script>