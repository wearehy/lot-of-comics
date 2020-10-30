<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/version/add')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
          >新增</el-button>
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog v-if="dialog" :visible.sync="dialog" :title="dialogTitle" width="450px">
      <el-form
        ref="form"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="110px"
      >
        
        <el-form-item label="安卓版本" prop="versionName" required>
          <el-input v-model="formList.versionName" placeholder="安卓版本" />
        </el-form-item>
        <el-form-item label="apk下载链接" prop="url" required>
          <el-input v-model="formList.url" placeholder="apk下载链接" />
        </el-form-item>
        <el-form-item label="文件大小" prop="fileSize" required>
          <el-input v-model="formList.fileSize" placeholder="文件大小" />
        </el-form-item>
        <el-form-item label="强制更新">
          <el-switch
            v-model="formList.versionConstraint"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus()"
          />
        </el-form-item>
        <el-form-item label="版本号" prop="versionCode" required>
          <el-input v-model="formList.versionCode" placeholder="版本号" />
        </el-form-item>
        <el-form-item label="更新内容" prop="updateInfo" required>
          <el-input type="textarea" :rows="4" v-model="formList.updateInfo" placeholder="更新内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="$permissionButton('/version/add')" v-if="btnStatus" type="primary" @click="addSubmit">保存</el-button>
        <el-button :disabled="$permissionButton('/version/modify')" v-else type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/version/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="versionName" label="安卓版本" width="100" />
      <el-table-column prop="url" label="apk下载链接" />
      <el-table-column prop="fileSize" label="文件大小" width="100" />
      <el-table-column prop="versionConstraint" label="强制更新" width="100">
        <template slot-scope="scope">{{scope.row.versionConstraint == 1?'是':'否'}}</template>
      </el-table-column>
      <el-table-column prop="versionCode" label="版本号" width="100" />
      <el-table-column prop="updateInfo" label="更新内容" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
           <el-tooltip content="编辑" effect="dark" placement="top">
          <el-button
            :disabled="$permissionButton('/version/modify')"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          />
           </el-tooltip>
            <el-tooltip content="删除" effect="dark" placement="top">
          <el-button
            :disabled="$permissionButton('/version/delete')"
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
  versionList,
  versionAdd,
  versionEdit,
  versionDel
} from "@/api/system/version.js";

const formListOld = {
  versionName: null,
  url: null,
  fileSize: null,
  versionConstraint: 0,
  versionCode: null,
  updateInfo: null
};

export default {
  name: "version",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      roles: [],
      tableData: [],
      formList: formListOld,
      rules: {
        versionName: [
          { required: true, message: "请输入安卓版本", trigger: "blur" }
        ],
        url: [
          { required: true, message: "请输入apk下载链接", trigger: "blur" }
        ],
        fileSize: [
          { required: true, message: "请输入文件大小", trigger: "blur" }
        ],
        versionCode: [
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
    this.versionListFun();
  },
  methods: {
    versionListFun() {
      versionList({ page: this.page.page, size: this.page.size }).then(res => {
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
      this.versionListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.versionListFun();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加App版本信息";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑App版本信息";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          versionAdd(this.formList).then(res => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.versionListFun();
            this.dialog = false;
          });
        } else {
          console.log("error sumbmit");
          return false;
        }
      });
    },
    //编辑操作
    editSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          versionEdit(this.formList).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.versionListFun();
            this.dialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除操作
    handelDel(row) {
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        versionDel(row.id).then(res => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500
          });
          this.versionListFun();
        });
      });
    },
    // 更改状态
    changeStatus(id, status) {
      
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