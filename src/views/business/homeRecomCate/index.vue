<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/recomCate/add')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
          >
            新增
          </el-button>
        
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="handelCancel" :visible="dialog" :title="dialogTitle" width="670px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类名称" prop="title" required >
            <el-input v-model="form.title"/>
          </el-form-item>
          <el-form-item label="状态" prop="display">
          <el-radio-group v-model="form.display" style="width: 242px;">
                  <el-radio :label="true">显示</el-radio>
                  <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="listorder">
              <el-input-number v-model.number="form.listorder" :min="0" :max="999" controls-position="right" style="width: 178px;" />
          </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
      <el-button v-if="btnStatus" type="primary" @click="addSubmit">保存</el-button>
      <el-button v-else type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
  
    <!--表格渲染-->
    <el-table ref="table" :disabled="$permissionButton('/recomCate')" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" sortable align="center"/>
        <el-table-column prop="title" label="名称" sortable align="center"/>
        <el-table-column prop="listorder" label="排序" sortable  align="center"/>
        <el-table-column prop="display" label="状态" sortable align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.display"
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
            <el-button :disabled="$permissionButton('/recomCate/edit')" size="mini" type="primary" icon="el-icon-edit" @click="handelEdit(scope.row)" />
            <el-button :disabled="$permissionButton('/recomCate/del')"  size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" />
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
import {recomCate, add, edit, del,changeCateStatus} from '@/api/business/homeRecomCate'


const defaultForm = {id:'',title: '',display:true,listorder: 999};

export default {
  name: 'homeRecomCate',
  data() {
    return {
      loading:true,
      dialog:false,
      dialogTitle:'',
      btnStatus:true,
      tableData:[],
      form:defaultForm,
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入首页推荐展示标题', trigger: 'blur' },
        ]
      }
    }
  },
  created(){
      this.recomCateList(this.page.page,this.page.size)
  },
  methods: {
    recomCateList(page,size){
      recomCate({page:page,size:size}).then(res => {
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
      this.recomCateList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.recomCateList(val, this.page.size);
    },

    //添加表单dialog
    handelAdd() {
      this.dialog = true
      this.dialogTitle ='添加推荐分类'
    },
    //编辑表单dialog
    handelEdit(row) {

      this.dialog = true
      this.dialogTitle ='编辑推荐分类'
      this.btnStatus = false

      this.$nextTick(() => {
        const {id, title,listorder, display} = row;
        this.form = {id,title, listorder, display};
      })
    },
    //清除表单
    handelCancel(done){
      this.$refs.form.resetFields();
      this.dialog = false;
      done();
    },
    //添加操作
    addSubmit(){
      this.$refs['form'].validate(valid=>{
          if(valid){
                add(this.form).then(res=>{
                    this.$notify({
                        title:'添加成功',
                        type:'success',
                        duration: 1500
                    })
                    this.$refs['form'].resetFields()
                this.recomCateList(this.page.page,this.page.size)
                this.dialog =false
                })
          }else{
              console.log('error sumbmit')
              return false
          }
      })
      
    },
    //编辑操作
    editSubmit(){
      this.$refs['form'].validate(valid =>{
          if(valid){
            edit(this.form).then(res=>{
                this.$notify({
                    title:'编辑成功',
                    type:'success',
                    duration: 1500
                })
                this.$refs['form'].resetFields()
                this.recomCateList(this.page.page,this.page.size)
                this.dialog =false
            })
          }else{
                console.log('error submit!!')
                return false
          }
      })
      
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
        changeCateStatus({id:id,display:display}).then(res=>{
            this.$notify({
                title:'状态更改成功',
                type:'success',
                duration: 1500
            })
            this.recomCateList(this.page.page,this.page.size)
        })
    }
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