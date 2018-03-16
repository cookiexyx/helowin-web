import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import { API_CONFIG } from '@/utils/config'
import '@/icons' // icon
import '@/permission' // 权限

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$http = axios
// 接口
Vue.prototype.API_CONFIG = API_CONFIG

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
