<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left"> </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/recommend/list']"
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column prop="TopicName" label="所属分类">
        <template slot-scope="scope">
          {{ scope.row.TopicName.join(" | ") }}
        </template>
      </el-table-column>
      <el-table-column prop="surname" label="用户昵称" />
      <el-table-column prop="idnumber" label="ID" />
      <el-table-column prop="look" label="查看详情">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.video"
            type="primary"
            icon="el-icon-picture"
            @click="
              showContent = scope.row;
              dialogTableVisible = true;
            "
            >图文</el-button
          >
          <el-button
            v-if="scope.row.video"
            type="primary"
            icon="el-icon-video-camera-solid"
            @click="
              showContent = scope.row;
              dialogTableVisible = true;
            "
            >视频</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="count" label="评论数" />
      <el-table-column prop="like_num" label="点赞数" />
      <el-table-column prop="create_time" label="发布时间" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="取消推荐"
            placement="top-start"
          >
            <el-button
              :disabled="$permissionButton('/recommend/qxtj')"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="btn(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :page-size="page.size"
      :page-sizes="[10, 20, 50, 100]"
      :total="page.total"
      :current-page="page.page"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 弹窗 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible">
      <div v-if="dialogTableVisible">
        <hyshow :data.sync="showContent"></hyshow>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recommendList } from "@/api/dynamic/recommend.js";
import { articleCheck } from "@/api/dynamic/article.js";
import hyshow from "@/components/imgTxtVideoShow/index.vue";
export default {
  name: "recommend",
  data() {
    return {
      loading: true,
      tableData: [],
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
      dialogTableVisible: false, //查看详情弹窗
    };
  },
  created() {
    this.recommendList();
  },
  components: {
    hyshow: hyshow,
  },
  methods: {
    recommendList() {
      recommendList({ page: this.page.page, size: this.page.size }).then(
        (res) => {
          this.tableData = res.list;
          this.page.total = res.total;
          setTimeout(() => {
            this.loading = false;
          }, 50);
        }
      );
    },
    btn(opt) {
      this.$confirm(`确定取消推荐吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            guid: opt.guid,
            isBetter: 0,
            state: opt.state,
          };
          articleCheck(data).then(() => {
            this.recommendList();
            this.$notify({
              title: "操作成功",
              type: "success",
              duration: 1500,
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      this.recommendList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.recommendList(val, this.page.size);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>

<style>
.crud-opts {
  padding: 6px 0;
  display: -webkit-flex;
  display: flex;
  /* align-items: center; */
}
</style>