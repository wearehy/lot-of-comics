<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('btn:comic-admin:category:add:POST')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
            >新增</el-button
          >
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      v-if="dialog"
      :visible.sync="dialog"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="form"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formList.name" placeholder="请输入分类名称" />
        </el-form-item>
        <!-- :active-value="1" :inactive-value="0" -->
        <!-- <el-form-item label="是否显示" prop="status">
          <el-switch
            v-model="formList.status"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            @change="changeStatus()"
          />
        </el-form-item> -->
        <el-form-item label="排序" prop="orders">
          <el-input-number
            v-model="formList.orders"
            placeholder="请输入排序"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="分类关键字" prop="keywords">
          <el-input
            v-model="formList.keywords"
            placeholder="请输入分类关键字"
          />
        </el-form-item>
        <el-form-item label="分类描述" prop="describes">
          <el-input
            type="textarea"
            :rows="4"
            v-model="formList.describes"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="btnStatus" type="primary" @click="addSubmit"
          >保存</el-button
        >
        <el-button v-else type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['btn:comic-admin:category:list:GET']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column prop="orders" label="排序" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="keywords" label="分类关键字" />
      <el-table-column prop="describes" label="分类描述" />

      <el-table-column prop="status" label="状态" width="140px">
        <template slot-scope="scope">
           <!-- :active-value="parseInt(1)"
            :inactive-value="parseInt(0)" -->
          <el-switch
            :disabled="$permissionButton('btn:comic-admin:category:state:PUT')"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            active-text="显示"
            inactive-text="隐藏"
            @change="changeStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('btn:comic-admin:price:PUT')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:category:delete:DELETE')
              "
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
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { list, add, edit, del, changeStatus } from "@/api/comic/classify.js";

const formListOld = {
  name: null,
  orders: null,
  keywords: null,
  describes: null,
  status: true,
};

export default {
  name: "classify",
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
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getAll();
  },
  methods: {
    getAll() {
      list({ page: this.page.page, size: this.page.size }).then((res) => {
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
      this.getAll();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.getAll();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加漫画分类";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑漫画分类";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          add(this.formList).then((res) => {
            this.$refs["form"].resetFields();
            this.getAll();
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
      this.$refs["form"].validate((valid) => {
        if (valid) {
          edit(this.formList).then((res) => {
            this.$refs["form"].resetFields();
            this.getAll();
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
        type: "error",
      }).then(() => {
        del({id:row.id}).then((res) => {
          this.getAll();
        });
      });
    },
    // 更改状态
    changeStatus(id, status) {
      changeStatus({id:id,status:status}).then(res => {
        this.getAll()
      })
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
</style>