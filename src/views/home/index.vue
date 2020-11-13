<template>
      <el-card>
          <el-tag type="info">网站域名：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">网站目录：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器操作系统：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器端口：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器IP：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">WEB运行环境：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">MySQL数据库版本：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">运行PHP版本：{{ xx }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">最大上传限制：{{ xx }}</el-tag>
      </el-card>
</template>

<script>
//引入echarts 插件
import { getSystemInfo } from "@/api/system/system";
export default {
  data() {
    return {
      xx: 'xx',
      sysinfos: {}
    };
  },
  mounted() {
    // this.getSystemInfo();
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    getSystemInfo() {
      getSystemInfo().then(res => {
        this.sysinfos = res;
      });
    }
  }
};
</script>
