<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container"></div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/album/prenatal/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="album.title" label="专辑标题" />
      <el-table-column prop="album.thumb" label="缩略图">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="40" :src="scope.row.album.thumb"></el-avatar>
         
        </template>
      </el-table-column>
      <el-table-column prop="album.playNum" label="播放总量" />
      <el-table-column prop="album.listorder" label="排序" />
      <el-table-column prop="week" label="怀孕计时（周）" />
      <!-- <el-table-column prop="album.createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" /> -->

      <el-table-column label="操作" width="80px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="top">
            <el-button
              :disabled="$permissionButton('/album/prenatal/delete')"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handelDel(scope.row)"
            />
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
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  prenatalList,
  prenatalEdit,
  prenatalDel
} from "@/api/business/prenatal.js";

export default {
  name: "prenatal",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      roles: [],
      tableData: [],

      rules: {
        url: [
          { required: true, message: "请输入apk下载链接", trigger: "blur" }
        ],
        fileSize: [
          { required: true, message: "请输入文件大小", trigger: "blur" }
        ],
        prenatalCode: [
          { required: true, message: "请输入版本号", trigger: "blur" }
        ],
        updateInfo: [
          { required: true, message: "请输入更新内容", trigger: "blur" }
        ]
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  created() {
    this.prenatalListFun();
  },
  methods: {
    prenatalListFun() {
      prenatalList({ page: this.page.page, size: this.page.size }).then(res => {
        this.tableData = res.list;

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.prenatalListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.prenatalListFun();
    },

    //删除操作
    handelDel(row) {
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        prenatalDel(row.id).then(res => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500
          });
          this.prenatalListFun();
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
.el-table .cell {
  white-space: pre-line;
}
</style>