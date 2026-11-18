<template>
    <div class="auth-page font-kanit">
        <!-- ฝั่งซ้าย: ฟอร์ม -->
        <div class="auth-left">
            <form class="auth-form auth-form-lg" @submit.prevent="register">
                <div class="auth-logo-wrap">
                    <img src="../assets/playzo/logoplayzo.png" alt="PlayZo" class="auth-logo" />
                </div>

                <h1 class="auth-title">สมัครสมาชิก PlayZo</h1>

                <div class="auth-grid">
                    <div class="auth-field">
                        <label class="auth-label">Username</label>
                        <v-text-field
                            v-model.trim="form.username"
                            placeholder="Username"
                            outlined
                            hide-details
                            class="auth-input"
                        />
                    </div>

                    <div class="auth-field">
                        <label class="auth-label">ชื่อ-นามสกุล</label>
                        <v-text-field
                            v-model.trim="form.name"
                            placeholder="ชื่อ-นามสกุล"
                            outlined
                            hide-details
                            class="auth-input"
                        />
                    </div>

                    <div class="auth-field">
                        <label class="auth-label">เบอร์โทร</label>
                        <v-text-field
                            v-model.trim="form.tel"
                            placeholder="เบอร์โทร"
                            maxlength="10"
                            outlined
                            hide-details
                            class="auth-input"
                        />
                    </div>

                    <div class="auth-field">
                        <label class="auth-label">ประเภทผู้ใช้</label>
                        <v-select
                            v-model="form.role"
                            :items="roles"
                            placeholder="เลือกประเภทผู้ใช้"
                            outlined
                            hide-details
                            class="auth-input"
                        />
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

                    <div class="auth-field">
                        <label class="auth-label">Confirm Password</label>
                        <v-text-field
                            v-model="form.confirmPassword"
                            :type="showConfirm ? 'text' : 'password'"
                            :append-icon="showConfirm ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            placeholder="Confirm Password"
                            outlined
                            hide-details
                            class="auth-input"
                            @click:append="showConfirm = !showConfirm"
                        />
                    </div>
                </div>

                <v-btn
                    type="submit"
                    block
                    x-large
                    dark
                    depressed
                    :loading="loading"
                    class="auth-submit"
                    color="#153a5b"
                >
                    สมัครสมาชิก
                </v-btn>

                <p class="auth-switch">
                    มีบัญชีอยู่แล้ว ?
                    <router-link :to="{ name: 'login' }" class="auth-link">
                        เข้าสู่ระบบ
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
import { toast } from "../store/toast";

export default {
    name: "RegisterView",
    data() {
        return {
            loading: false,
            roles: [
                { text: "ลูกค้าทั่วไป", value: "user" },
                { text: "ร้านค้า", value: "shop" },
            ],
            form: {
                username: "",
                name: "",
                tel: "",
                role: "user",
                password: "",
                confirmPassword: "",
            },
            showPassword: false,
            showConfirm: false,
        };
    },
    methods: {
        async register() {
            if (this.form.password !== this.form.confirmPassword) {
                toast.error("รหัสผ่านไม่ตรงกัน");
                return;
            }
            this.loading = true;
            try {
                const res = await this.axios.post("http://localhost:3000/api/v1/register", {
                    username: this.form.username,
                    name: this.form.name,
                    tel: this.form.tel,
                    role: this.form.role,
                    password: this.form.password,
                });
                toast.success((res.data && res.data.message) || "สมัครสมาชิกสำเร็จ");
                this.$router.push({ name: "login" });
            } catch (error) {
                console.log(error);
                const msg =
                    (error.response && error.response.data && error.response.data.message) ||
                    "สมัครสมาชิกไม่สำเร็จ";
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
.auth-form-lg {
    max-width: 600px;
}
.auth-logo-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
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
.auth-grid {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 16px;
}
@media (min-width: 640px) {
    .auth-grid {
        grid-template-columns: 1fr 1fr;
    }
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