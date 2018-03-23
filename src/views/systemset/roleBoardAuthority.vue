<template>
    <div>
        <el-form :model="boardAuthority" ref="functionAuthority">
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
export default {
  name: 'roleBoardAuthority',
  props: [],
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      data: {},
      checkedItem1: [],
      checkedItem2: [],
      boardAuthority: {
        list: []
      }
    }
  },
  created() {
    // this.getRoleBoardAuthority()
  },
  methods: {
    // 控制子菜单显示隐藏
    showChildren(val) {
      // 匹配是否选中
      if (!this.checkedItem1.includes(val)) {
        let parent = []
        this.data.list.forEach(item => {
          if (item.id === val) {
            item.childrenList.forEach(child => {
              parent.push(child.id)
            })
          }
        })
        this.checkedItem2 = this.checkedItem2.filter(
          key => !parent.includes(key)
        )
      }
    },

    // 获取角色仪表盘/驾驶舱权限
    getRoleBoardAuthority(currentType) {
      let currentUrl = ''
      if (currentType === 2) {
        currentUrl = this.API_CONFIG.roleBoardAuthority
      } else if (currentType === 3) {
        currentUrl = this.API_CONFIG.roleCockpitAuthority
      }
      this.$http
        .post(currentUrl, {
          roleId: this.$store.state.roleAuthority.id
        })
        .then(res => {
          this.data = res.data.data.result
          this.checkedItem1 = res.data.data.result.accessParentList
          this.checkedItem2 = res.data.data.result.accessChildrenList
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 修改角色权限信息
    updateFun() {
      let thisType = this.$store.state.roleAuthority.type
      if (thisType === 2) {
        // 修改仪表盘
        this.$http
          .post(this.API_CONFIG.updateBoardAuthority, {
            roleId: this.$store.state.roleAuthority.id,
            dashboardDirectoryIdList: this.checkedItem1,
            dashboardTemplateIdList: this.checkedItem2
          })
          .then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
          .catch(err => {
            this.$message.error('保存失败')
          })
      } else if (thisType === 3) {
        // 修改驾驶舱
        this.$http
          .post(this.API_CONFIG.updateCockpitAuthority, {
            roleId: this.$store.state.roleAuthority.id,
            cockpitDirectoryIdList: this.checkedItem1,
            cockpitTemplateIdList: this.checkedItem2
          })
          .then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
          .catch(err => {
            this.$message.error('保存失败')
          })
      }
      // console.log(this.$store.state.roleAuthority.type);
    }
  }
}
</script>

<style >
.el-checkbox {
  margin-left: 30px;
}
</style>
