<template>
  <fragment>
    <template v-for='menu in menuList'>
      <!-- 当有子菜单的时候渲染 el-submenu -->
      <el-submenu v-if="menu.children && menu.children.length >0" :index="menu.path" :key='menu.path'>
        <!-- 根菜单的标题 -->
        <template slot="title">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.label}}</span>
        </template>
        <!-- 子菜单 -->
        <menu-item :menuList='menu.children'></menu-item>
      </el-submenu>
      <!-- 当没有子菜单的时候渲染el-menu-item -->
      <el-menu-item v-else @click="clickMenu(menu)" :index="menu.path" :key='menu.path'>
        <i :class="menu.icon"></i>
        <span slot="title">{{menu.label}}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'MenuItem',
  props: {
    menuList: { type: Array, required: true }
  },
  components: {
    MenuItem
  },
  methods: {
    clickMenu(menu) {
      // 1.把当前点击中的菜单存入tabs列表中
      this.$store.commit('clickMenu', menu)
      // 2.进行页面跳转
      this.$router.push({ name: menu.name })
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
</style>