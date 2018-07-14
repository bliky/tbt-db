import numeral from 'numeral'

const filterNumber = (num, format, prefix, suffix) => {
  if (isNaN(parseFloat(num))) {
    return num;
  }

  var format = format || '0,0';
  var prefix = prefix || '';
  var suffix = suffix || '';

  return prefix + numeral(num).format(format) + suffix;
}

const dayGraReg = /^\d{4}-\d{2}-\d{2}$/;
const weekGraReg = /^\d{4}-\d{2}-\d{2}~\d{4}-\d{2}-\d{2}$/;
const monthGraReg = /^\d{4}-\d{2}$/;

const filterXAxis = (timeCat) => {
  if (dayGraReg.test(timeCat)) {
    // 日
    timeCat = timeCat.substr(5);
  } else if (weekGraReg.test(timeCat)) {
    // 周
    timeCat = timeCat.replace(/\d{4}-\d{2}-/g, '');
  } else if (monthGraReg.test(timeCat)) {
    // 月
    timeCat = timeCat.substr(-2) + '月';
  }
  //console.log(timeCat);
  return timeCat;
}

const filterYAxis = (num, suffix) => {
  if (isNaN(parseFloat(num))) {
    return num;
  }

  if (suffix === '%') return num + suffix;

  let ret = num;
  if (num >= 100000000) {
    ret = (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 1000000) {
    ret = (num / 10000000).toFixed(1) + 'kw';
  } else if (num >= 100000) {
    ret = (num / 10000).toFixed(1) + 'w';
  } else if(num >= 100) {
    ret = (num / 1000).toFixed(1) + 'k';
  }

  return ret + (suffix || '');
}

export {
  filterNumber,
  filterXAxis,
  filterYAxis
}
