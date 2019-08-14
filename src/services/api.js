import axios from 'axios';
import http from '../utils/http.js';
import Cookie from 'js-cookie';

const force_production = true;  // 强制使用生产模式: 本地开发时，调用测试接口时打开，提交代码前设置为false
const is_dev = !force_production && process.env.NODE_ENV !== 'production';

// API注册
const apis = {
  dashboard: 'dsa/dataBoard/dashboard',
  urlIsAccess: 'dsa/dataBoard/urlIsAccess',
  roi: 'dsa/dataBoard/roiList',
  roiCity: 'dsa/dataBoard/roiCityList',
  roiCh: 'dsa/dataBoard/roiChannelList',
  indClass: 'dsa/dataBoard/indClassList', // 指标申请页初始化请求接口：获取指标一级分类
  ind: 'dsa/dataBoard/indList', // 指标申请页二级入口：获取指标列表
  dimAndAttr: 'dsa/dataBoard/dimAndAttrList', // 指标申请页三级入口：获取指标属性维度
  submitApply: 'dsa/dataBoard/submitApply', // 提交指标申请
  insertApply: 'dsa/dataBoard/insertApply', // 插入指标申请
  promotionCh: 'dsa/dataBoard/promotion/getChannelList',  // 推广渠道
  promotionCity: 'dsa/dataBoard/promotion/getCityList',   // 推广城市
  promotion: 'dsa/dataBoard/promotion/getMainList', // 查询推广专题指标
  promotionTrend: 'dsa/dataBoard/promotion/getTrendList', // 查询推广专题趋势数据
  trackingBudget: 'dsa/dataBoard/advertise/getBudgetList', // 推广效果跟踪: 预算进度接口
  trackingClue: 'dsa/dataBoard/advertise/getClueList', // 推广效果跟踪: 新增线索接口
  trackingSale: 'dsa/dataBoard/advertise/getAccurateSaleList', // 推广效果跟踪: 精准可售接口
  trackingCashCompare: 'dsa/dataBoard/advertise/getCashCompareList', // 推广效果跟踪: 消费对比接口
  trackingUpdateTime: 'dsa/dataBoard/advertise/getUpdateTime', // 推广效果跟踪: 数据更新时间
  branchOfficeUpdateTime: 'dsa/dataBoard/branchOffice/updateTime', // 分公司专题：获取数据更新时间
  branchOfficeGetCityList: 'dsa/dataBoard/branchOffice/getCityList', // 分公司专题：获取区/城市数据
  branchOfficeGetCoreIndicator: 'dsa/dataBoard/branchOffice/getCoreIndicator', // 分公司专题：获取核心指标数据
  branchOfficeGetIndicatorTendency: 'dsa/dataBoard/branchOffice/getIndicatorTendency', // 分公司专题：获取指标趋势数据
  branchOfficeGetOftenIndicator: 'dsa/dataBoard/branchOffice/getOftenIndicator', // 分公司专题：获取常用指标数据
  branchOfficeUrlIsAccessErp: 'dsa/dataBoard/branchOffice/urlIsAccessErp', // 分公司专题：ERP权限认证
  branchOfficeGetRealtimeGmv: 'dsa/dataBoard/branchOffice/getRealtimeGmv' // 分公司专题：获取实时gmv数据
};

// 分公司专题：ERP权限认证
export const branchOfficeUrlIsAccessErp = params => {
  return request('branchOfficeUrlIsAccessErp', params);
};

// 分公司专题：获取数据更新时间
export const branchOfficeUpdateTime = params => {
  return request('branchOfficeUpdateTime', params);
};

// 分公司专题：获取区/城市数据
export const branchOfficeGetCityList = params => {
  return request('branchOfficeGetCityList', params);
};

// 分公司专题：获取核心指标数据
export const branchOfficeGetCoreIndicator = params => {
  return request('branchOfficeGetCoreIndicator', params);
};

// 分公司专题：获取指标趋势数据
export const branchOfficeGetIndicatorTendency = params => {
  return request('branchOfficeGetIndicatorTendency', params);
};

// 分公司专题：获取常用指标数据
export const branchOfficeGetOftenIndicator = params => {
  return request('branchOfficeGetOftenIndicator', params);
};

// 分公司专题：获取实时gmv数据
export const branchOfficeGetRealtimeGmv = params => {
  return request('branchOfficeGetRealtimeGmv', params);
};

// 服务请求
const request = (apiName, params) => {
  var baseParams = {
    uid: Cookie.get('t8t-it-uid') || '-',
    uname: Cookie.get('t8t-it-uname') || '-',
    tickets: Cookie.get('t8t-it-ticket') || '-'
  };
  return (is_dev ? axios.post('/'+apiName, params) :
         http.fetch(apis[apiName], Object.assign({}, baseParams, params))).then(res => {
          let data = res.data;
          if (data.status != 200) {
            console.error('[request]异常状态status: ', data.status, data.message || '');
            return Promise.reject(data);
          }
          return data
         });
};

// 获取业绩总况统计数据
export const fetchDashboard = params => {
  return request('dashboard', params);
};

// 判断URL是否可以访问
export const urlIsAccess = params => {
  return request('urlIsAccess', params);
};

// 获取ROI数据
export const fetchRoi = params => {
  return request('roi', params);
};

// 通过城市ID和日期获取 ROI 城市分析数据: 总况 Top10渠道 12个月趋势
export const fetchRoiCity = params => {
  return request('roiCity', params);
};

// 通过渠道ID和日期获取 ROI 渠道分析数据: 总况 12个月趋势
export const fetchRoiCh = params => {
  return request('roiCh', params);
};

// 指标申请：获取指标分类
export const fetchIndClass = params => {
  return request('indClass', params);
};

// 指标申请：获取指标
export const fetchInd = params => {
  return request('ind', params);
};

// 指标申请：获取指标维度
export const fetchDimAndAttr = params => {
  return request('dimAndAttr', params);
};

// 指标申请：提交申请
export const submitApply = params => {
  return request('submitApply', params);
};

// 指标申请：插入申请
export const insertApply = params => {
  return request('insertApply', params);
};

// 推广分析：获取推广渠道
export const fetchPromotionCh = params => {
  return request('promotionCh', params);
};

// 推广分析：获取推广城市
export const fetchPromotionCity = params => {
  return request('promotionCity', params);
};

// 推广分析：获取推广指标
export const fetchPromotion = params => {
  return request('promotion', params);
};

// 推广分析：获取推广趋势
export const fetchPromotionTrend = params => {
  return request('promotionTrend', params);
};

// 推广效果跟踪: 预算进度接口
export const fetchTrackingBudget = params => {
  return request('trackingBudget', params);
};

// 推广效果跟踪: 新增线索接口
export const fetchTrackingClue = params => {
  return request('trackingClue', params);
};

// 推广效果跟踪: 精准可售接口
export const fetchTrackingSale = params => {
  return request('trackingSale', params);
};

// 推广效果跟踪: 消费对比接口
export const fetchTrackingCashCompare = params => {
  return request('trackingCashCompare', params);
};

// 推广效果跟踪: 获取数据更新时间
export const fetchTrackingUpdateTime = params => {
  return request('trackingUpdateTime', params);
};
