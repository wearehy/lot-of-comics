<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-row>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-card shadow="hover">
                  所有的优惠券：
                  <div class="groupW">{{vTotal.allNum}}</div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  已使用优惠券：
                  <div class="groupW">{{vTotal.usedNum}}</div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  已过期优惠券：
                  <div class="groupW">{{vTotal.expiredNum}}</div>
                </el-card>
              </el-col>
            </el-row>
          </el-row>
        </el-button-group>
      </div>
    </div>
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-select
            v-model="selection.useState"
            @change="voucherListFun()"
            class="vMR marginTB5"
            placeholder="使用状态"
          >
            <el-option
              v-for="item in selection.useStateAll"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="selection.isExpire"
            @change="voucherListFun()"
            class="vMR marginTB5"
            placeholder="是否过期"
          >
            <el-option
              v-for="item in selection.isExpireAll"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="selection.vtid"
            @change="voucherListFun()"
            class="vMR marginTB5"
            placeholder="模板"
          >
            <el-option
              v-for="item in selection.vtidAll"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>
            <el-tooltip content="重置" effect="dark" placement="top">
              <el-button
                :disabled="$permissionButton('/voucher')"
                size="mini"
                type="warning"
                icon="el-icon-refresh-left"
                @click="resetFun"
              />
            </el-tooltip>
          </span>
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/voucher/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="title" label="名称" />
      <el-table-column prop="money" label="金额（元）">
        <template slot-scope="scope">{{(scope.row.money/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="useRules" label="使用规则" />
      <el-table-column prop="useType" label="使用类型">
        <template slot-scope="scope">{{scope.row.useType == 0?'商品代金券':'可提现代金券'}}</template>
      </el-table-column>
      <el-table-column prop="useState" label="使用状态">
        <template slot-scope="scope">{{scope.row.useState == 0?'未使用':'已使用'}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="删除" effect="dark" placement="top">
            <el-button
              :disabled="$permissionButton('/voucher')"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handelDel(scope.row)"
            />
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
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  voucherTotal,
  voucherTitle,
  voucherList,
  voucherDel,
} from "@/api/discount/voucher.js";

export default {
  name: "voucher",
  inject: ["reload"],
  data() {
    return {
      vTotal: 0,
      loading: true,
      dialog: false,
      dialogTitle: "",
      btnStatus: true,
      roles: [],
      tableData: [],

      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
      },

      selection: {
        useState: null,
        useStateAll: [
          { id: "0", title: "未使用" },
          { id: "1", title: "已使用" },
        ],
        isExpire: null,
        isExpireAll: [
          { id: "0", title: "未过期" },
          { id: "1", title: "已过期" },
        ],
        vtid: null,
        vtidAll: [],
      },
    };
  },
  created() {
    this.voucherListFun();
    voucherTitle().then((res) => {
      this.selection.vtidAll = res;
    });
  },
  methods: {
    voucherListFun() {
      let data = {
        useState: parseInt(this.selection.useState),
        isExpire: parseInt(this.selection.isExpire),
        vtid: this.selection.vtid,
        page: this.page.page,
        size: this.page.size,
      };
      !(data.useState || data.useState == 0) && delete data.useState;
      !(data.isExpire || data.isExpire == 0) && delete data.isExpire;
      !(data.vtid || data.vtid == 0) && delete data.vtid;
      // console.log(typeof data.useState,typeof data.vtid)
      voucherList(data).then((res) => {
        this.tableData = res.list;
        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
      voucherTotal().then((res) => {
        this.vTotal = res;
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.voucherListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.voucherListFun();
    },

    //删除操作
    handelDel(row) {
      this.$confirm(
        `确定删除${row.title}吗？删除后不可恢复哟！！！`,
        "高危操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }
      ).then(() => {
        voucherDel(row.id).then((res) => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 1500,
          });
          this.voucherListFun();
        });
      });
    },

    resetFun() {
      this.selection.useState = null;
      this.selection.isExpire = null;
      this.selection.vtid = null;
      this.voucherListFun();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.groupW {
  width: 56px;
  text-align: right;
  display: inline-block;
}
.vMR {
  margin-right: 11px;
}
</style>

<style>
</style>