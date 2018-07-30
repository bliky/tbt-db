import axios from 'axios';
import http from '../utils/http.js';
import Cookie from 'js-cookie';
import {toast} from '../common/notify';
import Vue from 'vue';

const is_dev = process.env.NODE_ENV !== 'production';

const apis = {
  dashboard: 'dsa/dataBoard/dashboard',
  urlIsAccess: 'dsa/dataBoard/urlIsAccess',
  roi: 'dsa/dataBoard/roi'
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

// 获取ROI数据
export const fetchRoi = params => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid'),
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket')
  };
  return (is_dev ? axios.post('/roi', params) :
         http.fetch(apis.roi, Object.assign({}, baseParams, params))).then(res => res.data);
};
