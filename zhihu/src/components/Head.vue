<template>
    <div class="header-box">
        <div class="left">
            <div class="time">
                <span>{{ timeNow.day }}</span>
                <span>{{ timeNow.month }}</span>
            </div>
            <h1 class="title">知乎日报</h1>
        </div>
        <router-link to="/person" class="link-btn"><img :src="pic" alt=""></router-link>
    </div>

</template>

<script>
import { formatTime } from '../assets/utils';
import { computed, onBeforeMount } from 'vue';
import timg from '../assets/images/timg.jpg'
import { useStore } from 'vuex';
export default {
    name: 'Head',
    props: {
        time: {
            type: String,
            default: ''
        }
    },
    setup(props) {

        const store = useStore();
        const pic = computed(() => {
            const { isLogin, info } = store.state;
            if (isLogin && info) {
                return info.pic || timg;
            }
            return timg;
        });
        onBeforeMount(() => {
            const { isLogin, info } = store.state;
            if (isLogin === null) store.dispatch('changeIsLoginAsync');
            if (info === null) store.dispatch('changeInfoAsync');
        });
        let timeNow = computed(() => {
            let time = props.time || null;
            let [month, day] = formatTime(time, '{1}-{2}').split('-');
            let area = ['一月', '二月', '三月', '四月', '五月', '六月', , '七月', '八月', '九月', , '十月', '十一月', '十二月',];
            month = area[month - 1]
            return {
                month, day
            }
        })
        return {
            pic,
            timeNow
        }
    }
}
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;

    .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .time {
        padding-right: 15px;
        border-right: 1px solid rgb(100, 99, 99);

    }

    span {
        display: block;
        height: 20px;
        font-weight: 400;
        line-height: 20px;
        font-size: 24px;
        text-align: center;
        padding-bottom: 2px;

        &:nth-child(2) {
            height: 15px;
            line-height: 15px;
            font-size: 16px;
            text-align: center;
            font-weight: 700;

        }
    }

    .title {
        padding-left: 15px;
        font-size: 22px;

    }

    .link-btn {
        box-sizing: border-box;
        width: 30px;
        height: 30px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
}
</style>