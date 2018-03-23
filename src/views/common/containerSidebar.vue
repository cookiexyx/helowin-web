<template>
  <div class="sidebar-wrap">
      <div class="sidebar-wrap-header">
            <span>仪表盘</span>
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <el-button type="text" icon="el-icon-circle-plus-outline"></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>创建文件夹</el-dropdown-item>
                    <el-dropdown-item>创建仪表盘</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
      </div>
      <div class="sidebar-wrap-body">
          <div class="sidebar-item" v-for="item in directoriesList" :key="item.id">
              <div class="title-box">
                    <div v-show="!item.editType">
                        <span @click="toggle(item)">
                            <i class="el-icon-document"></i>
                            <span>{{item.name}}</span>
                        </span>
                        <span class="button-box">
                            <i class="el-icon-edit" @click="editFun(item)"></i>
                            <i class="el-icon-delete"></i>
                        </span>
                    </div>
                    <div class="input-box" v-show="item.editType">
                        <el-input v-model="item.name" size="small"></el-input>
                        <i class="el-icon-check" @click="checkFun(item)"></i>
                    </div>
              </div>
              <ul v-show="item.showType">
                  <li v-for="child in templatesList" :key="child.id">
                    <span>{{child.name}}</span>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>重命名</el-dropdown-item>
                            <el-dropdown-item>复制</el-dropdown-item>
                            <el-dropdown-item>移动</el-dropdown-item>
                            <el-dropdown-item>复制至驾驶舱</el-dropdown-item>
                            <el-dropdown-item>转化至驾驶舱</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>

export default {
    name:'containerSidebar',
    data(){
        return{
            directoriesList:{},
            templatesList:{}
        }
    },
    created(){
        this.getDirectoriesList()
    },
    methods:{
        // 查询所有文件夹
        getDirectoriesList() {
            this.$http.get(this.API_CONFIG.dashboardDirectories, {}).then(res => {
                this.directoriesList = res.data.data.result
                this.directoriesList.forEach(item => {
                    this.$set(item, 'editType', false)
                    this.$set(item, 'showType', false)
                })
            })
        },
        toggle(item){
            this.$http.get(this.API_CONFIG.dashboardTemplates, {
                directoryId: item.id
            }).then(res => {
                this.templatesList = res.data.data.templatesList
                item.showType = !item.showType
            })    
        },
        // 修改文件夹名字
        editFun(item){
            item.editType = !item.editType
        },
        // 修改保存
        checkFun(item){
            if(item.name == ''){
                this.$message({
                    message: '名称不能为空',
                    type: 'warning'
                })
            }else{
                item.editType = !item.editType
            }

        }
    }
}
</script>

<style lang="scss">
.sidebar-wrap{
    padding: 0 10px;
}
.sidebar-wrap-header{
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    .el-dropdown{
        float: right;
        .el-button{
            font-size: 17px;
            padding: 10px 20px;
        }
        .el-dropdown-menu{
            top: 140px;
            left: 244px;
        }
    }
}
.sidebar-wrap-body{
    .sidebar-item{
        cursor: pointer;
        font-size: 14px;
        .title-box{
            margin: 0;
            overflow: hidden;
            height: 28px;
            line-height: 28px;
            .button-box{
                float: right;
            }
            .el-input--small .el-input__inner {
                height: 28px;
            }
            .input-box{
                position: relative;
                .el-icon-check:before{
                    font-size: 18px;
                    font-weight: bold;
                    position: absolute;
                    top: 5px;
                    right: 5px;;
                }
            }
        }
        i{
            margin-right: 10px;
        }
        ul{
            padding: 0;
            margin: 5px 0;
            color: rgb(119, 119, 119);
        }
        li{
            height: 28px;
            line-height: 28px;
            padding-left: 26px;
            .el-dropdown{
                float: right;
            }
        }
        li:hover{
            background-color: rgb(228, 228, 228);
        }
    }
}
</style>
