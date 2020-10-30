<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <div>
        <el-input
          :disabled="$permissionButton('/mail/order/get')"
          v-model="searchTitle"
          size="small"
          clearable
          placeholder="订单编号"
          style="width: 200px;"
          class="filter-item"
        />
        <span>
          <el-button
            :disabled="$permissionButton('/mail/order/get')"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="orderSearch"
          >搜索</el-button>
          <el-button
            :disabled="$permissionButton('/mail/order/get')"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="refresh"
          >重置</el-button>
        </span>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="marT16">
        <el-tab-pane label="全部" name="6"></el-tab-pane>
        <el-tab-pane label="待付款" name="0"></el-tab-pane>
        <el-tab-pane label="待发货" name="1"></el-tab-pane>
        <el-tab-pane label="已发货" name="2"></el-tab-pane>
        <el-tab-pane label="已完成" name="3"></el-tab-pane>
        <el-tab-pane label="已关闭" name="4"></el-tab-pane>
      </el-tabs>
      <!-- 内部内容 -->
      <div>
        <!--表格渲染-->
        <el-form ref="form" v-permission="['/mail/order/get']">
          <ul class="q_ul bottom10">
            <li class="a1">
              <div class="flex">
                <div class="f1">商品</div>
                <div class="f2"></div>
                <div class="f3">单价(元)/数量</div>
              </div>
            </li>
            <!-- <li class="a2">孝心值</li> -->
            <li class="a3">收货人</li>
            <li class="a4">配送方式</li>
            <li class="a5">实收金额(元)</li>
            <li class="a6">订单状态</li>
            <li class="a7">操作</li>
          </ul>
        </el-form>

        <div class>
          <table class="my_table" v-if="orderList.list.length!=0">
            <tbody v-for="items in orderList.list" :key="items.guid">
              <tr>
                <td colspan="7" class="goods_bg">
                  <div class="tTitle" v-if="items">
                    <div class="flex">
                      <div class="padr30 wb fa">
                        
                        <span class="inline-block wp300">订单号：{{items.orderNumber}}</span>
                        <span class="inline-block wp300">下单时间：{{items.createTime}}</span>
                      </div>

                      <div class="txt_r fb" @click="detailFun(items.guid)">
                        <a href="#" class="cBlue">查看详情</a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-for="(item,num2) in items.orderCommodity" :key="num2">
                <!-- 商品 单价/数量 -->
                <td class="a1">
                  <div class="flex pad10 alignItemsC">
                    <img class="f1" :src="item.image" alt />
                    <div class="f2">
                      <p>{{item.name}}</p>
                      <p>{{item.specsName}}</p>
                    </div>
                    <div class="f3">
                      <p>
                        {{(item.price/100).toFixed(2)}}
                        <span
                          v-if="items.orderCommodity.length==1"
                        >+ {{item.integral}}</span>
                      </p>
                      <p>{{item.num}}件</p>
                    </div>
                  </div>
                </td>
                <!-- 孝心值 -->

                <!-- <td class="a2" :rowspan="items.orderCommodity.length" v-if="num2 == 0">
                  <p
                    v-if="items.orderCommodity.length==1"
                  >{{(items.integralPrice/100).toFixed(2)}} (元)</p>
                  <p v-if="items.orderCommodity.length==1">{{items.integral}}</p>

                  <p v-if="items.orderCommodity.length!=1">N/A</p>
                </td> -->
                <!-- 收货人 -->
                <td
                  class="a3"
                  :rowspan="items.orderCommodity.length"
                  
                >
                <template v-if="num2 == 0&&items.address">
                   <p>{{items.address.name}}</p>
                  <p>{{items.address.mobile}}</p>
                </template>
                 
                </td>
                <!-- 配送方式 -->
                <td class="a4" :rowspan="items.orderCommodity.length" v-if="num2 == 0">
                  <p>快递</p>
                </td>
                <!-- 实收金额 -->
                <td class="a5" :rowspan="items.orderCommodity.length" v-if="num2 == 0">
                  <p>{{ (items.totalPrice/100).toFixed(2)}}</p>
                </td>
                <!-- 订单状态 -->
                <td class="a6" :rowspan="items.orderCommodity.length" v-if="num2 == 0">
                  <p v-if="items.state == 0">待付款</p>
                  <p v-if="items.state == 1">待发货</p>
                  <p v-if="items.state == 2">已发货</p>
                  <p v-if="items.state == 3">交易完成</p>
                  <p v-if="items.state == 4">订单取消</p>
                  <p v-if="items.state == 5">已退款</p>
                </td>
                <!-- 操作 -->
                <td class="a7 txt_c" :rowspan="items.orderCommodity.length" v-if="num2 == 0">
                  <!-- 待付款：取消订单 ；待发货 发货  -->
                  <!-- <Button type="default" v-if="items.state == 0" @click="btn(0,items.guid)"  >取消订单</Button>  -->
                  <!-- <Button type="default" v-if="items.state == 1" @click="btn(1,items.guid)"  > 发货 </Button>  -->
                  <el-button
                    :disabled="$permissionButton('/mail/express/add')"
                    v-if="items.state == 1"
                    class="filter-item"
                    size="mini"
                    type="primary"
                    @click="guid=items.guid;btn(1)"
                  >发货</el-button>
                  <p v-if=" items.state != 1">N/A</p>
                </td>
              </tr>
              <tr>
                <div style="height:10px"></div>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="orderList.list.length == 0"
          style="width:100%;height:100px;line-height:100px;text-align:center;"
        >无数据</div>
        <!-- 分页 -->
        <el-pagination
          background
          :page-size="orderList.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="orderList.total"
          :current-page="orderList.page"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 订单详情 -->
    <el-dialog
      :visible.sync="detailBool"
      :close-on-click-modal="false"
      title="订单详情"
      append-to-body
      width="1060px"
    >
      <detail @fatherBtn="btn" :details-val="details" :guid-val="guid"></detail>
    </el-dialog>
    <!-- 订单发货 -->
    <el-dialog
      :visible.sync="deliverBool"
      :close-on-click-modal="false"
      title="订单发货"
      append-to-body
      width="840px"
    >
      <deliver :details-val="details" :guid-val="guid"></deliver>
    </el-dialog>
  </div>
