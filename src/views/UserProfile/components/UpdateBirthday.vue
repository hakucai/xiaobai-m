<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from "dayjs";

export default {
  name: "UpdateBirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, // 禁止背景点击
      });

      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() +
      //   1}-${this.currentDate.getDate()}`;

      // 使用 dayjs 更加便捷
      const date = dayjs(this.currentDate).format("YYYY-MM-DD");

      // 请求更新用户生日数据
      await updateUserProfile({
        birthday: date,
      });

      this.$emit("input", date);
      this.$emit("close");

      this.$toast.success("修改成功");
    },
  },
};
</script>

<style lang="less" scoped></style>
