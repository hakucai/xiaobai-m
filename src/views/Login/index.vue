<template>
  <div class="login-container">
    <!-- 头部导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 表单输入框 -->
    <!-- 
      基于 Vant 的表单验证
      1、使用 van-form 组件包裹住所有的表单项 van-field
      2、给 van-form 绑定 submit 事件,只有表单验证通过，它才会调用 submit
     -->
    <van-form
      @submit="onLogin"
      @failed="onfailed"
      ref="login-form"
      :show-error="false"
      :show-error-message="false"
      validate-first
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="tubiao"
        left-icon="shouji"
        clearable
        center
        name="mobile"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        maxlength="11"
        size="large"
      />
      <van-field
        v-model="user.code"
        icon-prefix="tubiao"
        left-icon="yanzhengma"
        clearable
        center
        name="code"
        placeholder="请输入短信验证码"
        :rules="formRules.code"
        maxlength="6"
        size="large"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="time"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            plain
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button
          class="login-btn"
          type="info"
          block
          :loading="loginLoading"
          loading-type="spinner"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user"; // 引入用户登录、获取验证码模块
import { regMobile, regCode } from "@/regExp/"; //引入正则表达式

export default {
  name: "Login",
  data() {
    return {
      user: {
        mobile: "13911111111",
        code: "246810",
      },
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号" },
          { pattern: regMobile, message: "手机号错误" },
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { pattern: regCode, message: "验证码错误" },
        ],
      },
      time: 1000 * 60, // 倒计时时间
      isCountDownShow: false, // 倒计时显示状态
      isSendSmsLoading: false, // 发送验证码按钮的 loading 状态
      loginLoading: false, // 点击登录按钮的 loading 状态
    };
  },
  methods: {
    // 请求登录
    async onLogin() {
      // 点击登录开启 loading 状态
      this.loginLoading = true;

      this.$toast.loading({
        message: "登录中...", // 提示文本
        forbidClick: true, // 禁用背景点击
        duration: 0, // 展示登录时长(ms)
      });

      try {
        const { data } = await login(this.user);

        // 提示登录成功
        this.$toast.success("登录成功");

        // 将后端返回的用户登录状态 （token等数据）放到 Vuex 容器中
        this.$store.commit("setUser", data.data);

        // 清除 Layout 的缓存，让它重新渲染
        this.$store.commit("removeCachePage", "Layout");

        // 登陆成功跳转首页
        // this.$router.push("/mine"); // 这种方式不好，有问题
        this.$router.push(this.$route.query.redirect || "/");
      } catch (error) {
        console.log("登录失败", error);

        // 提示登录失败
        this.$toast.fail("登录失败，手机号或验证码错误");
      }

      // 无论是否登录成功，都要关闭登录的开启 loading 状态
      this.loginLoading = false;
    },

    // 提示失败信息
    onfailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示信息
          position: "top", // 防止手机键盘太高，看不见提示
        });
      }
    },

    //点击获取验证码
    async onSendSms() {
      try {
        // 效验手机号码
        await this.$refs["login-form"].validate("mobile");

        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true; // 开启验证码 loading 状态，防止用户多次点击发送请求
        await sendSms(this.user.mobile);

        // 短信发送出去，显示倒计时
        this.isCountDownShow = true;
      } catch (error) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = "";
        if (error && error.response && error.response.status === 429) {
          // 发送短信失败的错误提示
          message = "发送太频繁了，请稍后重试";
        } else if (error.name === "mobile") {
          // 表单验证失败的错误提示
          message = error.message;
        } else {
          // 未知错误
          message = "发送失败，请稍后重试";
        }

        // 提示用户
        this.$toast({
          message,
          position: "top",
        });
      }

      // 无论发送验证码成功还是失败，都要关闭 loading 状态
      this.isSendSmsLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .login-btn-warp {
    padding: 26px 16px;
    .login-btn {
      border-radius: 5px;
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .van-cell {
    height: 50px;
  }
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }
}
</style>
