import Vue from 'vue';
import Vuex from 'vuex';
import F2 from '@antv/f2';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import http from './utils/http.js';
import Cookie from 'js-cookie';
// import VConsole from 'vconsole'
import axios from 'axios';
import { ConfigPlugin, ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux';
import App from './App';
import Home from './components/Home';
import Apply from './components/apply/Apply';
import DataBoard from './components/board/DataBoard';
import EditInd from './components/board/EditInd';
import MyInds from './components/my/MyInds';
import Indesc from './components/my/Indesc';
import NounDesc from './components/my/NounDesc';
import selInd from './components/apply/selInd';
import selDim from './components/apply/selDim';
import Ind from './components/apply/Ind';
import Page from './components/test/testPage';
import Dashboard from './components/dashboard';
import Roi from './components/roi';
import utils from './utils/utils.js';

// new VConsole();

Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

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
  {
    path: '/',
    redirect: '/bdc-prd-dbd/board'
  },
  {
    path: '/dbd',
    redirect: '/bdc-prd-dbd/board'
  },
  {
    path: '/bdc-prd-dbd/board',
    component: Home
  },
  {
    path: '/bdc-prd-dbd/dataBoard',
    component: DataBoard
  },
  {
    path: '/bdc-prd-dbd/editInd',
    component: EditInd
  },
  {
    path: '/bdc-prd-dbd/apply',
    component: Apply
  },
  {
    path: '/bdc-prd-dbd/apply/ind',
    component: Ind
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
  },
  {
    path: '/bdc-prd-dbd/dashboard',
    component: Dashboard
  },
  {
    path: '/bdc-prd-dbd/roi',
    component: Roi
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
  if (to.meta.title) {
    document.title = to.meta.title;
  }
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
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
