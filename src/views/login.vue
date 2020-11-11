<template>
  <div class="login">
    <vue-particles class="particles-bg"></vue-particles>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="login-form"
    >
      <h3 class="title">{{ title }} 后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img id="codeSrc" @click="getCode" />
        </div>
      </el-form-item>
      <el-form-item prop="rememberMe">
        <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span>{{ copyRight }}</span>
      <span>⋅</span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{
        caseNumber
      }}</a>
    </div>
  </div>
</template>

<script>
import Config from "@/settings";
import { config } from "@/api/system/system";
import { getCodeImg } from "@/api/login";
export default {
  name: "Login",
  data() {
    return {
      title: this.$store.state.settings.title,
      caseNumber: this.$store.state.settings.caseNumber,
      copyRight: this.$store.state.settings.footerTxt,
      loginForm: {
        verify: "", //头部headers
        username: "",
        password: "",
        code: "",
        rememberMe: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.config();
    this.getCode();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.verify = res.verify;
        let codeSrc = `${process.env.VUE_APP_BASE_API}` + "/createVerify";
        let objs = document.getElementById("codeSrc");
        // objs.src = codeSrc;
        objs.src = "data:image/png;base64," + res.image;
      });
    },
    config() {
      config().then((res) => {
        this.title = res.title;
        this.caseNumber = res.caseNumber;
        this.copyRight = res.copyRight;
        // this.loginForm.rememberMe = res.rememberMe;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          code: this.loginForm.code,
          verify: this.verify,
          rememberMe: this.loginForm.rememberMe,
        };

        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", user)
            .then((res) => {
              this.$notify({
                title: "登录成功",
                type: "success",
                duration: 1500,
              });

              this.loading = false;

              // setTimeout(() => {
                this.$router.push({ path: "/" });
                // location.reload();
              // }, 5000);
            })
            .catch((e) => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/bg2.png");
  background-size: cover;
}
.particles-bg {
  position: fixed;
  width: 100%;
  height: 100%;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
