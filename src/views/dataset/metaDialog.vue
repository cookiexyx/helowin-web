<template>
  <div class="total">
    <!-- 添加元数据 -->
   <el-dialog :title="title" :visible.sync="dialogFormVisible">
   <el-form :model="metaDialogForm" ref="metaDialogForm">

    <!-- 数据标识 -->
    <el-form-item label="元数据标识" :label-width="formLabelWidth" prop="metadataKey">
      <el-input v-model="metaDialogForm.metadataKey" ></el-input>
    </el-form-item>

     <!-- 元数据名称 -->
    <el-form-item label="元数据名称" :label-width="formLabelWidth" prop="name">   
      <el-input v-model="metaDialogForm.name" ></el-input>
    </el-form-item>
    
    <!-- 所属数据列表 -->
    <el-form-item label="所属数据表"  prop="dataInfo" :label-width="formLabelWidth">
          <!-- <el-autocomplete 
           class="autocomplete"
           v-model="dataInfo.tableName"
          :fetch-suggestions="querySearchSubjects"
           placeholder="请选择数据表"  
           @focus="handleSelectData"
          >
          <template slot-scope="props" >
             <div>
             <el-tree
              :data="subjects" 
              :props="defaultProps"
               node-key="code"
               :load="loadSubjectList"
               v-show="showSubjectTree"
               :default-expanded-keys="expandedSubjectIds"
               :expand-on-click-node="false"
               @node-click="handleSubjectNodeClick">
              </el-tree>
             </div>
          </template>
          </el-autocomplete>   -->

      <el-cascader  
         placeholder="医院设备数据表" 
         :options="subjects"
         filterable
         :show-all-levels="false"
         :props="defaultProps"       
        > 
      </el-cascader>


    </el-form-item>
     <el-form-item prop="dataTableColumnId" >
       <!-- 字段 -->
    <el-col :span="11">
      <el-form-item label="字段" :label-width="formLabelWidth" prop="columnComment" >
       <!-- @change="changeCloumn" -->
        <el-select v-model="columnInfo.columnComment" placeholder="请选择字段"  class="autocomplete" @change="changeCloumn"  >
          <el-option 
            v-for="item in items"  
            :label="item.columnComment" 
            :value="item.columnComment"  
            :key="item.id">
          </el-option>
       </el-select>
     </el-form-item>
    </el-col>
    <!-- 名称 -->
     <el-col :span="11">
       <el-form-item label="名称" :label-width="formLabelWidth" prop="columnName" >
        <el-input  v-model="columnInfo.columnName" placeholder=""></el-input>
       </el-form-item>
     </el-col>
     </el-form-item>
     <!-- 对应字典 -->
      <el-form-item label="对应字典" :label-width="formLabelWidth" prop="domainId">
         <!-- <el-input v-model="metaDialogForm.domainId" class="domainLength" placeholder="请输入想搜索的字典关键字" > 
         </el-input> -->
        <el-autocomplete
            class="autocomplete"
            v-model="metaDialogForm.domainId"
            :fetch-suggestions="querySearch"
            placeholder="请输入想搜索的字典关键字"
            @select="handleSelect">
        <!-- :trigger-on-focus="false" 此属性可以设置用户点击既提示还是输入完再提示 -->
        </el-autocomplete>
         <router-link to="/Dataset/dataDomain" class="color">字典中没有？去添加>>>
         <!-- <i class="el-icon-circle-plus-outline"></i> -->
         </router-link>
      </el-form-item>
      
    <!-- 数据类型 -->
      <el-form-item label="数据类型" :label-width="formLabelWidth" prop="type"  >
        <el-input v-model="metaDialogForm.type" placeholder="" >
          <!-- <el-option label="字符型" value="shanghai"></el-option>
          <el-option label="数值型" value="beijing"></el-option>
          <el-option label="日期型" value="xinjiapo"></el-option> -->
        </el-input>
      </el-form-item>
    
    <!-- 显示长度 -->
    <el-form-item label="显示长度" :label-width="formLabelWidth" prop="length">
      <el-input v-model="metaDialogForm.length" placeholder="请输入字符长度"></el-input>
    </el-form-item>

     <!-- 显示格式 -->
    <el-form-item label="显示格式" :label-width="formLabelWidth" prop="format">
      <el-input v-model="metaDialogForm.format" ></el-input>
    </el-form-item>
    
    <!-- 数据来源 -->
    <el-form-item label="数据来源" :label-width="formLabelWidth" prop="dataSources">
      <el-input v-model="metaDialogForm.dataSource" placeholder="请输入数据来源"></el-input>
    </el-form-item>
    <!-- 底部按钮 -->
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="sumitForm()">确 定</el-button>
    <el-button @click="resetForm(metaDialogForm)">取 消</el-button> 
  </div>
