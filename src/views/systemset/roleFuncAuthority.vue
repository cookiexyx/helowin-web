<template>
  <div>
        <el-form :model="funcAuthority" ref="functionAuthority">
            <el-form-item v-for="item in data.list" :key="item.id">
                <el-checkbox-group v-model="checkedItem1">
                    <el-checkbox :label="item.id" @change="showChildren(item.id)">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="checkedItem2" >
                    <el-checkbox
                        v-for="child in item.childrenList"
                        :label="child.id" 
                        :disabled="!checkedItem1.includes(item.id)"
                        :key="child.id">
                        {{child.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-button class="save-button" type="primary" @click="updateFun()">保 存</el-button> 
        </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex' 

export default {
    name:'roleFuncAuthority',
    computed:{
        ...mapState({
            roleId: state => state.roleAuthority.id
        }) 
    },
    data(){
        return {
            data: {},
            checkedItem1: [],
            checkedItem2: [],
            funcAuthority:{
                list:[]
            }
        }
    },
    created(){
    },
    methods:{
        // 控制子菜单显示隐藏
        showChildren(val){
            // 匹配是否选中
            if (!this.checkedItem1.includes(val)){
                let parent = [];
                this.data.list.forEach(item=>{
                    if (item.id === val){
                        item.childrenList.forEach(child=>{
                            parent.push(child.id)
                        })
                    }
                });
                this.checkedItem2 = this.checkedItem2.filter(key => !parent.includes(key));
            }
        },
        // 获取权限列表
        getAuthorityList(){
            this.$http
            .post(this.API_CONFIG.rolesandauthority, {
                roleId:this.roleId
            })
            .then( (res) => {
                this.data = res.data.data.result
                // 用户选中的item
                this.checkedItem1 = res.data.data.result.accessParentList
                this.checkedItem2 = res.data.data.result.accessChildrenList
            })
            .catch( (err) => {
                console.log(err);
            });
        },

        // 保存角色权限信息
        updateFun(){
            let permissionIds = this.checkedItem1.concat(this.checkedItem2)
            permissionIds = [...new Set(permissionIds)]
            this.$http
            .post( this.API_CONFIG.updateAuthority, {
                roleId: this.roleId,
                permissionIds: permissionIds
            })
            .then( (res) => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
            })
            .catch( (err) => {
                this.$message.error('保存失败');
            });
        }
    }
}
</script>

