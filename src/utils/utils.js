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
