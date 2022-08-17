<template>
    <Nav />
    <div class="base-info" v-if="info">
        <img :src="info.pic" alt="" @click="$router.push('/updateperson')" />
        <p>{{info.name}}</p>
    </div>
    <van-cell-group>
        <van-cell title="我的收藏" is-link url="#/store" />
        <van-cell title="退出登录" @click="signout" />
    </van-cell-group>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
import { computed, onBeforeMount } from "vue";

export default {
    components: { Nav },
    name: "Person",
    setup() {
        const store = useStore(), router = useRouter();
        const info = computed(() => {
            const { info } = store.state;
            if (info) {
                return info;
            }
            return null;
        })
        onBeforeMount(() => {
            const { isLogin, info } = store.state;
            if (isLogin === null) store.dispatch('changeIsLoginAsync');
            if (info === null) store.dispatch('changeInfoAsync');
        });
        //退出登录
        const signout = () => {
            //提示
            Toast('已退出');
            //删除token
            localStorage.removeItem('token');
            //修改vuex中的数据
            store.commit('CHANGELOGIN', null);
            store.commit('CHANGEINFO', null);
            store.commit('changeStoreListAsync', null);
            router.replace('/login')
        }
        return {
            info,
            signout,
        }
    },
};
</script>

<style lang="less" scoped>
.base-info {
    box-sizing: border-box;
    margin: 20px 0;

    img {
        display: block;
        margin: 0 auto;
        width: 86px;
        height: 86px;
        border-radius: 50%;
    }

    p {
        line-height: 50px;
        font-size: 18px;
        text-align: center;
    }
}
</style>