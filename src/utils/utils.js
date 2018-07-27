export const getImgUrl = src => {
  return `http://www.to8to.com/${src}`
}

//app点击返回按钮
export const callNative = function(typeId, data){
  let jsonData = {}; //初始化
  if(data){
    jsonData = {"type":typeId,"data":data}
  }else{
    jsonData = {"type":typeId}
  }
  let searchStr = window.location.search+""
  if(searchStr.indexOf('appType=1') !==-1){ //android
    rabbitcircle.invoke( JSON.stringify(jsonData) )
  }else{ //ios
    window.location.href = 'to8to://www.oa.com/app/approve?json=' + JSON.stringify(jsonData)
  }

}
module.exports.callNative = callNative;

//utils.callNative(1007, {"url":noticeDetailUrl,"title":"新闻"});

export const appSystem = function() {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  // 这个是安卓操作系统
  if (isAndroid) {
    return 'android'
  }
  // 这个是ios操作系统
  if (isIOS) {
    return 'ios'
  }
}

const is_dev = process.env.NODE_ENV !== 'production';
const baseUrl = is_dev ? '' : 'https://dbdbigdata.to8to.com';

const routData = {
  funnel: { url: baseUrl + '/bdc-prd-dbd/dashboard', title:'转化漏斗' },
  roi: { url: baseUrl + '/bdc-prd-dbd/roi', title:'ROI分析' },
  indView: { url: baseUrl + '/bdc-prd-dbd/dataBoard', title:'指标看板' },
  indApply: { url: baseUrl + '/bdc-prd-dbd/apply', title:'指标申请' },
  indAnnotation: { url: baseUrl + '/bdc-prd-dbd/MyInds', title:'指标释义' },
  indDesc: { url: baseUrl + '/bdc-prd-dbd/indesc', title:'指标释义' },
  nounDesc: { url: baseUrl + '/bdc-prd-dbd/nounDesc', title:'名词释义' }
};

export const navTo = is_dev ?
  function (name) { this.$router.push({ path: routData[name].url }) } :
  function (name) { callNative(1007, routData[name]) };

export const openFile = is_dev ?
  function (path, title='') { window.open(path); } :
  function (path, title='') { callNative(1007, { url: 'https://dbdbigdata.to8to.com' + path, title }) };
