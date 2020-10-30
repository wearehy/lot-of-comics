<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-radio-group v-model="check" @change="articleListFun()">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">视频</el-radio>
        <el-radio :label="2">图文</el-radio>
      </el-radio-group>
    </div>
    <div class="head-container">
      <el-select
        class="mR5 marginTB5"
        v-model="page.state"
        placeholder="请选择设审核状态"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/article/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column prop="TopicName" label="所属分类">
        <template slot-scope="scope">
          {{ scope.row.TopicName.join(" | ") }}
        </template>
      </el-table-column>
      <el-table-column prop="surname" label="用户昵称" />
      <el-table-column prop="idnumber" label="ID" />
      <el-table-column prop="content" show-overflow-tooltip label="标题" width="200" />
      <el-table-column prop="look" label="查看详情">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.video"
            type="primary"
            icon="el-icon-picture"
            @click="
              showContent = scope.row;
              dialogTableVisible = true;
            "
            >图文</el-button
          >
          <el-button
            v-if="scope.row.video"
            type="primary"
            icon="el-icon-video-camera-solid"
            @click="
              showContent = scope.row;
              dialogTableVisible = true;
            "
            >视频</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="count" label="评论数" />
      <el-table-column prop="like_num" label="点赞数" />
      <el-table-column prop="create_time" label="发布时间" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- 待审核 -->
          <template v-if="page.state == 0">
            <el-tooltip
              class="item"
              effect="dark"
              content="通过"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/check/tg')"
                size="mini"
                type="success"
                icon="el-icon-s-unfold"
                @click="btn(scope.row, 1)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="拒绝"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/check/jj')"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="btn(scope.row, 2)"
              ></el-button>
            </el-tooltip>
          </template>
          <!-- 审核成功-->
          <template v-if="page.state == 1">
            <el-tooltip
              v-if="scope.row.is_better == 0"
              class="item"
              effect="dark"
              content="推荐"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/check/tj')"
                size="mini"
                type="success"
                icon="el-icon-s-promotion"
                @click="btn(scope.row, 3)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.is_better == 1"
              class="item"
              effect="dark"
              content="取消推荐"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/check/qxtj')"
                size="mini"
                type="warning"
                icon="el-icon-s-promotion"
                @click="btn(scope.row, 4)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="放入回收站"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/display')"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="btn(scope.row, 5)"
              ></el-button>
            </el-tooltip>
          </template>
          <!-- 审核未通过 -->
          <template v-if="page.state == 2">
            <el-tooltip
              class="item"
              effect="dark"
              content="复审"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/fs')"
                size="mini"
                type="success"
                icon="el-icon-s-order"
                @click="btn(scope.row, 6)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="放入回收站"
              placement="top-start"
            >
              <el-button
                :disabled="$permissionButton('/article/display')"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="btn(scope.row, 5)"
              ></el-button>
            </el-tooltip>
          </template>
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

    <!-- 弹窗 -->
    <el-dialog title="查看详情" :visible.sync="dialogTableVisible">
      <div v-if="dialogTableVisible">
        <hyshow :data.sync="showContent"></hyshow>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  articleList,
  videoList,
  txtList,
  articleCheck,
  articleDel,
} from "@/api/dynamic/article.js";
import hyshow from "@/components/imgTxtVideoShow/index.vue";

export default {
  name: "device",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      dialog: false,
      btnStatus: true,
      roles: [],
      tableData: [],
      options: [
        {
          value: 0,
          label: "待审核",
        },
        {
          value: 1,
          label: "审核成功",
        },
        {
          value: 2,
          label: "审核未通过",
        },
      ],
      updateData: {
        dcid: "", //设备渠道id,必填
        didArr: [
          //需要更新渠道的设备id数组,必填 @String
        ],
      },
      check: 0, //0全部，1视频，2图文
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
        state: 0,
      },

      dialogTableVisible: false, //查看详情弹窗
      showContent: "aa",
    };
  },
  created() {
    this.articleListFun();
  },
  components: {
    hyshow: hyshow,
  },
  watch: {
    "page.state"(val) {
      this.articleListFun();
    },
  },
  methods: {
    allListFun() {
      articleList({
        page: this.page.page,
        size: this.page.size,
        state: this.page.state,
      }).then((res) => {
        this.tableData = res.list ? res.list : [];

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    videoListFun() {
      videoList({
        page: this.page.page,
        size: this.page.size,
        state: this.page.state,
      }).then((res) => {
        this.tableData = res.list ? res.list : [];

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    txtListFun() {
      txtList({
        page: this.page.page,
        size: this.page.size,
        state: this.page.state,
      }).then((res) => {
        this.tableData = res.list ? res.list : [];

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },

    articleListFun() {
      //切换后的集合
      if (this.check == 0) {
        this.allListFun();
      } else if (this.check == 1) {
        this.videoListFun();
      } else if (this.check == 2) {
        this.txtListFun();
      }
    },

    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.articleListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.articleListFun();
    },
    btn(opt, num) {
      //操作：1、通过；2、拒绝；3、推荐；4、取消推荐；5、放入回收站；6、复审
      let title = "";
      if (num == 1) {
        title = "通过审核";
      } else if (num == 2) {
        title = "拒绝审核";
      } else if (num == 3) {
        title = "推荐";
      } else if (num == 4) {
        title = "取消推荐";
      } else if (num == 5) {
        title = "放入回收站";
      } else if (num == 6) {
        title = "复审";
      }

      this.$confirm(`确定${title}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (num == 1) {
            this.btn1(opt);
          } else if (num == 2) {
            this.btn2(opt);
          } else if (num == 3) {
            this.btn3(opt);
          } else if (num == 4) {
            this.btn4(opt);
          } else if (num == 5) {
            this.btn5(opt);
          } else if (num == 6) {
            this.btn6(opt);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    btn1(opt) {
      //1、通过；
      let data = {
        guid: opt.guid,
        state: 1,
        isBetter: opt.is_better,
      };

      articleCheck(data).then(() => {
        this.articleListFun();
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 1500,
        });
      });
    },
    btn2(opt) {
      //2、拒绝；
      let data = {
        guid: opt.guid,
        state: 2,
        isBetter: opt.is_better,
      };

      articleCheck(data).then(() => {
        this.articleListFun();
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 1500,
        });
      });
    },
    btn3(opt) {
      //3、推荐；
      let data = {
        guid: opt.guid,
        isBetter: 1,
        state: opt.state,
      };

      articleCheck(data).then(() => {
        this.articleListFun();
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 1500,
        });
      });
    },
    btn4(opt) {
      //4、取消推荐；
      let data = {
        guid: opt.guid,
        isBetter: 0,
        state: opt.state,
      };

      articleCheck(data).then(() => {
        this.articleListFun();
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 1500,
        });
      });
    },
    btn5(opt) {
      //5、放入回收站；
      let data = {
        guid: opt.guid,
      };

      articleDel(data).then(() => {
        this.articleListFun();
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 1500,
        });
      });
    },
    btn6(opt) {
      //6、复审
      this.btn1(opt);
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
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>