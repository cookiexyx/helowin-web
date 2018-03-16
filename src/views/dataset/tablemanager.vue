<template>
  <el-container>
    <el-aside width="220px">
      <div class="header"><span>数据表</span></div>
      <el-tree
        :data="treeData"
        :props="props"
        :load="loadNode"
        :node-key="treeData.id"
        @node-click="handleNodeClick"
        highlight-current
        lazy>
      </el-tree>
    </el-aside>
    <el-main>
      <el-tabs v-model="activeName">
        <el-tab-pane label="数据预览" name="t1">
            <div class="data-tips">
              <span>最新显示&nbsp;
                <span class="red-font">{{data.newData || 0}}</span>&nbsp;条数据，共&nbsp;
                <span class="red-font">{{data.dataTotal || 0}}</span>&nbsp;条数据
              </span>
              <!-- <span>| 最近更新时间：<span>{{data.updateTime}}</span></span> -->
              <a class="data-sort blue-font"><i class="el-icon-sort"></i>数据筛选</a>
            </div>
            <el-table
              :data="data.tableData"
              style="width: 100%">
              <el-table-column
                v-for="item in data.columnName"
                :key="item.name"
                :prop="item.name"
                :label="item.name"
                min-width="60">
              </el-table-column>
            </el-table>
         </el-tab-pane>
        <el-tab-pane label="关联关系" name="t2">关联关系</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeName: 't1',
      data: {},
      treeData: [],
      leafData: [],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      }
    }
  },
  mounted() {},
  created() {
    this.getDirectoriesList()
  },
  methods: {
    // 查询所有文件夹
    getDirectoriesList() {
      this.$http.post(this.API_CONFIG.directoriesList, {}).then(res => {
        this.treeData = res.data.data.result
      })
    },

    // 懒加载子菜单
    loadNode(node, resolve) {
      // console.log(node.data.id)
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level > 1) return resolve([])
      // 查询文件夹下面所有数据表
      this.$http
        .post(this.API_CONFIG.tablesList, {
          directoryId: node.data.id
        })
        .then(res => {
          this.leafData = res.data.data.result
          this.leafData.forEach(item => {
            const key = 'leaf'
            const value = true
            item[key] = value
          })
          // console.log(this.leafData)
          resolve(this.leafData)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 点击节点的时候加载详细数据表
    handleNodeClick(node, event) {
      // event.level==1表示第一级
      if (event.level === 1) {
        return false
      } else {
        this.$http
          .post(this.API_CONFIG.tablesDetail, {
            tableId: node.id
          })
          .then(res => {
            this.data = res.data.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>


<style rel="stylesheet/scss" lang="scss">
.el-aside {
  padding: 0 10px;
  border-right: 1px solid #ccc;
  .header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 5px;
    font-size: 18px;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    color: #409eff;
  }
}
.el-main {
  .el-tabs__header {
    margin: 0;
  }
  .data-tips {
    height: 60px;
    line-height: 60px;
    border-bottom: #ccc solid 1px;
    font-size: 15px;
  }
  .red-font {
    color: red;
  }
  .blue-font {
    color: #409eff;
  }
  .data-sort {
    margin-left: 20px;
  }
  .el-tabs__nav-scroll {
    display: table;
    margin: 0 auto;
  }
  .el-tabs__nav {
    float: inherit;
  }
  .el-tabs__item {
    font-size: 16px;
  }
  .el-tabs__active-bar {
    width: 64px;
  }
}
</style>
