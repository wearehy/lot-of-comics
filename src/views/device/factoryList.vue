<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts"><el-button-group class="crud-opts-left"></el-button-group></div>
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
        <el-form-item label="名称" prop="title">
          <el-input v-model="formList.title" placeholder="请输入名称" />
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
      <el-table-column prop="deviceName" label="设备名称" />
      <el-table-column prop="deviceVersion" label="设备版本" />
      <el-table-column prop="deviceManufactory" label="设备制造商" />
      

      <!-- <el-table-column label="操作" width="130px" align="center" fixed="right">
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
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import {factoryList,factoryEdit } from "@/api/device/factoryList.js";

const formListOld = {
  title: null, //名称
  money: 0, //金额
  validDuration: 0, //有效时长
  useRules: null, //使用规则
  useType: 0 //使用类型
};

export default {
  name: "foctoryList",
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
      price: 0,
      times: {
        d: 0,
        h: 0,
        m: 0,
        s: 0
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
        validDuration: [
          { required: true, message: "请输入有效时长", trigger: "blur" }
        ],
        useRules: [
          { required: true, message: "请输入使用规则", trigger: "blur" }
        ],
        useType: [
          { required: true, message: "请输入使用类型", trigger: "blur" }
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
  watch:{
   
  },
  created() {
    this.factoryListFun();
  },
  methods: {
   factoryListFun() {
     factoryList().then(res => {
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
      this.factoryListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.factoryListFun();
    },
    
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "设备工厂列表编辑";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //编辑操作
    editSubmit() {
      
      this.$refs["form"].validate(valid => {
        if (valid) {
         factoryEdit(this.formList).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.factoryListFun();
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