<template>
      <el-card>
          <el-tag type="info">网站域名：{{ sysinfos.url }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">网站目录：{{ sysinfos.document_root }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器操作系统：{{ sysinfos.server_os }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器端口：{{ sysinfos.server_port }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">服务器IP：{{ sysinfos.server_ip }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">WEB运行环境：{{ sysinfos.server_soft }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">MySQL数据库版本：{{ sysinfos.mysql_version }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">运行PHP版本：{{ sysinfos.php_version }}</el-tag>
          <el-divider></el-divider>
          <el-tag type="info">最大上传限制：{{ sysinfos.max_upload_size }}</el-tag>
      </el-card>
</template>

<script>
//引入echarts 插件
import { getSystemInfo } from "@/api/system/system";
export default {
  data() {
    return {
      sysinfos: {}
    };
  },
  mounted() {
    this.getSystemInfo();
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
