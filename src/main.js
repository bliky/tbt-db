import Vue from 'vue'
import F2 from '@antv/f2'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import http from './utils/http.js'
import Cookie from 'js-cookie'
import VConsole from 'vconsole'
import axios from 'axios'
import { ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux'
// import router from './router/index.js'
import App from './App'
import Home from './components/Home'
import Apply from './components/apply/Apply'
import Board from './components/board/Board'
import MyInds from './components/my/MyInds'
import Indesc from './components/my/Indesc'
import NounDesc from './components/my/NounDesc'
import Page from './components/test/testPage'



new VConsole()
Vue.prototype.$http = http
Vue.use(VueRouter,F2,Vue,VueResource,ConfirmPlugin, LoadingPlugin, ToastPlugin)
window.axios = axios; 

FastClick.attach(document.body)


const routes = [{
  path: '/',
  redirect: '/dbd/board'
  },
  {
    path: '/dbd/board',
    component: Board
  },
  {
    path: '/dbd/apply',
    component: Apply
  },
  {
    path: '/dbd/myinds',
    component: MyInds
  },
  {
    path: '/dbd/indesc',
    component: Indesc
  },
  {
    path: '/dbd/nounDesc',
    component: NounDesc
  },
  {
    path: '/dbd/page',
    component: Page
  }
]



const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 从路由的元信息中获取 title 属性
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.query.ticket && to.query.uid) {
    Cookie.set('t8t-it-ticket', to.query.ticket)
    Cookie.set('t8t-it-uid', to.query.uid)
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
