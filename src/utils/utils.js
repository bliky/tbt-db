export const getImgUrl = src => {
  return `http://www.to8to.com/${src}`
}

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
