<template>
  <el-tabs type="border-card">
    <el-tab-pane>
        <span slot="label"><i class="el-icon-setting"></i> 系统设置</span>
        <el-form ref="form" v-permission="['/system/config']" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="120px">
            <el-form-item label="网站名称" prop="title" required >
            <el-input v-model="form.title" style="width: 40%" />
            <span style="color: #C0C0C0;margin-left: 10px;">管理后台网站的名称</span>
            </el-form-item>
            <el-form-item label="网站Logo" prop="logo" required>
                <el-upload
                        :headers = "myHeaders"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :action="imagesUploadApi"
                        class="upload-demo"
                        style="width:260px"
                    >
                    <!-- <img v-if="form.logo" :src="form.logo" title="点击上传图片" class="avatar" style="width:60px;height:60px"> -->
                    <img  :src="form.logo ? form.logo : defaultPic" title="点击上传图片" class="avatar" style="width:60px;height:60px">
                </el-upload>
            <span style="color: #C0C0C0;margin-left: 10px;">管理后台网站logo</span>
            </el-form-item>
            <el-form-item label="网站域名" prop="web_url" required>
            <el-input v-model="form.web_url" style="width: 40%;" />
            <span style="color: #C0C0C0;margin-left: 10px;">网站域名</span>
            </el-form-item>
            <el-form-item label="附件域名" prop="img_url" required>
            <el-input v-model="form.img_url"  style="width: 40%;" />
            <span style="color: #C0C0C0;margin-left: 10px;">附件域名</span>
            </el-form-item>
            <el-form-item label="文件上传目录" prop="upload_url" required>
            <el-input v-model="form.upload_url" style="width: 40%;" />
            <span style="color: #C0C0C0;margin-left: 10px;">window系统是绝对地址，Linux系统是相对地址</span>
            </el-form-item>
            <el-form-item label="网站备案号" prop="caseNumber" >
            <el-input v-model="form.caseNumber" style="width: 40%;" />
            <span style="color: #C0C0C0;margin-left: 10px;">网站备案号：浙ICP备18005431号</span>
            </el-form-item>
            <el-form-item label="版权信息" prop="copyRight" >
            <el-input v-model="form.copyRight" style="width: 40%;" />
            <span style="color: #C0C0C0;margin-left: 10px;">网站版权信息：© 2019 Zheng Jie</span>
            </el-form-item>
            <el-form-item label="">
            <el-button :disabled="$permissionButton('/system/config/edit')" size="medium" type="primary" @click="doSubmit">保存配置</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
   </el-tabs>
</template>

<script>
import {config,editConfig} from '@/api/system/system'
import defaultPic from '@/assets/images/default.jpg'
import { mapGetters } from 'vuex'
import { getToken } from "@/utils/auth";
const defaultForm = {title:"",logo:"",web_url:"",img_url:"",upload_url:"",caseNumber:"",copyRight:""}
export default {
  name: 'Config',
  data() {
    return {
      myHeaders: {
        Authorization: getToken()
      },
      defaultPic:defaultPic,
      form:defaultForm,
      file_url:'',
      rules: {
        title: [
          { required: true, message: '请填入网站标题', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请上传管理后台网站logo', trigger: 'blur' }
        ],
        web_url: [
          { required: true, message: '请填入网站域名', trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '请填入附件域名', trigger: 'blur' }
        ],
        upload_url: [
          { required: true, message: '请填入文件上传目录', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
    ])
  },
  mounted(){
      this.config()
  },
  methods:{
      config(){
          config().then(res=>{
              this.form = res
              this.file_url = res.img_url
          })
      },
      //监听上传成功
    handleSuccess(response, file, fileList) {
      this.file_url = response.data.file_url
      this.form.logo= response.data.file_url + response.data.filename
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
      doSubmit(){
        this.$refs['form'].validate(valid =>{
          if(valid){
            editConfig(this.form).then(res=>{
                this.$notify({
                    title:'编辑成功',
                    type:'success',
                    duration: 1500
                })
                this.config()
            })
          }else{
                console.log('error submit!!')
                return false
          }
      })
      }
  }
}
</script>

<style scoped>
</style>
