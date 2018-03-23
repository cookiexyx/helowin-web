<template>
  <div class="wrapper">
    <!-- <el-header>科室管理</el-header>
    <div class="interval"></div> -->
    <!-- 左边展示区域 -->
    <div class="areaLeft">
      <div class="earaTop">科室管理
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
         :data="data"
         :props="defaultProps"
         node-key="id"
         @node-click="handleNodeClick"
        :render-content="renderContent"
        :default-expanded-keys= "expandedDepartmentIds"
         highlight-current
        :load="loadNode"
        :expand-on-click-node="false"
        lazy
        isLeaf="leaf"
        empty-text="空"
      >
      </el-tree>
      <!--   -->
      <!--    @node-click="handleNodeClick" -->
    </div>
    
    <!-- 右侧展示区域 -->
    <div class="areaRight">
      <div class="title">
        <i class="el-icon-menu"></i>
        科室维护
      </div>
      <!-- 表单 -->
      <div style="margin-top: 60px;"></div>
      <el-form :label-position="labelPosition" 
      label-width="100px" 
      :model="formScoure" 
      ref="saveForm"
       :rules="formRules">
        <el-form-item label="科室名称：" prop="name">
          <el-input v-model="formScoure.name" ></el-input>
        </el-form-item>

        <el-form-item label="所属医院：" prop="orgId " class="form-label">
          <el-input v-model="orgInfo.name" :disabled="orgDisabled"></el-input>
        </el-form-item>
        <el-form-item label="科室负责人：" prop="leader" style="word-break:none;overflow:hidden" size="6">
          <el-input v-model="formScoure.leader"></el-input>
        </el-form-item>

        <el-form-item label="所属学科：" prop="name">
          <!-- <el-autocomplete
            class="my-autocomplete"
            v-model="subjectInfo.name"
            :fetch-suggestions="querySearchSubjects"
            placeholder="请选择学科"
            @focus="handleSelect">
            <template slot-scope="props" >
              <div style="width: 500px">
                <el-tree
                  :data="subjects"
                  :props="subjectProps"
                  node-key="code"
                  v-show="showSubjectTree"
                  :load="loadSubjectList"
                 
                  :default-expanded-keys="expandedSubjectIds"                 
                  :expand-on-click-node="false"
                  @node-click="handleSubjectNodeClick"></el-tree>
              </div>
            </template>
          </el-autocomplete> -->
                  <el-cascader
                    class="my-autocomplete"
                    placeholder="请选择学科" 
                    :options="allAubjects"
                    :props="subjectProps"
                     v-model="subjectInfo2"
                     filterable
                     @change="handleChange"
                   > 
                  </el-cascader>
                  <!--  @change="handleChange" -->
                 <!--  @focus="handleSubjectNodeClick" -->
        </el-form-item>

        <el-form-item label="联系电话：" prop="phoneNumber">
          <el-input v-model="formScoure.phoneNumber" ></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="telephone">
          <el-input v-model.number="formScoure.telephone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="formScoure.email"></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="status" >
          <el-radio-group v-model="status" class="radio">
            <el-radio label=启用></el-radio>
            <el-radio label=禁用></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="简介：" prop="description">
          <el-input v-model="formScoure.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="addForm('saveForm',formScoure)" v-show="save">保存</el-button>
            <el-button type="primary" @click="submitForm('saveForm',formScoure)" v-show="edit">修改</el-button>
            <el-button @click="resetForm('saveForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'
