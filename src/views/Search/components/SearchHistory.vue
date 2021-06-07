<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除 </span>
        <span @click="isDeleteShow = false"> 完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(history, index) in searchHistories"
      :key="index"
      :title="history"
      @click="deleteHistories(history, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false, // 删除历史的图标显示状态
    };
  },
  methods: {
    deleteHistories(history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        // 持久化处理
        // 1、修改本地存储的数据
        // 2、请求接口删除线上的数据
        // 无论是否登录都把数据持久化到本地
        // 如果已经登录，则删除线上的历史数据
        // 没有删除单个的历史接口，只有删除全部的历史接口
        // setItem("search-histories", this.searchHistories);
        return;
      }
      // 如果不是删除状态，则跳转搜索，展示搜索结果
      this.$emit("search", history);
    },
  },
};
</script>

<style lang="less" scoped></style>
