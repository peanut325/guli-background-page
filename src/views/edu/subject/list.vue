<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
// 导入subject.js代码
import subject from "@/api/subject/subject.js";

export default {
  data() {
    // 定义变量和初始值
    return {
      filterText: "",
      subjectList: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    },
  },

  created() {
    this.getSubjectAll();
  },

  methods: {
    getSubjectAll() {
      subject
        .getSubjectAll()
        .then((response) => {
          this.subjectList = response.data.list;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "课程分类显示失败",
          });
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
  },
};
</script>