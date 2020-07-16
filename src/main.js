import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import   './plugins/element'  // 按需导入ui组件 文件
import './assets/fonts/iconfont.css'  /* 导入字体图标 样式 */



// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'  /* 请求  */


import Mbx from './components/Mbx.vue'/* 面包屑 */



/* mbx注册为全局组件 */
Vue.component('Mbx', Mbx)

/* 配置请求的根路径 */
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

/* 通过axios 请求拦截器 添加token 保证获取数据的权限 */
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

Vue.prototype.$http = axios  /* 挂载到vue上 */

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

