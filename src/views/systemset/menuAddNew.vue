<template>
  <div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="resetForm">
            <el-form :model="form">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="URL" :label-width="formLabelWidth">
                    <el-input v-model="form.path" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFun()">确 认</el-button>
                <el-button @click="resetForm()">取 消</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
export default {
   name:'menuAddNew',
   data(){
       return {
            dialogFormVisible: false,
            formLabelWidth: '50px',
            title:'新增菜单',
            form:{
                id:'',
                editType:false,
                path:'',
                name:''
            },
       }
   },
   methods:{
       resetForm(){
           this.dialogFormVisible = false
           this.form = {
                name: '',
                path:''
            }
       },
       // 新增
       showDialog(){
           this.title = '新增菜单'
           this.form.editType = false
           this.dialogFormVisible = true
       },
       // 修改
       updateDialog(row,index){
           this.title = '修改菜单'
           this.dialogFormVisible = true
           let _path = index === -1 ? row.path : row.path+'/'+row.childrenList[index].path
           this.form = {
               editType: true,
               id: row.id,
               path: _path,
               name: row.name
           }
       },
    //    新增&修改
       submitFun(){
           let _url = ''
           if(this.form.editType){
               _url = this.API_CONFIG.updatePermission
           }else{
               _url = this.API_CONFIG.addPermission
           }
            this.$http.post(_url, {
                id:this.form.id,
                name:this.form.name,
                path:this.form.url
            })
            .then( (res) => {
                this.dialogFormVisible = false
                this.$parent.fetchData()
                this.resetForm()
            })
            .catch(function (err) {
                console.log(err);
            });
       }

   }
}
</script>

<style>
    .el-dialog{
        width: 30%;
    }
</style>


