import { GridItem } from "vant";
import { createStore, createLogger } from "vuex";
import api from "../api/index";
const env = process.env.NODE_ENV;
export default createStore({
    state: {
        isLogin: null,
        info: null,
        storeList: null,
    },
    mutations: {
        CHANGELOGIN(state, bool) {
            state.isLogin = bool;
        },
        CHANGEINFO(state, payload) {
            state.info = payload;
        },
        CHANGESOTRELIST(state, payload) {
            state.storeList = payload;
        },
        REMOVESTORE(state,id) {
            if (state.storeList === null) return;
            state.storeList = state.storeList.filter((item) => {
                return item.id !== id;
            })
        }
    },
    actions: {
        //发请求修改isLogin
        async changeIsLoginAsync({ commit }) {
            let bool = false;
            let { code } = await api.isLogin();
            if (+code === 0) bool = true;
            commit('CHANGELOGIN', bool);
        },
        //发请求修改info信息 
        async changeInfoAsync({ commit }) {
            let { code, data } = await api.userInfo();
            if (+code === 0) commit('CHANGEINFO', data);
        },
        //发请求获取storeList信息 
        async changeStoreListAsync({ commit }) {
            let { code, data } = await api.storeList();
            if (+code !== 0) data = [];
            commit('CHANGESOTRELIST', data)
        }
    },
    plugins: env === 'production' ? [] : [createLogger()]
})