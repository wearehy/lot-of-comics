<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts"></div>
    </div>
    <!--表单渲染-->
    <el-dialog v-if="dialog" :visible.sync="dialog" :title="dialogTitle" width="450px">
      <el-form
        ref="form"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="60px"
      >
        <el-form-item label="收益率" prop="value" :required="btnStatus">
          <el-input v-model="formList.value" placeholder="请输入收益率" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/system/assetAllocation']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="value" label="收益率" />
      <el-table-column prop="description" label="描述" />

      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/system/assetAllocation')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  assetAllocationList,
  assetAllocationEdit
} from "@/api/system/assetAllocation.js";

export default {
  name: "assetAllocation",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      tableData: [],
      formList: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        frist: [
          { required: true, message: "请输入首件（个）", trigger: "blur" }
        ],
        fristPrice: [
          { required: true, message: "请输入运费（元）", trigger: "blur" }
        ],
        continued: [
          { required: true, message: "请输入续件（个）", trigger: "blur" }
        ],
        continuedPrice: [
          { required: true, message: "请输入续费（元）", trigger: "blur" }
        ]
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },

      formPut: {}
    };
  },
  created() {
    this.assetAllocationListFun();
  },
  methods: {
    assetAllocationListFun() {
      assetAllocationList().then(res => {
        this.tableData = res;
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
      this.assetAllocationListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.assetAllocationListFun();
    },

    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑" + row.title;
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //编辑操作
    editSubmit() {
      let valueName = this.formList.key.toString();
      let value = this.formList.value;
      this.formPut[valueName] = value;

      this.$refs["form"].validate(valid => {
        if (valid) {
          assetAllocationEdit(this.formPut).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.assetAllocationListFun();
            this.dialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
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