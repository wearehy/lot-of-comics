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
    <el-table ref="table" :disabled="$permissionButton('/users/edc')"  v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80px" sortable />
        <el-table-column prop="username" label="用户" sortable/>
        <el-table-column prop="idnumber" label="idnumber" sortable/>
        <el-table-column prop="avatar" label="头像" sortable>
            <template slot-scope="scope">
                <img :src="scope.row.avatar ? scope.row.avatar : Avatar" :width="40" class="avatar">
            </template>
        </el-table-column>
        <el-table-column prop="edc" label="预产期" sortable/>
        <el-table-column prop="createTime" label="创建时间" sortable/>
        <!-- <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
            <el-button v-permission="['admin','edc:del']" size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" />
            </template>
      </el-table-column> -->
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
import {edc} from '@/api/users/users'
import Avatar from '@/assets/images/avatar.png'

export default {
  name: 'Feedback',
  data() {
    return {
      Avatar:Avatar,
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
      this.edcList(this.page.page,this.page.size)
  },
  methods: {
    edcList(page,size){
      edc({page:page,size:size}).then(res => {
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
      this.edcList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.edcList(val, this.page.size);
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