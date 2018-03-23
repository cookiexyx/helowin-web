import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import echarts from 'echarts'
import { API_CONFIG } from '@/utils/config'
import '@/icons' // icon
import '@/permission' // 权限
import fetch_http from '@/utils/fetch_http'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.prototype.$echarts = echarts
Vue.prototype.API_CONFIG = API_CONFIG // 接口

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
