<template>
  <Nav />
  <van-form ref="formBox" @submit="submit">
    <van-cell-group inset>
      <van-field v-model="phone" center label="手机号" label-width="50px" name="phone" :rules="[{ required: true, message: '手机号为必填项' }, {
        pattern: regPhone, message: '手机号格式不正确'
      }]">
        <template #button>
          <van-button size="small" class="form-btn" :type="enable ? 'primary' : ''" @click="sendcode" :disabled="!enable">
            {{ enable ? '发送验证码' : time }}
          </van-button>
        </template>
      </van-field>

      <van-field v-model="code" label="验证码" label-width="50px" :rules="[{ required: true, message: '验证码为必填项' }, {
        pattern: regCode, message: '验证码必须为6位数字'
      }]" />
    </van-cell-group>

    <div style="margin: 20px 40px">
      <van-button round block type="primary" native-type="submit">
        立即登录/注册
      </van-button>
    </div>
  </van-form>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { reactive, toRefs, ref } from "vue";
import api from "@/api/index";
import { Toast } from "vant";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { valueToNode } from "@babel/types";

export default {
  components: { Nav },
  name: "Login",
  setup() {
    const router = useRouter(), ruote = useRoute(), store = useStore();
    let state = reactive({
      phone: "",
      code: "",
      time: '60s',
      enable: true,
    });
    let formBox = ref(null);
    const sendcode = async () => {
      try {
        //校验手机号格式
        await formBox.value.validate('phone');
        // 发送请求
        let { code } = await api.phoneCode(state.phone);
        if (+code !== 0) {
          Toast('当前网络繁忙,请稍后再试')
          return;
        }
        //开启倒计时
        state.enable = false;
        state.time = `60s`
        let n = 60;
        let timer = setInterval(() => {
          n--;
          if (n === 0) {
            clearInterval(timer);
            state.enable = true;
            return;
          }
          state.time = `${n}s`
        }, 1000)
      } catch (error) {
      }
    };
    //表单提交
    const submit = async () => {
      let { code, token } = await api.login(state.phone, state.code);
      if (+code !== 0) {
        Toast('登录失败,验证码错误!')
        state.code = '';
        formBox.value.resetValidation();
        return;
      }
      localStorage.setItem('token', token);
      store.commit('CHANGELOGIN',true);
      store.commit('changeStoreListAsync',null);
      store.dispatch('changeInfoAsync');
      
      Toast('登陆成功!')
      let from=ruote.query.from;
      if(from){
        router.replace(`/${from}`)
        return;
      }
      router.replace('/person')      
    }

    return {
      ...toRefs(state),
      formBox,
      regPhone: /^1\d{10}$/,
      regCode: /^\d{6}$/,
      //发送验证码
      sendcode,
      submit
    };
  },
};
</script>

<style lang="less" scoped>
.van-form {
  margin-top: 30px;

  .form-btn {
    width: 78px;
  }
}
</style>