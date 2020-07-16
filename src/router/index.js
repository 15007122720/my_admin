//第一步:引入必要的文件
import Vue from 'vue'     ////加载全局组件时,都需要引入Vue
import VueRouter from 'vue-router' //引入vue-router

import Login from '../components/Login.vue'  // 导入 登录页面
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'

Vue.use(VueRouter)     //第二步:加载全局组件Router


/* 解决报错显示是路由重复 */
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


//第三步:配置路由实例

const router = new VueRouter({
  routes: [
  
    { path: '/', redirect: '/login'  },
  
    { path: '/login', component: Login},
      
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    },
  ]
})

/* 挂载路由导航守卫 */
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()  /* 去往login 放行 */

  const tokenStr = window.sessionStorage.getItem('token')  /* 获取token */

  if (!tokenStr) return next('/login') /* 如果没token 就强制跳转登陆页面 */
  next()  /*否则就放行 */

})


export default router
