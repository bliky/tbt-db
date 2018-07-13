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
  filterYAxis
}
