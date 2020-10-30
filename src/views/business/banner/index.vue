<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/banner/add')"
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
      width="570px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="Banner类型" prop="type">
          <!-- 0专辑  1广告  2商品 -->
          <el-radio-group
            v-model="form.type"
            size="mini"
            style="width: 178px"
            :disabled="!btnStatus"
          >
            <el-radio-button label="0">合辑</el-radio-button>
            <el-radio-button label="1">广告</el-radio-button>
            <el-radio-button v-if="!btnStatus" label="2">商品</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="form.type.toString() === '1'" label="广告图片" prop="image" required>
          <img
            :src="form.image ? form.image : defaultPic"
            title="点击上传图片"
            class="avatar"
            style="width:140px;height:140px"
          />
          <cropper :share="shareF" @feedback="feedbackF"></cropper>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '2'" label="商品图片" prop="image" required>
          <img
            :src="form.image ?form.image : defaultPic"
            title="点击上传图片"
            class="avatar"
            style="width:140px;height:140px"
          />
          <cropper :share="shareF" @feedback="feedbackF"></cropper>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '1'" label="广告地址" prop="url" required>
          <el-input v-model="form.url" placeholder="广告地址" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '0'" label="合辑ID" prop="album_id" required>
          <el-input v-model="form.album_id" placeholder="合辑ID" style="width: 178px;" />
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
      :disabled="$permissionButton('/banner')"
      v-loading="loading"
      :data="tableData"
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column type="selection" width="40px" />
      <el-table-column prop="id" label="ID" width="80px" sortable />
      <el-table-column prop="type" label="类型" align="center" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" type="info">合辑</el-tag>
          <el-tag v-if="scope.row.type === 1" type="success">广告</el-tag>
          <el-tag v-if="scope.row.type === 2" type="primary">轮播</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="图片" align="center" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.image ? scope.row.image : defaultPic" :width="180" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="url" label="广告地址" align="center" sortable />
      <el-table-column prop="album_id" label="合辑id" align="center" sortable />
      <el-table-column prop="listorder" label="排序" align="center" sortable>
        <template scope="scope">
          <el-input-number
            v-model="scope.row.listorder"
            :min="0"
            :max="999"
            controls-position="right"
            placeholder="默认按升序"
            @change="handleSort(scope.row.id,scope.row.listorder)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="display" label="状态" align="center" sortable>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.display"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            @change="changeStatus(scope.row.id, scope.row.display)"
          />
        </template>
      </el-table-column>
      <el-table-column width="135px" prop="createTime" label="创建日期" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              :disabled="$permissionButton('/banner/edit')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              :disabled="$permissionButton('/banner/del')"
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
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  banner,
  add,
  edit,
  del,
  changeStatus,
  sort,
} from "@/api/business/banner";
import defaultPic from "@/assets/images/default.jpg";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

import cropper from "@/components/vueCropper";
const defaultForm = {
  id: "",
  type: 0,
  image: "",
  url: "",
  album_id: "",
  display: true,
  listorder: 999,
};
export default {
  name: "Banner",
  components: { cropper },
  data() {
    return {
      myHeaders: {
        Authorization: getToken(),
      },
      defaultPic: defaultPic,
      file_url: "",
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      tableData: [],
      form: defaultForm,
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
      rules: {
        album_id: [
          { required: true, message: "请填写合辑ID", trigger: "blur" },
        ],
        image: [{ required: true, message: "广告图片请上传", trigger: "blur" }],
        url: [{ required: true, message: "广告地址请填写", trigger: "blur" }],
      },
      shareF: {
        // 裁剪
        // autoCrop: false,
        enlarge: '4.8',
        fixed: true,
        fixedNumber: [1920,767]
      },
    };
  },
  created() {
    this.bannerList(this.page.page, this.page.size);
  },
  computed: {
    ...mapGetters(["imagesUploadApi"]),
  },
  methods: {
    bannerList(page, size) {
      banner({ page: page, size: size }).then((res) => {
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
      this.bannerList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.bannerList(val, this.page.size);
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
      this.dialogTitle = "添加banner";
      this.btnStatus = true;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true;
      this.btnStatus = false;
      this.dialogTitle = "编辑banner";

      this.$nextTick(() => {
        const { id, type, image, url, album_id, listorder, display } = row;
        this.form = { id, type, image, url, album_id, listorder, display };
      });
    },
    //取消并清除字段
    handelCancel(done) {
      this.$refs.form.resetFields();
      this.dialog = false;
      done();
    },
    //添加操作
    addSubmit() {
      this.form.type = parseInt(this.form.type);
      add(this.form).then((res) => {
        this.$notify({
          title: "添加成功",
          type: "success",
          duration: 1500,
        });
        this.$refs["form"].resetFields();
        this.bannerList(this.page.page, this.page.size);
        this.dialog = false;
      });
    },
    //编辑操作
    editSubmit() {
      edit(this.form).then((res) => {
        this.$notify({
          title: "编辑成功",
          type: "success",
          duration: 1500,
        });
        this.$refs["form"].resetFields();
        this.bannerList(this.page.page, this.page.size);
        this.dialog = false;
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
          this.bannerList(this.page.page, this.page.size);
        });
      });
    },
    // 更改状态
    changeStatus(id, display) {
      changeStatus({ id: id, display: display }).then((res) => {
        this.$notify({
          title: "状态更改成功",
          type: "success",
          duration: 1500,
        });
        this.bannerList(this.page.page, this.page.size);
      });
    },
    //排序
    handleSort(id, listorder) {
      sort({ id: id, listorder: listorder }).then((res) => {
        this.bannerList(this.page.page, this.page.size);
      });
    },
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
  text-align: center;
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