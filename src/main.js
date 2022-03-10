import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'; //引入element组件库
import 'element-ui/lib/theme-chalk/index.css'; //引入element样式文件
import Cookies from 'js-cookie'//cookie
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
Vue.use(ElementUI); //使用element
Vue.config.productionTip = false

//定义白名单
const whiteList = ['/login', "/"];
// 每次路由变化之前的操作
router.beforeEach(async (to, from, next) => {
  //获取token
  let token = Cookies.get("token");

  if (token) {
    console.log('token存在!');
    // 判断是否是去登录页面
    if (to.path === '/' || to.path === '/login') {
      next({ path: '/home' })
    } else {
      // 去往其他页面
      // 如果token存在,则需要解析通过token获取当前操作者的权限信息,从而获取路由数据和菜单数据
      const menuList = store.state.MenuStore.menuList
      const routerList = store.state.MenuStore.routerList
      if (menuList && menuList.length > 0 && routerList && routerList.length > 0) {
        // 存在则放行
        console.log('存在权限数据')
        next()
      } else {
        // 不存在则重新获取菜单权限数据
        console.log('不存在权限数据')
        try {
          console.log('从服务器获取数据')
          await store.dispatch('getAuthList', router)
        } catch (error) {
          console.log('发生异常', error)
          // 重定向到登录页面
          next({ path: '/' })
        }
        // 如果 addRoutes 并未完成，路由守卫会一层一层的执行执行，直到 addRoutes 完成，找到对应的路由
        // 解决动态路由刷新丢失的问题
        next({ ...to, replace: true })
      }
    }
  } else {
    console.log('token不存在!');
    //如果token不存在
    //判断是否在白名单里面
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('在白名单!');
      next();
    } else {
      //不在白名单，去登录
      console.log('不在白名单，去登录!');
      next({ path: '/' })
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



