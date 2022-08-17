import { createApp } from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router/index'
//引入Vant
import Vant,{Lazyload} from 'vant';
import './assets/reset.min.css';
import 'amfe-flexible';
import 'vant/lib/index.css'; 
//处理最大宽度
import { handleMaxWidth } from './assets/utils';
handleMaxWidth();
//当浏览器宽度发生变化的时候调用这个函数
window.addEventListener('resize', handleMaxWidth)
const app = createApp(App);
app.use(Vant);
app.use(Lazyload,{
    lazyComponent:true,
});
app.use(store);
app.use(router);
app.mount('#app');

// 首页  /
// 详情  /detail
//  登录 /login
//  个人信息 /person
//  收藏 /store
//  修改个人信息 /update 