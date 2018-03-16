<template>
  <div>
    <el-dialog title="数据库设置" :visible.sync="dialogFormVisible">
      <el-form :model="dbsetForm" :rules="rules" ref="dbsetForm" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" placeholder="请输入名称">
          <el-input v-model="dbsetForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" :label-width="formLabelWidth" required>
          <el-select v-model="value5" @change="changeType" placeholder="请选择数据类型">
            <el-option label="MYSQL" value="mysql"></el-option>
            <el-option label="KYLIN" value="kylin"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  required >
          <el-col :span="11">
            <el-form-item prop="host" label="主机" :label-width="formLabelWidth">
              <el-input v-model="dbsetForm.host" auto-complete="off"  ></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="11" >
            <el-form-item prop="port" label="端口" :label-width="formLabelWidth" >
              <el-input v-model="dbsetForm.port" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="用户" :label-width="formLabelWidth" prop="user">
          <el-input v-model="dbsetForm.user" auto-complete="off" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input v-model="dbsetForm.password" type="password" auto-complete="off" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth" prop="dbname">
          <el-input v-model="dbsetForm.databaseName" auto-complete="off" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testConnection">测试连接</el-button>
        <el-button  :disabled="connected" @click="datasourceConfig" >确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dbSetDialog',
  props: ['datasource'],
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        host: [{ required: true, message: ' ', trigger: 'blur' }],
        port: [{ required: true, message: ' ', trigger: 'blur' }],
        user: [{ required: true, message: ' ', trigger: 'blur' }],
        password: [{ required: true, message: ' ', trigger: 'blur' }],
        dbname: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      dbsetForm: {
        id: '',
        name: '',
        host: '',
        port: '',
        user: '',
        password: '',
        databaseName: '',
        databaseType: ''
      },
      value5: '',
      connected: true
    }
  },
  watch: {
    dbsetForm: {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        //        console.log(oldVal);//但是这两个值打印出来却都是一样的
        //        console.log(val);
      },
      deep: true
    }
  },
  created() {},
  methods: {
    cancel() {
      this.dialogFormVisible = false
      this.$emit('cancel', 'cancel')
    },
    changeType(val) {
      // console.log(val)
      this.dbsetForm.databaseType = val
    },
    testConnection() {
      console.log(this.dbsetForm)
      this.$http
        .post('/visualize/datasource/test_connection', this.dbsetForm)
        .then(res => {
          // console.log(res)
          if (res.data.success === true) {
            this.connected = false
            // alert('连接成功')
          } else {
            this.connected = true
            alert('connect faild')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    show(row) {
      console.log(row)
      this.dialogFormVisible = true
      if (row !== undefined) {
        row['user'] = row['username']
        row['databaseName'] = row['dbname']
        row['databaseType'] = row['type']
        // console.log(row)
        this.dbsetForm = row
        this.value5 = this.dbsetForm.databaseType
      }
      this.connected = true
    },
    addDatasource() {
      this.$http
        .post('/visualize/datasource/add_datasource', this.dbsetForm)
        .then(res => {
          if (res.data.data.success === true) {
            this.connected = false
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      this.dialogFormVisible = false
    },
    datasourceConfig() {
      let connection = this.dbsetForm
      // console.log(this.dbsetForm)
      this.$http
        .post('/visualize/datasource/datasource_config', connection)
        .then(res => {
          if (res.data.success === true) {
            // alert('修改成功')
            this.$emit('datasourceConfig', '修改成功')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
.el-dialog--small {
  width: 30%;
}
</style>
