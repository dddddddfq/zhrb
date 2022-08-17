<template>
  <van-skeleton title :row="5" v-if="newsInfo === null" />
  <div class="content" v-else v-html="newsInfo.body"></div>
  <div class="nav-box">
    <van-icon name="arrow-left" @click="handle"></van-icon>
    <van-icon name="comment-o" :badge="comments"></van-icon>
    <van-icon name="good-job-o" :badge="popularity"></van-icon>
    <van-icon name="star-o" :color="isStore ? 'red' : ''" @click="storeHandle"></van-icon>
    <van-icon name="share-o" color="#ccc"></van-icon>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import {
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUnmount,
  onUpdated,
  computed,
} from "vue";
import api from "@/api/index";
import { useStore } from "vuex";
import { Toast } from "vant";

export default {
  name: "Detail",
  setup() {
    const router = useRouter(),
      route = useRoute(),
      store = useStore();
    let state = reactive({
      comments: 0,
      popularity: 0,
      newsInfo: null,
    });
    let isLogin = computed(() => {
      return store.state.isLogin;
    });
    let storeList = computed(() => {
      return store.state.storeList || [];
    });
    let isStore = computed(() => {

      if (isLogin.value) {
        if (!Array.isArray(storeList.value)) storeList = [];
        return storeList.value.some((item) => {
          return +item.news.id === +route.params.id;
        })
      }
      return false;
    })
    onBeforeMount(async () => {
      if (store.state.isLogin === null) {
        await store.dispatch('changeIsLoginAsync');

      };
      if (isLogin.value) {
        if (store.state.storeList === null) store.dispatch('changeStoreListAsync');
        if (store.state.info === null) store.dispatch('changeInfoAsync');
      }
    })
    const storeHandle = async () => {
      if (!isLogin.value) {
        Toast('请先登录-!')
        router.push({
          path: '/login',
          query: {
            from: `detail/${route.params.id}`,
          }
        })
        return;
      };
      if (isStore.value) return;
      let { code } = await api.store(route.params.id)
      if (code !== 0) {
        console.log(code)
        Toast('收藏失败!');
        return;
      };
      Toast('收藏成功!')
      store.dispatch('changeStoreListAsync');
    }
    onBeforeMount(async () => {
      let link = document.createElement("link");
      link.id = "link";
      link.rel = "stylesheet";
      let id = route.params.id;
      let result = await api.queryNewsInfo(id);
      state.newsInfo = result;
      // 动态创建CSS
      link.href = state.newsInfo.css[0];
      document.head.appendChild(link);
      let { popularity, comments } = await api.queryNewsStory(id);
      state.popularity = popularity;
      state.comments = comments;
    });
    onUpdated(() => {
      let imgPlaceHolder = document.querySelector(".img-place-holder");
      if (imgPlaceHolder) {
        if (imgPlaceHolder.innerHTML.trim() === "") {
          imgPlaceHolder.innerHTML += `<img src="${state.newsInfo.image}" alt=""/>`;
        }
      }
    });
    onBeforeUnmount(() => {
      let link = document.getElementById("link");
      if (!link) return;
      document.head.removeChild(link);
    });

    const handle = () => {
      router.back();
    };

    return {
      ...toRefs(state),
      handle,
      isStore,
      storeHandle
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  background: #fff;
  padding-bottom: 50px;
  margin: 0;

  /deep/ .img-place-holder {
    height: 375px;
    overflow: hidden;

    img {
      display: block;
      margin: 0;
      width: 100%;
      min-height: 100%;
    }
  }
}

.van-skeleton {
  padding: 30px 15px;
}

.nav-box {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 15px;
  width: 100%;
  height: 50px;
  background: #f4f4f4;

  .van-icon:nth-child(1) {
    position: relative;

    &::after {
      position: absolute;
      top: -10%;
      right: -15px;
      content: "";
      width: 1px;
      height: 120%;
      background: #d5d5d5;
    }
  }

  /deep/ .van-badge {
    background-color: transparent;
    border: none;
    color: #000;
    right: -5px;
  }
}
</style>