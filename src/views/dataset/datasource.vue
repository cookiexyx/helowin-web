<template>
  <div class="data-source">
    <div class="title">
      <h2>数据源管理
        <span class="title-dropdown" >
                <el-dropdown  @command="handleCommand">
                    <span class="el-dropdown-link">
                     添加数据源<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="数据库">数据库</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
        </span>
      </h2>

    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="数据库" name="data1">
        <el-table
          :data="datasource"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="连接名称"
            style="width:15%">
          </el-table-column>
          <el-table-column
            prop="dbname"
            label="数据库"
            style="width:15%">
          </el-table-column>
          <el-table-column
            prop="info"
            label="连接信息"
            style="width:20%">
          </el-table-column>
          <el-table-column
            prop="port"
            label="端口"
            style="width:20%">
          </el-table-column>
          <el-table-column
            label="操作"
            style="width:30%">
            <template slot-scope="scope">
              <el-button @click="datasourceConfig(scope.row)" type="text" size="small">数据库配置</el-button>
            <!-- <el-button @click="datatableConfig(scope.row)" type="text" size="small">数据表配置</el-button> -->
              <el-button @click="deleteDatasource(scope.row)" type="text" size="small">删除</el-button>
              <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
              >
                <!-- <span>确定删除该数据源？</span>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="determine(scope.row)">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                </span> -->

              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <DbSetDialog @datasourceConfig="change" @cancel="cancel" :row="datasource" ref="dbSetDialog"></DbSetDialog>
    <TableConfig @cancel="cancel" ref="tablemanager"></TableConfig>
    <AddDatasource @cancel="cancel" ref="addDatasource"></AddDatasource>
  </div>
</template>
<script>
import DbSetDialog from '@/views/dataset/dbSetDialog'
import TableConfig from '@/views/dataset/tableConfig'
import AddDatasource from '@/views/dataset/addDatasource'
export default {
  name: 'datasource',
  components: { DbSetDialog, TableConfig, AddDatasource },
  data() {
    return {
      determineDelete: false,
      dialogVisible: false,
      activeName: 'data1',
      dialogFormVisible: false,
      datasource: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // determine(row) {
    //   this.determineDelete = true
    //   if (this.determineDelete === true) {
    //     this.$http
    //       .post('/visualize/datasource/delete_datasource', {
    //         id: row.id
    //       })
    //       .then(res => {
    //         if (res.data.success === true) {
    //           // alert('删除成功')
    //           this.fetchData()
    //         } else {
    //           alert('删除失败')
    //           this.fetchData()
    //         }
    //       })
    //   }
    //   this.dialogVisible = false
    // },
    cancel() {
      this.fetchData()
    },
    change(msg) {
      if (msg === '修改成功') {
        this.fetchData()
      }
    },
    fetchData() {
      var self = this
      this.$http
        .post('/visualize/datasource/list_datasources', {})
        .then(function(response) {
          const result = response.data.data.result
          result.forEach(item => {
            item['info'] = item['type'] + '/' + item['host']
          })
          self.datasource = result
          // console.log(result)
        })
    },
    handleCommand() {
      this.$refs.addDatasource.show()
    },
    datasourceConfig(row) {
      this.$refs.dbSetDialog.show(row)
    },
    datatableConfig(row) {
      this.$refs.tablemanager.show(row)
    },

    deleteDatasource(row) {
      this.$confirm('确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        // console.log(row)
        .then(res => {
          this.$http.post('/visualize/datasource/delete_datasource', row)
          // console.log(res)
          // if (res.data.success === true) {
          // alert('删除成功')
          this.fetchData()
          this.$message({ type: 'success', message: '删除成功!' })
          // } else {
        })
        .catch(() => {
          this.connected = true
          // alert('connect faild')
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.data-source {
  padding: 15px;
}

.data-source h2 {
  text-align: center;
}

.data-source .title-dropdown {
  display: inline-block;
  padding-left: 50px;
  border: 0 solid #000;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}

.el-dropdown {
  color: #48576a;
  font-size: 15px;
}

.data-source .el-tabs__nav-scroll {
  display: table;
  margin: 0 auto;
}
</style>

