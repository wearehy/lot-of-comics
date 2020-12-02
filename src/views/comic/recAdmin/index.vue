<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-input
            size="mini"
            v-model="searches.word"
            placeholder="关键字：书籍"
            @keyup.enter.native="getAll"
          />
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select size="mini" v-model="searches.type" placeholder="请选择" @change="getAll">
            <el-option
              v-for="item in searches.types"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select size="mini" v-model="searches.source" placeholder="请选择" @change="getAll">
            <el-option
              v-for="item in searches.sources"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-button-group>

        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:delete:more:POST')
            "
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="getAll()"
            >搜索</el-button
          >
        </el-button-group>
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:delete:more:POST')
            "
            size="mini"
            type="primary"
            icon="el-icon-s-grid"
            @click="clearGetAll()"
            >显示全部</el-button
          >
        </el-button-group>
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomlist:delete:more:POST')
            "
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handelDels"
            >批量删除</el-button
          >
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['btn:comic-admin:recomlist:list:GET']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="bookId" label="漫画编号" />
      <el-table-column prop="bookName" label="漫画名称" />
      <el-table-column prop="bookThumb" label="漫画封面">
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
      <el-table-column prop="title" label="推荐板块">
        <template slot-scope="scope">
          <span v-for="(item, num) in searches.types" :key="num">
            <span  v-if="item.title == scope.row.title">
              <span class="imgWH24 mR5 relative" style="top:6px;">
                <el-image class="imgWH20" style="overflow: hidden" :src="scope.row.icon" fit="cover">
                  <div slot="error">
                    <el-image
                      class="imgWH20"
                      :lazy="true"
                      :src="require(`@/assets/images/avatar.png`)"
                      fit="cover"
                    ></el-image>
                  </div>
                </el-image>
              </span>
              <el-tag type="success">{{ item.title }}</el-tag>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="typeStatus" label="推荐源">
        <template slot-scope="scope">
          <span v-for="(item, num) in searches.sources" :key="num">
            <span v-if="item.value == scope.row.typeStatus">
              {{ item.label }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="140px">
        <template slot-scope="scope">
          {{
            $moment(scope.row.updatetime * 1000).format("YYYY/MM/DD hh:mm:ss")
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomlist:delete:DELETE')
            "
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
import { list, recList, del, dels } from "@/api/comic/recAdmin.js";
import Avatar from "@/assets/images/avatar.png";
import cropper from "@/components/vueCropper";

export default {
  name: "classify",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      tableData: [],
      searches: {
        word: null,
        type: 0,
        types: [],
        source: 0,
        sources: [
          { value: 0, label: "来源" },
          { value: 1, label: "APP" },
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
    this.checkList();
    this.getAll();
  },
  components: { cropper },
  methods: {
    checkList() {
      recList().then((res) => {
        res.unshift({ id: 0, title: "类型" });
        this.searches.types = res;
      });
    },
    getAll() {
      let data = {
        page: this.page.page,
        size: this.page.size,
      };
      delete data.bookName;
      delete data.IconId;
      delete data.typeStatus;

      data.bookName =this.searches.word&& this.searches.word;
      (this.searches.type && this.searches.type != 0)&&(data.IconId =this.searches.type);
      (this.searches.source && this.searches.source != 0) && (data.typeStatus = this.searches.source);

      list(data).then((res) => {
        this.tableData = res.list;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    clearGetAll() {
      this.searches = {
        word: null,
        type: 0,
        types: [],
        source: 0,
        sources: [
          { value: 0, label: "来源" },
          { value: 1, label: "APP" },
        ],
      },
      list({ page: 1, size: 10 }).then((res) => {
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
        this.$refs.table.selection.forEach((item, index) => {
          arr.push(item.id);
        });

        dels({ ids: arr }).then((res) => {
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
        if (opt.differ == 1) {
          that.formList.icon = res.url;
        } else if (opt.differ == 2) {
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

