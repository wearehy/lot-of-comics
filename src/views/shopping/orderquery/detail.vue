<template>
  <div class="container detailC" style="height:500px">
    <div style="width:1000px;overflow-x: hidden;">
      <div class="bottom16 top15">
        订单编号：{{ detailsVal.orderNumber}}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        下单时间：{{ detailsVal.createTime }}
      </div>

      <div class="flex flex_column goods_border bottom16">
        <div class="flex flex_row wP100 border_box">
          <div class="flex_1 pad_min1">
            <!-- 待付款 -->
            <template v-if="step==0">
              <div class="fs20 fw900 bottom14">商家已拍下，等待买家付款</div>
              <div class="bottom14" v-if="detailsVal.endTime">
                如买家未在
                <span class="cRed">{{ timeFont }}</span>内付款，订单将按照设置逾期自动关闭。
              </div>
              <div class="dbtn">
                <el-button
                  disabled
                  class="filter-item"
                  size="mini"
                  type="primary"
                  @click="editor_btn"
                >改价</el-button>
              </div>
            </template>
            <!-- 待发货 -->
            <template v-if="step==1">
              <div class="fs20 fw900 bottom14">等待商家发货</div>
              <div class="bottom14">买家已付款至家谱纪待结算账户，请尽快发货，否则买家有权申请退款。</div>
              <div class="dbtn">
                <el-button
                  :disabled="$permissionButton('/mail/express/add')"
                  class="filter-item"
                  size="mini"
                  type="primary"
                  @click="childBtn"
                >发货</el-button>
              </div>
            </template>
            <!-- 已发货  -->
            <template v-if="step==2">
              <div class="fs20 fw900 bottom14">商家已发货，等待交易成功</div>
              <div class="bottom14">
                买家如在
                <span>1天内没有申请退款，交易将自动完成。</span>
              </div>
              <div class="dbtn"></div>
            </template>
            <!-- 已完成  -->
            <template v-if="step==3">
              <div class="fs20 fw900 bottom14">交易完成</div>
              <div class="bottom14"></div>
              <div class="dbtn"></div>
            </template>
            <!-- 已关闭  -->
            <template v-if="step==4">
              <div class="fs20 fw900 bottom14">交易关闭</div>
              <div class="bottom14">超时未付款</div>
              <div class="dbtn"></div>
            </template>
          </div>
          <div class="flex_2 goods_border_l flex_r flex flexC padlr20">
            <el-steps
              space="120px"
              v-if="step !== 4"
              :active="step+1"
              finish-status="success"
              simple
              style="margin-top: 20px;width:660px;"
            >
              <el-step title="买家下单"></el-step>
              <el-step title="买家付款"></el-step>
              <el-step title="商家发货"></el-step>
              <el-step title="交易成功"></el-step>
            </el-steps>
            
          </div>
        </div>

        <div class="pad_min1 goods_border_t flex">
          <div class="wp100 marginTB14 cOrange">友情提醒：</div>
          <!-- 待付款  -->
          <div class="flex_grow" v-if="step == 0">
            <p>请务必等待订单状态变更为“买家已付款，等待卖家发货”后再进行发货。</p>
          </div>
          <!-- 待发货  -->
          <div class="flex_grow" v-if="step == 1">
            <p>如果无法发货，请及时与买家联系并说明情况后进行退款；</p>
            <p>买家申请退款后，须征得买家同意后再发货，否则买家有权拒收货物；</p>
            <p>买家付款后超过7天仍未发货，将有权申请家谱纪客服介入发起退款维权；</p>
          </div>
          <!-- 已发货  -->
          <div class="flex_grow" v-if="step == 2">
            <p>交易成功后，家谱纪将把货款结算至你的店铺账户余额，你可申请提现；</p>
            <p>请及时关注你发出的包裹状态，确保能配送至买家手中；</p>
            <p>如果买家表示未收到货或者货物有问题，请及时联系买家积极处理，友好协商；</p>
          </div>
          <!-- 已完成  -->
          <div class="flex_grow" v-if="step == 3">
            <p>交易完成</p>
          </div>
          <!-- 已关闭  -->
          <div class="flex_grow" v-if="step == 4">
            <p>交易关闭；</p>
          </div>
        </div>
      </div>

      <div class="goods_bg bottom16">
        <ul class="flex" v-if="detailsVal.address">
          <li class="flex1 pad_min2">
            <div class="bottom5 fw900 fs15">
              收货人信息
              <span class="fw300 cBlue mL20 pointer" @click="copyFun()">复制</span>
            </div>
            <div class="flex">
              <div class="wpx">收货人：</div>
              <div class="wb">{{detailsVal.address.name}}</div>
            </div>
            <div class="flex">
              <div class="wpx">联系电话：</div>
              <div class="wb">{{detailsVal.address.mobile}}</div>
            </div>
            <div class="flex">
              <div class="wpx">收货地址：</div>
              <div
                class="wb"
              >{{detailsVal.address.pName}} {{detailsVal.address.aName}} {{detailsVal.address.cName}} {{detailsVal.address.detail}}</div>
            </div>
          </li>
          <li class="flex1 pad_min2">
            <div class="bottom5 fw900 fs15">配送信息</div>
            <div class="flex">
              <div class="wpx">配送方式：</div>
              <div class="wb">快递</div>
            </div>
            <div class="flex" v-if="detailsVal.sendTime">
              <div class="wpx">发货时间：</div>
              <div class="wb">{{detailsVal.sendTime}}</div>
            </div>
          </li>
          <li class="flex1 pad_min2">
            <div class="bottom5 fw900 fs15">付款信息</div>
            <div class="flex">
              <div class="wpx">付款状态：</div>
              <div class="wb">
                <span v-if="step == 0 || step == 4">未付款</span>
                <span v-if="step != 0 && step != 4">已付款</span>
              </div>
            </div>
            <div class="flex" v-if="step != 0 && step != 4">
              <div class="wpx">实付金额：</div>
              <div class="wb">{{(detailsVal.totalPrice/100).toFixed(2)}}</div>
            </div>
            <div class="flex" v-if="detailsVal.payType">
              <div class="wpx">付款方式：</div>
              <div class="wb">
                <span v-if="detailsVal.payType == 0">支付宝</span>
                <span v-if="detailsVal.payType == 1">微信</span>
              </div>
            </div>
            <div class="flex" v-if="detailsVal.payTime">
              <div class="wpx">付款时间：</div>
              <div class="wb">{{detailsVal.payTime}}</div>
            </div>
          </li>
          <li class="flex1 pad_min2">
            <div class="bottom5 fw900 fs15">买家信息</div>
            <div class="flex">
              <div class="wpx">买家：</div>
              <div class="wb">{{detailsVal.userName}}</div>
            </div>
          </li>
        </ul>
      </div>

      <table
        class="old_table bottom16"
        v-if="detailsVal.orderCommodity&&detailsVal.orderCommodity.length>0"
      >
        <tr class="goods_bg">
          <th class="a1">商品</th>
          <th class="a2">物流单号</th>
          <th class="a3">数量(件)</th>
          <th class="a4">孝心值折扣(元)</th>
          <th class="a5">单价(元)</th>
          <th class="a6">发货状态</th>
        </tr>

        <tr v-for="(item,index) in detailsVal.orderCommodity" :key="index">
          <td class="a1">
            <div class="flex alignItemsC">
              <img class="bottom5 mR15" style="width:48px;height:48px;" :src="item.image" alt />
              <div class>
                <p>{{item.name}}</p>
                <p>{{item.specsName}}</p>
              </div>
            </div>
          </td>
          <td class="a2">
            <span v-if="detailsVal.expressNum">{{detailsVal.expressNum}}</span>
            <span v-if="!detailsVal.expressNum">{{item.expressNum}}</span>
          </td>
          <td class="a3">{{item.num}}</td>
          <td class="a4">{{item.integral}}</td>
          <td class="a5">{{(item.price/100).toFixed(2)}}</td>
          <td class="a6">
            <span v-if="step == 0">未发货</span>
            <span v-if="step == 1">未发货</span>
            <span v-if="step == 2">已发货</span>
            <span v-if="step == 3">已完成</span>
            <span v-if="step == 4">未发货</span>
          </td>
        </tr>
      </table>

      <div class="wp250 rgt bottom50 pad20 mR40">
        <template v-if="step!=4">
          <div class="flex">
            <div class="wpx txt_r wp100">总金额：</div>
            <div
              class="flex_grow txt_r"
            >￥{{(detailsVal.totalPrice/100 - detailsVal.freightPrice/100).toFixed(2)}}</div>
          </div>
          <div class="flex">
            <div class="wpx txt_r wp100">运费：</div>
            <div class="flex_grow txt_r">￥{{(detailsVal.freightPrice/100).toFixed(2)}}</div>
          </div>

          <div class="flex fs16 fw900 top5">
            <div class="wpx txt_r wp100">实收金额：</div>
            <div class="flex_grow txt_r cRed">￥{{(detailsVal.totalPrice/100).toFixed(2)}}</div>
          </div>
        </template>
      </div>
    </div>
    <!-- 改价 -->

    <el-dialog
      :visible.sync="modal2"
      :close-on-click-modal="false"
      :title="'订单原价(含运费)：'+price+'元'"
      append-to-body
      width="1000px"
    >
      <div class="modal1_h">
        <p class="bottom20"></p>
        <p
          class="bottom5"
          v-if="detailsVal.address"
        >收货地址：{{detailsVal.address.pName}} {{detailsVal.address.aName}} {{detailsVal.address.cName}} {{detailsVal.address.detail}}</p>
        <p class="bottom5">实付金额 = 小计 + 店铺优惠</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderInfoGet } from "@/api/shopping/orderquery";
