<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover" />
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray">
          <span>共{{ coursePublish.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类：{{ coursePublish.subjectLevelOne }} —
            {{ coursePublish.subjectLevelTwo }}</span
          >
        </p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish()"
          >发布课程</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import publish from "@/api/publish/publish.js";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "",
      // 课程信息确认对象
      coursePublish: {},
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      // 判断路径中是否有id值
      if (this.$route.params && this.$route.params.id) {
        // 有id值则赋值到courseId
        this.courseId = this.$route.params.id;
        // 调用查询方法
        this.getCoursePublishVO();
      }
    },
    // 发布课程
    publish(){
      // 调用更新课程状态方法
      publish
      .updateCourseStatus(this.courseId)
      .then((response) => {
        this.$message({
            type: "success",
            message: "课程发布成功",
          });
          // 路由跳转到课程显示页面
          this.$router.push({ path: "/edu/course/list" });
      })
      .catch((error) => {
        this.$message({
            type: "error",
            message: "课程发布失败",
          });
      })
    },
    // 查询课程确认信息
    getCoursePublishVO() {
      publish
        .getCoursePublishVO(this.courseId)
        .then((response) => {
          // 赋值到coursePublish用于显示
          this.coursePublish = response.data.coursePublish;
        })
        .catch();
    },
    previous() {
      this.$router.push({ path: "/edu/course/chapter/" + this.courseId });
    }
  },
};
</script>
<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #ddd;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>