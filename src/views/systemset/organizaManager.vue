<template>
<div class="wrapper">
  <!-- <el-header>机构管理</el-header>
  <div class="interval"></div> -->
  <!-- 左边展示区域 -->
   <div class="areaLeft">
    <div class="earaTop">机构管理
        <span class="span_icon">
        <el-button type="text" @click="append(data)">
          <i class="el-icon-circle-plus-outline" ></i>
        </el-button>
         <el-button type="text" @click="remove(data)">
          <i class="el-icon-delete"></i>
        </el-button>
        </span>
    </div>
        <el-tree
         ref="eventCategoryTree"
        :data="data.organizationList"
        :props="defaultProps"
         node-key="id"
         :highlight-current="true"
         :load="loadNode"
         :expand-on-click-node="false"
         lazy
         isLeaf="leaf"
         :default-expanded-keys="expandOrgIds"
         :render-content="renderContent"
         @node-click="handleNodeClick"
         empty-text="空"
       >
    </el-tree>
</div>

     <!-- 右侧展示区域 -->
      <div class="areaRight">
          <div class="title">
            <i class="el-icon-menu"></i>
            机构维护
          </div>
         <!-- 表单 -->
         <div style="margin-top: 60px;"></div>

            <el-form :label-position="labelPosition" 
            label-width="150px" :model="formScoure"
            :rules="formRules"
            ref="saveForm"
            >
            <el-form-item label="上级机构代码：" prop="aboveId">
                <el-input v-model="parentOrg.innerOrgId" disabled></el-input>
            </el-form-item>

            <el-form-item label="机构代码：" prop="innerOrgId">
                <el-input v-model="formScoure.innerOrgId" ></el-input>
            </el-form-item>
            <el-form-item label="机构名称：" prop="name">
                <el-input v-model="formScoure.name"></el-input>
            </el-form-item>
            <el-form-item label="机构类型：" prop="orgType">
                <el-select v-model="formScoure.orgType" placeholder="请选择">
                  <el-option
                    v-for="item in orgTypes"
                    :key="item"
                    :value="item">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属区域：" prop="regionLongcode">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="regionInfo.name"
                :fetch-suggestions="querySearch"
                placeholder="请选择区域"
                @focus="handleSelect">
                <template slot-scope="props">
                  <div style="width: 500px">
                    <el-tree
                      :data="regions"
                      :props="regionProps"
                      node-key="id"
                      v-show="showRegionTree"
                      :load="loadRegionList"
                      :default-expanded-keys="expandedRegionIds"
                      lazy
                      :expand-on-click-node="false"
                      @node-click="handleRegionNodeClick"></el-tree>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item label="层级代码：" prop="level">
                <el-input v-model="formScoure.level" ></el-input>
            </el-form-item>

            <el-form-item label="地址：" prop="address">
                <el-input v-model="formScoure.address">
                </el-input>
            </el-form-item>

            <el-form-item label="电话：" prop="phoneNumber">
                <el-input v-model.number="formScoure.phoneNumber" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="formScoure.email" ></el-input>
            </el-form-item>

            <el-form-item label="是否存在下级机构：" prop="isLeaf">
                <el-select v-model="isLeaf" placeholder="请选择">
                   <el-option value=是></el-option>
                   <el-option value=否></el-option>
             </el-select>
            </el-form-item>

          <el-form-item label="状态：" prop="status" >
                <el-radio-group v-model="status" class="radio">
                   <el-radio label=启用></el-radio>
                   <el-radio label=禁用></el-radio>
                </el-radio-group>
          </el-form-item>

            <el-form-item label="简介：" prop="description">
                <el-input v-model="formScoure.description" type="textarea"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('saveForm',formScoure)" v-show="save">保存</el-button>
                 <el-button type="primary" @click="editForm('saveForm',formScoure)" v-show="edit">修改</el-button>
                <el-button @click="resetForm(formScoure)">重置</el-button>
            </el-form-item>
            </el-form>
      </div>
</div>
</template>

