<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('btn:comic-admin:recomicon:add:POST')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
            >新增</el-button
          >
        </el-button-group>
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('btn:comic-admin:recomicon:delete:more:POST')"
            class="filter-item"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDels"
            >批量删除</el-button
          >
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      v-if="dialog"
      :visible.sync="dialog"
      :title="dialogTitle"
      width="650px"
    >
      <el-form
        ref="form"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="120px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formList.title" placeholder="请输入推荐名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-image class="img80" :src="formList.icon" fit="cover">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
          <p>
            <cropper differ="1" :share="shareF1" @feedback="feedbackF"></cropper>
          </p>
        </el-form-item>
        <el-form-item label="展示风格" prop="style">
          <el-select v-model="formList.style" placeholder="请选择展示风格">
            <el-option
              v-for="item in styles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="formList.role" placeholder="请输入角色" /> -->
        </el-form-item>
        <el-form-item label="广告图" prop="picUrl" v-if="formList.style == 4">
          <el-image class="imgW300" :src="formList.picUrl" fit="cover">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/banner.png`)"
              ></el-image>
            </div>
          </el-image>
          <p>
            <cropper differ="2" :share="shareF2" @feedback="feedbackF"></cropper>
          </p>
        </el-form-item>
        <el-form-item label="跳转类型" prop="jumpType" v-if="formList.style == 4">
          <el-select v-model="formList.jumpType" placeholder="请选择跳转类型">
            <el-option
              v-for="item in jumpTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="formList.role" placeholder="请输入角色" /> -->
        </el-form-item>
        <el-form-item label="网页跳转地址" prop="webUrl" v-if="formList.style == 4">
          <el-input
            v-model="formList.webUrl"
            placeholder="请输入网页跳转地址"
          />
        </el-form-item>
        <el-form-item label="漫画ID" prop="bookId" v-if="formList.style == 4">
          <el-input v-model="formList.bookId" placeholder="请输入漫画ID" />
        </el-form-item>
        <el-form-item label="章节ID" prop="chapterId" v-if="formList.style == 4">
          <el-input v-model="formList.chapterId" placeholder="请输入章节ID" />
        </el-form-item>
        
        <el-form-item label="排序" prop="listorder">
          <el-input-number
            v-model="formList.listorder"
            controls-position="right"
            placeholder="请输入排序"
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
      v-permission="['btn:comic-admin:recomicon:list:GET']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="listorder" label="排序" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <el-image :src="scope.row.icon" style="width: 50px; margin-top: 10px">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="style" label="展示风格">
        <template slot-scope="scope">
          <p v-for="(item, num) in styles" :key="num">
            <span v-if="item.value == scope.row.style">{{ item.label }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="picUrl" label="广告图">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.picUrl"
            style="width: 120px; margin-top: 10px"
          >
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/banner.png`)"
              ></el-image>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="jumpType" label="跳转类型">
        <template slot-scope="scope">
          <p v-for="(item, num) in jumpTypes" :key="num">
            <span v-if="item.value == scope.row.jumpType">{{
              item.label
            }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="webUrl" label="跳转地址" />
      <el-table-column prop="bookId" label="漫画ID" />
      <el-table-column prop="chapterId" label="章节ID" />
      <el-table-column prop="display" label="状态" width="140px">
        <template slot-scope="scope">
          <el-switch
          :disabled="$permissionButton('btn:comic-admin:recomicon:update:state:PUT')"
            v-model="scope.row.display"
            active-color="#13ce66"
            inactive-color="#F56C6C"
            active-text="显示"
            inactive-text="隐藏"
            @change="changeDisplay(scope.row.id, scope.row.display)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="140px"/>

      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="$permissionButton('btn:comic-admin:recomicon:update:PUT')"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handelEdit(scope.row)"
          ></el-button>
          <el-button
            :disabled="$permissionButton('btn:comic-admin:recomicon:delete:DELETE')"
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
import { list, add, edit, del, dels, changeDisplay } from "@/api/comic/recList.js";
import Avatar from "@/assets/images/avatar.png";
import cropper from "@/components/vueCropper";

const formListOld = {
  title: null,
  icon: null,
  style: 4,
  picUrl: null,
  jumpType: 0,
  webUrl: null,
  bookId: null,
  chapterId: null,
  listorder: 0,
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
      styles: [
        { value: 1, label: "一排显示1个" },
        { value: 2, label: "一排显示2个" },
        { value: 3, label: "一排显示3个" },
        { value: 4, label: "广告横图" },
      ],
      jumpTypes: [
        { value: 0, label: "无" },
        { value: 1, label: "网页" },
        { value: 2, label: "漫画列表" },
        { value: 3, label: "漫画详情" },
        { value: 4, label: "充值页" },
      ],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
        jumpType: [
          { required: true, message: "请输入跳转类型", trigger: "blur" },
        ],
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
      shareF1: {
        enlarge: "0.5", //倍数
        name: "上传头像",
        type: "1",
      },
      shareF2: {
        enlarge: "4.8",
        fixed: true,
        fixedNumber: [1920, 767],
        type: "1",
      },
      roles: [],
    };
  },
  created() {
    this.getAll();
  },
  components: { cropper },
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
    imgError() {},
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
      this.dialogTitle = "添加漫画推荐分类";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑漫画推荐分类";
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
      !this.formList.password && delete this.formList.password;
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
        del({ id: row.id }).then((res) => {
          this.getAll();
        });
      });
    },
    //批量删除操作
    handelDels(row) {
      
      this.$confirm(`确定删除这些数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        let arr = [];
        this.$refs.table.selection.forEach((item,index) => {
          arr.push(item.id)
        })
     
        dels({ ids: arr}).then((res) => {
          this.getAll();
        });
      });
    },
    // 更改状态
    changeDisplay(id, display) {
      changeDisplay({ id: id, display: display }).then((res) => {
        this.getAll(this.page.page, this.page.size);
      });
    },
    feedbackF(opt) {
      let that = this;
      this.$hyUpload(opt.formData).then((res) => {
        if(opt.differ == 1){
          that.formList.icon = res.url;
        }else if(opt.differ == 2){
          that.formList.picUrl = res.url;
        }
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