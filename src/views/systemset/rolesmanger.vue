<template>
  <div class="table-style">
    <el-row class="margin-bottom-15">
      <el-col :span="12">
        <el-button type="primary" style="width:200px" @click="showDialog()">新增</el-button>
      </el-col>
      <el-col :span="12">
      <el-input v-model="roleName" placeholder="输入姓名关键字搜索" class="search-input">
      </el-input>
        <!-- <el-button plain  @click="search(roleName)">搜索</el-button> -->
        <el-button type="primary" icon="el-icon-search"  @click="search(roleName)">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="data.roleList"
      border
      style="width: 100%">
      <el-table-column prop="name" label="角色"></el-table-column>
      <el-table-column prop="type" label="管理操作范围"></el-table-column>
      <el-table-column prop="description" label="说明"></el-table-column>
      <el-table-column label="操作">
      
        <template slot-scope="scope">
          <el-button @click="editDialog(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRole(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddNewRole ref="isShow" v-on:childMethod="queryRole"></AddNewRole>
  </div>
</template>

<script>
import AddNewRole from '@/components/Dialog/addNewRole'

export default {
  name: 'rolesmanger',
  components: {
    AddNewRole
  },
  data() {
    return {
      roleName: '',
      data: {}
    }
  },
  methods: {
    // 添加用户，方法在弹窗
    showDialog() {
      this.$refs.isShow.show()
    },
    editDialog(scope) {
      this.$refs.isShow.editForm(scope)
    },
    // 查询用户数据
    queryRole() {
      var self = this
      this.$http
        .post('/visualize/role/list_roles', {})
        .then(response => {
          self.data = response.data.data
          // console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    },

    // 删除用户角色
    deleteRole(id, rows) {
      this.$confirm('此操作不可恢复,确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          var self = this
          this.$http
            .post('/visualize/role/delete_role', {
              id: id
            })
            // console.log(response)
            // console.log(self)
            .then(res => {
              self.queryRole()
              self.$message({ type: 'success', message: '删除成功!' })
            })
        })
        .catch(() => {
          // console.log(error)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 模糊搜索查询
    search(roleName) {
      var self = this
      this.$http
        .post('/visualize/role/list_roles_by_name', {
          name: roleName
        })
        .then(response => {
          self.data = response.data.data
          // console.log(response)
          this.roleName = ''
          if (self.data.roleList.length === 0) {
            this.$message({
              message: '没有符合条件的数据',
              type: 'info'
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  // 查询用户数据
  created() {
    this.queryRole()
  }
}
</script>


<style>
el-table-column {
  width: 20%;
}
.table-style {
  margin: 20px;
}
.margin-bottom-15 {
  margin-bottom: 15px;
}
.search-input {
  width: 40%;
  margin-right: 10px;
}
.el-table {
  margin-top: 40px;
}
.el-table th {
  background: #d5e2f0;
  font-size: 15px;
  color: black;
}
</style>
