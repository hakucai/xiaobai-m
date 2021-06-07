<template>
  <div class="user-profile">
    <!-- 顶部导航 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 顶部导航 end -->

    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <!-- 用户资料 -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isEditNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isEditGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isEditBirthdayShow = true"
    ></van-cell>
    <!-- 用户资料 end -->

    <!-- 修改头像弹出框 -->
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 修改头像弹出框 end -->

    <!-- 修改昵称弹出框 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 当传递给子组件的数据既要使用又要修改，例如这里的 name 
         这种情况下我们可以使用 v-model 简写    

        :name="user.name"
        @update-name="user.name = $event"

        这两个简写成 v-model="user.name"
        默认传递一个名字叫 value 的数据
        :value = "user.name"
        默认监听 input 事件 @input="user.name = $event"
        v-model 的本质还是父子组件通信，它仅仅是简化了父组件的使用
     -->
      <UpdateName
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>
    <!-- 修改昵称弹出框 end -->

    <!-- 修改性别弹出框 -->
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <UpdateGender v-model="user.gender" @close="isEditGenderShow = false" />
    </van-popup>
    <!-- 修改性别弹出框 end -->

    <!-- 修改生日弹出框 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <UpdateBirthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- 修改生日弹出框 end -->
  </div>
</template>

<script>
import UpdateName from "./components/UpdateName"; //引入修改用户昵称组件
import UpdateGender from "./components/UpdateGender"; // 引入修改用户性别组件
import UpdateBirthday from "./components/UpdateBirthday"; // 引入修改用户生日组件
import UpdatePhoto from "./components/UpdatePhoto"; // 引入修改用户生日组件
import { getUserProfile } from "@/api/user";
export default {
  name: "UserProfile",
  data() {
    return {
      user: {}, // 用户数据
      previewImage: null, // 上传预览的图片
      isEditPhotoShow: false, // 编辑用户头像弹出框显示状态
      isEditNameShow: false, // 编辑用户昵称弹出框显示状态
      isEditGenderShow: false, // 编辑用户性别弹出框显示状态
      isEditBirthdayShow: false, // 编辑用户生日弹出框显示状态
    };
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },
    onFileChange() {
      // 展示弹出层
      this.isEditPhotoShow = true;

      // 在弹出层里面预览图片
      const file = this.$refs.file.files[0];
      //   const blob = window.URL.createObjectURL(this.$refs.file.files[0]);
      this.previewImage = file;

      // 为了解决相同的文件不触发 change 事件，清空 file 中高端 value
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
.user-profile {
  .van-popup {
    background-color: #f5f7f9;
  }
  .update-photo-popup {
    background-color: #000;
  }
}
</style>
