<template>
  <div v-if="detailsVal && detailsVal" style="width:796px">
    <span class="fw600">发货方式</span>
    <span style="display:inline-block;width:15px;"></span>
    &nbsp;&nbsp;&nbsp;
    <el-radio v-model="setLoad.check" label="1">统一配送</el-radio>
    <el-radio v-model="setLoad.check" label="2">分批调配</el-radio>

    <div style="height:16px;width:100%;"></div>
    <div class="modal1_h" style="width:796px;overflow-x:hidden">
      <table class="old_table bottom16 bottom16">
        <tr class="goods_bg goods_border_b">
          <th class="a1">商品</th>
          <th class="a2">数量</th>
          <th class="a3">状态</th>
          <th class="a4">运单号</th>
        </tr>

        <!-- 统一配送 -->
        <tbody v-for="(item,index) in setLoad.list" :key="index">
          <template v-if="setLoad.check == '1'">
            <tr class="goods_border_b">
              <td class="a1">
                <div class="flex alignItemsC">
                  <img class="bottom5 mR15" style="width:48px;height:48px;" :src="item.image" alt />
                  <div class>
                    <p>{{item.name}}</p>
                    <p>{{item.specsName}}</p>
                  </div>
                </div>
              </td>
              <td class="a2">{{item.num}}</td>
              <td class="a3">
                <span v-if="!item.expressNum">待发货</span>
                <span v-if="item.expressNum">已发货</span>
              </td>
              <td class="a4">
                <span v-if="setLoad.data.expressNum">{{setLoad.data.expressNum}}</span>
                <span v-if="item.expressNum">{{item.expressNum}}</span>
              </td>
            </tr>
          </template>
        </tbody>
        <!-- 分批调配  -->
        <tbody v-for="(item,index2) in setLoad.list" :key="index2+'b'" class="goods_border_b">
          <template v-if="setLoad.check == '2'">
            <tr class>
              <td class="a1">
                <div class="flex alignItemsC">
                  <img class="bottom5 mR15" style="width:48px;height:48px;" :src="item.image" alt />
                  <div class>
                    <p>{{item.name}}</p>
                    <p>{{item.specsName}}</p>
                  </div>
                </div>
              </td>
              <td class="a2">{{item.num}}</td>
              <td class="a3">
                <span v-if="!item.expressNum">待发货</span>
                <span v-if="item.expressNum">已发货</span>
              </td>
              <td class="a4">
                <span v-if="setLoad.data.expressNum">{{setLoad.data.expressNum}}</span>
                <span v-if="item.expressNum">{{item.expressNum}}</span>
              </td>
            </tr>
            <tr class v-if="!item.expressNum">
              <td colspan="4">
                <div class="flex bottom16">
                  <div class="wp100 pad5 padl0 flex_shrink">发货方式</div>
                  <div class="flex_grow">
                    <ul>
                      <li class="flex">
                        <div class="wp80 pad5 flex_shrink">物流公司：</div>
                        <div class="rt pad5 padl0 flex_grow">
                          <el-select
                            style="medium"
                            v-model="setLoad.order[index2].order_c"
                            placeholder="请选择"
                            class="w180"
                          >
                            <el-option
                              v-for="item in setLoad.selects"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </div>
                      </li>
                      <li class="flex">
                        <div class="wp80 pad5 flex_shrink">快递单号：</div>
                        <div class="rt pad5 padl0 flex_grow">
                          <el-input
                            v-model="setLoad.order[index2].order_n"
                            type="text"
                            class="lft w180"
                            placeholder="请输入快递单号"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="flex flexC wp400">
                    <el-button
                      :disabled="$permissionButton('/mail/express/add')"
                      @click="setLoad.index2 = index2;setLoad.guid2=item.orderCommodityGuid;set_btn()"
                      v-if="setLoad.check==2"
                      class="filter-item"
                      size="mini"
                      type="primary"
                    >发货</el-button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div class="flex bottom16" v-if="setLoad.check == '1'">
        <div class="wp100 pad5 padl0 flex_shrink">发货方式</div>
        <div class="flex_grow">
          <ul>
            <li class="flex">
              <div class="wp80 pad5 flex_shrink">物流公司：</div>
              <div class="rt pad5 padl0 flex_grow">
                <!-- <Select v-model="setLoad.order_c" class="w180">
                  <Option
                    v-for="item in setLoad.selects"
                    :value="item.com+'_'"
                    :key="item.com"
                  >{{ item.title }}</Option>
                </Select>-->
                <el-select style="medium" v-model="setLoad.order_c" placeholder="请选择" class="w180">
                  <el-option
                    v-for="item in setLoad.selects"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value+'_'"
                  ></el-option>
                </el-select>
              </div>
            </li>
            <li class="flex">
              <div class="wp80 pad5 flex_shrink">快递单号：</div>
              <div class="rt pad5 padl0 flex_grow">
                <el-input
                  v-model="setLoad.order_n"
                  type="text"
                  class="lft w180"
                  placeholder="请输入快递单号"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex bottom16" v-if="setLoad.data">
        <div class="wp100 pad5 padl0 flex_shrink">配送信息</div>
        <div class="flex_grow">
          <ul v-if="setLoad.data.address">
            <li class="flex">
              <div class="wp80 pad5 flex_shrink">配送方式：</div>
              <div class="pad5 padl0 flex_grow">快递</div>
            </li>
            <li class="flex">
              <div class="wp80 pad5 flex_shrink">收货人：</div>
              <div class="pad5 padl0 flex_grow">{{setLoad.data.address.name}}</div>
            </li>
            <li class="flex">
              <div class="wp80 pad5 flex_shrink">收货地址：</div>
              <div
                class="pad5 padl0 flex_grow"
              >{{setLoad.data.address.pName}} {{setLoad.data.address.aName}} {{setLoad.data.address.cName}} {{setLoad.data.address.detail}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div style="height:25px">
      <el-button
        :disabled="$permissionButton('/mail/express/add')"
        @click="set_btn()"
        v-if="setLoad.check==1"
        class="filter-item rgt"
        size="mini"
        type="primary"
      >发货</el-button>
    </div>
  </div>
</template>

<script>
import { express, expressAdd } from "@/api/shopping/orderquery";
export default {
  data() {
    return {
      setLoad: {
        //发货弹窗
        check: "1", // '1'统一配送，'2'分批调配
        data: {},
        order_c: "", //订单公司
        order_num: "", //订单号
        selects: [],
        list: [],
        guid2: null, //分批调配单个商品的guid
        index2: 0,
        order: [
          //分批调配单个商品的 物流公司+订单号
          { order_c: "", order_n: "" }
        ]
      }
    };
  },
  created() {
    this.expressData();
  },
  watch: {
    detailsVal(val, old) {
      this.setLoad.list = val.orderCommodity;
      this.setLoad.data = val;
      let order = [];
      let len = this.setLoad.list.length;
      for (let i = 0; i < len; i++) {
        order.push({
          order_c: this.setLoad.list[i].expressCom,
          order_n: this.setLoad.list[i].expressNum
        });
      }
      this.setLoad.order = order;
    }
  },
  props: ["detailsVal", "guidVal"],

  methods: {
    expressData() {
      express().then(res => {
        
        let selects = [];
        let len = res.length;
        for (let i = 0; i < len; i++) {
          selects.push({ label: res[i].title, value: res[i].com });
        }
        this.setLoad.selects = selects;
       
      });
    },
    set_load() {
      this.$myAjax
        .get("admin/service/mail/order/info/get?guid=" + this.guid)
        .then(res => {
          this.setLoad.data = res.data.data;
          this.setLoad.list = res.data.data.orderCommodity;

          let order = [];
          let len = this.setLoad.list.length;
          for (let i = 0; i < len; i++) {
            order.push({
              order_c: this.setLoad.list[i].expressCom,
              order_n: this.setLoad.list[i].expressNum
            });
          }
          this.setLoad.order = order;
        });
    },
    set_btn() {
      let data;

      if (this.setLoad.check == 1) {
        if (this.setLoad.order_c && this.setLoad.order_n) {
          data = {
            guid: this.guidVal,
            expressCom: this.setLoad.order_c.replace("_", ""),
            expressNum: this.setLoad.order_n,
            type: 1
          };
          this.expressAddFun(data);
        } else {
          this.$message({
            message: "请填写完表单",
            type: "success"
          });
        }
      } else {
        if (
          this.setLoad.order[this.setLoad.index2].order_c &&
          this.setLoad.order[this.setLoad.index2].order_n
        ) {
          data = {
            guid: this.setLoad.guid2,
            expressCom: this.setLoad.order[this.setLoad.index2].order_c,
            expressNum: this.setLoad.order[this.setLoad.index2].order_n,
            type: 2
          };
          this.expressAddFun(data);
        } else {
          this.$message({
            message: "请填写完表单",
            type: "success"
          });
        }
      }
    },
    expressAddFun(data) {
      expressAdd(data).then(res => {
        if (this.setLoad.check == 1) {
        } else {
        }
        this.$notify({
          title: "发货成功",
          type: "success",
          duration: 1500
        });
      });
    },
    sc() {
      let selects = this.select.selects;
      let len = selects.length;
      for (let i = 0; i < len; i++) {
        if (selects[i].value == this.select.select) {
          this.select.label = selects[i].label;
        }
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.w180 {
  width: 180px;
}
.w80 {
  width: 80px;
}
.w20 {
  width: 20px;
}

.a1 {
  width: 40%;
  padding: 12px 20px;
}
.a2,
.a3,
.a4 {
  width: 20%;
  padding: 12px 20px;
}

.rt {
  position: relative;
  top: -4px;
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
  width: 11%;
}

table {
  width: 100%;
}
tr {
  width: 100%;
}
td {
  align-items: center;
  /* border: 1px solid #ebedf0; */
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
ul,
li {
  margin: 0;
}
</style>