import Vue from 'vue'
import F2 from '@antv/f2'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import http from './utils/http.js'
import Cookie from 'js-cookie'
// import VConsole from 'vconsole'
import axios from 'axios'
import { ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux'
import App from './App'
import Home from './components/Home'
import Apply from './components/apply/Apply'
import Board from './components/board/Board'
import MyInds from './components/my/MyInds'
import Indesc from './components/my/Indesc'
import NounDesc from './components/my/NounDesc'
import selInd from './components/apply/selInd'
import selDim from './components/apply/selDim'
import Page from './components/test/testPage'
import utils from './utils/utils.js'


// new VConsole()
Vue.prototype.$http = http
Vue.use(VueRouter,F2,Vue,ConfirmPlugin, LoadingPlugin, ToastPlugin,utils)
window.axios = axios; 

FastClick.attach(document.body)

const routes = [
  {
  path: '/dbd',
  redirect: '/bdc-prd-dbd/board'
  },
  {
    path: '/bdc-prd-dbd/board',
    component: Board
  },
  {
    path: '/bdc-prd-dbd/apply',
    component: Apply
  },
  {
    path: '/bdc-prd-dbd/myinds',
    component: MyInds
  },
  {
    path: '/bdc-prd-dbd/indesc',
    component: Indesc
  },
  {
    path: '/bdc-prd-dbd/nounDesc',
    component: NounDesc
  },
  {
    path: '/bdc-prd-dbd/selInd',
    component: selInd
  },
  {
    path: '/bdc-prd-dbd/selDim',
    component: selDim
  },
  {
    path: '/bdc-prd-dbd/page',
    component: Page
  }
]



const router = new VueRouter({
  mode:'history',
  routes
})

router.beforeEach((to, from, next) => {
  // 从路由的元信息中获取 title 属性
  if (to.meta.title) {
    document.title = to.meta.title
  }

  next()
})

let rel = router.beforeEach((to, from, next) => {
  // 从路由的元信息中获取 title 属性
  // Cookie.set('t8t-it-ticket', to.query.ticket)
  Cookie.set('t8t-it-appVersion', to.query.appVersion)
  Cookie.set('t8t-it-appType', to.query.appType)
  Cookie.set('t8t-it-deviceId', to.query.deviceId)
  Cookie.set('t8t-it-version', to.query.version)
  Cookie.set('t8t-it-accountId', to.query.accountId)
  Cookie.set('t8t-it-ticket', to.query.tickets)
  Cookie.set('t8t-it-token', to.query.token)
  Cookie.set('t8t-it-uid', to.query.uid)
  // Cookie.set('t8t-it-uname', to.query.uname)
  rel()
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
