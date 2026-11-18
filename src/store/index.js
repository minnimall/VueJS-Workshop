import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";

Vue.use(Vuex);

const readUser = () => {
    try {
        const raw = VueCookies.get("user");
        if(!raw) return null;
        return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (e) {
        return null;
    }
};

export default new Vuex.Store({
    state: {
        token: VueCookies.get("token") || null,
        user: readUser(), // { _id, username, name, role }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        login({ commit }, { token, user }) {
            // JWT หมดอายุ 1 ชั่วโมง ให้ cookie หมดอายุตรงกัน
            VueCookies.set("token", token, "1h");
            VueCookies.set("user", user, "1h");
            commit("setToken", token);
            commit("setUser", user);
        },
        logout({ commit }) {
            VueCookies.remove("token");
            VueCookies.remove("user");
            commit("setToken", null);
            commit("setUser", null);
        },
    },
});