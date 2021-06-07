<template>
  <div class="update-name">
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateName",
  data() {
    return {
      localName: this.value,
    };
  },
  props: {
    // 声明接收父组件 v-model 传递的 value 数据
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, // 禁止背景点击
      });
      try {
        // 请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName,
        });

        // 更新成功，修改父组件的 name ，关闭弹出框
        // 发布 input 事件，更新父组件 v-model 绑定的数据
        this.$emit("input", this.localName);
        this.$emit("close");

        this.$toast.success("保存成功");
      } catch (error) {
        if (error && error.response && error.response.status === 409) {
          this.$toast.fail("昵称已存在");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.update-name {
  .name-field-warp {
    padding: 10px;
  }
}
</style>
