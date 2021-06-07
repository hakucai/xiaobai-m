<template>
  <div class="mine-container">
    <!-- 头部信息 -->
    <van-cell-group v-if="user" class="mine-info">
      <!-- 头像、昵称、编辑资料 -->
      <van-cell class="base-info" center :border="false">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="update-btn" size="small" round to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>
      <!-- 头像、昵称、编辑资料 end -->

      <!-- 数据信息导航栏 -->
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <span class="count" slot="icon">{{ currentUser.art_count }}</span>
          <span class="text" slot="text">头条</span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="count" slot="icon">{{ currentUser.follow_count }}</span>
          <span class="text" slot="text">关注</span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="count" slot="icon">{{ currentUser.fans_count }}</span>
          <span class="text" slot="text">粉丝</span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="count" slot="icon">{{ currentUser.like_count }}</span>
          <span class="text" slot="text">获赞</span>
        </van-grid-item>
      </van-grid>
      <!-- 数据信息导航栏 end -->
    </van-cell-group>

    <div
      v-else
      class="not-login"
      @click="
        $router.push({
          name: 'Login',
          query: { redirect: '/mine' },
        })
      "
    >
      <div class="not-login-img">
        <img src="@/assets/imgs/notlogin.png" />
      </div>
      <div class="not-login-text">
        登录 / 注册
      </div>
    </div>
    <!-- 头部信息 end -->

    <!-- 收藏、历史 -->
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="tubiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="tubiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <!-- 收藏、历史 end -->

    <!-- 跳转框 -->
    <van-cell title="消息通知" is-link url="/" />
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat" />
    <van-cell
      v-if="user"
      class="loginOut-cell"
      title="退出登录"
      @click="onLogout"
    />
    <!-- 跳转框 end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";
export default {
  name: "Mine",
  data() {
    return {
      currentUser: {}, //当前登录用户信息
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadGetCurrentUser();
  },
  methods: {
    async loadGetCurrentUser() {
      const { data } = await getCurrentUser();
      this.currentUser = data.data;
    },
    onLogout() {
      // 提示用户退出
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出吗",
        })
        // 确认执行这里
        .then(() => {
          this.$store.commit("setUser", null);
        })
        // 取消执行这里
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.mine-container {
  .mine-info {
    background: url(~@/assets/imgs/banner.png) no-repeat;
    background-size: cover;
    .base-info {
      height: 115px;
      box-sizing: border-box;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        box-sizing: border-box;
        margin-right: 11px;
      }
      .name {
        color: #fff;
        font-size: 15px;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        font-size: 11px;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url(~@/assets/imgs/banner.png) no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .not-login-img img {
      width: 66px;
      height: 66px;
    }
    .not-login-text {
      color: #fff;
      font-size: 14px;
    }
  }
  /deep/.nav-grid {
    .nav-grid-item {
      height: 70px;
      .tubiao {
        font-size: 22px;
      }
      .tubiao-shoucang {
        color: #eb5253;
      }
      .tubiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
  }

  .loginOut-cell {
    color: #d86262;
    font-size: 15px;
    text-align: center;
  }

  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
