<template>
    <div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="saveForm" >
 
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                <el-input v-show="ruleForm.editType == false" v-model="ruleForm.name"  placeholder="请填写角色名称" ></el-input>
                 <span v-show="ruleForm.editType == true">{{ruleForm.name}}</span>
                </el-form-item>
 
                <el-form-item label="管理操作范围" :label-width="formLabelWidth" prop="type" >
                <el-select v-model="ruleForm.type" placeholder="请选择管理范围" >
                    <el-option value="全部" ></el-option>
                    <el-option value="本机构及下属机构" ></el-option>
                    <el-option value="本机构" ></el-option>
                    <el-option value="本科室" ></el-option>
                    <!-- <span v-show="ruleForm.editType == true">{{ruleForm.type}}</span> -->
                </el-select>                 
                </el-form-item>
              
                  <el-form-item label="说明" :label-width="formLabelWidth" prop="description">
                  <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="ruleForm.description">
                </el-input>
               </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm(ruleForm)">取 消</el-button>
                <el-button type="primary" @click="roleCommit('saveForm',ruleForm)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

import { validatePhone } from '@/utils/validate'
<script>
export default {
  name: 'addNewRole',
  data() {
    return {
      title: '新增用户',
      dialogFormVisible: false,
      ruleForm: {
        id: '',
        name: '',
        type: '',
        description: '',
        editType: false
      },
      rules: {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择管理范围', trigger: 'change' }
        ],
        description: [
          { required: false, message: '请填写说明', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    show() {
      this.title = '新增用户'
      this.ruleForm.editType = false
      this.dialogFormVisible = true
    },
    editForm(scope, ruleForm) {
      this.title = '编辑用户'
      this.ruleForm = {
        editType: true,
        id: scope.id,
        name: scope.name,
        type: scope.type,
        description: scope.description
      }
      this.dialogFormVisible = true
    },
    resetForm(ruleForm) {
      this.dialogFormVisible = false
      this.ruleForm = {
        name: '',
        type: '',
        description: ''
      }
    },
    // 提交表单
    roleCommit(formName, ruleForm) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var self = this
          let urlPath = ''
          if (this.ruleForm.editType === false) {
            // 新增用户
            urlPath = '/visualize/role/add_role'
          } else {
            // 编辑用户
            urlPath = '/visualize/role/update_role'
          }
          this.$http
            .post(urlPath, {
              id: ruleForm.id,
              name: ruleForm.name,
              type: ruleForm.type,
              description: ruleForm.description
            })
            .then(function(response) {
              self.dialogFormVisible = false
              // console.log(response)
              self.$emit('childMethod')
              self.$message({
                message: '操作成功',
                type: 'success'
              })
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          return false
        }
      })
    }
  },
  props: []
}
</script>
