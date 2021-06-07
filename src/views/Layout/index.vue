<template>
  <div>
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view />
    </keep-alive>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      active: 0,
    };
  },
  mounted() {
    this.$store.commit("addCachePage", "Layout");
  },
};
</script>

<style lang="less" scoped></style>
