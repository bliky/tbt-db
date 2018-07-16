import axios from 'axios';
import http from '../utils/http.js';
import Cookie from 'js-cookie';

const is_dev = false; // process.env.NODE_ENV !== 'production'

const apis = {
  dashboard: 'dsa/dataBoard/dashboard'
};

const baseParams = {
  uid: Cookie.get('t8t-it-uid'),
  uname: Cookie.get('t8t-it-uname'),
  tickets: Cookie.get('t8t-it-ticket')
};

export const fetchDashboard = params => {
  return is_dev ? axios.post('/dashboard', params) :
         http.fetch(apis.dashboard, Object.assign({}, baseParams, params));
}; // 获取业绩总况统计数据
