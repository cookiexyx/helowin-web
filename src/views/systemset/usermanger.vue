<template>
  <div class="table-style">
    <el-row class="margin-bottom-15">
      <el-col :span="12">
        <el-button type="primary" style="width:200px" @click="showDialog()">新增</el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="userName" placeholder="输入姓名关键字搜索" class="search-input"></el-input>
        <el-button plain @click="searchName()">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="data.userList"
      border
      style="width: 100%">
      <el-table-column prop="accountNumber" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="org.name" label="机构"></el-table-column>
      <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editDialog(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteUser(scope.row.id,scope.row.accountNumber)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="changePageSize"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
    <AddNewUser ref="isShow"></AddNewUser>
  </div>
</template>

<script>
import AddNewUser from '@/components/Dialog/addNewUser'
import { mapGetters } from 'vuex'
export default {
  name: 'usermanger',
  computed: {
    ...mapGetters(['currentPage', 'pageSize'])
  },
  components: {
    AddNewUser
  },

  data() {
    return {
      total: 10,
      changePageSize: [10, 20, 30, 40],
      userName: '',
      loading: false,
      data: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    showDialog() {
      this.$refs.isShow.show()
    },
    editDialog(scope) {
      this.$refs.isShow.editForm(scope)
    },
    handleCurrentChange(currentPage) {
      this.$store.dispatch('changeCurrentPage', currentPage)
      this.fetchData()
    },
    handleSizeChange(pageSize) {
      this.$store.dispatch('changeCurrentPageSize', pageSize)
      this.fetchData()
    },

    // 初始查询列表
    fetchData() {
      this.loading = true
      this.$http
        .post(this.API_CONFIG.usermanger, {
          start: this.currentPage,
          pageSize: this.pageSize
        })
        .then(response => {
          this.total = response.data.data.total
          this.data = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 根据姓名查询
    searchName() {
      this.$http
        .post(this.API_CONFIG.searchUser, {
          name: this.userName
        })
        .then(res => {
          this.data = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除用户
    deleteUser(userId, accountNumber) {
      this.$confirm('确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http
            .post(this.API_CONFIG.deleteUser, {
              id: userId,
              accountNumber: accountNumber
            })
            .then(res => {
              this.fetchData()
              this.$message({ type: 'success', message: '删除成功!' })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
el-table-column {
  width: 20%;
}
.pagination-wrap {
  padding: 20px 50px 20px 0;
  width: 100%;
}
.pagination-wrap .el-pagination {
  float: right;
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
</style>
