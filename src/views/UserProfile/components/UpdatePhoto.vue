<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from "@/api/user";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  name: "UpdatePhoto",
  props: {
    file: {
      //   type: Object,
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null, //裁切器示例
    };
  },
  mounted() {
    //图片裁切工具必须基于 img 进行初始化
    //注意： img 必须是可见状态才能正常完成初始化
    //       因为我们这里要在对话框里面初始化裁切工具
    //       所以务必要在对话框完全打开的状态下去完成初始化

    //获取图片 DOM 节点
    const image = this.$refs.image;

    // 第一次初始化好以后，如果预览裁切的图片发生了变化，裁切工具默认不会更新
    // 如果需要预览图片发生变化更新裁切工具：
    // 方式1：裁切工具 .replace 方法
    // 销毁裁切工具，重新初始化

    // 初始化裁切工具
    this.cropper = new Cropper(image, {
      aspectRatio: 1, // 设置裁剪框为固定的宽高比
      viewMode: 1, // 视图控制 0:无限制 1:限制裁剪框不能超出图片的范围
      dragMode: "none", // 图片是否可移动 crop 形成新的裁剪框  move 图片可移动   none 什么也没有
      cropBoxResizable: false,
      // movable: true, // 是否可以移动图片

      //当你移动裁切器的时候会触发调用 crop 方法
      // crop(event) {
      //   console.log(event.detail.x);
      //   console.log(event.detail.y);
      //   console.log(event.detail.width);
      //   console.log(event.detail.height);
      //   console.log(event.detail.rotate);
      //   console.log(event.detail.scaleX);
      //   console.log(event.detail.scaleY);
      // },
    });
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, // 禁止背景点击
        duration: 0, // 展示时间， 0 表示持续展示
      });

      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append("photo", file);

      // 如果要求 Content-Type 是 multipart/form-data 则一定要提交 FormData 数据对象
      // const fd = new FormData();
      // fd.append("photo", this.file);
      await updateUserPhoto(fd);

      // 更新父组件头像
      this.$emit("update-photo", window.URL.createObjectURL(file));

      // 关闭弹出层
      this.$emit("close");

      this.$toast.success("修改成功");
    },
  },
};
</script>

<style lang="less" scoped>
.update-photo {
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
  }
  .image {
    display: block;
    max-width: 100%;
  }
}
</style>
