<template>
  <div class="login-container">
     <img class="login_banner" src="/static/images/bg_login.png">  
     <h3 class="title">
        <img class="login_logo" src="/static/images/logo.png">
        区域健康医疗大数据中心
    </h3>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">    
       <el-form-item prop="accountNumber">
        <span class="svg-container svg-container_login">
          <!-- <icon-svg icon-class="yonghuming" /> -->
          <img src="/static/images/icon_login_user.png" class="mima">
        </span>
        <el-input name="accountNumber" type="text" v-model="loginForm.accountNumber" autoComplete="on" placeholder="邮箱" />
      </el-form-item>
      
      <el-form-item prop="password">
        <span class="svg-container">
          <!-- <icon-svg icon-class="mima"></icon-svg> -->
          <img src="/static/images/icon_login_password.png" class="mima">
        </span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
      </el-form-item>    
        <el-button type="primary" style="width:100%;" :loading="loading" @click="handleLogin" class="denglu">
          登 录
        </el-button>      
    </el-form>
    <el-dialog
      title="选择角色"
      :visible.sync="dialogVisible"
      width="30%">
        <el-select v-model="value" placeholder="请选择角色" prop="role" class="role-input">
          <el-option
            v-for="(item,index) in roles"
            :key="item.id"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-model="value" type="primary" @click="ensureLogin(value)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  computed: {
    ...mapGetters(['roles','currentRole'])
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      value: '',
      dialogVisible:false,
      loginForm: {
        accountNumber: 'admin',
        password: ''
      },
      // 验证规则
      loginRules: {
        accountNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 用户登陆选则角色
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.dialogVisible = true
              // this.$router.push({ path: '/' })
            })
            .catch((err) => {
              this.loading = false
              this.dialogVisible = false
              this.$message.error('账号密码输入错误');
            })
        } else {
          return false
        }
      })
    },
    // 确定以该角色登陆
    ensureLogin(index){
      if (index === '') {
        this.$message({ message: '请选择一个角色', type: 'warning' });
      }else{
        // console.log(this.roles[index].permissionList)
        this.dialogVisible = false
        // 设置当前角色路由
        this.$store.commit('SET_ROUTERS',this.roles[index].permissionList)
        // 保存当前角色信息
        this.$store.commit('SET_CURRENTROLE',this.roles[index])
        this.$router.push({ path: '/dashboard' })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/mixin.scss';
$bg: #ffffff;
$dark_gray: red;
$light_gray: #505750;
* {
  margin: 0;
  padding: 0;
}
.login-container {
  @include relative;
  height: 100vh;
  background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  .login_banner {
    float: left;
  }
  .title {
    position: absolute;
    color: #ffffff;
    left: 0;
    right: 0;
    margin-top: 220px;
    margin-bottom: 120px;
    text-align: center;
    font-size: 30px;
    font-weight: 400;
    font-family: '微软雅黑';
  }
  .login_logo {
    display: inline-block;
    width: 60px;
    height: 60px;
    vertical-align: middle;
  }
  .mima {
    display: inline-block;
    width: 22px;
    height: 22px;
    padding: 1px 0px;
    margin-left: 4px;
    vertical-align: middle;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 10px 3px 12px 10px;
    color: $light_gray;
    height: 40px;
  }
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
  }
  // .svg-container {
  //   padding: 6px 5px 6px 15px;
  //   color: $dark_gray;
  //   vertical-align: middle;
  //   width: 30px;
  //   display: inline-block;
  //   &_login {
  //     font-size: 20px;
  //   }
  // }

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 480px;
    padding: 35px 35px 15px 35px;
    margin: 410px auto 0 auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #f2f2f2;
    border-radius: 5px;
    color: #454545;
  }
  .denglu {
    height: 40px;
    margin-top: 10px;
  }
  .el-dialog__footer{
    text-align: center;
  }
  .role-input{
    border: 1px solid #cccaca;
    border-radius: 4px;
    width: 100%;
  }
  .el-input--suffix{
    width: 100%;
  }
  .el-dialog__body {
      padding: 30px 30px;
  }
}
</style>
