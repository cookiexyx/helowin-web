<!-- 线上将children改为childrenList -->
<template>
  <div>
    <template v-for="item in routes">
      <!-- 无下拉菜单 -->
      <router-link v-if="item.childrenList.length == 1" :to="item.path+'/'+item.childrenList[0].path">
        <el-menu-item :index="item.path+'/'+item.childrenList[0].path">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.childrenList[0].name}}
        </el-menu-item>
      </router-link>
      <!-- 有下拉菜单 -->
      <el-submenu :index="item.name" v-if="item.childrenList.length > 1">
        <template slot="title">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.name}}
        </template>
        <template v-for="child in item.childrenList">
          <sidebar-item class='menu-indent' v-if='child.childrenList&&child.childrenList.length>0' :routes='[child]'> </sidebar-item>
          <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.name}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>


<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  created() {
    // this.routes.forEach( item => {
    //   console.log(item.path)
    // })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.svg-icon {
  margin-right: 10px;
  // margin-left: 15px;
}
.hideSidebar {
  display: block;
  text-indent: 10px;
}
.menu-indent {
  display: block;
  text-indent: 10px;
}
</style>
