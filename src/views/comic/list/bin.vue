<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-input
            size="mini"
            v-model="searches.text"
            placeholder="关键字：书籍|作者|书籍ID"
            @keyup.enter.native="getAll"
          />
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select
            size="mini"
            v-model="searches.type"
            placeholder="请选择"
            @change="getAll"
          >
            <el-option
              v-for="item in searches.types"
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

      <el-table-column prop="id" label="编号" />
      <el-table-column prop="bookName" label="漫画名称" />
      <el-table-column prop="cateId" label="类型">
        <template slot-scope="scope">
          <div v-for="(itemId, num) in scope.row.cateId" :key="num">
            <p v-for="(item, num2) in cateIds" :key="num2">
              <span v-if="item.id == itemId">{{ item.name }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bookThumb2" label="封面图">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.bookThumb2"
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
      <el-table-column prop="penName" label="作者" />
      <el-table-column prop="bookAddtime" label="发布时间" width="140px">
        <template slot-scope="scope">
          {{
            $moment(scope.row.bookAddtime * 1000).format("YYYY/MM/DD hh:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="delTime" label="删除时间" />
      <el-table-column prop="chapterTitle" label="最新章节">
        <template slot-scope="scope">
          {{ scope.row.chapterTitle ? scope.row.chapterTitle : "N/A" }}
        </template>
      </el-table-column>
      <el-table-column prop="bookVip" label="收费" width="65px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bookVip == 1" type="success">VIP</el-tag>
          <el-tag v-if="scope.row.bookVip == 2" type="success">免费</el-tag>
          <el-tag v-if="scope.row.bookVip == 3" type="danger">付费</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bookIsend" label="状态" width="65px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bookIsend == 1" type="success">完结</el-tag>
          <el-tag v-if="scope.row.bookIsend == 2" type="warning">连载</el-tag>
          <el-tag v-if="scope.row.bookIsend == 3" type="danger">暂停</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.bookName + '-还原'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomlist:delete:DELETE')
              "
              size="mini"
              type="warning"
              icon="el-icon-refresh-left"
              @click="handelReturn(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="scope.row.bookName + '-删除'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomlist:delete:DELETE')
              "
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handelDel(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :page-size="page.size"
      :page-sizes="[4, 10, 50, 100]"
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
import { rList, rDel, rDels, rReturn, classify } from "@/api/comic/list.js";
import Avatar from "@/assets/images/avatar.png";

export default {
  name: "bin",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      tableData: [],
      searches: {
        text: null,
        type: 0,
        types: [
          { value: 0, label: "全部" },
          { value: 1, label: "VIP" },
          { value: 2, label: "免费" },
          { value: 3, label: "付费" },
        ],
      },
      page: {
        //分页相关
        page: 1,
        size: 4,
        total: 0,
      },
    };
  },
  created() {
    this.load();
    this.getAll();
  },
  props: [],
  methods: {
    load() {
      classify().then((res) => {
        this.cateIds = res;
      });
    },
    getAll() {
      let data = {
        page: this.page.page,
        size: this.page.size,
      };
      delete data.text;
      delete data.bookVip;

      data.text = this.searches.text && this.searches.text;
      this.searches.type &&
        this.searches.type != 0 &&
        (data.bookVip = this.searches.type);

      rList(data).then((res) => {
        this.tableData = res.list;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    clearGetAll() {
      (this.searches = {
        text: null,
        type: 0,
        types: [
          { value: 0, label: "全部" },
          { value: 1, label: "VIP" },
          { value: 2, label: "免费" },
          { value: 3, label: "付费" },
        ],
      }),
        rList({ page: 1, size: 10 }).then((res) => {
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

    //还原操作
    handelReturn(row) {
      this.$confirm(`确定还原这条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          var formData = new FormData();
        formData.append('id',row.id);
        rReturn(formData).then((res) => {
          this.getAll();
        });
      });
    },
    //删除操作
    handelDel(row) {
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`, "高危操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        rDel({ id: row.id }).then((res) => {
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

        rDels({ ids: arr }).then((res) => {
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

