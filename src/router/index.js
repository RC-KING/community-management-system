import Vue from 'vue'
import VueRouter from 'vue-router'
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  // !!!!!!! 特别注意,插入测试组件不要在第二个位置插入,不然会影响动态组件渲染 
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    redirect: "/home/desktop",
    children: [
      {
        path: 'desktop',
        name: 'desktop',
        component: () => import('../views/Desktop.vue')
      }
      // 动态路由往这个里面添加.....
      // ......
      // ......
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
