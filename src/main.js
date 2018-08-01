import Vue from 'vue';
import Vuex from 'vuex';
import F2 from '@antv/f2';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import http from './utils/http.js';
import Cookie from 'js-cookie';
import VConsole from 'vconsole'
import axios from 'axios';
import { ConfigPlugin, ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux';
import App from './App';
// APP入口页面
import Home from './components/Home';           // 首页
import Dashboard from './components/dashboard'; // 转化漏斗
import Roi from './components/roi';             // ROI分析
import DataBoard from './components/board/DataBoard'; // 指标看板
import Apply from './components/apply/Apply';         // 指标申请
import MyInds from './components/my/MyInds';          // 指标释义
// 子页面
import EditInd from './components/board/EditInd';
import Indesc from './components/my/Indesc';
import NounDesc from './components/my/NounDesc';
import selInd from './components/apply/selInd';
import selDim from './components/apply/selDim';
import Ind from './components/apply/Ind';
// 测试页面（开发用，不发布到生产环境）
import test from './components/test';

import utils from './utils/utils.js';

new VConsole();

Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);

// console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
// console.log('location.href: ', location.href);

if (process.env.NODE_ENV !== 'production') {
  require('./services/mock').default.bootstrap();
}

Vue.prototype.$http = http;
Vue.use(VueRouter, F2, Vue, utils, ConfigPlugin, {
  $layout: 'VIEW_BOX'
});
window.axios = axios;

FastClick.attach(document.body);
// 控制路由
const routes = [
  // 重定向到首页
  {
    path: '/',
    redirect: '/bdc-prd-dbd/board'
  },
  // 一级入口：数据看板首页
  {
    path: '/bdc-prd-dbd/board',
    component: Home
  },
  // 1.1 二级入口：转化漏斗
  {
    path: '/bdc-prd-dbd/dashboard',
    component: Dashboard
  },
  // 1.2 二级入口：ROI分析
  {
    path: '/bdc-prd-dbd/roi',
    component: Roi
  },
  // 2.1 二级入口：指标看板
  {
    path: '/bdc-prd-dbd/dataBoard',
    component: DataBoard
  },
  // 2.2 二级入口：指标申请
  {
    path: '/bdc-prd-dbd/apply',
    component: Apply
  },
  // 2.3 二级入口：指标释义
  {
    path: '/bdc-prd-dbd/myinds',
    component: MyInds
  },
  {
    path: '/bdc-prd-dbd/editInd',
    component: EditInd
  },
  {
    path: '/bdc-prd-dbd/apply/ind',
    component: Ind
  },
  // 指标释义
  {
    path: '/bdc-prd-dbd/indesc',
    component: Indesc
  },
  // 名词释义
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
    path: '/test',
    component: test
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

/*
 * 页面加载Store
*/
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

let rel = router.beforeEach((to, from, next) => {
  // 从路由的元信息中获取 title 属性
/*  if (to.meta.title) {
    document.title = to.meta.title;
  }*/

  console.log('URL查询对象', to.query);

  // 从路由的元信息中获取 title 属性
  to.query.appVersion && Cookie.set('t8t-it-appVersion', to.query.appVersion);
  to.query.appType && Cookie.set('t8t-it-appType', to.query.appType);
  to.query.deviceId && Cookie.set('t8t-it-deviceId', to.query.deviceId);
  to.query.version && Cookie.set('t8t-it-version', to.query.version);
  to.query.accountId && Cookie.set('t8t-it-accountId', to.query.accountId);
  to.query.tickets && Cookie.set('t8t-it-ticket', to.query.tickets);
  to.query.token && Cookie.set('t8t-it-token', to.query.token);
  to.query.uid && Cookie.set('t8t-it-uid', to.query.uid);
  to.query.uName && Cookie.set('t8t-it-uname', to.query.uName);
  rel();
  next();
  if (!to.query.uName) {
    setTimeout(()=>{
      VueApp.$vux.toast.show({
        type: 'warn',
        text: 'URL中的uName参数为空,这将导致后台查看接口调用的用户名为"-", 请与OA开发者协商, 在数据查看页面的URL中携带uName参数。',
        width: '80%',
        time: 10000
      })
    }, 3000);
  } else {
    setTimeout(()=>{
      VueApp.$vux.toast.show({
        text: 'uName: ' + to.query.uName,
        width: '80%',
        time: 2000
      });
    }, 3000);
  }
});

/* eslint-disable no-new */
var VueApp = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
