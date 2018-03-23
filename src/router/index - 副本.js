/*
路由控制页面
*/
import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
* hidden: true                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)
* redirect: noredirect           //当设置 noredirect 的时候该路由不会在面包屑导航中出现
* name:'router-name'             //设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
* alwaysShow: true             //当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜单
                               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式。只有一个时会将那个子路由当做根路由
* meta : {
    roles: ['admin','editor']     //设置该路由进入的权限，支持多个权限叠加
    title: 'title'                //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'            //设置该路由的图标
    noCache: true               //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
  }

* 如果页面上面需要导航栏，这里的name和要根绝路由显示的页面export default{的中的name要一致}
**/

// 不需要权限验证的路由，都可以访问的
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    name: '消息管理',
    hidden: true,
    children: [
      {
        path: 'message',
        component: _import('message/index'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: '统计分析',
    icon: 'zujian',
    children: [
      {
        path: 'index',
        name: 'Form',
        icon: 'zonghe',
        component: _import('page/form')
      }
    ]
  },
  {
    path: '/table',
    component: Layout,
    redirect: 'noredirect',
    name: '仪表盘',
    icon: 'zonghe',
    children: [
      {
        path: 'index',
        name: '经营1',
        component: _import('page/form'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/mcy',
    component: Layout,
    redirect: 'mcy',
    icon: 'wujiaoxing',
    name: '驾驶舱',
    // noDropdown: true,
    children: [
      {
        path: 'manage',
        name: '经营',
        component: _import('mcy/manage'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/Ferformance',
    component: Layout,
    redirect: 'ferformance',
    icon: 'email',
    name: '绩效考核',
    // noDropdown: true,
    children: [
      {
        path: 'kpim',
        name: '绩效指标管理',
        component: _import('ferformance/kpim'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/Dataset',
    component: Layout,
    redirect: 'dataset',
    icon: 'icons',
    name: '数据设置',
    noDropdown: true,
    children: [
      //  { path: 'datasource', name: '数据源管理', component: _import('dataset/datasource'), meta: { role: ['admin'] }},
      {
        path: 'tablemanager',
        name: '数据表管理',
        component: _import('dataset/tablemanager'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/systemset',
    component: Layout,
    redirect: 'systemset',
    icon: 'EXCEL',
    name: '系统设置',
    // noDropdown: true,
    children: [
      {
        path: 'usermanger',
        name: '用户管理',
        component: _import('systemset/usermanger'),
        meta: { role: ['admin'] }
      },
      {
        path: 'rolesmanger',
        name: '角色管理',
        component: _import('systemset/rolesmanger'),
        meta: { role: ['admin'] }
      },
      {
        path: 'rulesmanger',
        name: '规则管理',
        component: _import('systemset/rulesmanger'),
        meta: { role: ['admin'] }
      },
      {
        path: 'authoritymanager',
        name: '权限管理',
        component: _import('systemset/authoritymanager'),
        meta: { role: ['admin'] }
      },
      {
        path: 'rolesandauthority',
        name: '角色权限关系管理',
        component: _import('systemset/rolesandauthority'),
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/userinfo',
    component: Layout,
    redirect: 'noredirect',
    icon: 'xinrenzhinan',
    // name: '个人信息',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: '个人信息',
        component: _import('userinfo/index'),
        meta: { role: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步验证的路由
export const asyncRouterMap = [
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'Example',
  //   icon: 'zujian',
  //   children: [
  //     { path: 'index', name: 'Form', icon: 'zonghe', component: _import('page/form') }
  //   ]
  // },

  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'Table',
  //   icon: 'tubiao',
  //   children: [{ path: 'index', name: 'Form', component: _import('page/form'), meta: { role: ['admin'] }}]
  // },
  // {
  //   path: '/mcy',
  //   component: Layout,
  //   redirect: '/mcy/index',
  //   icon: 'weixin',
  //   noDropdown: true,
  //   children: [{ path: 'index', name: 'Mcy', component: _import('mcy/index'), meta: { role: ['admin'] }}]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   // alwaysShow: true,
  //   meta: { roles: ['admin', 'edior'] }, // 你可以在根组件中设置角色
  //   children: [{
  //     path: 'index',
  //     component: _import('permission/index'),
  //     name: 'Permission',
  //     meta: {
  //       title: '管理员',
  //       icon: 'lock',
  //       role: ['admin']// 你也可以在子组件中设置角色
  //     }
  //   }]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