import deliverVue from "./deliver.vue";

export default {
  data() {
    return {
      step: 1, //1买家下单；2买家付款；3商家发货；4交易成功；

      modal2: false,
      price: 809,
      columns1: [
        { title: "商品", slot: "title", align: "center" },
        { title: "单价(元)", key: "one_price", align: "right" },
        { title: "数量", key: "num", align: "center" },
        { title: "小计(元)", key: "all_price", align: "right" },
        { title: "孝心值优惠", slot: "money", align: "center" },
        { title: "涨价或减价", slot: "add", align: "center" },
        { title: "运费(元)", slot: "tran", align: "center" },
        {
          title: "实付金额",
          key: "pay_price",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "red",
                  fontWeight: 900
                }
              },
              params.row.pay_price
            );
          },
          align: "right"
        }
      ],
      data1: [],

      time: 0,
      timeFont: null,
      detailsBool: false
    };
  },
  props: ["detailsVal"],
  computed: {},
  watch: {
    detailsVal(val, old) {
      this.step = val.state;
      this.load();
    }
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      // this.$nextTick(() => {
      //     this.step = this.detailsVal.state;
      //     this.data1 = this.detailsVal.orderCommodity;
      // });

      let now = Math.floor(new Date().getTime() / 1000);
      let end = Math.floor(new Date(this.detailsVal.endTime).getTime() / 1000);
      // let end = Math.floor(new Date('2020-04-02 20:40:53').getTime()/1000);

      let ms = end - now;

      this.time = ms;

      this.timeFun(ms);
    },

    childBtn() {
      //操作 发货
      this.$emit("fatherBtn", 1);
    },
    editor_btn() {
      //取消订单
      this.modal2 = true;
    },
    del_btn() {
      //改价
    },
    copyFun() {
      let copy =
        "收货人:" +
        this.detailsVal.address.name +
        ",联系电话:" +
        this.detailsVal.address.mobile +
        ",收货地址:" +
        this.detailsVal.address.pName +
        this.detailsVal.address.aName +
        this.detailsVal.address.cName +
        this.detailsVal.address.detail;

      var textArea = document.createElement("textarea");

      textArea.style.position = "fixed";
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = 0;
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.value = copy;

      document.body.appendChild(textArea);

      textArea.select();
      try {
        var msg = document.execCommand("copy") ? "成功" : "失败";
        this.$message("复制内容 " + msg);
      } catch (err) {
        this.$message("不能使用这种方法复制内容");
      }
      document.body.removeChild(textArea);
    },
    timeFun(val) {
      let _this = this;
      function task() {
        let h = 0,
          m = 0,
          s = 0;
        let timeFont = "";
        if (val > -1) {
          console.log(val);
          val -= 1;

          h = Math.floor((val % (3600 * 24)) / (60 * 60));
          h < 10 && (h = "0" + h);
          m = Math.floor((val % 3600) / 60);
          m < 10 && (m = "0" + m);
          s = Math.floor(val % 60);
          s < 10 && (s = "0" + s);
          console.log(h);
          timeFont = h + "时" + m + "分" + s + "秒";
          _this.timeFont = timeFont;
        } else {
          clearInterval(timer);
        }
      }
      task();
      var timer = setInterval(task, 1000);
    }
  },

  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  components: {}
};
</script>

<style  scoped>
.detailC {
  overflow-y: auto;
}
.a1 {
  width: 30%;
}
.a2,
.a3,
.a4,
.a5,
.a6 {
  width: 14%;
}
.a3,
.a4,
.a5 {
  text-align: right;
}
.a2,
.a6 {
  text-align: center;
}
.dbtn {
  padding-top: 10px;
}
.wpx {
  width: 75px;
  flex-shrink: 0;
  padding-bottom: 3px;
}
.wb {
  flex-grow: 1;
  word-break: break-all;
  min-width: 150px;
  padding-bottom: 3px;
}
td {
  padding: 10px 12px;
  border: 1px solid #ebedf0;
}
th {
  padding: 10px 12px;
}
</style>