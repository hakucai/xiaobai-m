<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value,
    };
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onGenderChange(picker, value, index) {
      this.defaultIndex = index;
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, // 禁止背景点击
      });

      // 请求提交更新用户性别
      await updateUserProfile({
        gender: this.defaultIndex,
      });

      this.$emit("input", this.defaultIndex);
      this.$emit("close");

      this.$toast.success("修改成功");
    },
  },
};
</script>

<style lang="less" scoped></style>
