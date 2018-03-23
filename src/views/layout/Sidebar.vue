
<template>
  <el-menu 
      mode="vertical"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="$route.path">
    <sidebar-item :routes='roleRouters'></sidebar-item>
  </el-menu>  
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// 实际线上将routers替换成roleRouters
export default {
  components: { SidebarItem },
  computed: {
    // 从store中取数据
    ...mapGetters(['routers'])
  },
  data() {
    return {
      roleRouters: [],
      screenHeight: document.body.clientHeight - 60 // 减去header的60px
    }
  },
  created() {
    // 从localStorage本地存储中获取数据(线上路由)
    this.roleRouters = JSON.parse(window.localStorage.getItem('routers'))
    // 本地路由
    // this.routers.forEach(item => {
    //   item['childrenList'] = item['children']
    //   delete item['children']
    // })
    // console.log(this.routers)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
.app-wrapper .sidebar-container {
  overflow-y: scroll;
}
</style>
