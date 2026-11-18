<template>
    <div class="font-kanit">
        <!-- Carousel -->
        <v-carousel cycle height="300" interval="4000" show-arrows-on-hover hide-delimiters class="rounded-xl">
            <v-carousel-item v-for="(img, i) in banners" :key="i" :src="img"
            />
        </v-carousel>

        <!-- การ์ดสินค้า -->
        <div class="mt-10">
            <div v-if="loading" class="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div v-for="n in 4" :key="n" class="h-72 animate-pulse rounded-xl border border-gray-200 bg-gray-100"></div>
            </div>

            <!-- ไม่มีสินค้า / โหลดไม่สำเร็จ -->
            <p v-else-if="products.length === 0" class="text-center text-gray-500">
                {{ errorMsg || "ยังไม่มีสินค้า" }}
            </p>

            <!-- รายการสินค้า -->
            <div v-else class="grid grid-cols-2 gap-6 md:grid-cols-4">
                <router-link
                    v-for="item in products"
                    :key="item._id"
                    :to="{ name: 'product-detail', params: { id: item._id } }"
                    class="p-card"
                >
                    <div class="p-img">
                        <img v-if="item.image" :src="imageUrl(item.image)" :alt="item.name" />
                        <v-icon v-else color="grey lighten-1" large>mdi-image-off-outline</v-icon>
                    </div>

                    <div class="p-info">
                        <p class="p-name">{{ item.name }}</p>
                        <p class="p-price">฿ {{ Number(item.price).toLocaleString() }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from "../store/toast";

export default {
    name: "Main",
    data() {
        return {
            loading: false,
            errorMsg: "",
            products: [],
            banners: [
                require("../assets/playzo/banner10.jpg"),
                require("../assets/playzo/banner7.jpg"),
                require("../assets/playzo/จอยlisa.jpg"),
                require("../assets/playzo/banner9.jpg"),
                require("../assets/playzo/banner8.jpg"),
                require("../assets/playzo/spiderman_1150x300.jpg"),
            ],
        };
    },
    mounted() {
        const u = this.$store.state.user;
        const HOME = { shop: "shop-home", admin: "admin-home" };
        if (this.$store.state.token && u && HOME[u.role]) {
            this.$router.replace({ name: HOME[u.role] });
            return;
        }
        this.getProducts();
    },
    methods: {
        imageUrl(path) {
            if (!path) return "";
            return path.startsWith("http") ? path : `http://localhost:3000${path}`;
        },
        async getProducts() {
            this.loading = true;
            this.errorMsg = "";
            try {
                const { data } = await this.axios.get(
                    "http://localhost:3000/api/v1/products"
                );
                // รองรับทั้ง [ ... ] และ { data: [ ... ] }
                this.products = Array.isArray(data) ? data : data.data || [];
            } catch (error) {
                console.log(error);
                this.errorMsg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "โหลดสินค้าไม่สำเร็จ";
                toast.error(this.errorMsg);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
    .p-card {
        display: flex;
        flex-direction: column;
        padding: 8px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #f9fafb;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .p-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    /* กรอบรูป: สูงเท่ากันทุกใบ */
    .p-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 192px;
        min-height: 192px;
        max-height: 192px;
        overflow: hidden;
        border-radius: 10px;
        background: #fff;
    }
    .p-img img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
    }

    /* ข้อมูล: ชื่อสูง 2 บรรทัดคงที่ ราคาอยู่ล่างสุด */
    .p-info {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        padding: 12px 8px 8px;
    }
    .p-name {
        margin: 0;
        height: 42px; /* 2 บรรทัด x line-height 21px */
        font-size: 14px;
        line-height: 21px;
        color: #1f2937;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .p-price {
        margin: auto 0 0;
        padding-top: 10px;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
        color: #153a5b;
    }
</style>