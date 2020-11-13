<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
          >
            <!-- :disabled="$permissionButton('/menus/add')"
          > -->
            新增
          </el-button>
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      @close="handelCancel"
      :visible.sync="dialog"
      :title="dialogTitle"
      width="580px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单可见"
          prop="hidden"
        >
          <el-radio-group
            v-model="form.hidden"
            size="mini"
            style="width: 178px"
          >
            <el-radio-button label="0">是</el-radio-button>
            <el-radio-button label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单图标"
          prop="icon"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 450px"
              placeholder="点击选择图标"
              readonly
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单标题"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :style="
              form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'
            "
            placeholder="菜单标题"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '2'"
          label="按钮名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="按钮名称"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          label="路由地址"
          prop="path"
        >
          <el-input
            v-model="form.path"
            placeholder="路由地址"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '0'"
          label="权限标识"
          prop="permission"
        >
          <el-input
            v-model="form.permission"
            :disabled="form.iframe"
            placeholder="权限标识"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number
            v-model.number="form.sort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '1'"
          label="组件名称"
          prop="component_name"
        >
          <el-input
            v-model="form.component_name"
            style="width: 178px"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '1'"
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="form.component"
            style="width: 178px"
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item label="上级类目" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="menus"
            style="width: 450px"
            placeholder="选择上级类目"
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
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="菜单名称" width="180px" prop="name" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" />
      <el-table-column prop="permission" label="权限标识" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.hidden ? 'info' : 'success'">{{
            scope.row.hidden ? "否" : "是"
          }}</el-tag>
          <!-- <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          />
          <!-- :disabled="$permissionButton('/menus/edit')" /> -->
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDel(scope.row)"
          />
          <!-- :disabled="$permissionButton('/menus/del')"  /> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { menus, getMenusTree, add, edit, del } from "@/api/auth/menu";
import IconSelect from "@/components/IconSelect";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const defaultForm = {
  id: "",
  name: "",
  sort: 999,
  path: "",
  component: "",
  component_name: "",
  parentId: 0,
  icon: "",
  hidden: 0,
  type: 0,
  permission: "",
};
export default {
  name: "Menu",
  inject: ["reload"],
  components: { Treeselect, IconSelect },
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      menus: [],
      tableData: [],
      form: defaultForm,
      selectList: null,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.meunsTableTree();
  },
  methods: {
    meunsTableTree() {
      menus().then((res) => {
        this.tableData = res;
        this.selectListFun(res);
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
      
    },
    //上级类目列表
    selectListFun(res) {
      
      function fun(opt) {
        opt.map((x) => {
          x.label = x.name;
          if (x.children && x.children.length > 0) {
            fun(x.children);
          }
        });
      }
      fun(res);
      this.selectList =  res;       //methods 下函数无法用return，此处用callback替代
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加菜单";
      // getMenusTree().then(res => {
      let _res;
      
      _res = this.resFun(this.selectList); //删除 children:null
      this.menus = [];
      const menu = { id: 0, label: "顶级类目", children: [] };
      menu.children = _res;
      this.menus.push(menu);
      // })
    },
    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true;
      this.btnStatus = false;
      this.dialogTitle = "编辑菜单";

      this.$nextTick(() => {
        this.form = row;
        // getMenusTree().then((res) => {
          let _res;
          _res = this.resFun(this.selectList); //删除 children:null
          // console.log(res)
          this.menus = [];
          const menu = { id: 0, label: "顶级类目", children: [] };
          menu.children = _res;
          this.menus.push(menu);
        // });
      });
    },
    //取消并清除字段
    handelCancel(done) {
      this.$refs["form"].resetFields();
      this.dialog = false;
      this.meunsTableTree();
      // done()
    },
    //添加操作
    addSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          add(this.form).then((res) => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500,
            });
            this.$refs["form"].resetFields();
            this.meunsTableTree();
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
          edit(this.form).then((res) => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500,
            });
            this.$refs["form"].resetFields();
            this.meunsTableTree();
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
        del(row.id).then((res) => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500,
          });
          this.meunsTableTree();
        });
      });
    },
    // 选中图标
    selected(name) {
      this.form.icon = name;
    },
    resFun(x) {
      //去除children: null
      let len = x.length;
      for (let i = 0; i < len; i++) {
        (!x[i].children || x[i].children.length == 0) && delete x[i].children;
        x[i].children && this.resFun(x[i].children);
      }
      return x;
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
.crud-opts .crud-opts-right {
  margin-left: auto;
}
</style>