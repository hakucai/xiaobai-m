<template>
  <div class="search-container">
    <!-- 头部搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，
    且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        shape="round"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isShowResult = false"
      />
    </form>
    <!-- 头部搜索栏 end -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isShowResult" :search-text="searchText" />
    <!-- 搜索结果 end -->

    <!-- 搜索建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 搜索建议 end -->

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
    <!-- 历史记录 end -->
  </div>
</template>

<script>
import SearchSuggestion from "./components/SearchSuggestion"; // 引入搜索建议组件
import SearchHistory from "./components/SearchHistory"; // 引入历史记录组件
import SearchResult from "./components/SearchResult"; // 引入搜索结果组件

import { setItem, getItem } from "@/utils/storage";
// import { getSearchHistories } from "@/api/search";
import { mapState } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  data() {
    return {
      searchText: "", // 搜索输入框内容绑定
      isShowResult: false, // 控制搜索结果的展示状态
      searchHistories: [], // 搜索历史数据
    };
  },
  created() {
    this.loadSearchHistories();
  },
  watch: {
    // 监视搜索历史记录的变化，存储到本地
    searchHistories() {
      setItem("search-histories", this.searchHistories);
    },
  },
  methods: {
    async onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;

      const index = this.searchHistories.indexOf(searchText);
      if (index != -1) {
        // 把重复项删除
        this.searchHistories.splice("index", 1);
      }
      //把最新的搜索历史记录到顶部
      this.searchHistories.unshift(searchText);

      // 如果用户已登录，把历史记录存储到线上

      // 如果用户未登录，把历史记录存储到本地
      // setItem("search-histories", this.searchHistories);

      // 展示搜索结果
      this.isShowResult = true;
    },
    async loadSearchHistories() {
      // 后端返回的历史记录太少，把后端返回的历史记录和本地存储的历史记录合并到一起

      // 如果用户已登录
      const searchHistories = getItem("search-histories") || [];
      // if (this.user) {
      //   const { data } = await getSearchHistories();

      //   // 合并数组:  [...数组,...数组]
      //   // 把 Set 转为数组： [...Set对象]
      //   // 数组去重 [...new Set([...数组,...数组])]
      //   searchHistories = [
      //     ...new Set([...searchHistories, ...data.data.keywords]),
      //   ];
      // }

      this.searchHistories = searchHistories;
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="less" scoped></style>
