<template>
<div class="container">
 <!-- 顶部查询模块 -->
 <el-form  :model="formInline" >
    <!-- <el-form-item label="元数据列表："> -->
    元数据列表 
    <el-input  placeholder="请输入数据名称关键字" v-model="formInline.database" size="medium" ></el-input>
     <!-- </el-form-item> -->
     <!-- <el-form-item label="所属数据库表："> -->
    所属数据库表
        <el-cascader  
        placeholder="医院设备数据表" 
        :options="result"
         filterable
        :show-all-levels="false"
        :props="props"
        > 
      </el-cascader>
        <el-button type="primary" @click="searchData(database)" size="medium">查询</el-button>
     <!-- </el-form-item> -->
        <i class="el-icon-document">
           <el-button type="text" @click="showDialog()">
            添加元数据
           </el-button>
        </i>
  <MetaDialog ref="isShow"  v-on:childMethod="querySearch" ></MetaDialog>
 </el-form>

 <!-- 表格模块的表头 -->
  <el-table 
     :data="data.metaDataRecordList"
      border 
      style="width:98%;margin:auto">
    <el-table-column prop="number" type="index" label="序号" width="180"></el-table-column>
    <el-table-column prop="metadataKey" label="元数据标识" width="180"> </el-table-column>
    <el-table-column prop="name"  label="元数据名称"></el-table-column>
    <el-table-column prop="dataTable.dataTableDirectory.directoryName" label="所属文件夹"></el-table-column>
    <el-table-column prop="dataTableColumn.columnName" label="数据表中文名"></el-table-column>
    <el-table-column prop="dataTableColumn.columnComment" label="字段中文名"></el-table-column>
    <el-table-column prop="domainId" label="对应字典名称"></el-table-column>
    <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button @click="editDialog(scope.row)" type="primary" icon="el-icon-edit" size="small">修改</el-button>
          <el-button @click="deleteData(scope.row.id)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
    </el-table-column>
  </el-table>

  <!-- 分页模块 -->
  <div >
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000">
    </el-pagination>
  </div>

</div>
</template>

<script>
import MetaDialog from '@/views/dataset/metaDialog'
export default {
  name: 'metadata',
  components: {
    MetaDialog
  },
  data() {
    return {
      data: {},
      result: [],
      currentPage: 5,
      formInline: {
        user: '',
        region: ''
      },
      props: {
        label: 'name',
        value: 'name',
        children: 'dataTableInfoList'
      }
    }
  },
  methods: {
    // 查询所有文件夹
    getDirectoriesList() {
      this.$http.post('/visualize/table/list_directories', {}).then(res => {
        this.result = res.data.data.result
        // for (var i of res.data.data.result) {
        //   i.value = i.name
        //   i.label = i.value
        // }
        console.log(this.result)
      })
    },

    // 分页方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    // 显示弹窗方法
    showDialog() {
      this.$refs.isShow.show()
    },
    // 顶部模糊查询
    searchData(database) {
      var self = this
      this.$http
        .post('/visualize/metadata/list_metadata_recoeds_by_name', {})
        .then(response => {
          self.data = response.data.data
          console.log(response)
          // this.user = ''
          // 如果数据中长度为0
          if (self.data.metaDataRecordList.length === 0) {
            this.$message({
              message: '没有符合条件的数据',
              type: 'info'
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 查询元数据列表
    querySearch() {
      var self = this
      this.$http
        .post('/visualize/metadata/list_metadata_records', {})
        .then(response => {
          self.data = response.data.data
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 编辑数据列表传值
    editDialog(scope) {
      this.$refs.isShow.editForm(scope)
    },
    // 删除数据列表
    deleteData(id, rows) {
      this.$confirm('此操作不可恢复,确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          var self = this
          this.$http
            .post('/visualize/metadata/delete_metadata_record', {
              id: id
            })
            // console.log(response)
            // console.log(self)
            .then(res => {
              self.querySearch()
              self.$message({ type: 'success', message: '删除成功!' })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.querySearch()
    this.getDirectoriesList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  padding-left: 20px;
}
.el-input {
  width: 330px;
  margin: 30px 40px 40px 0;
}
.el-select {
  // width: 200px;
  margin: 0 10px 0 0;
}
.el-icon-document {
  color: #6a99ca;
  margin-left: 20px;
}
.el-pagination {
  margin: 350px auto 0 auto;
}
</style>
