<template>
  <div class="domain-dialog">
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="字典标识" :label-width="formLabelWidth" prop="identification">
                    <el-input v-model="form.identification" auto-complete="off" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="字典名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" auto-complete="off" size="medium"></el-input>
                </el-form-item>
                <div>
                    <span>具体内容</span>
                    <el-button @click="addRow()" type="text" icon="el-icon-circle-plus-outline">添加</el-button>
                </div>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column type="index" label="序号" min-width="15%"></el-table-column>
                    <el-table-column label="值" min-width="25%">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.domainValueKey"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值含义" min-width="30%">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.name"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="30%">
                        <template slot-scope="scope">
                            <!-- <el-button type="primary" size="mini" icon="el-icon-upload" @click="saveRow(scope)">保存</el-button> -->
                            <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteFun(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveFun()">保 存</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dataDomainDialog',
  props:[],
  data(){
      return {
        rules:{
            identification:[
                { required: true, message: '请输入字典标识' }
            ],
            name:[
                { required: true, message: '请输入字典名称' }
            ],
        },
        title:'添加数据字典',
        formLabelWidth: '100px',
        dialogVisible: false,
        // 添加标识
        addType:true,
        domainValueKey:'',
        name:'',
        tableData:[],
        form:{
            identification:'',
            name:''
        }
      }
  },
  methods: {
      handleClose(){
        this.dialogVisible = false
      },
      addDialog(){
        this.addType = true
        this.title = '添加数据字典'
        this.dialogVisible = true
        setTimeout(() => {
            this.$refs.form.resetFields()
            this.tableData = []
            this.form = {
                identification:'',
                name:''
            }
        }, 0)
      },
      updateDialog(row){
        this.addType = false
        this.title = '修改数据字典'
        this.dialogVisible = true
        this.tableData = row.domainValueList
        this.form = {
            identification: row.identification,
            name: row.name,
            id:row.id
        }
      },
      // 判断值内容是否全部填写
      flagFun(){
        const flag = 
                this.tableData.every(item => {
                    if(item.domainValueKey != '' && item.name != '') return true 
                    else return false
                })
        return flag
      },
      // 添加
      addRow(){
          if(this.tableData.length == 0){
                this.tableData.push({ domainValueKey:'', name:'' })
          }else{
                if(this.flagFun()){
                    this.tableData.push({ domainValueKey:'', name:'' })
                }else{
                    this.$message({
                        message: '值和值含义不能为空',
                        type: 'warning'
                    })
                }
          }
      },
      // 保存
      saveFun(){
        if(this.flagFun()){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 判断是修改还是添加的url
                    let url = this.addType?this.API_CONFIG.addDomain:this.API_CONFIG.updateDomain
                    this.$http
                        .post(url, {
                            identification: this.form.identification,
                            name: this.form.name,
                            id:this.form.id,
                            domainValueList: this.tableData
                        })
                        .then(res => {
                            if (res.data.success) {
                                this.dialogVisible = false
                                this.$message({ type: 'success', message: '保存成功!' })
                                this.$emit('childMethod')
                                // location.reload()
                            }else{
                                this.$message.error('保存失败');
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    return false;
                }
            })
        }else{
            this.$message({
                message: '值和值含义不能为空',
                type: 'warning'
            })
        }
      },
      // 删除某一条字典值
      deleteFun(index){
          this.tableData.splice(index, 1)
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.domain-dialog{
    .el-form-item {
        margin-bottom: 17px;
    }
    .el-table {
        thead {
            font-size: 14px;
            text-align: center;
        }
        th .cell{
            text-align: center;
        }
        .el-button--mini{
            padding: 5px;
        }
        .el-table td {
            padding: 7px 0;
        }
    }
}
</style>


