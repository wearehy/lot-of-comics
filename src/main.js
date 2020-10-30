import Vue from 'vue'
import App from './App.vue'
import router from './router/routers'
import store from './store'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'

// 权限指令 (隐藏)
import permission from './components/Permission'
// 权限指令 (传出bool)
import permissionButton from './components/PermissionButton'
Vue.prototype.$permissionButton = permissionButton;

import './assets/styles/element-variables.scss'

// global css
import './assets/styles/index.scss'

import './assets/icons' // icon
import './router/index' // permission control

import VueParticles from 'vue-particles'

//import VueCropper from 'vue-cropper'  //vue-cropper 图片裁剪工具
import VueCropper from '../public/vue-cropper/dist/index.js' //因为做了修改，vue-cropper 放入public

//屏蔽vue-router报错问题
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

import hyUpload from '@/utils/hyUpload.js'
// 字体图
import "./assets/fonts/iconfont.css"
//时间戳
import timestamp from '@/components/time/timestamp.js'
Vue.prototype.$timestamp = timestamp
//秒数倒计时
import second from '@/components/time/second.js'
Vue.prototype.$second = second

Vue.prototype.$hyUpload = hyUpload
Vue.use(VueCropper)
Vue.use(permission)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})
Vue.use(VueParticles)

//vue-video-player
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')