<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-input
            size="mini"
            v-model="search.text"
            placeholder="书籍名称|作者|书籍ID"
            @keyup.enter.native="getAll"
          />
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select
            size="mini"
            v-model="search.bookVip"
            placeholder="请选择是否收费"
            @change="getAll"
          >
            <el-option
              v-for="item in searches.bookVips"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select
            size="mini"
            v-model="search.bookIsend"
            placeholder="请选择连载状态"
            @change="getAll"
          >
            <el-option
              v-for="item in searches.bookIsends"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-select
            size="mini"
            v-model="search.appShow"
            placeholder="是否显示"
            @change="getAll"
          >
            <el-option
              v-for="item in searches.appShows"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-button-group>
        <el-button-group class="crud-opts-left wp150 mR5 bottom5">
          <el-date-picker
            v-model="checkTime"
            type="daterange"
            size="mini"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-button-group>
      </div>
      <div class="crud-opts">
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
            type="warning"
            icon="el-icon-s-grid"
            @click="clearGetAll()"
            >显示全部</el-button
          >
        </el-button-group>
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:delete:more:POST')
            "
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
            >新增</el-button
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
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomlist:delete:more:POST')
            "
            size="mini"
            type="warning"
            icon="el-icon-refresh"
            @click="changeDisplays"
            >批量修改状态</el-button
          >
        </el-button-group>
        <el-button-group class="crud-opts-left mR5 bottom5">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomlist:delete:more:POST')
            "
            size="mini"
            type="danger"
            icon="el-icon-takeaway-box"
            @click="binDialog = true"
            >回收站</el-button
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
        <el-form-item label="所属分类" prop="cateId">
          <el-checkbox-group v-model="formList.cateId">
            <el-checkbox
              v-for="item in cateIds"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="漫画名称" prop="bookName">
          <el-input v-model="formList.bookName" placeholder="请输入漫画名称" />
        </el-form-item>
        <el-form-item label="作者" prop="penName">
          <el-input v-model="formList.penName" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="热度" prop="view">
          <el-input-number
            v-model="formList.view"
            controls-position="right"
            placeholder="请输入热度"
          />
        </el-form-item>
        <el-form-item label="收藏数量" prop="collect">
          <el-input-number
            v-model="formList.collect"
            controls-position="right"
            placeholder="请输入收藏数量"
          />
        </el-form-item>
        <el-form-item label="内容简介" prop="bookDesc">
          <el-input
            v-model="formList.bookDesc"
            type="textarea"
            :rows="4"
            placeholder="请输入内容简介"
          />
        </el-form-item>
        <el-form-item label="是否完结" prop="bookIsend">
          <el-radio v-model="formList.bookIsend" :label="1">完结</el-radio>
          <el-radio v-model="formList.bookIsend" :label="2">连载</el-radio>
          <el-radio v-model="formList.bookIsend" :label="3">暂停</el-radio>
        </el-form-item>
        <el-form-item label="竖向封面" prop="bookThumb">
          <el-image class="img80" :src="formList.bookThumb" fit="cover">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
          <p>
            <cropper
              differ="1"
              :share="shareF1"
              @feedback="feedbackF"
            ></cropper>
          </p>
        </el-form-item>
        <el-form-item label="横向封面" prop="bookThumb2">
          <el-image class="img80" :src="formList.bookThumb2" fit="cover">
            <div slot="error">
              <el-image
                :lazy="true"
                :src="require(`@/assets/images/avatar.png`)"
              ></el-image>
            </div>
          </el-image>
          <p>
            <cropper
              differ="2"
              :share="shareF2"
              @feedback="feedbackF"
            ></cropper>
          </p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="btnStatus" type="primary" @click="addSubmit"
          >保存</el-button
        >
        <el-button v-else type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--批量修改-->
    <el-dialog
      v-if="cDialog"
      :visible.sync="cDialog"
      title="批量修改状态"
      width="350px"
    >
      <el-switch
        v-model="cDialogSwitch"
        active-text="显示"
        inactive-text="屏蔽"
      >
      </el-switch>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDisplaysSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!--回收站-->
    <el-dialog
      v-if="binDialog"
      :visible.sync="binDialog"
      title="回收站"
      width="85%"
    >
      <div style="width: 100%; height: 61vh; overflow-x: hidden">
        <listbin></listbin>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="binDialog = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--热度-->
    <el-dialog
      v-if="viewDialog"
      :visible.sync="viewDialog"
      title="热度"
      width="350px"
    >
      <el-input-number
        size="mini"
        controls-position="right"
        v-model="formListModify.view"
        placeholder="请输入热度"
        @keyup.enter.native="viewSubmit"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewSubmit">确定</el-button>
        <el-button  @click="viewDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 收藏 -->
    <el-dialog
      v-if="collectDialog"
      :visible.sync="collectDialog"
      title="收藏数量"
      width="350px"
    >
      <el-input-number
        size="mini"
        controls-position="right"
        v-model="formListModify.collect"
        placeholder="请输入热度"
        @keyup.enter.native="collectSubmit"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="collectSubmit">确定</el-button>
        <el-button  @click="collectDialog = false">取消</el-button>
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
      <el-table-column prop="view" label="热度" width="100px">
        <template slot-scope="scope">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:update:PUT')
            "
            size="mini"
            @click="viewDialog = true;id=scope.row.id;formListModify.view = scope.row.view;"
            >{{ scope.row.view }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="realView" label="真实阅读" />
      <el-table-column prop="collect" label="收藏">
        <template slot-scope="scope">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:update:PUT')
            "
            size="mini"
            @click="collectDialog = true;id=scope.row.id;formListModify.collect = scope.row.collect;"
            >{{ scope.row.collect }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="chapterTitle" label="最新章节" width="180px">
        <template slot-scope="scope">
          <el-button
            :disabled="
              $permissionButton('btn:comic-admin:recomicon:update:PUT') &&
              scope.row.chapterTitle
            "
            size="mini"
            @click="handelEdit(scope.row)"
            >{{
              scope.row.chapterTitle ? scope.row.chapterTitle : "N/A"
            }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="bookVip" label="收费" width="75px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.bookVip == 1" type="success" size="mini"
            >VIP</el-button
          >
          <el-button v-if="scope.row.bookVip == 2" type="success" size="mini"
            >免费</el-button
          >
          <el-button v-if="scope.row.bookVip == 3" type="danger" size="mini"
            >付费</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="bookIsend" label="状态" width="65px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bookIsend == 1" type="success">完结</el-tag>
          <el-tag v-if="scope.row.bookIsend == 2" type="warning">连载</el-tag>
          <el-tag v-if="scope.row.bookIsend == 3" type="danger">暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appShow" label="APP" width="75px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.appShow == 1" type="success" size="mini"
            >显示</el-button
          >
          <el-button v-if="scope.row.appShow == 2" type="danger" size="mini"
            >屏蔽</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="操作" width="280px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            :content="scope.row.bookName + '-推广设置'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomicon:update:PUT')
              "
              size="mini"
              type="info"
              icon="el-icon-s-help"
              @click="handelEdit(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="scope.row.bookName + '-推荐设置'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomicon:update:PUT')
              "
              size="mini"
              type="warning"
              icon="el-icon-thumb"
              @click="handelEdit(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="scope.row.bookName + '-章节列表'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomicon:update:PUT')
              "
              size="mini"
              type="success"
              icon="el-icon-s-operation"
              @click="handelEdit(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="scope.row.bookName + '-编辑'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="$permissionButton('btn:comic-admin:price:PUT')"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handelEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            :content="scope.row.bookName + '-删除'"
            effect="dark"
            placement="top"
          >
            <el-button
              :disabled="
                $permissionButton('btn:comic-admin:recomicon:delete:DELETE')
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
  list,
  one,
  recommend,
  classify,
  chapter,
  add,
  recomAdd,
  del,
  dels,
  view,
  collect,
  vip,
  show,
  shows,
  edit,
} from "@/api/comic/list.js";
import Avatar from "@/assets/images/avatar.png";
import cropper from "@/components/vueCropper";
import listbin from "./bin";

const formListOld = {
  cateId: [],
  bookName: null,
  penName: null,
  view: 0,
  collect: 0,
  bookDesc: null,
  bookIsend: 1,
  bookThumb: null,
  bookThumb2: null,
};
var monthStart = "";
var monthStartPre = "";
var monthEndPre = "";
var search = {
  text: null, //文本筛选,书籍名称,作者,书籍id
  bookVip: 0,
  bookIsend: 0,
  appShow: 0,
  stateTime: null,
  endTime: null,
};

export default {
  name: "comicList",
  inject: ["reload"],
  data() {
    return {
      id: null,
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      roles: [],
      tableData: [],
      formList: formListOld,
      cateIds: [], //分类
      cDialog: false, //批量修改状态
      cDialogSwitch: false,
      binDialog: false,
      viewDialog: false,
      collectDialog: false,
      formListModify: {
        view: null,
        collect: null,
      },

      rules: {
        cateId: [
          { required: true, message: "请输入所属分类", trigger: "blur" },
        ],
        bookName: [
          { required: true, message: "请输入漫画名称", trigger: "blur" },
        ],
        penName: [{ required: true, message: "请输入作者", trigger: "blur" }],
        bookDesc: [
          { required: true, message: "请输入内容简介", trigger: "blur" },
        ],
        bookIsend: [
          { required: true, message: "请输入是否完结", trigger: "blur" },
        ],
        bookThumb: [
          { required: true, message: "请输入竖向封面", trigger: "blur" },
        ],
        bookThumb2: [
          { required: true, message: "请输入横向封面", trigger: "blur" },
        ],
      },
      search: JSON.parse(JSON.stringify(search)),
      searches: {
        bookVips: [
          { value: 0, label: "是否收费" },
          { value: 1, label: "VIP" },
          { value: 2, label: "免费" },
          { value: 3, label: "付费" },
        ],
        bookIsends: [
          { value: 0, label: "连载状态" },
          { value: 1, label: "经完结" },
          { value: 2, label: "连载" },
          { value: 3, label: "暂停" },
        ],
        appShows: [
          { value: 0, label: "是否显示" },
          { value: 1, label: "显示" },
          { value: 2, label: "屏蔽" },
        ],
      },
      checkTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date(monthStart);
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上月",
            onClick(picker) {
              const end = new Date(monthEndPre);
              const start = new Date(monthStartPre);
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            },
          },
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
        name: "上传竖向封面",
        type: "1",
      },
      shareF2: {
        enlarge: "4.8",
        fixed: true,
        fixedNumber: [1920, 767],
        name: "上传横向封面",
        type: "1",
      },
      roles: [],
    };
  },

  watch: {
    checkTime(val, old) {
      if (val) {
        this.search.stateTime = Math.floor(val[0].getTime() / 1000).toString();
        this.search.endTime = Math.floor(val[1].getTime() / 1000).toString();
      } else {
        this.search.stateTime = null;
        this.search.endTime = null;
      }
    },
  },
  created() {
    this.load();
    this.getAll();
    // 本月初
    monthStart = this.$moment()
      .month(this.$moment().month())
      .startOf("month")
      .valueOf();
    // 上月初
    monthStartPre = this.$moment()
      .month(this.$moment().month() - 1)
      .startOf("month")
      .valueOf();
    // 上月末
    monthEndPre = this.$moment()
      .month(this.$moment().month() - 1)
      .endOf("month")
      .valueOf();
  },
  components: { cropper, listbin },
  methods: {
    load() {
      classify().then((res) => {
        this.cateIds = res;
      });
    },
    clearGetAll() {
      //全显示
      this.checkTime = null;
      this.search = JSON.parse(JSON.stringify(search));
      list({ page: 1, size: 10 }).then((res) => {
        this.tableData = res.list;

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    getAll() {
      let getSearch = JSON.parse(JSON.stringify(this.search));
      getSearch.page = this.page.page;
      getSearch.size = this.page.size;
      for (let k in getSearch) {
        !getSearch[k] && delete getSearch[k];
      }
      list(getSearch).then((res) => {
        res.list.map((x) => {
          x.cateId = x.cateId.split(",");
        });
        this.tableData = res.list;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
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
      this.dialogTitle = "添加漫画";
      this.formList = formListOld;
    },
    //编辑表单dialog
    handelEdit(row) {
      this.btnStatus = false;
      this.dialog = true;
      this.dialogTitle = "编辑漫画";
      this.formList = JSON.parse(JSON.stringify(row));
    },

    //添加操作
    addSubmit() {
      this.$refs["form"].validate((valid) => {
        var formList = JSON.parse(JSON.stringify(this.formList));
        formList.cateId = formList.cateId.join(",");
        if (valid) {
          add(formList).then((res) => {
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
        var formList = JSON.parse(JSON.stringify(this.formList));
        formList.cateId = formList.cateId.join(",");
        if (valid) {
          edit(formList).then((res) => {
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
        var formData = new FormData();
        formData.append("id", row.id);
        del(formData).then((res) => {
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
    //批量修改状态操作
    changeDisplays(row) {
      this.cDialog = true;
    },
    changeDisplaysSubmit() {
      let arr = [];

      this.$refs.table.selection.forEach((item, index) => {
        arr.push(item.id);
      });
      if (!arr.length > 0) {
        this.$notify({
          title: "请选择需要修改的选项",
          type: "warning",
          duration: 2500,
        });
        this.cDialog = false;
        return false;
      }
      shows({ id: arr, appShow: this.cDialogSwitch }).then((res) => {
        this.cDialog = false;
        this.getAll();
      });
    },
    feedbackF(opt) {
      let that = this;
      this.$hyUpload(opt.formData).then((res) => {
        if (opt.differ == 1) {
          that.formList.bookThumb = res.url;
        } else if (opt.differ == 2) {
          that.formList.bookThumb2 = res.url;
        }
      });
    },
    viewSubmit(){  //修改热度
      let data = {
        id: this.id,
        view: this.formListModify.view
      }
      view(data).then(res => {
        this.getAll();
        this.viewDialog = false;
      })
    },
    collectSubmit(){  //修改收藏量
      let data = {
        id: this.id,
        collect: this.formListModify.collect
      }
      collect(data).then(res => {
        this.getAll();
        this.collectDialog = false;
      })
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