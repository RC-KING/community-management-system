<template>
  <div class="menu-bar-container">
    <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened>
      <menu-item :menuList='menuList'></menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuItem from '../components/MenuItem.vue'
export default {
  name: 'MenuBar',
  components: {
    // 注册组件
    MenuItem
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isCollapse: state => state.MenuStore.isCollapse,
      menuList: state => state.MenuStore.menuList
    })
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.menu-bar-container {
  height: 100%;
}
// 去除导航栏右侧的边框
.el-menu {
  border-right: none !important;
}
</style>