<template>
  <div class="home-container">
    <!-- 头部导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 头部导航栏 end -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 加载文章列表组件 -->
        <ArticleList :channel="channel" />
      </van-tab>
      <!-- 菜单按钮定位把列表的最后一项遮住了，可以在这里添加一个占位元素解决 -->
      <div slot="nav-right" style="width:33px;flex-shrink:0;"></div>
      <!-- 文章频道列表菜单 -->
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-warp"
      >
        <van-icon name="wap-nav" size="24"></van-icon>
      </div>
      <!-- 文章频道列表菜单end -->
    </van-tabs>
    <!-- 文章频道列表 end -->

    <!-- 频道编辑弹出框 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height:100%;"
    >
      <!-- 引入编辑框内部内容 -->
      <!-- 模板中的 $event 为事件参数，等于 index  -->
      <ChannelEdit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      />
    </van-popup>
    <!-- 频道编辑弹出框 end -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/ArticleList";
import ChannelEdit from "./components/ChannelEdit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "Home",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false, // 控制编辑频道显示状态
    };
  },
  created() {
    this.loadUserChannels();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async loadUserChannels() {
      let channels = [];
      if (this.user) {
        // 已登录，获取用户线上的频道数据
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        //没有登录，判断是否有本地存储的频道数据
        const localChannels = getItem("user-channels");
        // 如果有本地存储频道数据
        if (localChannels) {
          channels = localChannels;
        } else {
          // 用户没有登录，也没有本地存储频道数据,那就请求获取默认频道列表数据
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }
      // 把处理好的数据放到 data 中以供模板使用
      this.channels = channels;
      //   const { data } = await getUserChannels();
      //   this.channels = data.data.channels;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .channel-tabs {
    border-bottom: 1px solid #ebeaea;
    box-shadow: 2px 2px 20px #dbdbdb;
    /deep/.van-tab {
      width: 90px;
      box-sizing: border-box;
      border-right: 1px solid #ebeaea;
      // overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      // text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    /deep/.van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
    }
    .wap-nav-warp {
      position: fixed;
      right: 0;
      width: 33px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      opacity: 0.9;
      box-sizing: border-box;
      &::before {
        content: "";
        display: block;
        width: 1px;
        height: 43px;
        background: url(~@/assets/imgs/line.png) no-repeat;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-button__icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
}
</style>
