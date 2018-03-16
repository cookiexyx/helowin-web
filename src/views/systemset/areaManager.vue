<template>
<div class="wrapper">
  <!-- <el-header>区域管理</el-header>
  <div class="interval"></div> -->

  <!-- 左边展示区域 -->
   <div class="areaLeft" width=100% >
    <div class="earaTop">区域管理
        <span class="span_icon">
        <el-button type="text" @click="() => append(data)">
          <i class="el-icon-circle-plus-outline" ></i>
        </el-button>
         <el-button type="text" @click="() => remove(data)" >
          <i class="el-icon-delete"></i>
        </el-button>
        </span>
    </div>

    <!-- ref="eventCategoryTree" 这是在el-tree里面的测试用 -->
        <el-tree
        ref="eventCategoryTree"
        :data="data.regionList"
        :props="defaultProps"
         node-key="id"
         highlight-current
        :load="loadNode"
         isLeaf="leaf"
         lazy
         accordion
        :default-expanded-keys= "expandOrgIds"
        :render-content="renderContent"
        @node-click="handleNodeClick"
        empty-text="空"
       >
       <!-- expand-on-click-node
       则只有点箭头图标的时候才会展开或者收缩节点。
       accordion:是否每次只打开一个同级树节点展开
       default-expand-all:默认展开所有节点
       node-click="handleNodeClick:点击显示节点数据
       render-content树节点的内容区的渲染 Function
       -->
    </el-tree>

   </div>
     <!-- 右侧展示区域 -->
      <div class="areaRight"  >
          <div class="title">
            <i class="el-icon-menu"></i>
            区域维护
          </div>

         <!-- 表单 -->
         <div style="margin-top: 60px;"></div>
         <div>
            <el-form
             :label-position="labelPosition"
             label-width="120px"
            :model="formScoure"
            :rules="rules"
             ref="formSave"
            >

            <el-form-item label="区域ID：" prop="id" v-show="false">
                <el-input v-model="formScoure.id" ></el-input>
            </el-form-item>

             <el-form-item label="区域名称：" prop="name">
                <el-input v-model="formScoure.name"></el-input>
            </el-form-item>

            <el-form-item label="行政区划代码：" prop="longcode">
                <el-input v-model="formScoure.longcode"></el-input>
            </el-form-item>

            <el-form-item label="上级区域：" prop="aboveId">
                <el-input v-model="formScoure.aboveId" disabled></el-input>
            </el-form-item>

             <el-form-item label="层级代码：" prop="level">
                <el-input v-model="formScoure.level" disabled></el-input>
            </el-form-item>

            <el-form-item label="邮政编码：" prop="postcode">
                <el-input v-model="formScoure.postcode"></el-input>
            </el-form-item>

              <el-form-item label="电话区号：" prop="areacode">
                <el-input v-model="formScoure.areacode"></el-input>
            </el-form-item>

              <el-form-item label="区域概况：" prop="description">
                <el-input type="textarea" v-model="formScoure.description" ></el-input>
              </el-form-item>

            <div class="button-footer">
                <el-button type="primary" @click="addForm('formSave',formScoure)" v-show="save" >保存</el-button>
                <el-button type="primary" @click="submitForm('formSave',formScoure)" v-show="edit">修改</el-button>
                <el-button @click="resetForm('formSave')" >重置</el-button>
            </div>
            </el-form>
         </div>
      </div>
</div>
</template>

