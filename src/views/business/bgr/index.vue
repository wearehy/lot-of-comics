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
    <el-table ref="table" v-permission="['/bgr']" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60px" sortable />
        <el-table-column prop="week" label="周数" width="50px" sortable/>
        <el-table-column prop="day" label="天数" width="50" sortable/>
        <el-table-column prop="baby_article" label="标题" sortable/>
        <el-table-column prop="baby_size" label="宝宝尺寸" width="100px" sortable/>
        <el-table-column prop="growth_descirbe" label="成长描述" sortable/>
        <el-table-column prop="img" label="图片" sortable>
          <template slot-scope="scope">
                <img :src="scope.row.img ? scope.row.img : defaultPic" width="50%" class="avatar">
          </template>
        </el-table-column>
        <el-table-column prop="baby_video_url" label="视频" sortable>
          <template slot-scope="scope">
                <video :src="scope.row.baby_video_url" controls height="160px"></video>
          </template>
        </el-table-column>
        <el-table-column prop="cchao" label="彩超" sortable>
          <template slot-scope="scope">
                <img :src="scope.row.cchao ? scope.row.cchao : defaultPic" width="50%" class="avatar">
          </template>
        </el-table-column>
        <el-table-column prop="bchao" label="B超" sortable>
          <template slot-scope="scope">
                <img :src="scope.row.bchao ? scope.row.bchao : defaultPic" width="50%" class="avatar">
          </template>
        </el-table-column>

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
import {bgr} from '@/api/business/bgr'
import defaultPic from '@/assets/images/default.jpg'


export default {
  name: 'Bgr',
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
      this.bgrList(this.page.page,this.page.size)
  },
  methods: {
    bgrList(page,size){
      bgr({page:page,size:size}).then(res => {
        this.tableData = res.data
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
      this.bgrList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.bgrList(val, this.page.size);
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