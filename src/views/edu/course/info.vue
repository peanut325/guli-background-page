<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 一级分类，需要绑定onchange时间，将id传给二级分类 -->
      <el-form-item label="分类选择">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="oneSubject in oneSubjectList"
            :key="oneSubject.id"
            :label="oneSubject.title"
            :value="oneSubject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择二级分类">
          <el-option
            v-for="twoSubject in twoSubjectList"
            :key="twoSubject.id"
            :label="twoSubject.title"
            :value="twoSubject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="200" height="200" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/course/course.js";
// 导入subject.js代码
import subject from "@/api/subject/subject.js";
// 引入富文本编辑器
import Tinymce from "@/components/Tinymce";

export default {
  // 申明富文本编辑器组件（第三方）
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: "",
        subjectId: "",
        subjectParentId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: process.env.OSS_PATH + "/img/linux.png",
        price: 0,
      },
      teacherList: [],
      oneSubjectList: [], //一级分类列表
      twoSubjectList: [], //二级分类列表
      BASE_API: process.env.BASE_API,
      eduCourseId: "",
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.eduCourseId = this.$route.params.id;
        // 有id,即查询courseId对应的课程
        this.getCourseById();
      } else {
        // 先清空数据，防止添加课程时有回显信息，并给cover赋默认值
        this.courseInfo = {};
        this.courseInfo.cover = process.env.OSS_PATH + "/img/linux.png";
        // 调用查询所有讲师
        this.getTeacherAll();
        // 定义查询所有分类
        this.getSubjectAll();
      }
    },
    // 根据courseId查询课程
    getCourseById() {
      course
        .getCourseInfoById(this.eduCourseId)
        .then((response) => {
          // 查询成功后返回基本信息
          this.courseInfo = response.data.courseInfo;

          // 封装下拉表的二级分类信息
          // 先查询所有的课程分类
          subject.getSubjectAll().then((response) => {
            // 获取所有一级分类id
            this.oneSubjectList = response.data.list;
            // 遍历所有一级分类
            for (let i = 0; i < this.oneSubjectList.length; i++) {
              // subjectParentId和一级分类的id相等时，此时即可取出二级分类
              if (
                this.oneSubjectList[i].id == this.courseInfo.subjectParentId
              ) {
                // 获取一级分类的所有二级分类
                this.twoSubjectList = this.oneSubjectList[i].children;
              }
            }
          });
          // 调用查询所有讲师
          this.getTeacherAll();
        })
        .catch();
    },
    // 上传封面成功调用的方法
    handleAvatarSuccess(rep, file) {
      this.courseInfo.cover = rep.data.url;
      this.$message({
        type: "success",
        message: "课程封面上传成功",
      });
    },
    // 上传封面前调用的方法
    beforeAvatarUpload(file) {
      // 进行文件大小的校验
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // change调用二级分类
    subjectLevelOneChanged(value) {
      for (let i = 0; this.oneSubjectList.length; i++) {
        // 一级分类的id等于传过来的id，进行赋值
        if (this.oneSubjectList[i].id === value) {
          // 从一级分类里面获取二级分类
          this.twoSubjectList = this.oneSubjectList[i].children;
          // 清空二级分类的id值
          this.courseInfo.subjectId = '';
        }
      }
    },
    // 查询所有分类
    getSubjectAll() {
      subject
        .getSubjectAll()
        .then((response) => {
          this.oneSubjectList = response.data.list;
        })
        .catch();
    },
    // 查询所有讲师用于下拉表
    getTeacherAll() {
      course
        .getTeacherAll()
        .then((response) => {
          this.teacherList = response.data.items;
        })
        .catch();
    },
    // 判断新增还是修改
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        // 路径有id，执行更新
        this.updateCourse();
      } else {
        // 路径无id，执行新增
        this.insertCourse();
      }
    },
    // 新增课程
    insertCourse() {
      course
        .addCourseAll(this.courseInfo)
        .then((response) => {
          // 将接口中返回的课程id传入到章节
          this.$router.push({
            path: "/edu/course/chapter/" + response.data.eduCourseId,
          });
          this.$message({
            type: "success",
            message: "课程添加成功",
          });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "课程添加失败",
          });
        });
    },
    // 修改课程
    updateCourse() {
      course
        .updateCourseInfo(this.courseInfo)
        .then((response) => {
          // 将接口中返回的课程id传入到章节
          this.$router.push({
            // 注意这里传过去的id值为chapter传过来的值，而不是数据库中返回的id，和新增有区别
            path: "/edu/course/chapter/" + this.eduCourseId,
          });
          this.$message({
            type: "success",
            message: "课程修改成功",
          });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "课程修改失败",
          });
        });
    },
  },
};
</script>
<!-- 添加富文本编辑器样式 -->
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>