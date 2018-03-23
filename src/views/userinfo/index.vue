<template> 
<el-container class="data-source">
  <el-main>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane  label="个人信息"  name="first">
      <!-- 头像 -->
      <!-- <input type="file" name="header_img" accept="/static/images/yonghutouxiang.png"> -->
      <!-- <a href="#"><img src="/static/images/yonghutouxiang.png" class="avater"></a> -->
     <el-upload
        class="avatar-uploader"
        :action="importFileUrl"
        :data="upLoadData"
        :show-file-list="false"
         with-credentials:true
        :onError="uploadError"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
       <!-- 表单 --> 
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px"  >
        <el-form-item label="姓 名" prop="name" label-width="ruleFome">
           <el-input v-model="ruleForm.name" ></el-input>
       </el-form-item>
   
        <el-form-item label="账 号" label-width="ruleFome">
             <el-input placeholder="账户只能一个写死" v-model="ruleForm.input" :disabled="true"  ></el-input>      
        </el-form-item>

          <el-form-item label="电 话" label-width="ruleFome" >
             <el-input  placeholder="账户只能一个写死" v-model="ruleForm.input"></el-input>      
        </el-form-item>

          <el-form-item label="角 色" label-width="ruleFome">
             <el-input placeholder="账户只能一个写死" v-model="ruleForm.input" :disabled="true"  ></el-input>      
        </el-form-item>
       
        <el-form-item label="机 构" label-width="ruleFome">
             <el-input placeholder="账户只能一个写死" v-model="ruleForm.input" :disabled="true" ></el-input>      
        </el-form-item>
          
         <el-form-item >
           <el-button type="primary" @click="submitForm1(ruleForm)" class="button1" >确 定</el-button>
         </el-form-item>
      </el-form>    
    </el-tab-pane>
   
    <el-tab-pane label="修改密码" name="second">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2"  class="user-form">
            <el-form-item label="请输入旧密码" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="请输入新密码" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="请确认新密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')" class="button2">提交</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
  </el-tabs>
</el-main>
</el-container>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      importFileUrl: 'http://192.168.99.36:80/visualize/user/upload_avatar',
      // 请求跨域了，后台需要配置CORS
      // spring mvc 4.2添加的注解，在controller上使用
      // @CrossOrigin(origins = "http://localhost:8080", maxAge = 3600)
      // 接受来自http://localhost:8080的资源请求
      upLoadData: {
        userId: ''
      },
      ruleForm: {
        id: '',
        name: 'admin',
        input: 'passmin'
      },
      ruleFome: '200px',
      imageUrl: '',
      rules: {
        name: [
          {
            // required: true,
            trigger: 'blur',
            min: 3,
            max: 6,
            message: '长度在 3 到 6 个字符'
          }
        ]
      },
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      activeName: 'first',
      labelPosition: 'right',
      rules2: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 修改用户名
    submitForm1(scope) {
      var self = this
      this.$http
        .post('/visualize/user/update_personal_info', {
          id: scope.id,
          name: scope.name
        })
        .then(function(response) {
          console.log(response)
          alert('提交成功')
        })
        .catch(function(err) {
          self.$message.error(err)
        })
    },
    // 用户头像上传
    handleAvatarSuccess(response, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log('上传文件', response, file.name)
    },
    uploadError(response, file) {
      console.log('上传失败，请重试！')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.button1 {
  margin-left: 230px;
}
.button2 {
  margin-left: 310px;
}
.avater {
  width: 140px;
  height: 140px;
  margin-bottom: 60px;
  margin-left: 150px;
  border-radius: 50%;
  display: block;
}

.el-form-item {
  height: 80px;
  width: 380px;
  margin: auto;
  margin-bottom: 10px;
}
// 用户头像上传
.avatar-uploader {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  background-image: url('/static/images/yonghutouxiang.png');
  overflow: hidden;
  margin: 20px auto;
}
.el-upload {
  // border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: rgba($color: #fff, $alpha: 0);
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.el-tabs__nav-scroll {
  display: table;
  margin: 0 auto;
}
.el-tabs__nav {
  float: inherit;
}
.el-tabs__item {
  font-size: 16px;
}
.el-tabs__active-bar {
  width: 64px;
}
</style>
