<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button type="text" @click="openVideoDialog(chapter.id)"
              >添加课时</el-button
            >
            <el-button style="" type="text" @click="editChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="getVideoById(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="deleteEduVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/vodupload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/chapter/chapter.js";
import video from "@/api/video/video.js";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      eduCourseId: "",
      chapterVideoList: [],
      dialogChapterFormVisible: false, //是否显示章节表单
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: "", // 课时所在的章节id
      video: {
        // 课时对象
        id: "",
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: "",
      },
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },

  created() {
    this.init();
  },

  methods: {
    // ========================= 上传视频操作 ======================
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      // 将阿里云的视频id保存到video对象
      this.video.videoSourceId = response.data.videoId;
      // 将视频的文件名保存到video对象，用于保存
      this.video.videoOriginalName = file.name;
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    handleVodRemove(file, fileList) {
      // 调用方法删除
      video
        .deleteVideo(this.video.videoSourceId)
        .then((response) => {
          this.$message({
            type: "success",
            message: "删除视频成功！",
          });
          // 将显示文件列表清空
          (fileList = []),
            // 将视频id和视频文件名清空，防止保存到数据库
            (this.video.videoSourceId = "");
          this.video.videoOriginalName = "";
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "删除视频失败！",
          });
        });
    },
    beforeVodRemove(file, fileList) {
      // 提示信息
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // ========================= 小节操作 ======================
    // 小节模态框初始化
    openVideoDialog(chapterId) {
      // 弹框
      this.dialogVideoFormVisible = true;
      // 清除文件名
      this.fileList = [];
      // 清除数据
      this.video = {};
      // 将将章节id赋值进去
      this.video.chapterId = chapterId;
    },
    // 点击保存按钮判断小节新增还是修改
    saveOrUpdateVideo() {
      if (this.video.id) {
        // 更新操作
        this.updateVideo();
      } else {
        //新增操作
        this.addEduVideo();
      }
    },
    // 新增小节
    addEduVideo() {
      // 将课程id赋值进去
      this.video.courseId = this.eduCourseId;
      // 调用新增小节方法
      video
        .addVideo(this.video)
        .then((response) => {
          this.$message({
            type: "success",
            message: "新增课时成功",
          });
          // 关闭弹框
          this.dialogVideoFormVisible = false;
          // 清空小节数据
          this.video = {};
          // 查询所有章节,刷新页面
          this.getChapterAll();
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "新增课时失败",
          });
          // 关闭弹框
          this.dialogVideoFormVisible = false;
          // 清空小节数据
          this.video = {};
          // 查询所有章节,刷新页面
          this.getChapterAll();
        });
    },
    // 根据id查询小节用于回显
    getVideoById(videoId) {
      // 初始化模态框
      this.openVideoDialog();
      video
        .getVideoById(videoId)
        .then((response) => {
          this.video = response.data.eduVideo;
          // 回显视频上传文件名
          this.fileList = [{ name: this.video.videoOriginalName }];
        })
        .catch();
    },
    // 更新小节
    updateVideo() {
      video
        .updateVideo(this.video)
        .then((response) => {
          this.$message({
            type: "success",
            message: "更新课时成功",
          });
          // 关闭弹框
          this.dialogVideoFormVisible = false;
          // 清空小节数据
          this.video = {};
          // 查询所有章节,刷新页面
          this.getChapterAll();
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "更新课时失败",
          });
          // 关闭弹框
          this.dialogVideoFormVisible = false;
          // 清空小节数据
          this.video = {};
          // 查询所有章节,刷新页面
          this.getChapterAll();
        });
    },
    // 删除小节
    deleteEduVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return video.deleteEduVideo(videoId);
        })
        .then(() => {
          this.getChapterAll(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
        });
      // 关闭弹框
      this.dialogVideoFormVisible = false;
      // 查询所有章节,刷新页面
      this.getChapterAll();
    },
    // ========================= 章节操作 ======================

    // 删除章节
    deleteChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapter.deleteChapter(chapterId);
        })
        .then(() => {
          this.getChapterAll(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
        });
    },
    // 修改章节回显数据
    editChapter(chapterId) {
      // 初始化模态框
      this.openChapterDialog();
      chapter
        .getChapterById(chapterId)
        .then((response) => {
          // 将返回数据赋值给chapter
          this.chapter = response.data.eduChapter;
        })
        .catch();
    },
    // 章节模态框初始化
    openChapterDialog() {
      // 弹框
      this.dialogChapterFormVisible = true;
      // 表单数据清空
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    // 初始化页面
    init() {
      // 在页面渲染前，判断路径是否有courseId值，从而判断进行修改还是新增
      if (this.$route.params && this.$route.params.id) {
        this.eduCourseId = this.$route.params.id;
        // 有id,即查询courseId对应的章节
        this.getChapterAll();
      }
    },
    // 查询所有章节
    getChapterAll() {
      chapter
        .getChapterAll(this.eduCourseId)
        .then((response) => {
          this.chapterVideoList = response.data.chapterList;
        })
        .catch();
    },
    // 判断章节新增还是修改
    saveOrUpdateChapter() {
      this.saveBtnDisabled = true; // 开启保存按钮
      if (!this.chapter.id) {
        this.saveChapter();
      } else {
        this.updateChapter();
      }
    },
    // 保存章节
    saveChapter() {
      this.chapter.courseId = this.eduCourseId;
      chapter
        .addChapter(this.chapter)
        .then((response) => {
          this.$message({
            type: "success",
            message: "新增章节成功",
          });
          // 关闭弹框
          this.dialogChapterFormVisible = false;
          // 查询所有章节,刷新页面
          this.getChapterAll();
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "新增章节失败",
          });
        });
    },
    // 修改章节
    updateChapter() {
      chapter
        .updateChapter(this.chapter)
        .then((response) => {
          this.$message({
            type: "success",
            message: "修改章节成功",
          });
          // 关闭弹框
          this.dialogChapterFormVisible = false;
          // 查询所有章节,刷新页面
          this.getChapterAll();
        })
        .catch(
          this.$message({
            type: "error",
            message: "修改章节失败",
          })
        );
    },
    // 上一步路由跳转
    previous() {
      this.$router.push({ path: "/edu/course/info/" + this.eduCourseId });
    },
    // 下一步路由跳转
    next() {
      this.$router.push({ path: "/edu/course/publish/" + this.eduCourseId });
    },
  },
};
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  position: relative;
  float: right;
  font-size: 14px;
  z-index: 1;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>