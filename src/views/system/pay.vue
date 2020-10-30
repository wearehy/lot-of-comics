<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="微信APP支付" name="first">
      <el-form v-permission="['/system/pay']" ref="form" :model="form" style="margin-top: 6px;" size="small" label-width="120px">
        <el-form-item label="商户号MCHID" prop="wx_mchid" required >
          <el-input v-model="form.wx_mchid" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">微信分配给您的商户号</span>
        </el-form-item>
        <el-form-item label="APPID" prop="wx_appid" required >
          <el-input v-model="form.wx_appid" style="width: 40%" />
          <span style="color: #C0C0C0;margin-left: 10px;">微信分配给您的APPID</span>
        </el-form-item>
        <el-form-item label="API密钥" prop="wx_key" required >
          <el-input v-model="form.wx_key" type="password" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">微信分配给您的API KEY</span>
        </el-form-item>
        <el-form-item label="">
          <el-button :disabled="$permissionButton('/system/pay/edit')"  size="medium" type="primary" @click="saveConfig()">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="支付宝APP支付" name="second">
      <el-form ref="form" :model="form" style="margin-top: 6px;" size="small" label-width="100px">
        <el-form-item label="appID" prop="al_appid" required>
          <el-input v-model="form.al_appid" style="width: 40%" />
          <span style="color: #C0C0C0;margin-left: 10px;">应用APPID,收款账号既是APPID对应支付宝账号</span>
        </el-form-item>
        <el-form-item label="商户私钥" prop="al_secret_key" required>
          <el-input v-model="form.al_secret_key" type="password" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">商户私钥，你的PKCS8格式RSA2私钥</span>
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="al_public_key" required>
          <el-input v-model="form.al_public_key" type="password" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">支付宝公钥</span>
        </el-form-item>
        <!-- <el-form-item label="回调地址" prop="returnUrl">
          <el-input v-model="form.returnUrl" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">订单完成后返回的地址</span>
        </el-form-item>
        <el-form-item label="异步通知" prop="notifyUrl">
          <el-input v-model="form.notifyUrl" style="width: 40%;" />
          <span style="color: #C0C0C0;margin-left: 10px;">支付结果异步通知地址</span>
        </el-form-item> -->
        <el-form-item label="">
          <el-button :disabled="$permissionButton('/system/pay')" size="medium" type="primary" @click="saveConfig()">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {pay,editPay} from '@/api/system/system'

const defaultForm = {wx_appid:"",wx_mchid:"",wx_key:"",al_appid:"",al_public_key:"",al_secret_key:""}
export default {
  name: 'Pay',
  data() {
    return {
      activeName: 'first',
      form:defaultForm
    }
  },
  mounted(){
      this.pay()
  },
  methods:{
    pay(){
      pay().then(res=>{
        this.form = res
      })
    },
    saveConfig(){
      editPay(this.form).then(res=>{
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
