<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        style="width:60px;"
        type="danger"
        plain
        size="mini"
        round
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'close' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommandChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  data() {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false, // 点击编辑展示关闭
    };
  },
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
    // 推荐频道列表
    // 计算属性会观测内部依赖数据的变化而重新求值
    recommandChannels() {
      // 思路： 所有频道 减去 用户频道 等于 推荐频道
      // filter 方法：过滤数据，根据方法返回布尔值 true 来收集数据
      return this.allChannels.filter((channel) => {
        // 判断 channel 是否属于 用户频道
        return !this.userChannels.find((userChannels) => {
          //找到满足条件的元素
          return userChannels.id === channel.id;
        });
      });

      //第二种方法
      //   const arr = [];

      //   // 遍历所有频道
      //   this.allChannels.forEach((channel) => {
      //     let flag = false;
      //     for (let i = 0; i < this.userChannels.length; i++) {
      //       if (this.userChannels[i].id === channel.id) {
      //         // 所有频道中的频道项属于用户频道
      //         flag = true;
      //         break;
      //       }
      //     }
      //     if (!flag) {
      //       arr.push(channel);
      //     }
      //   });
      //   return arr;
    },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    async onAdd(channel) {
      this.userChannels.push(channel);

      //TODO: 数据持久化
      if (this.user) {
        // 登录了，数据存储到线上
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userChannels.length }],
        });
      } else {
        // 没有登录，数据存储到本地
        setItem("user-channels", this.userChannels);
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态， 删除频道
        this.deleteChannel(channel, index);
      } else {
        // 非编辑状态， 切换频道
        this.switchChannel(index);
      }
    },
    async deleteChannel(channel, index) {
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);

      // 数据持久化
      if (this.user) {
        // 登录了，数据持久化到线上
        await deleteUserChannel(channel.id);
      } else {
        // 没有登录，数据持久化到本地存储
        setItem("user-channels", this.userChannels);
      }
    },
    switchChannel(index) {
      // 切换频道
      this.$emit("update-active", index);

      // 关闭弹出框
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 55px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .grid-item {
    width: 90px;
    height: 43px;

    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 20px;
      color: #a3a3a3;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
