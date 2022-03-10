<template>
  <el-tabs v-model="currentShowTabName" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
    <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.title" :name="item.name"></el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: 'Tab',
  data() {
    return {}
  },
  methods: {
    // 关闭Tab,需要将Tab从TabList中移除
    removeTab(removeTargetName) {
      // desktop是必须保留的
      if (removeTargetName === 'desktop') {
        return
      }
      // 获取当前的tabList菜单数据
      const tabList = this.tabList
      // 2.将当前要删除的Tab从中移除
      tabList.forEach((tab, index) => {
        if (tab.name === removeTargetName) {
          // 从index下标的元素开始,往后删除1个
          tabList.splice(index, 1)
          // 设置删除目前tab后指向的tab
          // 因为desktop的index是0,且TabList最少保留了desktop这个元素,所以index - 1不会越界
          this.$store.commit('setCurrentShowTabName', tabList[index - 1].name)
          // 将全局数据修改
          this.$store.commit('setTabList', tabList)
          // 跳转页面
          this.$router.push({ name: tabList[index - 1].name })
        }
      })
    },
    tabClick(e) {
      // 1.构造tab对象
      const tab = {}
      tab.title = e.label
      tab.name = e.name
      // 2.提交tab列表数据改变
      this.$store.commit('clickMenu', tab)
      // 3.进行页面跳转
      this.$router.push({ name: tab.name })
    }
  },
  computed: {
    currentShowTabName: {
      get() {
        return this.$store.state.MenuStore.currentShowTabName
      },
      set(val) {
        this.$store.state.MenuStore.currentShowTabName = val
      }
    },
    tabList: {
      get() {
        return this.$store.state.MenuStore.tabList
      },
      set(val) {
        this.$store.state.MenuStore.tabList = val
      }
    }
  }
}
</script>