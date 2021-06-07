<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
      :success-duration="successDuration"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了~"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        >
        </van-cell> -->

        <ArticleItem v-for="(article, index) in articles" :key="index" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from "@/components/ArticleItem";
import { getArticles } from "@/api/article";
import { debounce } from "lodash";
export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态，当加载结束之后不再触发加载更多
      timestamp: null, // 获取下一页的时间戳
      isRefreshLoading: false, // 下拉刷新的 loading 状态
      refreshSuccessText: "", // 刷新成功提示的文本
      successDuration: 1500, // 刷新更改提示的文本逗留时长
      scrollTop: 0, // 列表滚动到顶部的距离
    };
  },
  mounted() {
    const articleList = this.$refs["article-list"];
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop;
    }, 50);
  },
  activated() {
    // 把记录的到顶部的距离重新设置回去
    this.$refs["article-list"].scrollTop = this.scrollTop;
  },
  methods: {
    async onLoad() {
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传历史的时间戳
        with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶 0-不包含置顶
      });

      // 把数据放到 articles 数组中
      const { results } = data.data;
      this.articles.push(...results);

      // 设置本次加载状态结束，它才可以判断需要加载下一次，否则就会永远停在这里
      this.loading = false;

      // 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp;
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true;
      }
    },
    async onRefresh() {
      // 下拉刷新，组件自己就会展示 loading 状态
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传历史的时间戳
        with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶 0-不包含置顶
      });

      // 把数据放在数据列表中（往顶部追加）
      const { results } = data.data;
      this.articles.unshift(...results);

      // 关闭刷新状态的 loading
      this.isRefreshLoading = false;
      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
