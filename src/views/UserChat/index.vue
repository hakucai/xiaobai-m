<template>
  <div class="user-chat">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 顶部导航栏 end -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list">
      <van-cell
        :title="message.msg"
        v-for="(item, index) in message"
        :key="index"
      />
    </van-cell-group>
    <!-- 消息列表 end -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message-warp">
      <van-field v-model="message" :border="false" placeholder="请输入消息" />
      <van-button
        size="small"
        type="primary"
        style="width:75px;"
        @click="onSend"
        >发送</van-button
      >
    </van-cell-group>
    <!-- 发送消息 end -->
  </div>
</template>

<script>
// import io from "socket.io-client";

export default {
  name: "UserChat",
  data() {
    return {
      message: "",
      socket: null, // WebSocket 通信对象
      messages: [], // 消息列表
    };
  },
  created() {
    // 建立连接
    // const socket = io("http://ttapi.research.itcast.cn/");
    // this.socket = socket;
    // socket.on("connect", () => {
    //   console.log("连接");
    // });
    // // 断开连接了
    // socket.on("disconnect", () => {
    //   console.log("断开");
    // });
    // socket.on("message", (data) => {
    //   // 把对方发给我的消息放到数组中
    //   this.messages.push(data);
    // });
    // window.socket = socket;
  },
  methods: {
    onSend() {
      // 请求发送消息
      const data = {
        meg: this.message,
        timestamp: Date.now(),
      };
      this.socket.emit("message", data);

      // 把用户发出去的消息存储到数组中
      this.messages.push(data);
    },
  },
};
</script>

<style lang="less" scoped>
.user-chat {
  .message-list {
    position: fixed;
    top: 46px;
    bottom: 44px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .send-message-warp {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 0 10px;
    align-items: center;
  }
}
</style>