</template>

<script>
import { orderGet, orderInfoGet } from "@/api/shopping/orderquery";
import detail from "./detail.vue";
import deliver from "./deliver.vue";

export default {
  name: "Orderquery",
  inject: ["reload"],
  data() {
    return {
      searchTitle: null,
      activeName: "6",

      loading: true,

      orderList: {
        list: [],
        type: "6",
        page: 1,
        size: 10,
        total: 0
      },

      guid: null,

      detailBool: false,
      details: {},

      deliverBool: false
    };
  },
  components: { detail: detail, deliver: deliver },
  watch: {
    orderList(val) {
      val.type == "7" && (this.activeName = "6");
    },
    activeName(val) {
      this.activeName != "6" && (this.searchTitle = null);
      this.orderList.type = val;
    }
  },
  created() {
    this.orderLoad();
  },
  methods: {
    orderLoad() {
      let data = {
        type: this.orderList.type,
        page: this.orderList.page,
        size: this.orderList.size
      };
      this.orderGetList(data);
    },
    orderGetList(data) {
      orderGet(data).then(res => {
        this.orderList.list = res.list;
        this.orderList.page = this.orderList.page;
        this.orderList.size = this.orderList.size;
        this.orderList.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    orderSearch() {
      this.activeName = "6";
      this.orderList.type = "7";
      let data = {
        orderNumber: this.searchTitle,
        type: this.orderList.type,
        page: this.orderList.page,
        size: this.orderList.size
      };
      this.orderGetList(data);
    },
    refresh() {
      this.searchTitle = null;
      this.activeName = "6";
      let data = {
        type: "6",
        page: 1,
        size: 10
      };
      this.orderGetList(data);
    },
    handleClick(tab, event) {
      let data = {
        type: this.activeName,
        page: 1,
        size: this.orderList.size
      };
      this.orderGetList(data);
    },

    // 改变每页显示数量事件
    handleSizeChange(val) {
      let data = {
        type: this.orderList.type,
        page: this.orderList.page,
        size: val
      };
      this.orderGetList(data);
    },
    // 翻页
    handleCurrentChange(val) {
      let data = {
        type: this.orderList.type,
        page: val,
        size: this.orderList.size
      };
      this.orderGetList(data);
    },
    detailFun(guid) {
      console.log(guid);
      if (!this.$permissionButton("mail/order/info/get")) {
        this.guid = guid;
        this.detailBool = true;
        this.orderInfoGetList();
      } else {
        this.$notify({
          title: "请先获取权限",
          type: "error",
          duration: 1500
        });
      }
    },
    orderInfoGetList() {
      let data = {
        guid: this.guid
      };
      orderInfoGet(data).then(res => {
        this.details = res;
      });
    },
    btn(n) {
      //操作 发货
      if (n == 1) {
        this.deliverBool = true;
        this.orderInfoGetList();
      } else if (n == 0) {
      }
    },
    set_btn() {
      let data;
      if (this.setLoad.check == 1) {
        data = {
          guid: this.guid,
          expressCom: this.setLoad.order_c.replace("_", ""),
          expressNum: this.setLoad.order_n,
          type: 1
        };
      } else {
        data = {
          guid: this.setLoad.guid2,
          expressCom: this.setLoad.order[this.setLoad.index2].order_c,
          expressNum: this.setLoad.order[this.setLoad.index2].order_n,
          type: 2
        };
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
@media screen and (max-width: 700px) {
  .head-container {
    width: 700px;
  }
}

.el-tabs__header .el-tabs__nav .is-active {
  color: #409eff !important;
}

.wb {
  word-break: keep-all;
}
.flex {
  display: flex;
}
.q_ul {
  overflow: hidden;
  background: #f7f8fa;
}
.q_ul li {
  float: left;
  padding: 15px 10px;
}
.q_ul li:not(.a1) {
  text-align: center;
}

.a1 {
  width: 34%;
}
.a2,
.a3,
.a4,
.a5,
.a6,
.a7 {
  width: 13.2%;
}

table {
  width: 100%;
}
tr {
  width: 100%;
}
td {
  align-items: center;
  border: 1px solid #ebedf0;
}
.tTitle {
  border-bottom: 0;
  padding: 16px;
  color: #323233;
}

.f1 {
  width: 60px;
  margin-right: 10px;
}
td .f1 {
  height: 60px;
  border-radius: 3px;
}
.f2 {
  margin-right: 10px;
  flex-grow: 1;
}
.f3 {
  min-width: 120px;
  text-align: right;
}

td:not(.a1) p {
  text-align: center;
}
.fa {
  flex: 2;
}
.fb {
  flex: 1;
}
</style>