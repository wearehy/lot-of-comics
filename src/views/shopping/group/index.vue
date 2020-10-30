<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/mail/commodity/group/add')"
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
        <el-form-item label="名称" prop="name" :required='btnStatus'>
          <el-input v-model="formList.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" :required='btnStatus'>
          <el-input v-model="formList.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="商品数量" prop="count" :required='btnStatus'>
          <el-input v-model="formList.count" placeholder="请输入商品数量" />
        </el-form-item>
        
        <el-form-item label="可见">
          <el-switch
            v-model="formList.isDisplay"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            :active-value="0"
            :inactive-value="1"
            @change="changeStatus()"
          />
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
      v-permission="['/mail/commodity/group/all']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="name" label="名称" />  
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="count" label="商品数量" />
      

      <el-table-column prop="isDisplay" label="可见">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDisplay == 0?'success':'info'">{{scope.row.isDisplay == 0?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/mail/commodity/group/update')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/mail/commodity/group/delete')"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handelDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  groupList,
  groupAdd,
  groupEdit,
  groupDel
} from "@/api/shopping/group.js";

const formListOld = {
  name: null,
  sort: null,
  count: null,
  isDisplay: 0
};

export default {
  name: "group",
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
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序", trigger: "blur" }
        ],
        count: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
    
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
    this.groupListFun();
  },
  methods: {
    groupListFun() {
      groupList().then(res => {
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
      this.groupListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.groupListFun();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加商品分组";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑商品分组";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          groupAdd(this.formList).then(res => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.groupListFun();
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
      delete this.formList.isDelete
      this.$refs["form"].validate(valid => {
        if (valid) {
          groupEdit(this.formList).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.groupListFun();
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
        groupDel(row.guid).then(res => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500
          });
          this.groupListFun();
        });
      });
    },
    // 更改状态
    changeStatus(id, status) {}
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