</el-dialog>
</div>
</template>

<script>
export default {
  name: 'metaDialog',
  data() {
    return {
      dialogFormVisible: false,
      title: '添加元数据',
      data: [],
      items: [],
      subjects: [],
      test: {},
      tableName: '',
      metaDialogForm: {
        metadataKey: '',
        name: '',
        tableName: '',
        tableId: '',
        domainIdd: '',
        columnCommentId: '',
        columnComment: '',
        columnName: '',
        domainId: '',
        dataInfo: {},
        type: '',
        length: '',
        format: '',
        dataSource: ''
      },
      columnInfo: {},
      dataInfo: {},
      formLabelWidth: '120px',
      defaultProps: {
        label: 'name',
        value: 'name',
        children: 'dataTableInfoList' // 子级节点属性
      },
      showSubjectTree: true,
      expandedSubjectIds: [],
      subjectInfo: {}
    }
  },
  methods: {
    // 下拉框选项改变，值改变
    changeCloumn(value, scope) {
      this.meatSearch()
      console.log(this.columnsList)
    },

    // ------------------------所属数据表查询---------------------------------------------
    handleSelectData() {
      this.showSubjectTree = true
      this.loadSubjectList({ level: 0 })
    },
    querySearchSubjects(queryString, cb) {
      var restaurants = this.subjects
      // 调用 callback 返回建议列表的数据
      cb(restaurants)
      // console.log(restaurants) //
    },
    // 选择选项 点击收起
    handleSubjectNodeClick(data) {
      this.dataInfo.tableName = data.name
      // 当前节点的id
      this.metaDialogForm.tableId = data.id
      // console.log(this.metaDialogForm.tableId)
      // console.log(data) // 每项的数据详情
      this.showSubjectTree = false
      // 查询所有字段
      this.$http
        .post('/visualize/table/get_columns', {
          id: this.metaDialogForm.tableId
        })
        .then(response => {
          // 查询字段数据下拉数据赋值
          console.log(response)
          self.items = response.data.data.columnList // 字段中的数组
          // console.log(self.items)
          self.items.forEach(element => {
            this.metaDialogForm.columnCommentId = element.id
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    loadSubjectList(node, resolve) {
      // console.log(node, resolve)
      // if (node.level === 0) {
      this.$http
        .post('/visualize/table/list_directories', {})
        .then(res => {
          this.subjects = res.data.data.result
          // console.log(this.subjects) //
        })
        .catch(function(error) {
          console.log(error)
        })
      // } else {
      // this.expandedSubjectIds.push(node.key)
      // this.$http
      //   .post('/visualize/table/list_directories', {})
      //   .then(res => {
      //     let result = res.data.data.result
      //     resolve(result)
      //     console.log(result)
      //   })
      //   .catch(function(error) {
      //     console.log(error)
      //   })
      // }
    },

    // -----------------------------------------------------------------------------------------------
    // 字典中的每一项
    handleSelect(item) {
      this.metaDialogForm.domainIdd = item.id
    },

    // 字典查询所有字典的数据
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
      // console.log(results)
      if (results.length === 0) {
        this.$message('暂无数据')
        // results = [{ value: '暂无数据' }]
        return false
      }
    },

    // 匹配用户输入的关键字
    createFilter(queryString) {
      // console.log(queryString) // 用户输入什么输出就是什么
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },

    // 查询所有字典的数据
    loadAll() {
      // var self = this
      this.$http
        .post('/visualize/domain/list_domains', {})
        .then(response => {
          for (var i of response.data.data.domainInfoList) {
            i.value = i.name // ps:必须为每个对象增加value字段！！因为autocomplete只识别value字段并在下拉列中显示
          }
          this.restaurants = response.data.data.domainInfoList
          // console.log(this.restaurants)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 查询字段数据列表遍历下拉框选项
    meatSearch() {
      // this.$http
      //   .post('/visualize/table/get_columns', {
      //     id: this.metaDialogForm.tableId
      //   })
      //   .then(response => {
      //     // 查询字段数据下拉数据赋值
      //     // console.log(response)
      //     self.items = response.data.data.columnList // 字段中的数组
      //     // console.log(self.items)
      //     self.items.forEach(element => {
      //       this.metaDialogForm.columnCommentId = element.id
      //     })
      //   })
      //   .catch(function(error) {
      //     console.log(error)
      //   })
    },

    // 显示弹出框
    show() {
      this.title = '添加元数据'
      this.dialogFormVisible = true
    },
    // 提交按钮
    sumitForm() {
      var self = this
      let urlPath = ''
      console.log()
      if (this.title === '添加元数据') {
        // 新增用户
        urlPath = '/visualize/metadata/add_metadata_record'
        // console.log(this.metaDialogForm.tableId)
        // console.log(this.metaDialogForm.columnCommentId)
        // console.log(this.metaDialogForm.domainIdd)
        this.$http
          .post(urlPath, {
            metadataKey: this.metaDialogForm.metadataKey,
            name: this.metaDialogForm.name,
            dataTableId: this.metaDialogForm.tableId,
            dataTableColumnId: this.metaDialogForm.columnCommentId,
            domainId: this.metaDialogForm.domainIdd,
            type: this.metaDialogForm.type,
            length: this.metaDialogForm.length,
            format: this.metaDialogForm.format,
            dataSource: this.metaDialogForm.dataSource
          })
          .then(function(response) {
            self.dialogFormVisible = false
            if (response.data.msg === '成功') {
              self.$emit('childMethod')
              self.$message({
                message: '添加成功',
                type: 'success'
              })
              self.resetForm()
            } else {
              self.$message({
                message: '添加失败，请重试',
                type: 'warning'
              })
            }
            self.resetForm()
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        // 修改用户
        urlPath = '/visualize/metadata/update_metadata_record'
        this.$http
          .post(urlPath, {
            id: this.metaDialogForm.id, // 编辑必备
            metadataKey: this.metaDialogForm.metadataKey,
            name: this.metaDialogForm.name,
            dataTableId: this.dataInfo.id,
            dataTableColumnId: this.columnInfo.id,
            domainId: this.metaDialogForm.domainId,
            type: this.metaDialogForm.type,
            length: this.metaDialogForm.length,
            format: this.metaDialogForm.format,
            dataSource: this.metaDialogForm.dataSource
          })
          .then(function(response) {
            self.dialogFormVisible = false
            // console.log(response)
            self.$emit('childMethod')
            self.$message({
              message: '修改成功',
              type: 'success'
            })
            self.resetForm()
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      // alert('保存成功')
    },
    // 编辑按钮
    editForm(scope) {
      // console.log(scope) // 当前一行数据
      this.dataInfo = scope.dataTable
      this.columnInfo = scope.dataTableColumn
      this.title = '修改元数据'
      this.dialogFormVisible = true
      // console.log(scope.id) // 元数据id
      this.metaDialogForm = {
        id: scope.id,
        metadataKey: scope.metadataKey,
        name: scope.name,
        domainId: scope.domainId,
        type: scope.type,
        length: scope.length,
        format: scope.format,
        dataSource: scope.dataSource
      }
    },
    // 重置按钮
    resetForm(metaDialogForm) {
      this.metaDialogForm = {
        metadataKey: '',
        name: '',
        domainId: '',
        type: '',
        length: '',
        format: '',
        dataSource: ''
      }
      this.dataInfo = {}
      this.columnInfo = {}
      this.dialogFormVisible = false
    }
  },
  mounted(scope) {
    this.meatSearch()
    this.restaurants = this.loadAll()
    this.loadSubjectList()
  }
}
</script>

<style >
.el-select {
  width: 250px;
}
.inline-input {
  width: 250px;
}
.domainLength {
  /* width: 250px; */
  margin-right: 150px;
}
.color {
  color: red;
  margin-left: 50px;
}
.autocomplete {
  width: 300px;
}
</style>
