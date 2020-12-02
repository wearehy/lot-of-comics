<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('btn:admin:sec:user:add:POST')"
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
      width="450px"
    >
      <el-form
        ref="form"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username" :required="btnStatus">
          <el-input v-model="formList.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" :required="btnStatus">
          <el-input v-model="formList.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="图片" prop="avatar" :required="btnStatus">
          <el-image class="img80" :src="formList.avatar" fit="cover">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
          <p>
            <cropper num="1" :share="shareF" @feedback="feedbackF"></cropper>
          </p>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" :required="btnStatus">
          <el-select v-model="formList.roleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="formList.role" placeholder="请输入角色" /> -->
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="btnStatus">
          <el-input
            type="password"
            v-model="formList.password"
            placeholder="请输入新密码"
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
      v-permission="['btn:admin:sec:user:page:GET']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <!-- <el-table-column prop="id" label="ID" /> -->
      <el-table-column prop="username" label="登录名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="avatar" label="头像" width="70px">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.avatar"
            style="width: 50px; margin-top: 10px"
          >
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="loginLog.loginIp" label="登录ip" />
      <el-table-column prop="loginLog.updateTime" label="登录时间" width="140px" />
      <el-table-column prop="status" label="状态" width="140px">
        <template slot-scope="scope">
          <el-switch
            :disabled="$permissionButton('btn:admin:sec:user:edit:PUT')"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="parseInt(1)"
            :inactive-value="parseInt(0)"
            @change="changeStatus(scope.row.secUserId, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column width="140px" prop="createTime" label="创建日期" />
      <el-table-column width="140px" prop="updateTime" label="修改日期" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="$permissionButton('btn:admin:sec:user:edit:PUT')"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          ></el-button>
          <el-button
            :disabled="$permissionButton('btn:admin:sec:permission:del:DELETE')"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDel(scope.row)"
          ></el-button>
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
import {
  adminList,
  roleList,
  adminAdd,
  adminEdit,
  adminDel,
  changeStatus,
} from "@/api/auth/admin.js";
import Avatar from "@/assets/images/avatar.png";
import cropper from "@/components/vueCropper";

const formListOld = {
  username: null,
  nickname: null,
  role: null,
  roleId: null,
  password: null,
  avatar: null,
  avatarId: null,
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
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
        roleId: [{ required: true, message: "请上传角色", trigger: "blur" }],
        password: [
          { required: this.btnStatus, message: "请输入密码", trigger: "blur" },
        ],
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
      shareF: {
        enlarge: "0.5", //倍数
        name: "上传头像",
        type: "1",

        // enlarge: '4.8',
        // fixed: true,
        // fixedNumber: [1920,767]
      },
      roles: [],
    };
  },
  created() {
    this.roleList();
    this.adminList();
  },
  components: { cropper },
  methods: {
    roleList() {
      roleList().then((res) => {
        this.roles = res;
        formListOld.roleId = res[0].id;
      });
    },
    adminList() {
      adminList({ page: this.page.page, size: this.page.size }).then((res) => {
        res.list.map((x) => {
          for (let k in this.roles) {
            x.role == this.roles[k].name && (x.roleId = this.roles[k].id);
          }
        });
        this.tableData = res.list;

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    imgError() {},
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.adminList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.adminList();
    },
    //添加表单dialog
    handelAdd() {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加商品分类";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑商品分类";
      this.formList = JSON.parse(JSON.stringify(row));

      // console.log(222, this.formList);
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          adminAdd(this.formList).then((res) => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500,
            });
            this.$refs["form"].resetFields();
            this.adminList();
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
      !this.formList.password && delete this.formList.password;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          adminEdit(this.formList).then((res) => {
            this.$refs["form"].resetFields();
            this.adminList();
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
        adminDel({ secUserId: row.secUserId }).then((res) => {
          this.adminList();
        });
      });
    },
    // 更改状态
    changeStatus(secUserId, status) {
      changeStatus({ secUserId: secUserId, status: status }).then((res) => {
        this.adminList(this.page.page, this.page.size);
      });
    },
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.formList.avatarId = res.id;
        this.formList.avatar = res.url;
        // console.log(111)
      });
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