
import { getOperatorPermissionInfoApi } from '../api/permission'
// 全局数据
export default {
  state: {
    // 菜单折叠控制(点击菜单折叠按钮之后,菜单折叠只剩图标)
    isCollapse: false,
    // 菜单数据
    menuList: [],
    // 路由数据
    routerList: [],
    // 当先激活的Tab
    currentShowTabName: 'desktop',
    // Tab列表
    tabList: [
      {
        title: '首页',
        name: 'desktop'
      }
    ],
  },
  mutations: {
    // 修改菜单折叠控制
    setIsCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    // =====================  Tab模块 =============================== //
    // 获取tabList
    // 初始化数据
    initTab(state) {
      const tabs = sessionStorage.getItem('tabList')
      const activeTab = sessionStorage.getItem('activeTab')
      if (tabs) state.tabList = JSON.parse(tabs)
      if (activeTab) state.currentShowTabName = JSON.parse(activeTab)
    },
    // 修改当前展示的Tab(currentShowTabName)
    setCurrentShowTabName(state, name) {
      state.currentShowTabName = name
      sessionStorage.setItem('activeTab', JSON.stringify(state.currentShowTabName))
    },
    // 获取 tabList
    setTabList(state, tabList) {
      state.tabList = tabList
      sessionStorage.setItem('tabList', JSON.stringify(state.tabList))
    },
    // 修改 tabList(点击了menu之后,新增tab)
    clickMenu(state, menu) {
      console.log(menu)
      // 如果menu不存在,则直接退出
      if (menu === null || !menu) return

      // 1.判断当前点中的菜单是否在tabs里面 
      const res = state.tabList.findIndex(item => item.name === menu.name)
      if (res === -1) {
        // 2.如果不存在则将当前的菜单存入tab列表中
        state.tabList.push({
          title: menu.label,
          name: menu.name
        })
      }
      // 3.设置当前选项的选项卡为当前新增的选项卡
      state.currentShowTabName = menu.name
      // 4.把当前的tab列表存入sessionStorage中
      sessionStorage.setItem('tabList', JSON.stringify(state.tabList))
      // 5.将当前激活的tab存入session中
      sessionStorage.setItem('activeTab', JSON.stringify(state.currentShowTabName))
    },
    // =====================  menuList模块 =============================== //
    //设置菜单到store里面
    setMenuList(state, list) {
      state.menuList = list;
    },
    // =====================  routerList模块 =============================== //
    //设置路由到store
    setRouterList(state, list) {
      state.routerList = list;
    },
    // 动态路由生成(将后台生成的路由数据转化成Vue的路由数据)
    dynamicRouter(state, router) {
      let oldRouter = router.options.routes;
      let routerList = state.routerList;
      routerList.forEach(item => {
        // 内嵌网页走的分支
        if (/^.+\.html$/ig.test(item.url)) {
          console.log('进入iframe路由')
          item.component = resolve => require([`@/views/IFrame/IFrame.vue`], resolve);
        } else {
          // 正常Vue路由走的分支
          // item.component = () => import(`@/views${item.url}.vue`);
          item.component = (resolve) => require([`@/views${item.url}.vue`], resolve);
        }
        // 这里决定了基础路由中不能随意修改
        oldRouter[2].children.push(item);
      })
      //5.添加到现有路由里面
      router.addRoutes(oldRouter);
      console.log(router);
    }
  },
  actions: {
    //获取用户权限数据(menuList,routerList,以及生成的dynamicRouter)
    async getAuthList({ commit }, router) {
      let { data: res } = await getOperatorPermissionInfoApi();
      console.log("getOperatorPermissionInfoApi响应数据", res);
      //获取菜单数据
      let menuList = res.data.menuList;
      //获取路由数据
      let routerList = res.data.routerList;
      // 获取权限字段(控制按钮)
      const authList = res.data.authList
      console.log('即将存入')
      sessionStorage.setItem('authList', JSON.stringify(authList))
      //菜单数据存储到store
      commit('setMenuList', menuList)
      //路由数据存储到store
      commit('setRouterList', routerList)
      //动态路由生成
      commit('dynamicRouter', router)
    },
  }
}
