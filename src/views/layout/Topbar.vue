<template>
   <el-container class="top clearfix">
        <el-col :span="24">
             <router-link class='inlineBlock' to="/">
                <img class="main-logo" src="/static/images/logo.png" alt="">
                <h3 class="text">区域健康医疗大数据中心</h3>
             </router-link>
            <router-link class='inlineBlock' to="/message">
              <img class="message" src="/static/images/xiaoxi.png" alt="">
              <div class="redponit"></div>
            </router-link>
         </el-col>
         
        <el-dropdown  class="avatar-container" trigger="click">
        <div class="avatar-wrapper">  
        <img class="user-avatar" src="/static/images/yonghutouxiang.png" alt="">
                欢迎您：Admin
            <i class="el-icon-caret-bottom"></i>
        </div>

      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class='inlineBlock' to="/userinfo/index">
          <el-dropdown-item>
            个人信息
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided><span @click="logout" style="display:block;">安全退出</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
   </el-container>
</template>

<script>
export default {
  name: 'topbar',
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.top {
  width: 100%;
  height: 60px;
  background-color: #237be4;
  // position: fixed;
  // overflow: hidden;
  .main-logo {
    margin-left: 10px;
    margin-right: 8px;
    width: 40px;
    height: 40px;
    border: 3px;
    vertical-align: middle;
  }
  .text {
    color: aliceblue;
    display: inline-block;
    font-weight: 600;
    margin-top: 20px;
  }
  .message {
    width: 20px;
    height: 20px;
    float: right;
    color: #fff;
    margin-right: 205px;
    margin-top: 26px;
  }
  .redponit {
    // display: none;
    float: right;
    border-radius: 50%;
    margin-right: -10px;
    margin-top: 36px;
    background-color: red;
    width: 7px;
    height: 7px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .user-avatar {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      border: 3px;
    }
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 15px;
      position: relative;
      color: beige;
      .el-icon-caret-bottom {
        right: -20px;
        top: 25px;
        font-size: 10px;
        vertical-align: middle;
      }
    }
  }
}
</style>
