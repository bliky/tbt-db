import Vue from 'vue';
import VueRouter from 'vue-router';

import FastClick from 'fastclick';
import axios from 'axios';

import F2 from '@antv/f2';
import { ConfigPlugin, ConfirmPlugin, LoadingPlugin, ToastPlugin } from 'vux';

import utils from './utils/utils';
import http from './utils/http.js';
import App from './App';

import router from './router';
import store from './store';

// import VConsole from 'vconsole'
// new VConsole();

// 清空 sessionStorage
window.sessionStorage.clear();

Vue.prototype.$http = http;
window.axios = axios;

Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);

Vue.use(VueRouter, F2, Vue, utils, ConfigPlugin, {
  $layout: 'VIEW_BOX'
});

FastClick.attach(document.body);

if (process.env.NODE_ENV !== 'production') {
  require('./services/mock').default.bootstrap();
}

/* eslint-disable no-new */
var VueApp = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
