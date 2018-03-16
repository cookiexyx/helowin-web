/*
* 权限控制页面
*/

import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import Cookies from 'js-cookie'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log('1')
  // console.log(Cookies.get('Admin-Token'))
  if (getToken()) {
    // console.log('2')
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
        // console.log('3')
        //   if (store.getters.roles.length !== 0) {
        //     store.dispatch('GetInfo').then(res => {
        //       const roles = res.data.role
        //       store.dispatch('GenerateRoutes', { roles }).then(() => {
        //         router.addRoutes(store.getters.addRouters)
        //         next({ ...to })
        //       })
        //     })
        //   } else {
        //     next()
        //   }
      next()
    }
  } else {
    // console.log('4')
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
