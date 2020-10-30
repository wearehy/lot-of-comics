<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" v-if="homePage">
      <div class="marginTB16">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          @click="guidF=null;homePage=false;addGoods()"
          :disabled="$permissionButton('/mail/commodity/add')"
        >发布商品</el-button>
      </div>
      <div>
        <el-input
          :disabled="$permissionButton('/mail/commodity/get')"
          v-model="searchkey"
          size="small"
          clearable
          placeholder="输入商品名称"
          style="width: 200px;"
          class="filter-item"
        />
        <span>
          <el-button
            :disabled="$permissionButton('/mail/commodity/get')"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="search"
          >搜索</el-button>
          <el-button
            :disabled="$permissionButton('/mail/commodity/get')"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="reset()"
          >重置</el-button>
        </span>
      </div>

      <div>
        <el-tabs class="marT16" v-model="card" type="card" @tab-click="tabsClick">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="销售中" name="1"></el-tab-pane>
          <el-tab-pane label="已售罄" name="2"></el-tab-pane>
          <el-tab-pane label="仓库中" name="3"></el-tab-pane>
        </el-tabs>

        <div class="bottom10">
          <!-- <el-checkbox class="mR10" v-model="allSelectStatus" @on-change="checkSelect">
            <span>当前页面全选</span>
          </el-checkbox>-->

          <template v-if="card==0||card==3">
            <el-button :disabled="$permissionButton('/mail/commodity/sell')" @click="shelves(0)">上架</el-button>
            <div class="inline-block padlr5"></div>
          </template>
          <template v-if="card!=3">
            <el-button :disabled="$permissionButton('/mail/commodity/sell')" @click="shelves(1)">下架</el-button>
            <div class="inline-block padlr5"></div>
          </template>
          <template>
            <el-button :disabled="$permissionButton('/mail/commodity/delete')" @click="delGoods">删除</el-button>
            <div class="inline-block padlr5"></div>
          </template>
          <template>
            <el-button
              :disabled="$permissionButton('/mail/commodity/group/list/update')"
              @click="showChangeGroupModal"
            >改分组</el-button>
            <div class="inline-block padlr5"></div>
          </template>
        </div>

        <el-table
          ref="selection"
          @selection-change="selectCallback"
          v-permission="['/mail/commodity/get']"
          v-loading="loading"
          :data="goodsList"
          row-key="id"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="商品名字" width="240">
            <template slot-scope="scope">
              <div class="flex" @click="toEdit(scope.row)">
                <div class="flex_1">
                  <div class="margin10 img80 inline-block">
                    <img class="wP100" :src="scope.row.image[0]" alt />
                  </div>
                </div>
                <div class="flex_1 flex flexC">
                  <span class>{{scope.row.name}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格">
            <template slot-scope="scope">{{(scope.row.price/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="integral" label="孝心值" />
          <el-table-column prop="pageview" label="浏览量" />
          <el-table-column prop="stock" label="库存" />
          <el-table-column prop="salesVolume" label="销量" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="stateName" label="商品状态" />

          <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="推荐" placement="top">
                <el-button
                  class="mR5"
                  :disabled="$permissionButton('/banner/add/commodity')"
                  size="mini"
                  type="success"
                  icon="el-icon-s-promotion"
                  @click="guidF=scope.row.guid;rec=true"
                />
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  :disabled="$permissionButton('/mail/commodity/update')"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="guidF=scope.row.guid;homePage=false;toEdit(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          :page-size="size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          :current-page="page"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <el-dialog :visible.sync="groupModalVisible" title="修改分组">
          <el-form ref="form">
            <el-form-item label="* 商品分组">
              <el-select v-model="goodGroupGuid" placeholder="请选择">
                <el-option
                  v-for="item in goodsGroup"
                  :key="item.value"
                  :label="item.name"
                  :value="item.guid"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="$message.success('已取消');groupModalVisible=false" class="mR10">取 消</el-button>
            <el-button type="primary" @click="changeGoodsGroupOk();groupModalVisible=false">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 推荐 首页banner/商城banner -->
        <el-dialog v-if="rec" :visible.sync="rec" title="推荐">
          <el-radio-group v-model="recRadio">
            <el-radio :label="0">首页轮播</el-radio>
            <el-radio :label="1">商城轮播</el-radio>
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="$message.success('已取消');rec=false" class="mR10">取 消</el-button>
            <el-button type="primary" @click="recFun();rec=false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 子页面  -->
    <manage_child v-if="!homePage" @close="closeF" :guid="guidF"></manage_child>
  </div>
</template> 
<script>
import {
  commodityGet,
  categoryGet,
  commodityGroupGet,
  commoditySell,
  commodityDelete,
  commodityGroupUpdate,
  bannerAdd
} from "@/api/shopping/manage.js";

import manage_child from "./manage_child.vue";

export default {
  name: "manage",
  data() {
    return {
      rec: false,
      recRadio: 0,
      guidF: null,
      homePage: true,
      loading: true,
      card: "0",
      page: 1, //页码
      size: 10, //默认每页条数
      searchBool: false,
      searchkey: "", //搜索关键词
      tableLoading: false,
      allSelectStatus: false, //多选框
      total: 0, //总共条数
      goodsList: [],
      selectList: [], //选中商品
      groupModalVisible: false, //显示商品分组弹框
      goodsGroup: "", //商品全部分组
      goodGroupGuid: "" //选择的商品分组的GUID
    };
  },
  created() {},
  components: { manage_child },
  methods: {
    getGoodsList() {
      let data = {};
      if (!this.searchBool) {
        data = {
          type: this.card,
          page: this.page,
          size: this.size
        };
      } else {
        data = {
          type: "4",
          page: this.page,
          size: this.size,
          name: this.searchkey
        };
      }

      commodityGet(data).then(res => {
        this.goodsList = res.list;
        this.loading = false;
        this.total = res.total;
      });
    },

    //获取商品品类
    getGoodsCategory() {
      categoryGet().then(res => {
        this.goodsCategory = res;
      });
    },
    //获取商品分类
    getGoodsGroup() {
      commodityGroupGet().then(res => {
        this.goodsGroup = res;
      });
    },
    tabsClick() {
      this.searchBool = false;
      this.page = 1;
      this.getGoodsList();
    },
    //全选Btn
    checkSelect() {
      this.$refs.selection.selectAll(this.allSelectStatus);
    },
    //选择商品时的回调函数
    selectCallback(e) {
      this.selectList = e;
    },
    //上架商品
    shelves(type) {
      if (this.selectList.length != 0) {
        let list = [];
        this.selectList.forEach(item => {
          list.push(item.guid);
        });
        commoditySell({ list, type }).then(res => {
          this.clearCheck();
          this.selectList = [];
          this.getGoodsList();
          type == 0
            ? this.$message.success("上架成功")
            : this.$message.success("下架成功");
        });
      } else {
        this.$message.error("请先选择");
      }
    },
    //删除商品
    delGoods() {
      if (this.selectList.length != 0) {
        let list = [];
        this.selectList.forEach(item => {
          list.push(item.guid);
        });
        this.$confirm("是否删除当前选中商品，删除后不可恢复！")
          .then(_ => {
            commodityDelete(list).then(res => {
              this.clearCheck();
              this.selectList = [];
              this.getGoodsList();
              this.$message.success("删除成功");
            });
          })
          .catch(_ => {});
      } else {
        this.$message.error("请先选择");
      }
    },
    //显示商品分组弹框
    showChangeGroupModal() {
      if (this.selectList.length != 0) {
        this.groupModalVisible = true;
      } else {
        this.$message.error("请先选择");
      }
    },
    //修改商品分组弹框 确定
    changeGoodsGroupOk() {
      if (!this.goodGroupGuid) {
        this.$message.error("请先选择分组");
      } else {
        let list = [];
        this.selectList.forEach(item => {
          list.push(item.guid);
        });
        commodityGroupUpdate({
          list,
          commodityGroupGuid: this.goodGroupGuid
        }).then(res => {
          this.clearCheck();
          this.selectList = [];
        });
      }
    },
    //编辑按钮
    toEdit(row) {},
    //发布商品
    addGoods() {},
    //搜索
    search() {
      this.searchBool = true;
      if (this.searchkey == "") {
        this.$message.error("请输入关键字");
      } else {
        this.loading = true;
        this.page = 1;
        this.size = 10;
        this.searchBool = true;
        this.getGoodsList();
      }
    },
    //重置
    reset() {
      this.searchBool = false;
      this.card = "0";
      this.page = 1;
      this.size = 10;
      this.searchkey = "";
      this.getGoodsList();
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.size = val;
      this.getGoodsList();
    },
    // 翻页
    handleCurrentChange(val) {
      (this.page = val), this.getGoodsList();
    },
    //清除列表勾选
    clearCheck() {
      this.$refs.selection.clearSelection();
    },
    closeF(val) {
      this.homePage = val;
      this.getGoodsList();
      console.log(111, this.homePage);
    },
    recFun() {
      bannerAdd({ commodityGuid: this.guidF, scene: this.recRadio }).then(
        res => {
          this.$notify({
            title: "推荐成功",
            type: "success",
            duration: 1500
          });
        }
      );
    }
  },

  mounted() {
    this.getGoodsList();
    this.getGoodsCategory();
    this.getGoodsGroup();
  }
};
</script>  
<style scoped>
.operating {
  line-height: 60px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 20px;
}
.tabs-nav {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.table-name {
  display: flex;
  align-items: center;
}
.table-name img {
  width: 80px;
  height: 80px;
  margin: 10px;
}
.table-name span {
  margin-left: 5px;
  color: blue;
  cursor: pointer;
}
.pagination {
  text-align: right;
  margin-top: 20px;
  padding-bottom: 70px;
}
.goods-image {
  object-fit: contain;
}
</style>
     