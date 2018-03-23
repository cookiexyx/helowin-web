<template>
      <span class="top" >
        <span @click="WatchInfo(STORE,DATA,NODE)" style="width: 80%">
          <span>{{DATA.label}}</span>
        </span>

        <span class="span_icon">
          <el-button style="font-size: 10px;" type="text" v-if="DATA.addAble" @click="Append(STORE,DATA,NODE)">
            <i class="el-icon-plus"></i>
          </el-button>
          
          <el-button style="font-size: 10px;" type="text" v-if="DATA.delAble" @click="Delete(STORE,DATA,NODE)">
            <i class="el-icon-delete"></i>
          </el-button>
        </span>
       
      </span>
</template>


<script scoped>
export default {
  name: '',
  data() {
    return {}
  },
  props: ['NODE', 'DATA', 'STORE'],
  methods: {
    Append(s, d, n) {
      alert('请添加数据')
      // 添加节点事件
      this.$emit('Append', s, d, n)
    },
    Delete(s, d, n) {
      alert('删除成功')
      this.$emit('Deletel', s, d, n)
    },
    WatchInfo(s, d, n) {
      this.$emit('WatchInfo', s, d, n)
    }
  }
}
</script>

<style scoped>
.top {
  display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding-right: 80px;
  height: 30px;
}
</style>
