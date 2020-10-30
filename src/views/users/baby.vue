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
    <el-table ref="table" v-permission="['/users/baby']" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60px" sortable />
        <el-table-column prop="username" label="用户" sortable width="200px" />
        <el-table-column prop="nickname" label="宝宝"  sortable width="200px" />
        <el-table-column prop="gender" label="宝宝性别" sortable width="100px">
            <template slot-scope="scope">
                <img v-if="scope.row.gender === 0" :src="Unknown" :width="40" class="avatar">
                <img v-else-if="scope.row.gender === 1" :src="Man" :width="40" class="avatar">
                <img v-else :src="Women" :width="40" class="avatar">
            </template>
        </el-table-column>
        <el-table-column prop="birthday" label="宝宝生日" width="200px" sortable/>
        <el-table-column prop="status" label="默认宝宝" width="200px" sortable>
          <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="danger">是</el-tag>
              <el-tag v-else type="info">否</el-tag>
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
import {baby} from '@/api/users/users'
import defaultPic from '@/assets/images/default.jpg'
import Man from '@/assets/images/man.png'
import Women from '@/assets/images/women.png'
import Unknown from '@/assets/images/unknown.png'


export default {
  name: 'Baby',
  data() {
    return {
      Man: Man,
      Women: Women,
      Unknown: Unknown,
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
      this.babyList(this.page.page,this.page.size)
  },
  methods: {
    babyList(page,size){
      baby({page:page,size:size}).then(res => {
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
      this.babyList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.babyList(val, this.page.size);
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