import { isvalidPhone } from '../../utils/validate'
export default {
  components: { isvalidPhone },
  name: 'sectionManager',
  // props: [data],
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
      data: [],
      save: true,
      edit: false,
      // sectionList: [],
      subjectInfo2: [],
      expandedDepartmentIds: [],
      selectTree: {},
      formScoure: {
        name: '',
        leader: '',
        subject_id: '',
        orgId: '',
        email: '',
        telephone: '',
        phoneNumber: '',
        description: '',
        status: ''
      },
      allAubjects: [],
      subjectInfo: {
        name: []
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
        disabled: 'disabled'
      },
      subjectProps: {
        label: 'name',
        children: 'children',
        value: 'name'
      },
      subjectName: '',
      parentNode: [],
      subject: null,
      showSubjectTree: true,
      expandedSubjectIds: [],
      status: '',
      orgInfo: {},
      selfId: 0,
      orgDisabled: false,
      formRules: {
        telephone: [
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
      }
    }
  },
  // 查询科室列表
  created() {
    this.querySeach()
    this.loadSubjectList()
  },
  methods: {
    querySeach() {
      this.$http
        .post('/visualize/org/list_orgs', {
          aboveId: '/'
        })
        .then(res => {
          this.data = res.data.data.organizationList
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 学科获取
    loadSubjectList(node, resolve) {
      // console.log(node, resolve)
      // if (node.level === 0) {
      this.$http
        .post('/visualize/subject/list_subjects', {})
        .then(res => {
          // console.log(res)
          this.allAubjects = res.data.data.subjectList
          // console.log(this.allAubjects) //
          // this.allAubjects.forEach(carrentId => {
          //   this.secondId = carrentId.children
          //   // console.log(carrentId.name)
          //   this.secondId.forEach(currentSecond => {
          //     // console.log(currentSecond.name)
          //     this.currentSecondId = currentSecond.id
          //   })
          // })
        })
        .catch(function(error) {
          console.log(error)
        })

      // } else {
      // this.expandedSubjectIds.push(node.key)
      // console.log(this.expandedDepartmentIds) // 子菜单
      // this.$http
      //   .post('/visualize/subject/list_subjects', {
      //     // code: node.key
      //   })
      //   .then(res => {
      //     let result = res.data.data.subjectList
      //     resolve(result)
      //     // console.log(result)
      //   })
      //   .catch(function(error) {
      //     console.log(error)
      //   })
      // }
    },

    handleChange(value) {
      console.log(value)
      // console.log(this.allAubjects) //
      // this.allAubjects.forEach(carrentId => {
      //   this.secondId = carrentId.children
      //   // console.log(carrentId.name)
      //   this.secondId.forEach(currentSecond => {
      //     // console.log(currentSecond.name)
      //     if (value[0] === carrentId.name && value[1] === currentSecond.name) {
      //       // 当前层级的id
      //       console.log(currentSecond.id)
      //     }
      //   })
      // })
    },
    handleSubjectNodeClick(data) {
      // this.subjectInfo = data
      this.showSubjectTree = false
      console.log(data)
      // data.forEach(element => {})
    },
    handleSelect() {
      this.showSubjectTree = true
      this.loadSubjectList({ level: 0 })
    },

    loadNode(node, resolve) {
      if (node.key !== undefined) {
        this.expandedDepartmentIds.push(node.key)
      }
      if (node.level !== 0) {
        if (node.data.name === '科室') {
          this.$http
            .post('/visualize/department/list_departments_without_status', {
              orgId: node.parent.key
            })
            .then(res => {
              let result = res.data.data
              console.log(res)
              result.forEach(item => {
                item['isLeaf'] = true
              })
              return resolve(result)
            })
            .catch(function(error) {
              console.log(error)
            })
        } else if (node.data.name === '子机构') {
          this.$http
            .post('/visualize/org/list_orgs', {
              aboveId: node.parent.key
            })
            .then(res => {
              if (res.data.success === true) {
                let orgList = res.data.data.organizationList
                return resolve(orgList)
              } else {
                Message.error('查询失败，请检查服务器连接')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          return resolve([
            {
              id: node.key + 'keshi',
              name: '科室'
            },
            {
              id: node.key + 'zijigou',
              name: '子机构'
            }
          ])
        }
      }
    },
    querySearchSubjects(queryString, cb) {
      var restaurants = this.subjects
      // 调用 callback 返回建议列表的数据
      cb(restaurants)
      // console.log(restaurants) // 一个外科数据
    },

    // 新增节点
    append() {
      // console.log(this.selectTree)
      if (this.selectTree.innerOrgId !== undefined) {
        this.formScoure = {}
        this.subjectInfo = {}
        this.subject = {}
        this.save = true
        this.edit = false
        this.orgInfo = this.selectTree
        this.orgDisabled = true
      } else {
        Message.info('请先选择机构,再点击添加按钮')
      }
    },
    // 删除节点
    remove() {
      if (
        this.selectTree.id !== undefined &&
        this.selectTree.id !== null &&
        this.selectTree.subjectId !== undefined
      ) {
        MessageBox.confirm('此操作将删除该科室, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http
              .post('/visualize/department/delete_department', {
                departmentId: this.selectTree.id
              })
              .then(res => {
                // console.log(this.selectTree.id)
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
        Message('请选择要删除的科室')
      }
    },
    // 树节点内容区的渲染Function(h, { node, data, store }
    renderContent(h, { node, data, store }) {
      return <span>{node.data.name}</span>
    },

    // 添加保存按钮
    addForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var addDepartment = {
            name: this.formScoure.name,
            leader: this.formScoure.leader,
            // subjectId: this.subjectInfo.id,
            subjectId: this.subject_id,
            orgId: this.orgInfo.id,
            email: this.formScoure.email,
            phoneNumber: this.formScoure.phoneNumber,
            telephone: this.formScoure.telephone,
            description: this.formScoure.description,
            status: this.status === '启用' ? 0 : 1
          }
          this.$http
            .post('/visualize/department/add_department', addDepartment)
            .then(res => {
              if (res.data.success === true) {
                Message.success('添加成功')
              } else {
                Message.error('添加失败')
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
    // 修改按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var self = this
          this.$http
            .post('/visualize/department/update_department', {
              id: this.formScoure.id,
              name: this.formScoure.name,
              // leader: this.formScoure.aboveId,
              leader: this.formScoure.leader,
              // subjectId: this.subjectInfo.id,
              subjectId: this.currentSecondId,
              orgId: this.orgInfo.id,
              email: this.formScoure.email,
              phoneNumber: this.formScoure.phoneNumber,
              telephone: this.formScoure.telephone,
              description: this.formScoure.description,
              status: this.status === '启用' ? 0 : 1
            })
            .then(res => {
              // console.log(this.currentSecondId)
              if (res.data.success === true) {
                Message.success('修改成功')
                this.querySeach()
              } else {
                Message.success('修改失败')
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },

    // 重置按钮
    resetForm(formScoure) {
      alert('重置成功')
      this.formScoure = {
        name: '',
        leader: '',
        subject_id: '',
        orgId: '',
        email: '',
        telephone: '',
        phoneNumber: '',
        description: '',
        status: ''
      }
    },
    // 点击左侧显示数据
    handleNodeClick(scope, formScoure) {
      console.log(scope)
      this.selectTree = scope
      if (
        scope.leader !== undefined &&
        scope.subjectId !== undefined &&
        scope.orgId !== undefined
      ) {
        this.save = false
        this.edit = true
        this.orgInfo = scope.organization
        this.subjectInfo = scope.subject
        this.subjectInfo2 = []
        // console.log(scope.subject.code)
        this.subjectCode = scope.subject.code
        let parentCode = this.subjectCode.slice(0, 4)
        // console.log(this.allAubjects)
        let one = this.allAubjects.find(item => {
          return item.code === parentCode
        })
        // 怎么获取当前对象下面以及子对象下面的所有name一次性加入subjectInfo2拼接成一个数组
        this.subjectInfo2.push(one.name)
        this.subjectInfo2.push(scope.subject.name)
        // console.log(this.subjectInfo2)
        if (scope.status === 0) {
          this.status = '启用'
        } else {
          this.status = '禁用'
        }
        this.formScoure = scope
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
.earaTop {
  width: 300px;
  height: 40px;
  background-color: #d5e2f0;
  line-height: 45px;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
}
.areaLeft {
  margin: 50px 0px 0 20px;
  border-radius: 10px;
  display: inline-block;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
}
.my-autocomplete {
  width: 390px;
}
.areaRight {
  display: inline-block;
  height: 35px;
  width: 70%;
  position: absolute;
  border-bottom: 1px solid #cccc;
  margin: 55px 0px 0 30px;
}
.span_icon {
  float: right;
  margin-right: 7px;
  font-size: 20px;
}
.el-form-item {
  width: 500px;
}
</style>
