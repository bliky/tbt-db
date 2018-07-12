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

export {
  filterNumber
}
