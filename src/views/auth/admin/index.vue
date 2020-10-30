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
            :disabled="$permissionButton('/admin/add')"
          >
            新增
          </el-button>
        
        </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="handelCancel" :visible.sync="dialog" :title="dialogTitle" width="370px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="登录用户名"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="昵称"/>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
            <el-input v-model="form.password" :placeholder="passwordTips"/>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="角色" prop="role_id">
            <el-select
            v-model="form.role_id"
            style="width: 200px"
            placeholder="请选择"
            required
            >
            <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
            />
            </el-select>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button v-if="btnStatus"  type="primary" @click="addSubmit">保存</el-button>
        <el-button v-else  type="primary" @click="editSubmit">保存</el-button>
        </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-permission="['/admin']"  v-loading="loading" :data="tableData" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="username" label="登录名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column prop="avatar" label="头像" >
            <template slot-scope="scope">
                <img :src="scope.avatar ? scope.avatar : Avatar" :width="40" class="avatar">
            </template>
        </el-table-column>
        <el-table-column prop="loginip" label="登录ip" />
        <el-table-column prop="logintime" label="登录时间" />
        <el-table-column prop="display" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.statusBool"
                active-color="#13ce66"
                inactive-color="#F56C6C"
                @change="changeStatus(scope.row.id, scope.row.statusBool)"
              />
            </template>
        </el-table-column>
        <el-table-column width="135px" prop="create_time" label="创建日期">
            <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
            </template>
        </el-table-column>
        <el-table-column width="135px" prop="update_time" label="修改日期">
            <template slot-scope="scope">
            <span>{{ scope.row.update_time }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
            <el-button :disabled="$permissionButton('/admin/edit')" size="mini" type="primary" icon="el-icon-edit" @click="handelEdit(scope.row)" ></el-button>
            <el-button :disabled="scope.row.id === 1&& $permissionButton('/admin/del')" size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" ></el-button>
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
import {admin, add, edit, del,getAllRole,changeStatus} from '@/api/auth/admin'
import Avatar from '@/assets/images/avatar.png'

const defaultForm = {id:'',username: '',password:'',nickname: '',role_id: ''}
export default {
  name: 'Menu',
  inject:['reload'],
  data() {
    return {
      Avatar: Avatar,
      passwordTips:'默认密码为123456',
      loading:true,
      dialog:false,
      dialogTitle:'',
      btnStatus:true,
      roles: [],
      tableData:[],
      form:defaultForm,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请选择用户角色', trigger: 'change' },
        ],
      },
      page: {
        //分页相关
        page: 1,
        size: 10,
        total: 0
      },
    }
  },
  created(){
      this.adminList(this.page.page,this.page.size)
  },
  methods: {
    adminList(page,size){
      admin({page:page,size:size}).then(res => {
        this.tableData = res.data
        var len = this.tableData.length;
        for(let i=0;i<len;i++){
          this.tableData[i].status == 1?this.tableData[i].statusBool = true: this.tableData[i].statusBool  = false;
        }

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
      this.adminList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.adminList(val, this.page.size);
    },
    //添加表单dialog
    handelAdd() {
      this.dialog = true
      this.dialogTitle ='添加管理员'
      getAllRole().then(res => {
        this.roles = res
      })
    },
    //编辑表单dialog
    handelEdit(row) {
      this.dialog = true
      this.btnStatus = false
      this.passwordTips='修改请填写'
      this.dialogTitle ='编辑管理员'
      

      this.$nextTick(()=>{
          this.form.password = ''
          this.form.id = row.id
          this.form.username = row.username
          this.form.nickname = row.nickname
          this.form.role_id = row.role_id

        getAllRole().then(res => {
        this.roles = res
      })
      })
    },
    //取消并清除字段
    handelCancel(done){
      this.$refs['form'].resetFields()
      this.dialog =false
      done()
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
                this.adminList(this.page.page,this.page.size)
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
                this.adminList(this.page.page,this.page.size)
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
            this.adminList(this.page.page,this.page.size)
        })
      })

    },
    // 更改状态
    changeStatus(id,status){
        changeStatus({id:id,status:status}).then(res=>{
            this.$notify({
                title:'状态更改成功',
                type:'success',
                duration: 1500
            })
            this.adminList(this.page.page,this.page.size)
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