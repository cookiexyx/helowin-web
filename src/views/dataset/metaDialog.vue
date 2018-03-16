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
    <el-form-item label="所属数据表" :label-width="formLabelWidth" prop="tableName">
       <el-cascader  
        v-model="metaDialogForm.tableName"
        placeholder="医院设备数据表" 
        :options="result"
         filterable
        :props="props"
        > 
      </el-cascader>
    </el-form-item>
     
     <el-form-item >
       <!-- 字段 -->
     <el-col :span="11">
      <el-form-item label="字段" :label-width="formLabelWidth" prop="columnComment" >
       <!-- @change="changeCloumn" -->
        <el-select v-model="columnInfo.columnComment" placeholder="请选择字段" >
          <el-option 
         v-for="item in items"  
        :label="item.dataTableColumn.columnComment" 
        :value="item.id"  
        :key="item.columnComment"
          >
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
       class="inline-input"
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
        <el-select v-model="metaDialogForm.type" placeholder="" >
          <el-option label="字符型" value="shanghai"></el-option>
          <el-option label="数值型" value="beijing"></el-option>
          <el-option label="日期型" value="xinjiapo"></el-option>
       </el-select>
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
    <el-button type="primary" @click="sumitForm(metaDialogForm)">确 定</el-button>
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
      result: [],
      items: [],
      test: {},
      restaurants: [],
      metaDialogForm: {
        metadataKey: '',
        name: '',
        tableName: '',
        columnComment: '',
        columnName: '',
        domainId: '',
        type: '',
        length: '',
        format: '',
        dataSource: ''
      },
      tableName: '',
      columnInfo: {},
      // dataInfo: '',
      props: {
        label: 'name',
        value: 'name',
        children: 'dataTableInfoList'
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    // changeCloumn(val) {
    //   console.log(val)
    //   this.columnInfo = {
    //     columnName: 'a',
    //     columnComment: 'b'
    //   }
    // },
    // 查询所有字典的数据
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      // console.log(restaurants)
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
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
    handleSelect(item) {
      // console.log(item)
    },

    // 查询所有文件夹
    getDirectoriesList() {
      this.$http.post('/visualize/table/list_directories', {}).then(res => {
        this.result = res.data.data.result
        for (var i of res.data.data.result) {
          i.value = i.name
          i.label = i.value
        }
        // console.log(this.result)
      })
    },

    // 查询元数据列表遍历下拉框选项
    meatSearch() {
      var self = this
      this.$http
        .post('/visualize/metadata/list_metadata_records', {})
        .then(response => {
          // 查询数据下拉数据赋值
          self.items = response.data.data.metaDataRecordList // 数据总数组
          console.log(self.items)
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    // 显示弹出框
    show() {
      this.title = '添加元数据'
      this.dialogFormVisible = true
    },
    // 提交按钮
    sumitForm(metaDialogForm) {
      var self = this
      let urlPath = ''
      if (this.title === '添加元数据') {
        // 新增用户
        urlPath = '/visualize/metadata/add_metadata_record'
      } else {
        // 修改用户
        urlPath = '/visualize/metadata/update_metadata_record'
      }
      this.$http
        .post(urlPath, {
          id: metaDialogForm.id,
          name: metaDialogForm.name,
          tableName: metaDialogForm.tableName,
          columnComment: metaDialogForm.columnComment,
          columnName: metaDialogForm.columnName,
          domainId: metaDialogForm.domainId,
          type: metaDialogForm.dataType,
          length: metaDialogForm.length,
          format: metaDialogForm.format,
          dataSource: metaDialogForm.dataSource
        })
        .then(function(response) {
          self.dialogFormVisible = false
          // console.log(response)
          self.$emit('childMethod')
          self.$message({
            message: '操作成功',
            type: 'success'
          })
          self.resetForm()
        })
        .catch(function(error) {
          console.log(error)
        })
      // alert('保存成功')
    },
    // 编辑按钮
    editForm(scope, metaDialogForm) {
      // console.log(scope)
      this.test = [
        scope.dataTable.dataTableDirectory.directoryName,
        scope.dataTable.tableName
      ]
      // console.log(this.test)
      this.columnInfo = scope.dataTableColumn
      // this.dataInfo = scope.dataTable.tableName
      // console.log(this.dataInfo)
      this.title = '修改元数据'
      this.dialogFormVisible = true
      this.metaDialogForm = {
        metadataKey: scope.metadataKey,
        name: scope.name,
        tableName: scope.tableName,
        columnComment: scope.columnComment,
        columnName: scope.columnName,
        domainId: scope.domainId,
        type: scope.dataType,
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
        dataTableInfo: '',
        columnComment: '',
        columnName: '',
        domainId: '',
        type: '',
        length: '',
        format: '',
        dataSource: ''
      }
      this.dialogFormVisible = false
    }
  },
  mounted() {
    this.meatSearch()
    this.restaurants = this.loadAll()
    this.getDirectoriesList()
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
</style>
