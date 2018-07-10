import axios from 'axios';
import http from '../utils/http.js';

const is_dev = process.env.NODE_ENV !== 'production'
const fetch = is_dev ? axios.post : http.fetch

export const fetchDashboard = params => { return fetch(is_dev ? '/dashboard' : 'dashboard', params); }; // 获取业绩总况统计数据
