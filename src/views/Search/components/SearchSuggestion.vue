<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      :title="str"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <!-- 展示搜索建议的高亮 -->
      <div slot="title" v-html="hightlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash"; // 引入防抖

export default {
  name: "SearchSuggestion",
  data() {
    return {
      suggestions: [], // 搜索建议数据列表
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  watch: {
    // 属性名：要监视的数据名称
    searchText: {
      // 当数据发生改变时会执行 handler 处理函数
      handler: debounce(async function() {
        //防抖
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
      }, 200),
      // async handler() {
      //   // 找到数据接口
      //   // 请求获取数据
      //   // 模板绑定展示
      //   const { data } = await getSearchSuggestions(this.searchText);
      //   this.suggestions = data.data.options;
      // },
      // 该回调将在监听开始之后立即调用
      immediate: true,
    },
  },
  methods: {
    hightlight(str) {
      // RegExp 是正则表达式的构造函数
      // 参数1：字符串 参数2：匹配模式 参数3：正则对象

      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color:red;">${this.searchText}</span>`
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
