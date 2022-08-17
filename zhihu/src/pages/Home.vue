<template>
    <!--  头部  -->

    <Head :time="today"></Head>
    <!-- 轮播图 -->
    <section class="banner-box">
        <van-swipe v-if="bannerList.length > 0" autoplay="3000" lazy-render>
            <van-swipe-item v-for="item in bannerList" :key="item.id">
                <router-link :to="`/detail/${item.id}`" class="content">
                    <img :src="item.image" alt="">
                    <div class="mark">
                        <h3 class="title">{{ item.title }}</h3>
                        <span class="tip">{{ item.hint }}</span>
                    </div>
                </router-link>
            </van-swipe-item>
        </van-swipe>
    </section>
    <!-- 新闻列表 -->
    <van-skeleton title :row="5" v-if="newList == null"></van-skeleton>
    <div v-else>
        <section class="news-box" v-for="(item, index) in newList" :key="item.date">
            <van-divider v-if="index !== 0" content-position="left">{{ formatTime(item.date, "{1}月{2}日") }}
            </van-divider>
            <div class="content">
                <Item v-for="item2 in item.stories " :key="item2.id" :data="item2" />
            </div>
        </section>
    </div>
    <div class="lazy-more" v-show="newList.length !== 0" ref="loadMore">
        <van-loading size="14px">加载中...</van-loading>
    </div>
</template>

<script>
import Head from '../components/Head.vue';
import Item from '../components/newsItem.vue';
import { formatTime } from '../assets/utils';
import { reactive, toRefs, onBeforeMount, ref, onMounted } from 'vue';
import api from '../api/index';
export default {
    components: { Head, Item },
    name: 'Home',
    setup(props) {
        let state = reactive({
            today: '',
            newList: [],
            bannerList: []
        });
        let loadMore = ref(null)
        //第一次加载获取数据
        onBeforeMount(async () => {
            let { date, stories, top_stories } = await api.queryNewsLatest();
            state.today = date;
            state.newList.push(Object.freeze({
                date, stories
            }))
            state.bannerList = Object.freeze(top_stories);
        });
        //第一次渲染完:加载更多
        onMounted(() => {
            let ob = new IntersectionObserver(async (changes) => {
                let item = changes[0];
                if (item.isIntersecting) {
                    let result = await api.queryNewsBefore(state.newList[state.newList.length- 1]["date"])
                    state.newList.push(Object.freeze(result))
                }
            })
            ob.observe(loadMore.value)
        })
        return {
            ...toRefs(state),
            formatTime,
            loadMore,
        }
    }

}
</script>

<style lang="less" scoped>
.banner-box {
    box-sizing: border-box;
    height: 375px;
    background: #d5d5d5;

    .van-swipe {
        width: 100%;
        height: 100%;
        background: #fff;

        .content {
            position: relative;
            display: block;
            height: 100%;
            color: #fff;

            img {
                display: block;
                width: 100%;
                height: 100%;
            }

            .mark {
                position: absolute;
                left: 0;
                bottom: 0;
                box-sizing: border-box;
                padding: 10px 20px;
                width: 100%;
                height: 110px;
                background: rgba(0, 0, 0, 0.3);
                background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
            }

            .title {
                padding-top: 15px;
                max-height: 50px;
                font-size: 20px;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .tip {
                line-height: 16px;
                font-size: 12px;
            }
        }

        /deep/ .van-swipe__indicators {
            left: auto;
            right: 20px;
            transform: none;

            .van-swipe__indicator--active {
                width: 15px;
                border-radius: 3px;
                background: #fff;
            }
        }
    }
}

.van-skeleton {
    padding: 30px 15px;
}

.news-box {
    padding: 0 15px;

    .van-divider {
        margin: 5px;
        font-size: 12px;
        color: #123456;

        &::before {
            display: none;
        }
    }
}

.lazy-more {
    display: flex;
    line-height: 30px;
    justify-content: center;
    padding: 10px;
    background: #f4f4f4;
}
</style>