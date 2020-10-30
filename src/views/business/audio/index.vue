<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
        <!-- 搜索 -->
        <div>
          <el-input  :disabled="$permissionButton('/audio/search')"  v-model="searchTitle" size="small" clearable placeholder="音频名称" style="width: 200px;" class="filter-item" />
          <!-- <el-date-picker
            :default-time="['00:00:00','23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="height:30.5px"
          /> -->
          <span>
            <el-button  :disabled="$permissionButton('/audio/search')"  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button  :disabled="$permissionButton('/audio/search')"  class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="refresh">重置</el-button>
          </span>
        </div>
      <div class="crud-opts">
        <el-button-group class="crud-opts-left">
          <el-button
            :disabled="$permissionButton('/audio/add')"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handelAdd"
          >
            新增
          </el-button>
        
        </el-button-group>
        <el-button-group class="crud-opts-right">
          <el-button
            size="mini"
            icon="el-icon-refresh"
            @click="refresh()"
          />
    </el-button-group>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="handelCancel" :visible="dialog" :title="dialogTitle" width="670px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="音频标题" prop="title" required >
            <el-input v-model="form.title" style="width:390px"/>
          </el-form-item>
          <el-form-item label="所属合辑" prop="album_id" required>
            <el-cascader v-model="form.album_id" :options="albums" filterable clearable :show-all-levels="false" @change="handleChange" style="width: 390px;" placeholder="选择所属合辑" >
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="封面图" prop="thumb" required>
            <img :src="form.thumb ? form.thumb : defaultPic" title="点击上传图片" class="avatar" style="width:140px;height:140px">
            <cropper :share="shareF" @feedback="feedbackF"></cropper>
          </el-form-item>
          <el-form-item label="音频文件" prop="url" required>
            <el-upload
                  :headers = "myHeaders"
                  :show-file-list="false"
                  :on-success="handleFileSuccess"
                  :on-error="handleError"
                  :action="imagesUploadApi"
                  class="upload-demo"
                  style="width:260px"
              >
                  
                  <audio v-if="form.url" :src="form.url" controls="controls" style="height:34px"></audio>
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
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
    <el-table ref="table" v-permission="['/audio']" v-loading="loading" :data="tableData" :default-sort="{prop: 'id', order: 'descending'}">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" sortable width="60px" align="center"/>
        <el-table-column prop="album" label="所属合辑" sortable align="center"/>
        <el-table-column prop="title" label="名称" sortable align="center"/>
        <el-table-column prop="thumb" label="封面图" sortable align="center">
            <template slot-scope="scope">
                <img :src="scope.row.thumb ? scope.row.thumb : defaultPic" :width="40" class="avatar">
            </template>
        </el-table-column>
        <el-table-column prop="url" label="音频" sortable width="170px" align="center">
            <template slot-scope="scope">
                <audio :src="scope.row.url" controls="controls" style="width:145px;height:34px"></audio>
            </template>
        </el-table-column>
        <el-table-column prop="time_length" label="时间" sortable align="center" />
        <el-table-column prop="listorder" label="排序" align="center" sortable>
            <template scope="scope">
              <el-input-number v-model="scope.row.listorder" :min="0" :max="999" controls-position="right" placeholder="默认按升序" @change="handleSort(scope.row.id,scope.row.listorder)"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column prop="play_num" label="播放量" sortable  align="center"/>
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
        <el-table-column width="135px" prop="create_time" label="创建日期" sortable align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
            <el-button :disabled="$permissionButton('/audio/edit')" size="mini" type="primary" icon="el-icon-edit" @click="handelEdit(scope.row)" />
            <el-button :disabled="$permissionButton('/audio/del')"  size="mini" type="danger" icon="el-icon-delete" @click="handelDel(scope.row)" />
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
import {audio, search,add, edit, del,changeStatus,sort} from '@/api/business/audio'
import {cateAlbum} from '@/api/business/album'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import defaultPic from '@/assets/images/default.jpg'
import { mapGetters } from 'vuex'
import { getToken } from "@/utils/auth";

import cropper from "@/components/vueCropper";

const defaultForm = {id:'',title: '',album_id:[],thumb: '',url: '',display:true,listorder: 999};

export default {
  name: 'Audio',
  inject:['reload'],
  components: { Treeselect , cropper },
  data() {
    return {
      myHeaders: {
        Authorization: getToken()
      },
      searchTitle:"",
      defaultPic: defaultPic,
      loading:true,
      dialog:false,
      dialogTitle:'',
      btnStatus:true,
      file_url:'',
      albums:[],
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
          { required: true, message: '请输入标题/名称', trigger: 'blur' },
        ],
        album_id: [
          { required: true, message: '请选择所属合辑', trigger: 'blur' },
        ],
        thumb: [
          { required: true, message: '请上传封面图', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请上传音频文件', trigger: 'blur' },
        ]
      },
      shareF: {
        // 裁剪
       
      },
    }
  },
  created(){
      this.audioList(this.page.page,this.page.size)
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
    ])
  },
  methods: {
    audioList(page,size){
      audio({page:page,size:size}).then(res => {
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
      this.audioList(1, val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page.page = val;
      this.audioList(val, this.page.size);
    },
    //级联选择器改变选项事件
    handleChange(value){
      this.form.album_id = value
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.file_url = response.data.file_url

      this.form.thumb= response.data.file_url + response.data.filename
    },
    //监听文件上传成功
    handleFileSuccess(response, file, fileList) {
      this.file_url =  response.data.file_url

      this.form.url = response.data.file_url + response.data.filename
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    //添加表单dialog
    handelAdd() {
      this.dialog = true
      this.dialogTitle ='添加音频'
      cateAlbum().then(res => {
        this.albums = res
      })
    },
    //编辑表单dialog
    handelEdit(row) {

      this.dialog = true
      this.dialogTitle ='编辑音频'
      this.btnStatus = false

      this.$nextTick(() => {
        const {id, album_id, title, url, listorder, display, thumb} = row;
        this.form = {id, album_id, title, url, listorder, display, thumb};
        cateAlbum().then(res => {
          this.albums = res
        })
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
                this.audioList(this.page.page,this.page.size)
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
                this.audioList(this.page.page,this.page.size)
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
            this.audioList(this.page.page,this.page.size)
        })
      })

    },
    // 更改状态
    changeStatus(id,display){
        changeStatus({id:id,display:display}).then(res=>{
            this.$notify({
                title:'状态更改成功',
                type:'success',
                duration: 1500
            })
            this.audioList(this.page.page,this.page.size)
        })
    },  
     //搜索 
    handleSearch(){
      search({title:this.searchTitle}).then(res=>{
        this.tableData = res.data
        // this.page.page = res.page
        // this.page.size = res.size
        this.page.total = res.total
      })
    },
    refresh(){
      this.reload()
    },
    //排序
    handleSort(id,listorder){
      sort({id:id,listorder:listorder}).then(res=>{
        this.audioList(this.page.page,this.page.size)
      })
    },
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.form.thumb = res.file_url + res.filename;
      });
    },
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