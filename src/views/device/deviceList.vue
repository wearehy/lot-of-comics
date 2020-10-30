<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-radio-group v-model="page.state" @change="deviceListFun()">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">已激活</el-radio>
        <el-radio :label="2">未激活</el-radio>
      </el-radio-group>
    </div>
    <div class="head-container">
      <el-select class="mR5 marginTB5" v-model="updateData.dcid" placeholder="请选择设备渠道">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.channelName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-tooltip content="更新设备渠道" effect="dark" placement="top">
        <el-button type="warning" icon="el-icon-refresh" size="small" @click="updateFun"></el-button>
      </el-tooltip>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-permission="['/device/list']"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="deviceName" label="设备名" />
      <el-table-column prop="deviceVersion" label="设备版本号" />
      <el-table-column prop="deviceManufactory" label="设备制造商" />
      <el-table-column prop="isActive" label="状态">
        <template slot-scope="scope">{{scope.row.isActive == 1? '激活':'未激活'}}</template>
      </el-table-column>
      <el-table-column prop="deviceIdentity" label="设备标识" />
      <el-table-column prop="deviceIdentityMd5" label="设备标识md5" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="deviceMac" label="Mac地址" />
      <el-table-column prop="channel" label="渠道" />
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
  deviceList,
  channelList,
  deviceUpdate,
} from "@/api/device/deviceList.js";

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
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      updateData: {
        dcid: "", //设备渠道id,必填
        didArr: [
          //需要更新渠道的设备id数组,必填 @String
        ],
      },

      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0,
        state: 0,
      },
    };
  },
  created() {
    this.deviceListFun();
    this.channelListFun();
  },
  methods: {
    deviceListFun() {
      deviceList({
        page: this.page.page,
        size: this.page.size,
        state: this.page.state,
      }).then((res) => {
        this.tableData = res.list;

        this.page.total = res.total;
        setTimeout(() => {
          this.loading = false;
        }, 50);
      });
    },
    channelListFun() {
      channelList().then((res) => {
        this.options = res;
      });
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.page = 1;
      this.page.size = val;
      this.deviceListFun();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.deviceListFun();
    },
    // 列表选择
    handleSelectionChange(val) {
      this.updateData.didArr = [];
      val.forEach((element) => {
        this.updateData.didArr.push(element.guid);
      });
      // console.log(this.updateData.didArr)
    },
    // 更新设备渠道
    updateFun() {
      if (!this.updateData.dcid) {
        this.$notify({
          title: "请选择设备渠道",
          type: "error",
          duration: 2500,
        });
      } else if (this.updateData.didArr.length == 0) {
        this.$notify({
          title: "请选择设备",
          type: "error",
          duration: 2500,
        });
      } else {
        deviceUpdate(this.updateData).then((res) => {
          this.$notify({
            title: "更新成功",
            type: "success",
            duration: 2500,
          });
        });
      }
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
</style>