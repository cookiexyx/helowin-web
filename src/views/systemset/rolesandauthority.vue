<template>
  <el-container>
    <!-- <el-header>角色权限管理</el-header> -->
    <el-container>
      <el-aside width="300px">
          <el-header>角色列表</el-header>
          <el-row class="tac role-list">
            <el-col :span="24" style="height:100%">
              <el-menu default-active="0" class="el-menu-vertical-demo" style="height:100%">
                <el-menu-item 
                  v-for="(item,index) in data.roleList" 
                  :index="index.toString()"
                  :key="item.id"
                  :id="item.id"
                  :type="item.type"
                  @click="changeRole(item)">
                  <span slot="title">{{item.name}}</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
      </el-aside>
      <el-main>
        <el-tabs type="border-card" @tab-click="changeTab" v-model="activeTab" v-loading="loading">
          <el-tab-pane label="功能权限列表" name="1">
            <RoleFuncAuthority ref="child1"></RoleFuncAuthority>
          </el-tab-pane>
          <el-tab-pane label="仪表盘权限列表" name="2">
            <RoleBoardAuthority ref="child2"></RoleBoardAuthority>
          </el-tab-pane>
          <el-tab-pane label="驾驶舱权限列表" name="3">
            <RoleBoardAuthority ref="child3"></RoleBoardAuthority>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import RoleFuncAuthority from '@/views/systemset/roleFuncAuthority'
import RoleBoardAuthority from '@/views/systemset/roleBoardAuthority'

export default {
  name: 'rolesandauthority',
  components: {
    RoleFuncAuthority,
    RoleBoardAuthority
  },
  data() {
    return {
      data: {},
      activeTab: '1',
      loading: false,
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色信息
    getRoleList() {
      this.$http
        .post(this.API_CONFIG.roleList, {})
        .then(res => {
          this.data = res.data.data
          this.$store.commit('updateRoleId', this.data.roleList[0].id)
          this.$refs.child1.getAuthorityList()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 切换角色时加载不同的信息
    changeRole(socpe) {
      // 更新id
      const currentType = this.$store.state.roleAuthority.type
      this.$store.dispatch('changeRoleId', socpe.id)
      this.loadingViews(currentType)
    },

    // 切换选项卡
    changeTab(tab) {
      // 更新type
      const currentType = tab.name
      this.$store.dispatch('changeTab', currentType)
      this.loadingViews(currentType)
    },
    // 加载不同视图
    loadingViews(type) {
      switch (type) {
        case '1':
          this.$refs.child1.getAuthorityList()
          break
        case '2':
          this.$refs.child2.getRoleBoardAuthority(type)
          break
        case '3':
          this.$refs.child3.getRoleBoardAuthority(type)
          break
      }
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  padding: 15px;
}

.role-list {
  min-height: 500px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-main {
  line-height: 0px;
}
.el-checkbox {
  float: left;
}
.save-button {
  width: 160px;
  float: left;
  margin-left: 5%;
}
.el-menu-item {
  text-align: left;
}
/* .el-tabs__nav{
    height: 39px;
  } */
</style>
