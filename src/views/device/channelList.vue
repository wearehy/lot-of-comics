<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/vt/add')"
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
        label-width="80px"
      >
        <el-form-item label="渠道名" prop="channelName">
          <el-input v-model="formList.channelName" placeholder="请输入渠道名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="btnStatus" type="primary" @click="addSubmit">保存</el-button>
        <el-button v-else type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/vt/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="channelName" label="渠道名" />
      <el-table-column prop="createTime" label="创建时间" />
      
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/vt/edit')"
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
import { channelList, channelAdd, channelEdit, channelUpdate } from "@/api/device/channelList.js";

const formListOld = {
  channelName: null, //名称
};

export default {
  name: "channel",
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
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  watch:{
    
  },
  created() {
    this.channelListFun();
  },
  methods: {
    channelListFun() {
      channelList().then(res => {
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
      this.channelListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.channelListFun();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加渠道";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑渠道";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          channelAdd(this.formList).then(res => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.channelListFun();
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
          channelEdit(this.formList).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.channelListFun();
            this.dialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>

<style>
</style>