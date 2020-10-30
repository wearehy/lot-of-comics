<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left"></el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/users/feedback']"
      v-loading="loading"
      :data="tableData"
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" sortable />
      <el-table-column prop="email" label="email" sortable />
      <el-table-column prop="content" label="反馈内容" sortable />
      <el-table-column prop="createTime" label="创建时间" sortable />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="$permissionButton('/users/feedback/del')"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDel(scope.row)"
          />
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
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { feedback, delFeedback } from "@/api/users/users";

export default {
  name: "Feedback",
  data() {
    return {
      loading: true,
      tableData: [],
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  created() {
    this.feedbackList(this.page.page, this.page.size);
  },
  methods: {
    feedbackList(page, size) {
      feedback({ page: page, size: size }).then(res => {
        this.tableData = res.data;
        // this.page.page = res.page;
        // this.page.size = res.size;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      this.feedbackList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.feedbackList(val, this.page.size);
    },

    //删除操作
    handelDel(row) {
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        delFeedback(row.id).then(res => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500
          });
          this.feedbackList(this.page.page, this.page.size);
        });
      });
    }
  }
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
.crud-opts .crud-opts-right {
  margin-left: auto;
}
</style>