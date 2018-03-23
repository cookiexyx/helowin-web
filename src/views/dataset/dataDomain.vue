<template>
    <el-container class="domain">
        <el-header>
            <el-input 
            class="search-input" 
            v-model="search" 
            placeholder="请输入字典标识或名称关键字"
            size="small"></el-input>
            <el-button class="search-button" type="primary" size="medium" @click="searchIdentification()">查询字典标识</el-button>
            <el-button class="search-button" type="primary" size="medium" @click="searchName()">查询字典名称</el-button>
            <el-button type="text" size="medium" icon="el-icon-circle-plus-outline" @click="addDataDomain">添加数据字典</el-button>
        </el-header>
        <el-main>
            <el-table
                ref="singleTable"
                :data="data.domainInfoList"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                width="100">
                </el-table-column>
                <el-table-column
                prop="identification"
                label="字典标识"
                min-width="120">
                </el-table-column>
                <el-table-column
                prop="name"
                label="字典名称"
                min-width="120">
                </el-table-column>
                <el-table-column
                label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" icon="el-icon-edit" @click="updateDataDomain(scope.row)">修改</el-button>
                        <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteDomain(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <dataDomainDialog ref="child" v-on:childMethod="fetchData"></dataDomainDialog>
        </el-main>
    </el-container>
</template>

<script>
import NoData from "@/views/common/noData"
import DataDomainDialog from "@/views/dataset/dataDomainDialog"


export default {
  components: { NoData, DataDomainDialog },
  data(){
      return {
        search:'',
        loading: false,
        data:{}
      }
  },
  created(){
      this.fetchData()
  },
  methods:{
    // 添加数据字典
    addDataDomain(){
        this.$refs.child.addDialog()
    },
    // 修改数据字典
    updateDataDomain(row){
        this.$refs.child.updateDialog(row)
    },
    fetchData() {
        console.log()
      this.loading = true
      this.$http
        .post(this.API_CONFIG.dataDomainsList, {})
        .then(res => {
          this.data = res.data.data
          this.loading = false
        })
    },
    // 根据标识模糊查询
    searchIdentification(){
        this.$http
            .post(this.API_CONFIG.byDomainIdentification, {
                identification:this.search
            })
            .then(res => {
                this.data = res.data.data
            })
    },
    // 根据名称模糊查询
    searchName(){
        this.$http
            .post(this.API_CONFIG.byDomainName, {
                name:this.search
            })
            .then(res => {
                this.data = res.data.data
            })
    },
    // 删除
    deleteDomain(id){
        this.$confirm('确认是否删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {
            this.$http.post(this.API_CONFIG.deleteDomain, {
                    id: id
                })
                .then(res => {
                    this.fetchData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
        })
        .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-header{
    line-height: 60px;
    .search-input{
        width: 300px;
        margin-right: 20px;
    }
    .search-button{
        width: 120px;
        margin-right: 20px;
    }
}
.el-main{
    .el-table thead {
        font-size: 15px;
    }
    .el-button--medium {
        padding: 10px;
    }
}

</style>


