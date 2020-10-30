<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
          <el-input :disabled="$permissionButton('/recomCateList/search')"  v-model="search.title" size="small" clearable placeholder="合辑名称" style="width: 200px;" class="filter-item" />
          <el-select :disabled="$permissionButton('/recomCateList/search')" v-model="search.cate_id" placeholder="请选择所属分类" style="margin-bottom:10px;vertical-align: middle;">
            <el-option
              v-for="item in cates"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <span>
            <el-button :disabled="$permissionButton('/recomCateList/search')" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button :disabled="$permissionButton('/recomCateList/search')" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="refresh">重置</el-button>
          </span>
        </div>
        <div class="crud-opts">
    
        <el-button-group class="crud-opts-right">
          <el-button
            size="mini"
            icon="el-icon-refresh"
            @click="refresh()"
          />
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <el-table ref="table" v-permission="['/recomCateList']" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60px" sortable align="center"/>
        <el-table-column prop="title" label="名称" sortable align="center"/>
        <el-table-column prop="thumb" label="合辑封面" sortable>
            <template slot-scope="scope">
                <img :src="scope.row.thumb ? scope.row.thumb : defaultPic" :width="60" class="avatar">
            </template>
        </el-table-column>
        <el-table-column prop="cate" label="所属分类" sortable align="center"/>
        <el-table-column prop="listorder" label="排序" sortable  align="center">
            <template scope="scope">
              <el-input-number v-model="scope.row.listorder" :min="0" :max="999" controls-position="right" placeholder="默认按升序" @change="handleSort(scope.row.id,scope.row.listorder)"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column prop="display"  label="状态" sortable align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.display"
                :active-value="parseInt(1)" 
                :inactive-value="parseInt(0)"
                active-color="#13ce66"
                inactive-color="#F56C6C"
                @change="changeStatus(scope.row.id, scope.row.display)"
              />
            </template>
        </el-table-column>
        <el-table-column width="135px" prop="createTime" label="创建日期" sortable align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
            <el-button :disabled="$permissionButton('/recomCateList/del')"  size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" />
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
import {recomCateList,del,changeRecomCateStatus,search,cates,sort} from '@/api/business/homeRecomCateList'
import defaultPic from '@/assets/images/default.jpg'

export default {
  name: 'homeRecomCate',
  inject:['reload'],
  data() {
    return {
      loading:true,
      tableData:[],
      defaultPic:defaultPic,
      cates:[],
      search:{
        title:"",
        cate_id:"",
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created(){
      localStorage.setItem('page',1)
      this.catesList()
      this.recomCateList(this.page.page,this.page.size)
  },
  methods: {
    recomCateList(page,size){
      recomCateList({page:page,size:size}).then(res => {
        this.tableData = res.data
        // this.page.page = res.page
        // this.page.size = res.size
        this.page.total = res.total
        setTimeout(()=>{
          this.loading =false
        },50)
        
      })
    },
    catesList(){
      cates().then(res=>{
        this.cates = res.list
      })
    },
    // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      const page = localStorage.getItem('page')?localStorage.getItem('page'):1
      this.recomCateList(page, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      localStorage.setItem('page',val)
      this.recomCateList(val, this.page.size);
    },
    //清除表单
    handelCancel(done){
      this.$refs.form.resetFields();
      this.dialog = false;
      done();
    },
    //删除操作
    handelDel(row){
      this.$confirm(`确定删除这条数据吗？删除后不可恢复哟！！！`,'高危操作',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(()=>{
        del(row.id).then(res => {
            this.$notify({
                title:'删除成功',
                type:'success',
                duration: 1500
            })
            this.recomCateList(this.page.page,this.page.size)
        })
      })

    },
    // 更改状态
    changeStatus(id,display){
        let setDisplay = true;
        setDisplay =  display == 0?false:true;
        changeRecomCateStatus({id:id,display:setDisplay}).then(res=>{
            this.$notify({
                title:'状态更改成功',
                type:'success',
                duration: 1500
            })
            this.recomCateList(this.page.page,this.page.size)
        })
    },
    //搜索
    handleSearch(){
      search({title:this.search.title,cate_id:this.search.cate_id}).then(res=>{
          this.tableData = res.data
          // this.page.page = res.page
          // this.page.size = res.size
          this.page.total = res.total
        })
    },
    refresh(){
          // this.$notify({
          //         title:'刷新成功',
          //         type:'success',
          //         duration: 1500
          //     })
        // this.recomCateList(localStorage.getItem('page'), this.page.size);
        this.reload()
    },
    //排序
    handleSort(id,listorder){
      sort({id:id,listorder:listorder}).then(res=>{
        this.recomCateList(this.page.page,this.page.size)
      })
    }
  }
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: center;
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