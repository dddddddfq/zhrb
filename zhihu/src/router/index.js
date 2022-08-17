import { createRouter, createWebHashHistory } from "vue-router";
import store from '../store/index';
import routes from './routes';
import api from '../api/index';
import { Toast } from "vant";
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    let arr = ['/person', '/updateperson', '/store'];
       if (arr.includes(to.path)) {
        let isLogin = store.state.isLogin;
        console.log(isLogin)
        if (isLogin) {
            next();
            return;
        }
        if (isLogin === false) {
            Toast('请先登录!');
            next('/login');
        }
        if (isLogin === null) {
            try {
                let { code, data } = await api.isLogin();
                console.log(code,data)
                if (+code !== 0) {
                    Toast('请先登录!');
                    next('/login');
                    return;
                }
                next();
                store.commit('CHANGELOGIN',true)
                store.commit('CHANGEINFO',data);
            } catch (err) {
                console.log(err);
            }
        }
    }
    next()
})
export default router;