<script>
import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'
let id = 1000
export default {
  components: { ElInput },
  name: 'areaManager',
  data() {
    return {
      formSave: 'formSave',
      labelPosition: 'left',
      save: true,
      edit: false,
      data: {},
      expandedKeys: [],
      expandOrgIds: [],
      regionList: [],
      selectTree: {},
      formScoure: {
        id: '',
        name: '',
        aboveId: '/',
        longcode: '',
        level: '',
        postcode: '',
        areacode: '',
        description: ''
      },
      parentAboveId: '',
      parentName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // // 触发的当前的节点，放到全局，方便调用*/
      triggerCurrenNodeData: {},
      // // 触发的当前节点
      triggerCurrenNode: {},
      rules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        longcode: [
          { required: true, message: '请输入行政区划代码', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        aboveId: [
          { required: true, message: '请输入上级区域', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        areacode: [
          { required: true, message: '请输入电话区号', trigger: 'blur' }
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入区域概况', trigger: 'blur' }
        ]
      }
    }
  },

  // 查询区域列表
  created() {
    this.querySeach()
  },
  methods: {
    // 查询区域列表
    querySeach() {
      this.$http
        .post('/visualize/region/list_regions', {
          aboveId: '/'
        })
        .then(res => {
          this.data = res.data.data
          // console.log(res) // 所有的数据
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 懒加载节点
    loadNode(node, resolve) {
      // console.log(node.parent.name)
      //  node 当前节点的信息，resolve 全部节点的信息
      if (node.level === 0) {
        return resolve([{ name: '根节点' }])
      }
      if (node.level > 6) return resolve([])
      setTimeout(() => {
        this.$http
          .post('/visualize/region/list_regions', {
            aboveId: node.key
          })
          .then(res => {
            var result = res.data.data.regionList
            resolve(result)
            this.expandedKeys.push(this.selectTree.id)
          })
          .catch(function(error) {
            console.log(error)
          })
      }, 5)
      this.expandOrgIds.push(node.key)
    },

    // 添加节点按钮
    append(data, paretNode) {
      // console.log(data.regionList)
      // this.edit = false
      // this.save = true
      // const newChild = { id: id++, name: '', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
      // this.formScoure = {
      //   id: this.parentAboveId,
      //   name: newChild.name,
      //   aboveId: this.parentAboveId
      // }
      if (this.selectTree.id !== undefined && this.selectTree.id !== null) {
        const newChild = { id: id++, name: '', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        this.formScoure = {
          id: this.parentAboveId,
          aboveId: this.parentAboveId
        }
        this.regionInfo = {}
        this.save = true
        this.edit = false
      } else {
        Message('请选择上级机构')
      }
    },
    // 删除节点按钮
    remove(data, expandedKeys) {
      var self = this
      this.$confirm('此操作不可恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/visualize/region/delete_region', {
              id: this.selectTree.id
            })
            .then(res => {
              // console.log(this.selectTree.name)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              self.querySeach()
            })
            .catch(function(error) {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 树节点内容区的渲染Function(h, { node, data, store }
    renderContent(h, { node, data, store }) {
      return <span>{node.data.name}</span>
    },
    // 保存节点按钮
    addForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(formScoure)
          var dataPost = {
            name: this.formScoure.name,
            aboveId: this.formScoure.aboveId,
            longcode: this.formScoure.longcode,
            level: this.formScoure.level,
            postcode: this.formScoure.postcode,
            areacode: this.formScoure.areacode,
            description: this.formScoure.description
          }
          this.$http
            .post('/visualize/region/add_region', dataPost)
            .then(res => {
              if (res.data.success === true) {
                Message.success('添加成功')
                // this.expandedKeys.push(this.selectTree.id)
                this.expandOrgIds.push(this.selectTree['id'])
                this.querySeach()
              } else {
                Message.error('添加失败')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
          this.expandOrgIds.push(this.selectTree['id'])
        } else {
          return false
        }
      })
    },

    // 修改节点按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(formScoure)
        if (valid) {
          var self = this
          this.$http
            .post('/visualize/region/update_region', {
              id: this.formScoure.id,
              name: this.formScoure.name,
              aboveId: this.formScoure.aboveId,
              longcode: this.formScoure.longcode,
              level: this.formScoure.level,
              postcode: this.formScoure.postcode,
              areacode: this.formScoure.areacode,
              description: this.formScoure.description
            })
            .then(function(response) {
              self.querySeach()
              Message.success('修改成功')
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },

    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleNodeClick(scope, formScoure) {
      this.selectTree = scope
      // console.log(scope)
      // 当前节点的数据
      this.save = false
      this.edit = true
      this.parentName = scope.name
      this.parentAboveId = scope.id
      this.formScoure = {
        id: scope.id,
        name: scope.name,
        aboveId: scope.aboveId,
        longcode: scope.longcode,
        level: scope.level,
        postcode: scope.postcode,
        areacode: scope.areacode,
        description: scope.description
      }
      this.$refs[this.formSave].resetFields()
    }
  }
}
</script>


<style scoped>
/* .el-header {
  font-size: 16px;
  height: 45px;
  text-align: center;
  line-height: 50px;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
} */

.el-tree {
  width: 300px;
  font-size: 16px;
}
.earaTop {
  width: 300px;
  height: 45px;
  background-color: #d5e2f0;
  line-height: 45px;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
}

.areaLeft {
  margin: 50px 100px 0 100px;
  border-radius: 10px;
  display: inline-block;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  box-shadow: 10px 10px 5px #ccc;
}

.areaRight {
  display: inline-block;
  height: 25px;
  width: 50%;
  position: absolute;
  border-bottom: 1px solid #cccccc;
  margin: 50px 0px 0 50px;
}
.span_icon {
  float: right;
  margin-right: 7px;
  font-size: 14px;
}
.el-form-item {
  width: 500px;
}

.button-footer {
  margin-left: 125px;
  margin-top: 30px;
}
</style>
