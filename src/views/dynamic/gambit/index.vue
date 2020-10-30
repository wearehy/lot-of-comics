<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/mail/category/add')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd(null)"
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
        ref="formList"
        :model="formList"
        :rules="rules"
        size="small"
        class="demo-ruleForm"
        label-width="80px"
      >
        <el-form-item label="父级" prop="parentGuid" :required="btnStatus">
          <el-select
            v-model="formList.parentGuid"
            placeholder="请选择父级"
            :disabled = "parentGuidDis"
          >
            <el-option
              v-for="item in selects"
              :key="item.guid"
              :label="item.title"
              :value="item.guid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="title" :required="btnStatus">
          <el-input v-model="formList.title" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图片" prop="image" :required="btnStatus">
          <el-image
            v-show="formList.image"
            class="img80"
            :src="formList.image"
            fit="cover"
          ></el-image>

          <p>
            <cropper :share="shareF" @feedback="feedbackF"></cropper>
          </p>
          <p class="red">{{ imgNull }}</p>
        </el-form-item>
        <el-form-item label="分类描述" prop="content" :required="btnStatus">
          <el-input v-model="formList.content" placeholder="请输入分类描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" :required="btnStatus">
          <el-input v-model="formList.sort" placeholder="请输入排序" />
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
      v-permission="['/gambit/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'subTopics', hasChildren: 'hasChildren' }"
      row-key="guid"
    >
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="image" label="分类图片" width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.image" fit="cover" class="img40"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        show-overflow-tooltip
        label="分类名称"
        width="200"
      />
      <el-table-column prop="content" show-overflow-tooltip label="分类描述" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="添加" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/gambit/add')"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handelAdd(scope.row.guid)"
            />
          </el-tooltip>
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/gambit/edit')"
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/gambit/del')"
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
  gambitList,
  gambitAdd,
  gambitEdit,
  gambitDel,
} from "@/api/dynamic/gambit.js";
import cropper from "@/components/vueCropper";

const formListOld = {
  parentGuid: '0',
  title: null,
  image: null,
  content: null,
  sort: '0',
};

export default {
  name: "gambit",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      roles: [],
      tableData: [],
      selects: [],
      titles: [],
      parentGuidDis: false,
      formList: formListOld,
      rules: {
        parentGuid: [{ message: "请输入父级", trigger: "change" }],
        title: [{ message: "请输入分类名称", trigger: "blur" }],
        image: [{ message: "请上传图片" }],
        content: [{ message: "请输入分类描述", trigger: "blur" }],
        sort: [{ message: "请输入排序", trigger: "blur" }],
        
      },
      imgNull: "",
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },
      shareF: {
        enlarge: "1", //倍数
        name: "上传图片",
      },
    };
  },
  created() {
    this.gambitList();
  },
  components: { cropper },
  methods: {
    gambitList() {
      gambitList().then((res) => {
        let that = this;
        this.tableData = res;
        this.page.total = res.total;

        let select = [{ guid: "0", title: "默认顶级", subTopics: res }];
        let selectAll = [{ guid: "0", title: "默认顶级" }];
        function fun(select, level) {
          if (select.subTopics && select.subTopics.length > 0) {
            for (let i = 0; i < select.subTopics.length; i++) {
              select.subTopics[i].level = level + 1;
              var bef = "";
              for (let j = 0; j < level + 1; j++) {
                bef += "—|";
              }
              select.subTopics[i].title = bef + " " + select.subTopics[i].title;

              selectAll.push(select.subTopics[i]);
              fun(select.subTopics[i], select.subTopics[i].level);
            }
          }
        }
        fun(select[0], -1);
        this.selects = selectAll;
        // console.log(selectAll);

        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.gambitList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.gambitList();
    },
    //添加表单dialog
    handelAdd(opt) {
      this.btnStatus = true;
      this.dialog = true;
      this.dialogTitle = "添加话题";
      this.parentGuidDis = false;
      this.formList = formListOld;
      if(opt){
        this.formList.parentGuid = opt;
        this.parentGuidDis = true;
      }
      
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑话题";
      this.parentGuidDis = true;
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      
      this.$refs["formList"].validate((valid) => {
        if (valid) {
          gambitAdd(this.formList).then((res) => {
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 1500,
            });
            this.$refs["formList"].resetFields();
            this.gambitList();
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
      this.$refs["formList"].validate((valid) => {
        if (valid) {
          gambitEdit(this.formList).then((res) => {
            this.$notify({
              title: "编辑成功",
              type: "success",
              duration: 1500,
            });
            this.$refs["formList"].resetFields();
            this.gambitList();
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
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        
        gambitDel({guid:row.guid}).then((res) => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500,
          });
          this.gambitList();
        });
      });
    },
    // 更改状态
    changeStatus(id, status) {},
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.formList.image = res.file_url + res.filename;
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
.el-table .cell {
  white-space: pre-line;
}
</style>