<script>
import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
import { isvalidPhone } from '../../utils/validate'
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'
let id = 1000
export default {
  components: { ElInput, isvalidPhone },
  name: 'organizaManager',

  data() {
    // 定义一个全局的手机号变量，谁用谁知道
    var validPhone = (formRules, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'left',
      data: {},
      save: true,
      edit: false,
      expandedKeys: [],
      organizationList: [],
      selectTree: {},
      formScoure: {
        name: '',
        innerOrgId: '',
        regionLongcode: '',
        level: '',
        orgType: '',
        isLeaf: '',
        address: '',
        email: '',
        description: '',
        phoneNumber: '',
        aboveId: '',
        status: ''
      },
      parentAboveId: '',
      parentLevel: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      orgTypes: [],
      isLeaf: '',
      status: '',
      parentOrg: {},
      regions: [],
      regionProps: {
        label: 'name',
        children: 'children'
      },
      region: null,
      regionInfo: {},
      showRegionTree: true,
      expandedRegionIds: [],
      expandOrgIds: [],
      formRules: {
        phoneNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: validPhone
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ]
        // status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        // isLeaf: [
        //   { required: true, message: '请选择存在状态', trigger: 'change' }
        // ]
        // regionLongcode: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: '请选择区域',
        //     trigger: 'change'
        //   }
        // ]
      }
    }
  },
  // 查询机构列表
  created() {
    this.querySeach()
    this.queryOrgType()
  },
  methods: {
    // 添加根节点
    loadRegionList(node, resolve) {
      if (node.level === 0) {
        this.$http
          .post('/visualize/region/list_regions', {
            aboveId: '/'
          })
          .then(res => {
            this.regions = res.data.data.regionList
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        this.expandedRegionIds.push(node.key)
        this.$http
          .post('/visualize/region/list_regions', {
            aboveId: node.key
          })
          .then(res => {
            var result = res.data.data.regionList
            resolve(result)
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    handleRegionNodeClick(data) {
      this.regionInfo = data
      this.showRegionTree = false
    },
    handleSelect() {
      this.showRegionTree = true
      this.loadRegionList({ level: 0 })
    },
    querySearch(queryString, cb) {
      var restaurants = this.regions
      // 调用 callback 返回建议列表的数据
      cb(restaurants)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    queryRegion(param) {
      this.$http
        .post('/visualize/region/list_regions', param)
        .then(res => {
          console.log(res.data.data.regionList)
          this.regionInfo = res.data.data.regionList
          console.log(this.regionInfo)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    queryOrgType() {
      this.$http
        .post('/visualize/org/list_org_type', {})
        .then(res => {
          this.orgTypes = res.data.data.OrgTypeEnum
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    querySeach() {
      this.$http
        .post('/visualize/org/list_orgs', {
          aboveId: '/'
        })
        .then(res => {
          this.data = res.data.data
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 懒加载节点
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '根节点' }])
      }
      if (node.level > 6) return resolve([])
      setTimeout(() => {
        this.$http
          .post('/visualize/org/list_orgs_without_status', {
            aboveId: node.key
          })
          .then(res => {
            var result = res.data.data.organizationList
            resolve(result)
            this.expandedKeys.push(this.selectTree.id)
          })
          .catch(function(error) {
            console.log(error)
          })
      }, 0)
      this.expandOrgIds.push(node.key)
    },
    // 添加节点按钮
    append() {
      if (this.selectTree.id !== undefined && this.selectTree.id !== null) {
        this.formScoure = {
          level: this.parentLevel
        }
        this.regionInfo = {}
        this.save = true
        this.edit = false
      } else {
        Message('请选择上级机构')
      }
    },
    // 删除节点
    remove() {
      if (this.selectTree.id !== undefined && this.selectTree.id !== null) {
        MessageBox.confirm('此操作将删除该机构, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http
              .post('/visualize/org/delete_org', { id: this.selectTree.id })
              .then(res => {
                if (res.data.success === true) {
                  Message.success('删除成功')
                  this.querySeach()
                } else {
                  Message.error('删除失败')
                }
              })
              .catch(function(error) {
                console.log(error)
              })
          })
          .catch(() => {
            Message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        Message('请选择删除机构')
      }
    },
    // 渲染节点
    renderContent(h, { node, data, store }) {
      return <span>{node.data.name}</span>
    },
    // 保存节点按钮
    submitForm(formName, formScoure) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var addOrg = {}
          addOrg['name'] = this.formScoure['name']
          addOrg['innerOrgId'] = this.formScoure['innerOrgId']
          addOrg['level'] = this.formScoure['level']
          addOrg['orgType'] = this.formScoure['orgType']
          addOrg['address'] = this.formScoure['address']
          addOrg['email'] = this.formScoure['email']
          addOrg['description'] = this.formScoure['description']
          addOrg['phoneNumber'] = this.formScoure['phoneNumber']
          addOrg['aboveId'] = this.selectTree['id']
          addOrg['regionLongcode'] = this.regionInfo['longcode']
          if (this.isLeaf === '是') {
            addOrg['isLeaf'] = '0'
          } else {
            addOrg['isLeaf'] = '1'
          }
          if (this.status === '启用') {
            addOrg['status'] = 0
          } else {
            addOrg['status'] = 1
          }
          this.$http
            .post('/visualize/org/add_org', addOrg)
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
    // 修改按钮
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var updateOrg = {}
          updateOrg['id'] = this.selectTree['id']
          updateOrg['name'] = this.formScoure['name']
          updateOrg['innerOrgId'] = this.formScoure['innerOrgId']
          updateOrg['level'] = this.formScoure['level']
          updateOrg['orgType'] = this.formScoure['orgType']
          updateOrg['address'] = this.formScoure['address']
          updateOrg['email'] = this.formScoure['email']
          updateOrg['description'] = this.formScoure['description']
          updateOrg['phoneNumber'] = this.formScoure['phoneNumber']
          updateOrg['regionLongcode'] = this.regionInfo['longcode']
          if (this.isLeaf === '是') {
            updateOrg['isLeaf'] = '0'
          } else {
            updateOrg['isLeaf'] = '1'
          }
          if (this.status === '启用') {
            updateOrg['status'] = 0
          } else {
            updateOrg['status'] = 1
          }
          this.$http
            .post('/visualize/org/update_org', updateOrg)
            .then(res => {
              if (res.data.success === true) {
                Message.success('修改成功')
              } else {
                Message.error('修改失败')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
          this.querySeach()
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm(formScoure) {
      alert('重置成功')
      this.formScoure = {
        name: '',
        innerOrgId: '',
        regionLongcode: '',
        level: '',
        orgType: '',
        isLeaf: '',
        address: '',
        email: '',
        description: '',
        phoneNumber: '',
        aboveId: '',
        status: ''
      }
    },
    handleNodeClick(scope) {
      this.selectTree = scope
      // console.log(scope)
      this.save = false
      this.edit = true
      this.parentLevel = scope.level
      this.parentAboveId = scope.id
      if (scope.isLeaf === '0') {
        this.isLeaf = '是'
      } else {
        this.isLeaf = '否'
      }
      if (scope.status === 0) {
        this.status = '启用'
      } else {
        this.status = '禁用'
      }
      this.regionInfo = scope.region
      this.$http
        .post('/visualize/org/list_orgs', {
          id: scope.aboveId
        })
        .then(res => {
          if (
            res.data.data.organizationList[0] === null ||
            res.data.data.organizationList[0] === undefined
          ) {
            this.parentOrg = {
              innerOrgId: ''
            }
          } else {
            this.parentOrg = res.data.data.organizationList[0]
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      this.formScoure = {
        id: scope.id,
        name: scope.name,
        aboveId: scope.aboveId,
        innerOrgId: scope.innerOrgId,
        regionLongcode: scope.regionLongcode,
        level: scope.level,
        orgType: scope.orgType,
        email: scope.email,
        description: scope.description,
        isLeaf: scope.isLeaf,
        address: scope.address,
        phoneNumber: scope.phoneNumber,
        status: scope.status
      }
    }
  }
}
</script>


<style scoped>
/* .wrapper {
  display: flex;
  align-items: flex-start;
} */
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
.radio {
  margin-left: -100px;
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
  width: 60%;
  position: absolute;
  border-bottom: 1px solid #cccccc;
  margin: 50px 0px 0 50px;
}
.span_icon {
  float: right;
  margin-right: 7px;
  font-size: 20px;
}
.el-form-item {
  width: 500px;
}
.el-form-item label {
  margin-left: 100px;
}
</style>

