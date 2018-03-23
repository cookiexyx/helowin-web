<template>
    <div id="menuManager">
        <el-table
            ref="menuManagerTable"
            v-loading="loading"
            :data="data.permissionList"
            style="width:100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" 
                    v-for="(item,index) in props.row.childrenList"
                    :key="item.id">
                <el-form-item>
                    <span>{{ item.name }}</span>
                </el-form-item>
                <el-form-item :index="index">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-sort-up" @click="sortIndex2(props,index,'up')"></el-button>
                        <el-button type="text" icon="el-icon-sort-down" @click="sortIndex2(props,index,'down')"></el-button>
                    </template>
                </el-form-item>
                <el-form-item><span>{{ props.row.path +'/'+ item.path }}</span></el-form-item>
                <el-form-item>
                    <template slot-scope="scope">
                        <el-button @click="addNew()" type="text" size="small">新增</el-button>
                        <el-button @click="update(props.row,index)" type="text" size="small">修改</el-button>
                        <el-button @click="deleteFun(props.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column label="菜单名称" prop="name" min-width="30%"></el-table-column>
            <el-table-column label="顺序" min-width="10%">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-sort-up" @click="sortIndex(scope,'up')"></el-button>
                    <el-button type="text" icon="el-icon-sort-down" @click="sortIndex(scope,'down')"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="链接" prop="path" min-width="40%"></el-table-column>
            <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
                <el-button @click="addNew()" type="text" size="small">新增</el-button>
                <el-button @click="update(scope.row, -1)" type="text" size="small">修改</el-button>
                <el-button @click="deleteFun(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <MenuAddNew ref="child"></MenuAddNew>
    </div>
</template>

<script>
  import MenuAddNew from "@/views/systemset/menuAddNew"
  export default {
    name: 'usermanger',
    components: {
        MenuAddNew
    },
    data() {
        return {
            expanded:true,
            loading:false,
            data:{},
            childData:{}
        }
    },
    created() {
        this.fetchData()
    },
    methods:{
        handleClick(arr){
            console.log(arr)
        },
        fetchData(){
            this.loading = true
            this.$http.post(this.API_CONFIG.menuPermissionsList, {
                id: null
            })
            .then( (res) => {
                this.data = res.data.data
                this.loading = false
            })
            .catch(function (err) {
                console.log(err);
            });
        },
        // 新增
        addNew(){
            this.$refs.child.showDialog()
        },
        // 修改
        update(row,index){
            this.$refs.child.updateDialog(row,index)
        },
        // 删除
        deleteFun(id){
            this.$confirm('确认是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$http.post(this.API_CONFIG.deletePermission, {
                    id:id
                })
                .then( (res) => {
                    this.fetchData();
                    this.$message({ type: 'success', message: '删除成功!' });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 父排序
        sortIndex(scope,type){
            let sIndex = ''
            let ids = [this.data.permissionList[scope.$index].id]
            if (type == 'up') {
                sIndex = scope.$index-1
            }else{
                sIndex = scope.$index+1
            }
            if (this.data.permissionList[sIndex] == undefined) {
                return false
            }else{
                ids.push(this.data.permissionList[sIndex].id)
                this.$http.post(this.API_CONFIG.sortPermission, {
                    ids: ids
                }).then( (res) => {
                    this.fetchData()
                }).catch(function (err) {
                    console.log(err);
                });
            }
            //console.log(this.data.permissionList[sIndex])
        },
        // 子排序
        sortIndex2(props,index,type){
            // console.log(props.$index)
            // console.log(props.row.childrenList[index].id)
            let sIndex = ''
            let ids = [props.row.childrenList[index].id]
            if (type == 'up') {
                sIndex = index-1
            }else{
                sIndex = index+1
            }
            if (props.row.childrenList[sIndex] == undefined) {
                return false
            }else{
                ids.push(props.row.childrenList[sIndex].id)
                this.$http.post(this.API_CONFIG.sortPermission, {
                    ids: ids
                }).then( (res) => {
                    this.fetchData()
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    }
  }
</script>

<style>
#menuManager{ padding: 0 20px; }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    /* border-bottom: 1px solid #c2c0c0; */
  }
  .demo-table-expand .el-form-item:nth-of-type(1) {
    width: 30%;
  }
  .demo-table-expand .el-form-item:nth-of-type(2) {
    width: 10%;
  }
  .demo-table-expand .el-form-item:nth-of-type(3) {
    width: 40%;
  }
  .demo-table-expand .el-form-item:nth-of-type(4) {
    width: 20%;
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0 0 0 48px;
}
    .el-form-item{
        padding-left: 10px;
    }
    .el-table__body{
        width: 100%;
    }
    .el-table__body-wrapper{
        width: 100%;
    }
</style>


