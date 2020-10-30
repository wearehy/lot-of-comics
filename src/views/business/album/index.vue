<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <div>
        <el-input
          v-model="searchTitle"
          size="small"
          clearable
          placeholder="合辑名称"
          style="width: 200px;"
          class="filter-item"
          :disabled="$permissionButton('/album/search')"
        />
        <!-- <el-date-picker
            :default-time="['00:00:00','23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="height:30.5px"
        />-->
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="handleSearch"
            :disabled="$permissionButton('/album/search')"
          >搜索</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="refresh"
            :disabled="$permissionButton('/album/search')"
          >重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/album/add')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
          >新增</el-button>
        </el-button-group>
        <el-button-group class="crud-opts-right">
          <el-button size="mini" icon="el-icon-refresh" @click="refresh()" />
        </el-button-group>
      </div>
    </div>
    <!--绑定-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="bindBool"
      :title="'请选择“'+bindName+'”胎教周数'"
      width="556px"
    >
     <el-popover
            placement="bottom-start"
            trigger="click"
            width="516"
          >
            <weekModel @weekNum="weekNumF"></weekModel>
            <el-input
              slot="reference"
              v-model="bindForm.week"
              placeholder="点击选择胎教周数"
              width="516"
              readonly
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindSubmit">保存</el-button>
      </div>
    </el-dialog>
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
        label-width="80px"
      >
        <el-form-item label="合辑标题" prop="title" required>
          <el-input v-model="form.title" style="width:390px" />
        </el-form-item>
        <el-form-item label="上级类目" prop="cate_id" required>
          <treeselect
            v-model="form.cate_id"
            :options="cates"
            style="width: 390px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
        <el-form-item label="合辑图片" prop="thumb" required>
          <img
            :src="form.thumb ? form.thumb : defaultPic"
            title="点击上传图片"
            class="avatar"
            style="width:140px;height:140px"
          />
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

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="handelCancelRecom"
      :visible.sync="recomformDialog"
      title="推荐设置"
      width="570px"
    >
      <el-form ref="Recomform" :model="Recomform" size="small" label-width="80px">
        <el-form-item label="推荐分类" prop="cate">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="Recomform.checkedCates" @change="handleCheckedCatesChange">
            <el-checkbox
              v-for="rcate in recomCates"
              :key="rcate.id"
              :label="rcate.id"
            >{{ rcate.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="recomSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/album']"
      v-loading="loading"
      :data="tableData"
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column type="selection" width="40px" />
      <el-table-column prop="id" label="ID" width="80px" sortable />
      <el-table-column prop="parent" label="所属上级" sortable />
      <el-table-column prop="title" label="合辑" sortable />
      <el-table-column prop="thumb" label="图标" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.thumb ? scope.row.thumb : defaultPic" :width="40" class="avatar" />
        </template>
      </el-table-column>
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
      <el-table-column prop="playNum" label="播放量" sortable />
      <el-table-column prop="display" label="状态" sortable>
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
      <el-table-column label="操作" width="230px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="绑定" placement="top">
            <el-button
              :disabled="$permissionButton('/album/prenatal/set')"
              size="mini"
              type="info"
              icon="el-icon-user-solid"
              @click="bindBool=true;bindForm.albumId=scope.row.id;bindName=scope.row.title"
            />
          </el-tooltip>
          <el-tooltip content="推荐" placement="top">
            <el-button
              :disabled="$permissionButton('/album/setRecom')"
              size="mini"
              type="success"
              icon="el-icon-s-promotion"
              @click="handelRecom(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button
              :disabled="$permissionButton('/album/edit')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              :disabled="$permissionButton('/album/del')"
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
import { getToken } from "@/utils/auth";
import {
  album,
  search,
  add,
  edit,
  del,
  changeStatus,
  getAllRecomCate,
  setRecom,
  checkRecom,
  sort,
  prenatalSet
} from "@/api/business/album";
import { getCateTree } from "@/api/business/category";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import defaultPic from "@/assets/images/default.jpg";
import { mapGetters } from "vuex";
import weekModel from '@/components/weekModel';

import cropper from "@/components/vueCropper";

const defaultForm = {
  id: "",
  title: "",
  cate_id: 0,
  thumb: "",
  display: true,
  listorder: 999
};
export default {
  name: "Album",
  inject: ["reload"],
  components: {
    weekModel,
    Treeselect,
    cropper
  },
  data() {
    return {
      myHeaders: {
        Authorization: getToken()
      },
      searchTitle: "",
      checkAll: false,
      isIndeterminate: true,
      defaultPic: defaultPic,
      file_url: "",
      loading: true,
      dialog: false,
      recomformDialog: false,
      dialogTitle: "",
      btnStatus: true,
      cates: [],
      recomCates: [],
      tableData: [],
      form: defaultForm,
      Recomform: {
        id: "",
        checkedCates: []
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },
      rules: {
        title: [{ required: true, message: "请输入合辑标题", trigger: "blur" }],
        cate_id: [
          { required: true, message: "请选择所属分类", trigger: "blur" }
        ],
        thumb: [{ required: true, message: "请上传封面图", trigger: "blur" }]
      },
      bindBool: false,
      bindForm: {
        week: null,
        albumId: null
      },
      bindName: null,

      shareF: {
        // 裁剪
      
      },
    };
  },
  created() {
    this.albumList(this.page.page, this.page.size);
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  methods: {
    albumList(page, size) {
      album({ page: page, size: size }).then(res => {
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
      this.albumList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.albumList(val, this.page.size);
    },
    //监听上传成功
    handleSuccess(response, file, fileList) {
      this.file_url = response.data.file_url;
      this.form.thumb = response.data.file_url + response.data.filename;
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message);
      this.$notify({
        title: msg.message,
        type: "error",
        duration: 2500
      });
    },
    //推荐
    handelRecom(id) {
      this.recomformDialog = true;
      this.$nextTick(() => {
        this.Recomform.id = id;
        getAllRecomCate().then(res => {
          this.recomCates = res;
          console.log(res);
        });
        checkRecom({ id: id }).then(res => {
          this.Recomform.checkedCates = res;
        });
      });
    },
    handelCancelRecom(done) {
      this.$refs["Recomform"].resetFields();
      this.recomformDialog = false;
      done();
    },
    //全选
    handleCheckAllChange(val) {
      const all = [];
      this.recomCates.forEach(function(item, index) {
        all.push(item.id);
      });
      this.Recomform.checkedCates = val ? all : [];
      this.isIndeterminate = false;
    },
    handleCheckedCatesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.recomCates.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.recomCates.length;
    },
    //添加表单dialog
    handelAdd() {
      this.dialog = true;
      this.dialogTitle = "添加合辑";
      getCateTree().then(res => {
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
      this.dialogTitle = "编辑合辑";
      this.$nextTick(() => {
        const { id, cate_id, title, listorder, display, thumb } = row;
        this.form = { id, cate_id, title, listorder, display, thumb };
        getCateTree().then(res => {
          this.cates = [];
          const cate = { id: 0, label: "顶级类目", children: [] };
          cate.children = res;
          this.cates.push(cate);
        });
      });
    },
    //取消并清除字段
    handelCancel(done) {
      this.$refs.form.resetFields();
      this.dialog = false;
      done();
    },
    //绑定操作
    bindSubmit() {
      prenatalSet({
        week: this.bindForm.week,
        albumId: this.bindForm.albumId
      }).then(res => {
        this.bindBool = false
      });
    },
    //添加操作
    addSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          add(this.form).then(res => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.albumList(this.page.page, this.page.size);
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
          edit(this.form).then(res => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500
            });
            this.$refs["form"].resetFields();
            this.albumList(this.page.page, this.page.size);
            this.dialog = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //推荐
    recomSubmit() {
      setRecom(this.Recomform).then(res => {
        this.$notify({
          title: "设置成功",
          type: "success",
          duration: 1500
        });
        this.albumList(this.page.page, this.page.size);
        this.recomformDialog = false;
      });
    },
    //删除操作
    handelDel(row) {
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        del(row.id).then(res => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500
          });
          this.albumList(this.page.page, this.page.size);
        });
      });
    },
    // 更改状态
    changeStatus(id, display) {
      changeStatus({ id: id, display: display }).then(res => {
        this.$notify({
          title: "状态更改成功",
          type: "success",
          duration: 1500
        });
        this.albumList(this.page.page, this.page.size);
      });
    },
    //搜索
    handleSearch() {
      search({ title: this.searchTitle }).then(res => {
        this.tableData = res.data;
        // this.page.page = res.page;
        // this.page.size = res.size;
        this.page.total = res.total;
      });
    },
    refresh() {
      this.reload();
    },
    //排序
    handleSort(id, listorder) {
      sort({ id: id, listorder: listorder }).then(res => {
        this.albumList(this.page.page, this.page.size);
      });
    },
    weekNumF(val){
      this.bindForm.week = val
    },
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.form.thumb = res.file_url + res.filename;
      });
    },
  }
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