<template>
<div class="container">
 <!-- 顶部查询模块 -->
 <el-form  :model="formInline" >
    <!-- <el-form-item label="元数据列表："> -->
    元数据列表 
    <el-input  placeholder="请输入数据名称关键字" v-model="dataName" size="medium" ></el-input>
     <!-- </el-form-item> -->
     所属数据库表
      <!-- <el-form-item label="元数据列表："> -->
        <!-- <el-autocomplete
               class="autocomplete"
                v-model="subjectInfo.name"
                :fetch-suggestions="querySearchSubjects"
                placeholder="请选择数据表"
                @focus="handleSelect">
                  <template slot-scope="props">  
                  <div style="width: 500px" >  
                    <el-tree
                        :data="subjects"
                        :props="defaultProps"
                        v-show="showSubjectTree"
                        :load="loadSubjectList"                         
                        :default-expanded-keys="expandedSubjectIds"
                        :expand-on-click-node="false"
                         @node-click="handleSubjectNodeClick">
                       </el-tree>                  
                  </div>  
                </template>           
        </el-autocomplete> -->

     <!-- <template>
        <el-select v-model="subjectInfo.name" placeholder="请选择">
          <el-option-group
            v-for="group in subjects"
            :key="group.name"
            :label="group.label"
            :prop=defaultProps>
            <el-option
              v-for="item in subjects.dataTableInfoList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              >
            </el-option>
          </el-option-group>
        </el-select>
</template> -->


      <!-- </el-form-item>  -->
        <el-cascader 
         class="autocomplete" 
         placeholder="医院设备数据表" 
        :options="subjects"
         filterable
         :show-all-levels="false"
         :props="defaultProps"
          clearable
          @change="handleChange"
        > 
      </el-cascader>

        <el-button type="primary" @click="searchData(dataName)" size="medium">查询</el-button>
      <!-- </el-form-item>  -->
        <i class="el-icon-document">
           <el-button type="text" @click="showDialog(data)">
            添加元数据
           </el-button>
        </i>
  <MetaDialog ref="isShow" v-on:childMethod="queryData" ></MetaDialog>
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
  <!-- <div >
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000">
    </el-pagination>
  </div> -->

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
      subjects: [],
      selectTree: {},
      currentPage: 5,
      dataName: '',
      formInline: {
        region: ''
      },
      defaultProps: {
        children: 'dataTableInfoList', // 子级节点属性
        label: 'name',
        value: 'name' // 显示的节点名称
      },
      // restaurants: [],
      subjectInfo: {},
      showSubjectTree: true,
      expandedSubjectIds: []
    }
  },
  methods: {
    handleChange(value) {
      // console.log(value[1]) // 当前选择的节点名组成的数组
      // 遍历数据库得出第一级数组
      this.subjects.forEach(carrentId => {
        this.childrenId = carrentId.dataTableInfoList
        // 遍历第一级数组得出第二级数组，获得第二级数组详情
        this.childrenId.forEach(chilId => {
          // console.log(chilId.id)
          // 如果当前节点的数组中第一级节点名=第一级的name并且第二级节点名=当前第二级的节点名
          // 返回了当前的id，也就是当前层级的id
          if (value[1] === chilId.name && value[0] === carrentId.name) {
            // 当前层级的id
            console.log(chilId.id)
          }
        })
      })
    },
    // 查询下拉数组
    loadSubjectList(node, resolve) {
      // console.log(node) // 获取不到
      this.$http
        .post('/visualize/table/list_directories', {})
        .then(res => {
          // console.log(this.subjects) // 8条数据表数组
          this.subjects = res.data.data.result
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 子菜单的信息，点击后下拉框收起
    handleSubjectNodeClick(data) {
      this.subjectInfo = data
      this.showSubjectTree = false
      console.log(this.subjectInfo)
    },
    handleSelect() {
      this.showSubjectTree = true
      this.loadSubjectList()
    },
    // 鼠标点下显示数据
    querySearchSubjects(queryString, cb) {
      var restaurants = this.subjects
      // console.log(restaurants) // 8个数据列表数组
      // 调用 callback 返回建议列表的数据
      cb(restaurants)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
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
      console.log()
    },
    // 顶部模糊查询
    searchData(dataName) {
      var self = this
      this.$http
        .post('/visualize/metadata/list_metadata_records_by_name', {
          name: dataName
        })
        .then(response => {
          // console.log(response)
          self.data = response.data.data
          this.dataName = ''
          this.subjectInfo.name = ''
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
    queryData() {
      var self = this
      this.$http
        .post('/visualize/metadata/list_metadata_records', {})
        .then(response => {
          self.data = response.data.data
          // console.log(self.data)
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
    deleteData(id) {
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
            .then(res => {
              self.queryData()
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
    this.queryData()
    this.loadSubjectList()
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
.autocomplete {
  width: 300px;
  margin: 0 10px 0 0;
}
.el-icon-document {
  color: #6a99ca;
  margin-left: 20px;
}
.el-pagination {
  text-align: center;
  margin: 400px 0 0 0;
}
</style>
