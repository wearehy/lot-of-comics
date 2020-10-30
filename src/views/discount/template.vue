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
        <el-form-item label="名称" prop="title">
          <el-input v-model="formList.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input-number v-model="price" controls-position="right" placeholder="请输入金额" /> 元
        </el-form-item>
        <el-form-item label="有效时长" prop="validDuration">
          <el-input-number v-model="times.d" controls-position="right" placeholder="请输入有效时长" /> 天
          <el-input-number v-model="times.h" controls-position="right" placeholder="请输入有效时长" /> 小时
          <el-input-number v-model="times.m"  class="top5" controls-position="right" placeholder="请输入有效时长" /> 分
          <el-input-number v-model="times.s" class="top5" controls-position="right" placeholder="请输入有效时长" /> 秒
        </el-form-item>
        <el-form-item label="使用规则" prop="useRules">
          <el-input v-model="formList.useRules" placeholder="请输入使用规则" />
        </el-form-item>
        <el-form-item label="使用类型" prop="useType">
          <el-radio-group v-model="formList.useType">
            <el-radio :label="0">商品代金券</el-radio>
            <el-radio :label="1">可提现代金券</el-radio>
          </el-radio-group>
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
      <el-table-column prop="title" label="名称" />
      <el-table-column prop="money" label="金额（元）">
        <template slot-scope="scope">{{(scope.row.money/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="validDuration" label="有效时长">
        <template slot-scope="scope">{{$second.timer1(scope.row.validDuration)}}</template>
      </el-table-column>
      <el-table-column prop="useRules" label="使用规则" />
      <el-table-column prop="sentTotal" label="送出总数" />
      <el-table-column prop="useType" label="类型">
        <template slot-scope="scope">{{scope.row.useType == 0?'商品代金券':'可提现代金券'}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />

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
import { vtList, vtAdd, vtEdit } from "@/api/discount/template.js";

const formListOld = {
  title: null, //名称
  money: 0, //金额
  validDuration: 0, //有效时长
  useRules: null, //使用规则
  useType: 0 //使用类型
};

export default {
  name: "vt",
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
    'formList.validDuration'(val){
      this.times.d = Math.floor(val/(24*3600))
      this.times.h = Math.floor(val%(3600*24)/3600)
      this.times.m = Math.floor((val%3600)/60)
      this.times.s = val%60
    },
    'times.d'(val){
      this.formList.validDuration = val*(24*3600) + this.times.h*3600 + this.times.m*60 + this.times.s
    },
    'times.h'(val){
      this.formList.validDuration = this.times.d*(24*3600) + val*3600 + this.times.m*60 + this.times.s
    },
    'times.m'(val){
      this.formList.validDuration = this.times.d*(24*3600) + this.times.h*3600 + val*60 + this.times.s
    },
    'times.s'(val){
      this.formList.validDuration = this.times.d*(24*3600) + this.times.h*3600 + this.times.m*60 + val
    },

    'formList.money'(val){
      this.price = (val/100).toFixed(2)
    },
    price(val){
      this.formList.money = val*100
    }


  },
  created() {
    this.vtListFun();
  },
  methods: {
    vtListFun() {
      vtList().then(res => {
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
      this.vtListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.vtListFun();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加基础模板";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑基础模板";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          vtAdd(this.formList).then(res => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.vtListFun();
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
          vtEdit(this.formList).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.vtListFun();
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