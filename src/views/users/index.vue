<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <el-input
          :disabled="$permissionButton('/users/search')"
          v-model="search.title"
          size="small"
          clearable
          placeholder="ID | 用户名 | idnumber | 手机号"
          style="width: 240px;"
          class="filter-item"
        />
        <el-select
          :disabled="$permissionButton('/users/search')"
          v-model="search.user_stage"
          placeholder="选择人生阶段"
          style="margin-bottom:10px;vertical-align: middle;"
        >
          <el-option label="暂无" value="1"></el-option>
          <el-option label="我怀孕了" value="2"></el-option>
          <el-option label="我是辣妈" value="3"></el-option>
        </el-select>
        <span>
          <el-button
            :disabled="$permissionButton('/users/search')"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="handleSearch"
          >搜索</el-button>
          <el-button
            :disabled="$permissionButton('/users/search')"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="refresh"
          >重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <el-button-group class="crud-opts-right">
          <el-button size="mini" icon="el-icon-refresh" @click="refresh()" />
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/users']"
      v-loading="loading"
      :data="tableData"
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" sortable />
      <el-table-column prop="username" label="用户名" sortable />
      <el-table-column prop="idnumber" label="idnumber" sortable />
      <el-table-column prop="mobile" label="手机号" sortable />
      <el-table-column prop="avatar" label="头像" sortable>
        <template slot-scope="scope">
          <img :src="scope.avatar ? scope.avatar : Avatar" :width="40" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" sortable>
        <template slot-scope="scope">
          <img v-if="scope.gender === 0" :src="Unknown" :width="40" class="avatar" />
          <img v-else-if="scope.gender === 1" :src="Man" :width="40" class="avatar" />
          <img v-else :src="Women" :width="40" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="user_stage_name" label="人生阶段" sortable />
      <el-table-column prop="login_ip" label="登录ip" sortable />
      <el-table-column prop="login_time" label="登录时间" sortable />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button :disabled="$permissionButton('/users/edit')" size="mini" disabled="true" type="primary" icon="el-icon-edit" @click="handelEdit(scope.row)" /> -->
          <el-button
            :disabled="$permissionButton('/users/del')"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDel(scope.row)"
          />
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
import { users, search, edit, del, changeStatus } from "@/api/users/users";
import Avatar from "@/assets/images/avatar.png";
import Man from "@/assets/images/man.png";
import Women from "@/assets/images/women.png";
import Unknown from "@/assets/images/unknown.png";

const defaultForm = {
  id: "",
  username: "",
  password: "",
  nickname: "",
  role_id: "",
};
export default {
  name: "Menu",
  inject: ["reload"],
  data() {
    return {
      Avatar: Avatar,
      Man: Man,
      Women: Women,
      Unknown: Unknown,
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      tableData: [],
      form: defaultForm,
      search: {
        title: "",
        user_stage: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        role_id: [
          { required: true, message: "请选择用户角色", trigger: "change" },
        ],
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
    this.userList(this.page.page, this.page.size);
  },
  methods: {
    userList(page, size) {
      users({ page: page, size: size }).then((res) => {
        this.tableData = res.data;
        // this.page.page = res.page;
        // this.page.size = res.size;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      this.userList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.userList(val, this.page.size);
    },

    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true;
      this.btnStatus = false;
      this.dialogTitle = "编辑用户";

      this.$nextTick(() => {
        this.form.password = "";
        this.form.id = row.id;
        this.form.username = row.username;
        this.form.nickname = row.nickname;
        this.form.role_id = row.role_id;
      });
    },
    //取消并清除字段
    handelCancel(done) {
      this.$refs["form"].resetFields();
      this.dialog = false;
      done();
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
            this.userList(this.page.page, this.page.size);
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
          this.userList(this.page.page, this.page.size);
        });
      });
    },
    // 更改状态
    changeStatus(id, status) {
      changeStatus({ id: id, status: status }).then((res) => {
        this.$notify({
          title: "状态更改成功",
          type: "success",
          duration: 1500,
        });
        this.userList(this.page.page, this.page.size);
      });
    },
    //搜索
    handleSearch() {
      search({
        title: this.search.title,
        user_stage: this.search.user_stage,
      }).then((res) => {
        this.tableData = res.data;
        // this.page.page = res.page;
        // this.page.size = res.size;
        this.page.total = res.total;
      });
    },
    refresh() {
      this.reload();
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