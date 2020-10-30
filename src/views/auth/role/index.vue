<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
            :disabled="$permissionButton('/roles/add')"
          >
            新增
          </el-button>
        
        </el-button-group>
      </div>
    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="handelCancel" :visible.sync="dialog" :title="dialogTitle" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px;" />
        </el-form-item>

        <el-form-item label="描述信息" prop="remark">
          <el-input v-model="form.remark" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="btnStatus"  type="primary" @click="addSubmit">保存</el-button>
        <el-button v-else :disabled="$permissionButton('/admin/menu')"  type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table ref="table" v-permission="['/roles']"  v-loading="loading" highlight-current-row style="width: 100%;" :data="tableData" row-key="id"  @current-change="handleCurrentLineChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="remark" :show-overflow-tooltip="true" label="描述" />
            <el-table-column width="135px" prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button :disabled="$permissionButton('/roles/edit')" size="mini" type="primary" icon="el-icon-edit" @click="handelEdit(scope.row)" />
                <el-button  :disabled="scope.row.id === 1 && $permissionButton('/roles/del')" size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" />
              </template>
          </el-table-column>
          </el-table>
          <!--分页组件-->
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
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never" >
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getAll, add, edit, del,editMenu} from '@/api/auth/role'
import { getMenusTree } from '@/api/auth/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Avatar from '@/assets/images/avatar.png'


export default {
  name: 'Role',
  components: { Treeselect},
  inject:['reload'],
  data() {
    return {
      loading:true,
      dialog:false,
      dialogTitle:'',
      btnStatus:true,
      menus: [],
      tableData:[],
      form:{
        id: '',
        name: '',
        remark: '',
      },
      Avatar: Avatar,
      selections:[],
      defaultProps: { children: 'children', label: 'label' },
      currentId: 0, 
      menuLoading: false, 
      showButton: false,
      menuIds: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },
    }
  },
  created() {
    this.getMenus()
    this.rolesList(this.page.page,this.page.size)
  },
  methods: {
    rolesList(page,size){
      getAll({page:page,size:size}).then(res=>{
          this.tableData = res.data
          // this.page.page = res.page
          // this.page.size = res.size
          this.page.total = res.total
          setTimeout(()=>{
            this.loading =false
          },50)
      })
    },
   getMenus(){
     getMenusTree().then(res => {
        this.menus = res
      })
   },
   // 触发单选
    handleCurrentLineChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        this.showButton = true
        this.menuIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          _this.menuIds.push(data.id)
        })
      }
    },
   // 改变每页显示数量事件
    handleSizeChange(val) {
      this.page.size = val;
      this.rolesList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.rolesList(val, this.page.size);
    },
   //添加表单dialog
    handelAdd() {
      this.dialog = true
      this.dialogTitle ='添加角色'
    },
    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true
      this.dialogTitle ='编辑角色'
      this.btnStatus = false
      
      this.$nextTick(()=>{
        const {id,name,remark} = row
        this.form = {id,name,remark}
      })
    },
    //取消并清除字段
    handelCancel(done){
      this.$refs['form'].resetFields()
      this.dialog =false
      // done()
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
                this.rolesList(this.page.page,this.page.size)
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
                this.rolesList(this.page.page,this.page.size)
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
        this.rolesList(this.page.page,this.page.size)
        })
      })

    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id }
        role.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      
      editMenu(role).then(res=>{
        this.$notify({
          title:'菜单权限分配成功',
          type:'success',
          duration: 1500
        })
        this.menuLoading = false
      })
    },
    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
