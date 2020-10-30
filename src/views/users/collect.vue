<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table ref="table" v-permission="['/users/collect']" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60px" sortable />
        <el-table-column prop="username" label="用户" sortable/>
        <el-table-column prop="aid" label="收藏ID"  sortable/>
        <el-table-column prop="title" label="标题"  sortable/>
        <el-table-column prop="type" label="类型" sortable>
            <template slot-scope="scope">
                <el-tag v-if="scope.type === 1" type="success">合辑</el-tag>
                <el-tag v-else type="info">音频</el-tag>
            </template>
        </el-table-column>
     
        <el-table-column prop="createTime" label="创建时间" sortable/>
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
import {collect} from '@/api/users/users'
import defaultPic from '@/assets/images/default.jpg'


export default {
  name: 'Collect',
  data() {
    return {
      defaultPic:defaultPic,
      loading:true,
      tableData:[],
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },
    }
  },
  created(){
      this.collectList(this.page.page,this.page.size)
  },
  methods: {
    collectList(page,size){
      collect({page:page,size:size}).then(res => {
        this.tableData = res.list
        // this.page.page = res.page
        // this.page.size = res.size
        this.page.total = res.total
        setTimeout(()=>{
          this.loading =false
        },50)
        
      })
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      this.collectList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.collectList(val, this.page.size);
    },

  }
}
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
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }

</style>