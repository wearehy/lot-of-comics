<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/cate/add')"
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
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="handelCancel"
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
        label-width="78px"
      >
        <el-form-item label="分类名称" prop="title" required>
          <el-input v-model="form.title" style="width:390px" />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid" required>
          <treeselect
            v-model="form.pid"
            :options="cates"
            style="width: 390px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
        <el-form-item label="分类图片" prop="image">
          <!-- <el-upload
            :headers="myHeaders"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="imagesUploadApi"
            class="upload-demo"
          > -->
            <img
              :src="form.image ? form.image : defaultPic"
              title="点击上传图片"
              class="avatar"
              style="width:140px;height:140px"
            />
          <!-- </el-upload> -->
          <cropper :share="shareF" @feedback="feedbackF"></cropper>
        </el-form-item>
        <el-form-item label="状态" prop="display">
          <el-radio-group v-model="form.display" style="width: 242px;">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="listorder">
          <el-input-number
            v-model.number="form.listorder"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px;"
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
      v-permission="['/cate']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="分类名称" width="125px" prop="title" />
      <el-table-column prop="image" label="分类图标">
        <template slot-scope="scope">
          <img :src="scope.row.image ? scope.row.image : defaultPic" :width="40" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="listorder" align="center" label="排序">
        <template slot-scope="scope">{{ scope.row.listorder }}</template>
      </el-table-column>
      <el-table-column prop="display" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.display"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            @change="changeStatus(scope.row.id, scope.row.display)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="$permissionButton('/cate/edit')"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          />
          <el-button
            :disabled="$permissionButton('/cate/del')"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDel(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { cate, getCateTree, add, edit, del } from "@/api/business/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import defaultPic from "@/assets/images/default.jpg";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

import cropper from "@/components/vueCropper";

const defaultForm = {
  id: "",
  pid: 0,
  title: "",
  image: "",
  display: true,
  listorder: 999,
};
export default {
  name: "Category",
  inject: ["reload"],
  components: { Treeselect , cropper },
  data() {
    return {
      myHeaders: {
        Authorization: getToken(),
      },
      file_url: "",
      defaultPic: defaultPic,
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      cates: [],
      tableData: [],
      form: defaultForm,
      rules: {
        title: [
          { required: true, message: "请输入标题/名称", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择所属上级", trigger: "blur" }],
      },

      shareF: {
        // 裁剪
       
      },
     
    };
  },
  computed: {
    ...mapGetters(["imagesUploadApi"]),
  },
  mounted() {
    this.cateTableTree();
  },
  methods: {
    cateTableTree() {
      cate().then((res) => {
        this.tableData = res;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    //监听上传成功
    handleSuccess(response, file, fileList) {
      this.file_url = response.data.file_url;
      this.form.image = response.data.file_url + response.data.filename;
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message);
      this.$notify({
        title: msg.message,
        type: "error",
        duration: 2500,
      });
    },
    //添加表单dialog
    handelAdd() {
      this.dialog = true;
      this.dialogTitle = "添加分类";
      getCateTree().then((res) => {
        this.cates = [];
        const cate = { id: 0, label: "顶级类目", children: [] };
        cate.children = res;
        this.cates.push(cate);
      });
    },
    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true;
      this.btnStatus = false;
      this.dialogTitle = "编辑分类";

      this.$nextTick(() => {
        const { id, pid, title, image, listorder, display } = row;
        this.form = { id, pid, title, image, listorder, display };

        getCateTree().then((res) => {
          this.cates = [];
          const cate = { id: 0, label: "顶级类目", children: [] };
          cate.children = res;
          this.cates.push(cate);
        });
      });
    },
    //取消并清除字段
    handelCancel(done) {
      this.$refs["form"].resetFields();
      this.dialog = false;
      done();
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
            this.cateTableTree();
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
            this.cateTableTree();
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
          this.cateTableTree();
        });
      });
    },
    // 选中图标
    selected(name) {
      this.form.icon = name;
    },
    // 分类图 裁剪
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.form.image = res.file_url + res.filename;
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