<template>
  <section class="app-main clearfix" >   
    <transition name="fade" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  }
}
</script>

<style>
/* .clearfix::after {
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
  content: '';
}
.clearfix {
  zoom: 1;
} */
.el-message-box__wrapper {
    top: -300px;
}
</style>
