<template>
    <div class="auth-page font-kanit">
        <!-- ฝั่งซ้าย: ฟอร์ม -->
        <div class="auth-left">
            <form class="auth-form auth-form-sm" @submit.prevent="login">
                <div class="auth-logo-wrap">
                    <img src="../assets/playzo/logoplayzo.png" alt="PlayZo" class="auth-logo" />
                </div>

                <h1 class="auth-title">เข้าสู่ระบบ PlayZo</h1>

                <div class="auth-field">
                    <label class="auth-label">Username</label>
                    <v-text-field v-model.trim="form.username" placeholder="Username" outlined hide-details class="auth-input"/>
                </div>

                <div class="auth-field">
                    <label class="auth-label">Password</label>
                    <v-text-field
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                        placeholder="Password"
                        outlined
                        hide-details
                        class="auth-input"
                        @click:append="showPassword = !showPassword"
                    />
                </div>

                <v-btn  type="submit"  block  x-large  dark  depressed  :loading="loading"  class="auth-submit"  color="#153a5b">
                    เข้าสู่ระบบ
                </v-btn>

                <p class="auth-switch">
                    ยังไม่มีบัญชี ?
                    <router-link :to="{ name: 'register' }" class="auth-link">
                        สมัครสมาชิก
                    </router-link>
                </p>
            </form>
        </div>

        <!-- ฝั่งขวา: รูปภาพเต็มครึ่งจอ -->
        <div class="auth-right">
            <img src="../assets/playzo/banner10.jpg" alt="PlayZo" class="auth-cover" />
        </div>
    </div>
</template>

<script>
import { API_BASE } from "../config";
import { toast } from "../store/toast";

const HOME = { shop: "shop-home", admin: "admin-home" };

export default {
    name: "LoginView",
    data() {
        return {
            loading: false,
            form: {
                username: "",
                password: "",
            },
            showPassword: false,
        };
    },
    methods: {
        async login() {
            if (!this.form.username || !this.form.password) {
                toast.error("กรุณากรอก Username และ Password");
                return;
            }
            this.loading = true;
            try {
                const res = await this.axios.post(
                    `${API_BASE}/api/v1/login`,
                    this.form
                );
                // รองรับทั้ง { data: { token, user } } และ { token, user }
                const payload = res.data.data || res.data;

                await this.$store.dispatch("login", {
                    token: payload.token,
                    user: payload.user,
                });
                toast.success(`ยินดีต้อนรับ ${payload.user.name || payload.user.username}`);
                this.$router.push({ name: HOME[payload.user.role] || "main" });
            } catch (error) {
                console.log(error);
                const msg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "เข้าสู่ระบบไม่สำเร็จ";
                toast.error(msg);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.auth-input ::v-deep .v-input__append-inner {
    align-self: center;
    margin-top: 0 !important;
    padding-left: 8px;
}
.auth-input ::v-deep .v-input__append-inner .v-input__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.auth-input ::v-deep .v-input__append-inner .v-icon {
    font-size: 20px;
    color: #6b7280;
}
.auth-page {
    display: flex;
    height: 100vh;
    background: #fff;
}
.auth-left {
    flex: 1 1 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    padding: 40px 32px;
}
.auth-right {
    display: none;
    position: relative;
    flex: 1 1 70%;
    overflow: hidden;
    background: #fff;
}
@media (min-width: 768px) {
    .auth-right {
        display: block;
    }
}
.auth-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9; /* ความทึบของภาพ: ยิ่งน้อยยิ่งจาง */
}

.auth-form {
    width: 100%;
}
.auth-form-sm {
    max-width: 440px;
}
.auth-logo-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
}
.auth-logo {
    width: 230px;
    height: auto;
    object-fit: contain;
}
.auth-title {
    margin: 0 0 24px;
    font-size: 24px;
    font-weight: 500;
    color: #111827;
}
.auth-field {
    margin-bottom: 14px;
}
.auth-label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: #1f2937;
}
.auth-input ::v-deep .v-input__slot {
    min-height: 42px !important;
    border-radius: 10px;
}
.auth-input ::v-deep input {
    font-family: "Kanit", sans-serif;
    font-size: 14px;
}
.auth-input ::v-deep .v-select__selection {
    font-size: 14px;
}
.auth-submit {
    margin-top: 6px;
    border-radius: 10px;
    font-family: "Kanit", sans-serif;
    font-size: 15px;
}
.auth-switch {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: #374151;
}
.auth-link {
    margin-left: 4px;
    font-weight: 700;
    color: #159cb4;
}

.auth-input ::v-deep .v-input__append-inner .v-icon {
    font-size: 20px;
    color: #6b7280;
}
</style>