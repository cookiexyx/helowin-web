<template>
  <div>
    <el-dialog title="配置数据表" :visible.sync="dialogFormVisible"  >
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
        >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="connected" @click="addTables">确定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.el-transfer {
  width: 800px;
}
</style>

<script>
export default {
  props: ['datasourceInfo'],
  data() {
    return {
      datasource: '',
      datasourceId: '',
      dialogFormVisible: false,
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
  methods: {
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
      let tableInfo = {}
      console.log(this.datasourceInfo)
      tableInfo['id'] = this.datasourceId
      tableInfo['tableList'] = this.tableList
      this.$http
        .post('/visualize/datasource/datatable_config', tableInfo)
        .then(res => {
          console.log(res)
          if (res.data.success === true) {
            alert('配置成功')
            this.dialogFormVisible = false
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    listTables(row) {
      row['user'] = row['username']
      row['databaseName'] = row['dbname']
      row['databaseType'] = row['type']
      this.$http
        .post('/visualize/datasource/list_tables_by_datasource', row)
        .then(res => {
          if (res.data.success === true) {
            let result = res.data.data.result
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
            let result = res.data.data.result
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
    show(row) {
      console.log(row)
      this.dialogFormVisible = true
      row['query'] =
        'autoReconnect=true&useUnicode=true&createDatabaseIfNotExist=true&characterEncoding=utf8&useSSL=true&serverTimezone=UTC'
      this.listTables(row)
      this.listSyncTables(row)
    }
  }
}
</script>