import axios from 'axios';
import http from '../utils/http.js';
import Cookie from 'js-cookie';
import {toast} from '../common/notify';
import Vue from 'vue';
// import {roiViewModel} from './viewmodel';

const force_production = false;  // 强制使用生产模式: 本地开发时，调用测试接口时打开，提交代码前设置为false
const is_dev = !force_production && process.env.NODE_ENV !== 'production';

const apis = {
  dashboard: 'dsa/dataBoard/dashboard',
  urlIsAccess: 'dsa/dataBoard/urlIsAccess',
  roi: 'dsa/dataBoard/roiList',
  roiCity: 'dsa/dataBoard/roiCityList',
  roiCh: 'dsa/dataBoard/roiChannelList'
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

// 通过城市ID和日期获取 ROI 城市分析数据: 总况 Top10渠道 12个月趋势
export const fetchRoiCity = params => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid'),
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket')
  };
  return (is_dev ? axios.post('/roiCity', params) :
         http.fetch(apis.roiCity, Object.assign({}, baseParams, params))).then(res => res.data);
};

// 通过渠道ID和日期获取 ROI 渠道分析数据: 总况 12个月趋势
export const fetchRoiCh = params => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid'),
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket')
  };
  return (is_dev ? axios.post('/roiCh', params) :
         http.fetch(apis.roiCh, Object.assign({}, baseParams, params))).then(res => res.data);
};
