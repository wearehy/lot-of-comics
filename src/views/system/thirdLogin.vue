<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="微信三方登录配置" name="first">
      <el-form v-permission="['/system/thirdLogin']" ref="form" :model="form" style="margin-top: 6px;" size="small" label-width="120px">
        <el-form-item label="APP KEY" prop="app_key" required >
          <el-input v-model="form.app_key" style="width: 40%" />
          <span style="color: #C0C0C0;margin-left: 10px;">APP KEY</span>
        </el-form-item>
        <el-form-item label="APP_SECRET" prop="app_secret" required >
          <el-input v-model="form.app_secret" type="password" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">APP_SECRET</span>
        </el-form-item>
        <el-form-item label="">
          <el-button :disabled="$permissionButton('/system/thirdLogin/edit')" size="medium" type="primary" @click="saveConfig()">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {thirdLogin,editThirdLogin} from '@/api/system/system'

const defaultForm = {app_key:"",app_secret:""}
export default {
  name: 'thirdLogin',
  data() {
    return {
      activeName: 'first',
      form:defaultForm
    }
  },
  mounted(){
      this.thirdLogin()
  },
  methods:{
    thirdLogin(){
      thirdLogin().then(res=>{
        this.form = res
      })
    },
    saveConfig(){
      editThirdLogin(this.form).then(res=>{
                this.$notify({
                    title:'编辑成功',
                    type:'success',
                    duration: 1500
                })
                this.pay()
            })
    }
  }
}
</script>

<style scoped>
</style>
