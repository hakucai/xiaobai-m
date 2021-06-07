<template>
  <van-cell class="article-time">
    <!-- van-multi-ellipsis--l3 为 vant 里面的内置样式   -->
    <div class="title van-multi-ellipsis--l3" slot="title">
      {{ article.title }}
    </div>
    <div slot="label">
      <div class="cover-warp" v-if="article.cover.type === 3">
        <div
          class="cover-warp-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item" :src="img" fit="cover" />
        </div>
      </div>
      <div class="label-warp">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>

    <!-- 默认插槽的名字叫 default 可以省略 -->
    <!-- <div slot="default"></div>  可以直接写成<div></div> -->
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/.van-cell__value {
    width: 116px;
    height: 73px;
    flex: unset;
    margin-left: 12px;
  }
  .cover-warp {
    display: flex;
    padding: 15px 0;
    .cover-warp-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
    }
    .cover-item {
      width: 100%;
      height: 73px;
    }
  }
  .label-warp {
    font-size: 11px;
    color: #b4b4b4;
    .label-warp span {
      margin-right: 12px;
    }
  }
}
</style>
