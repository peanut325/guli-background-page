<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'"
          field="multipartFile"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 导入teacher.js代码
import teacher from "@/api/teacher/teacher.js";
// 引入头像弹框组件
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  // 声明头像弹框组件
  components: { ImageCropper, PanThumb },

  data() {
    // 设置teacher初始值，可以省略
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      BASE_API: process.env.BASE_API,
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id

      // 此处禁用保存按钮，防止再次提交
      saveBtnDisabled: false, // 保存按钮是否禁用
    };
  },

  created() {
    this.init();
  },

  watch: {
    // 监听
    $route(to, from) {
      // 路由变化方式，路由发生变化，方法就会执行，区分新增和修改，从而是否清空数据
      this.init();
    },
  },

  methods: {
    // 上传成功后的回调函数
    cropSuccess(data) {
      // 将url赋值给teacher对象
      this.teacher.avatar = data.url;
      // 关闭弹窗
      this.imagecropperShow = false;
      // 上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false;
      // 上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 封装初始化方法
    init() {
      // 在页面渲染前，判断路径是否有id值，从而判断进行修改还是新增
      if (this.$route.params && this.$route.params.id) {
        // 有id即，通过id值查找讲师
        this.getTeacherById(this.$route.params.id);
      } else {
        // 如果没有id值，防止修改的数据回显在新增表单上，此时清空表单
        this.teacher = {};
      }
    },

    // 通过id查找讲师
    getTeacherById(id) {
      teacher
        .getTeacherById(id)
        .then((response) => {
          // 由于表单和teacher是双向绑定，只需将查询的数据赋值给teacher即可显示在表单上
          this.teacher = response.data.teacher;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "没有该讲师信息",
          });
        });
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true;
      // 根据teacher中是否有id来判断进行删除还是新增
      if (this.teacher.id) {
        this.updateTeacherById();
      } else {
        this.saveData();
      }
    },

    updateTeacherById() {
      teacher
        .updateTeacherById(this.teacher)
        .then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          // 回到讲师列表 路由跳转实现
          this.$router.push({ path: "/edu/teacher/list" });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "修改失败",
          });
        });
    },

    saveData() {
      teacher
        .saveTeacher(this.teacher)
        .then((response) => {
          this.$message({
            type: "success",
            message: "新增成功!",
          });

          // 回到讲师列表 路由跳转实现
          this.$router.push({ path: "/edu/teacher/list" });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "新增失败",
          });
        });
    },
  },
};
</script>