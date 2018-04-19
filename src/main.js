import Vue from 'vue'
import F2 from '@antv/f2'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import http from './utils/http.js'
import Cookie from 'js-cookie'
import VConsole from 'vconsole'
import axios from 'axios'
import { ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux'
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
Vue.use(VueRouter,F2,Vue,ConfirmPlugin, LoadingPlugin, ToastPlugin)
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

  
  Cookie.set('t8t-it-ticket', to.query.tickets == undefined ? "vOVtr_GYRv3f1Y1k9R4PxoqEU6E2YOoh-CBcXHcMmsNR8TPAcl6Gk6WCwSGe-2ChhrBzL_U-Pk97yFw3WmQ1vD3Rv44ODUwYI-adgbR7bgrsGfcybkNX2MEUowvULfHS" : to.query.tickets)
  Cookie.set('t8t-it-uid', to.query.uid == undefined ? 78273 : to.query.uid  )
  Cookie.set('t8t-it-uname', to.query.uname)
  
  next()
})
console.log('nihao')
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
