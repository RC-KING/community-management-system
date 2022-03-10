<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    // 当页面创建之前获取 Tab 的数据和选中状态
    this.$store.commit('initTab')
  }
}
</script>
<style lang="less">
#app {
  height: 100%;
}
</style>
