<template>
    <div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="resetForm">
            <el-form :model="form" :rules="rules2" ref="form">
                <el-form-item label="选择机构" :label-width="formLabelWidth" prop="orgValue">
                    <el-select v-show="form.editType == false" v-model="form.orgValue" placeholder="请选择机构">
                        <el-option 
                            v-for="item in orgOptions" 
                            :key="item.id" 
                            :value="item.id" 
                            :label="item.name">
                        </el-option>
                    </el-select>
                    <span v-show="form.editType == true">{{form.orgName}}</span>
                </el-form-item>
                <el-form-item label="录入员工姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" v-show="form.editType == false" auto-complete="off" placeholder="请输入员工姓名" :maxlength="30"></el-input>
                    <span v-show="form.editType == true">{{form.name}}</span>
                </el-form-item>    
                <el-form-item label="注册账号" :label-width="formLabelWidth" prop="accountNumber">
                    <el-input v-model="form.accountNumber" auto-complete="off" placeholder="填写电子邮箱" v-show="form.editType == false"></el-input>
                    <span v-show="form.editType == true">{{form.accountNumber}}</span>
                </el-form-item>     
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" type="password" auto-complete="off" placeholder="输入密码"></el-input>
                </el-form-item>   
                <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
                    <el-input v-model="form.checkPass" type="password" auto-complete="off" placeholder="确认密码"></el-input>
                </el-form-item> 
                <el-form-item label="用户角色" :label-width="formLabelWidth" prop="roles">
                    <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
                    <el-checkbox-group v-model="form.roles" @change="handleCheckedRolesChange">
                        <el-checkbox style="margin-right:15px" 
                            v-for="role in roleList" 
                            :label="role.id"
                            :key="role.id"
                            name="roles"
                            >{{role.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item> 
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phoneNumber">
                    <el-input v-model="form.phoneNumber" auto-complete="off" placeholder="填写正确的电话号码"></el-input>
                </el-form-item>                  
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm(form)">取 消</el-button>
                <el-button type="primary" @click="commitForm(form)">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { validatePhone } from '@/utils/validate'

export default {
  name:'addNewUser',
  data(){
    // 表单验证
    const validatePass = (rule, value, callback) => {
        if (value === '') {
         callback(new Error('请输入密码'));
        } else if( value.length <= 5){
         callback(new Error('密码不得小于6位'));
        }else{
        if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
        }
         callback();
        }
    }
    const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    }

    return {
        // 验证规则
        rules2:{
            password:[
                { required: true, validator: validatePass }
            ],
            checkPass: [
                { required: true, validator: validatePass2 }
            ],
            orgValue: [
                { required: true, message: ' ', trigger: 'change' }
            ],
            name:[
                { required: true, type: 'string', message: '输入员工姓名' }
            ],
            accountNumber:[
                { required: true, message: '请输入账号' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            roles:[
                { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
            ],
            phoneNumber:[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
            ]
        },
        title:'新增用户',
        orgOptions:[],
        dialogFormVisible: false,
        // checkbox
        roleList: [],
        // 全选
        isIndeterminate: true,
        checkAll: false,
        form: {
            id:'',
            name: '',
            accountNumber:'',
            password:'',
            checkPass:'',
            roles: [],
            editType: false,
            orgId:'',
            orgName:'',
            orgValue: ''
        },
        formLabelWidth: '120px'
    }
  },
  methods: {
        show() {
            this.title = '新增用户'
            this.form.editType = false
            this.dialogFormVisible = true
            this.queryRoleList()
            // 查询所有机构
            this.$http.post( this.API_CONFIG.orgsList, {})
                .then((response) => {
                    this.orgOptions = response.data.data.organizationList
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        // 查询所有角色
        queryRoleList(){
            this.$http.post('/visualize/role/list_roles', {})
                .then((response) => {
                    this.roleList = response.data.data.roleList
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        // 编辑表单
        editForm(scope,form) {
            let roleIds = [] 
            this.title = '编辑用户'
            this.queryRoleList()
            scope.roleList.forEach(function(item) {
                roleIds.push(item.id)
            })
            // console.log(roleIds)
            this.form = {
                editType: true,
                id:scope.id,
                name: scope.name,
                orgValue:scope.org.id,
                orgName:scope.org.name,
                accountNumber: scope.accountNumber,
                password: scope.password,
                checkPass: scope.password,
                roles:roleIds,
                phoneNumber: scope.phoneNumber
            }
            
            this.dialogFormVisible = true;
        },

        // 复选
        handleCheckedRolesChange(value) {
            // console.log(value)
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.roleList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
        },

        // 重置表单
        resetForm(form) {
            this.dialogFormVisible = false    
            this.$refs.form.resetFields();       
            this.form = {
                name: '',
                accountNumber: '',
                password: '',
                checkPass: '',
                phoneNumber: '',
                orgValue:'',
                orgId:'',
                roles:[]
            }
        },


        // 新增or编辑用户提交表单
        commitForm(form) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let roleIds = []     
                    let urlPath = ''
                
                    // console.log(form.roles)
                    // form.roles.forEach(function(item) {
                    //     roleIds.push(item.id)
                    // })

                    if(this.form.editType == false){
                        // 新增用户
                        urlPath = '/visualize/user/add_user'
                    }else{
                        // 编辑用户
                        urlPath = '/visualize/user/update_user'
                    }
                    this.$http.post(urlPath, {
                        id: form.id,
                        name: form.name,
                        accountNumber: form.accountNumber,
                        password: form.password,
                        phoneNumber:form.phoneNumber,
                        orgId: form.orgValue,
                        roleIds:form.roles
                    })
                    .then((res) => {
                        this.dialogFormVisible = false;
                        this.resetForm();
                        // location.reload();
                        this.$parent.fetchData()
                    })
                    .catch((err) => {
                        console.log(err)
                    }); 
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
          
        }     
    },
  props:[]
}
</script>
<style>
    .el-checkbox+.el-checkbox {
        margin-left: 0px;
    }
    .dialog-footer{
        text-align: center;
    }
    .dialog-footer .el-button{
        width: 150px;
    }
    .el-dialog--small {
        width: 34%;
    }
</style>


