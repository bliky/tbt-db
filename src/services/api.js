import axios from 'axios';
import http from '../utils/http.js';
import Cookie from 'js-cookie';
import {toast} from '../common/notify';
import Vue from 'vue';

var is_dev = process.env.NODE_ENV !== 'production';

is_dev = false;

const apis = {
  dashboard: 'dsa/dataBoard/dashboard',
  urlIsAccess: 'dsa/dataBoard/urlIsAccess'
};

// 获取业绩总况统计数据
export const fetchDashboard = params => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid'),
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket')
  };
  return is_dev ? axios.post('/dashboard', params) :
         http.fetch(apis.dashboard, Object.assign({}, baseParams, params));
};

// 判断URL是否可以访问
export const urlIsAccess = params => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid'),
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket')
  };
  return is_dev ? axios.post('/urlIsAccess', params) :
         http.fetch(apis.urlIsAccess, Object.assign({}, baseParams, params));
};
