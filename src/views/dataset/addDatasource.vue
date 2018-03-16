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
        <el-form-item label="用户" prop="user"  :label-width="formLabelWidth" >
          <el-input v-model="dbsetForm.user" auto-complete="off" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="dbsetForm.password" type="password" auto-complete="off" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item label="数据库名" prop="databaseName" :label-width="formLabelWidth" >
          <el-input v-model="dbsetForm.databaseName" auto-complete="off" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testConnection">测试连接</el-button>
        <el-button  :disabled="connected" @click="tableShow" >下一步</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置数据表" :visible.sync="tableDialogFormVisible"  >
      <h3 style="color: #3a8ee6">数据源: {{datasource}}</h3>
      <el-transfer
        v-model="value3"
        :render-content="renderFunc"
        :titles="['源表', '待同步表']"
        :button-texts="['到左边', '到右边']"
        :format="{
      noChecked: '${total}',
      hasChecked: '${checked}/${total}'
    }"
        @change="handleChange"
        :data="data"
        append-to-body
      >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="tableDialogFormVisible = false , connected = true">上一步</el-button>
        <el-button :disabled="connected" @click="addTables">确定</el-button>
        <el-button @click="tableDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--<AddDatasourceTableManager @cancel="cancel" :datasourceInfo="dbsetForm" ref="tablemanager1"></AddDatasourceTableManager>-->
  </div>
</template>
<script>
export default {
  name: 'dbSetDialog',
  //    components: { AddDatasourceTableManager },
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
        databaseName: [{ required: true, message: ' ', trigger: 'blur' }]
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
      datasource: '',
      datasourceId: '',
      tableDialogFormVisible: false,
      data: [],
      connected: true,
      value3: [],
      tableList: [],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      }
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
      this.dbsetForm['databaseType'] = this.value5
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
    show() {
      this.dialogFormVisible = true
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
    cancel() {
      this.dialogFormVisible = false
      this.$emit('cancel', 'cancel')
    },
    handleChange(value, direction, movedLabels) {
      console.log(value)
      this.data.forEach(item => {
        if (value.indexOf(item['key']) !== -1) {
          this.tableList.push({
            name: item['key'],
            comment: item['label']
          })
        }
      })
      this.connected = false
    },
    addTables() {
      this.dbsetForm['tableList'] = this.tableList
      this.dbsetForm['username'] = this.dbsetForm['user']
      this.dbsetForm['type'] = this.dbsetForm['databaseType']
      this.dbsetForm['dbname'] = this.dbsetForm['databaseName']
      this.$http
        .post('/visualize/datasource/add_datasource', this.dbsetForm)
        .then(res => {
          console.log(res)
          if (res.data.success === true) {
            // alert('添加成功')
            this.dialogFormVisible = false
            this.tableDialogFormVisible = false
            this.$emit('cancel', 'cancel')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    listTables(row) {
      this.$http
        .post('/visualize/datasource/list_tables_by_datasource', row)
        .then(res => {
          if (res.data.success === true) {
            var result = res.data.data.result
            const data = []
            result.forEach(item => {
              if (item['TABLE_NAME'] !== '') {
                data.push({
                  key: item['TABLE_NAME'],
                  label: item['REMARKS']
                })
              }
            })
            console.log(data)
            this.data = data
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    listSyncTables(row) {
      row['sourceId'] = row['id']
      this.$http
        .post('/visualize/datasource/list_tables_by_datasource_id', row)
        .then(res => {
          if (res.data.success === true) {
            var result = res.data.data.result
            result.forEach(item => {
              if (item['name'] !== '') {
                this.value3.push(item['name'])
              }
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    tableShow() {
      console.log(this.dbsetForm)
      this.datasource = this.dbsetForm.name
      this.tableDialogFormVisible = true
      this.dbsetForm['query'] =
        'autoReconnect=true&useUnicode=true&createDatabaseIfNotExist=true&characterEncoding=utf8&useSSL=true&serverTimezone=UTC'
      this.listTables(this.dbsetForm)
      this.listSyncTables(this.dbsetForm)
    }
  }
}
</script>

<style>
.el-dialog--small {
  width: 30%;
}
</style>
