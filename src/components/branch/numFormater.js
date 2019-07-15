import { filterNumber } from '../../common/filter'

export default (val, data_type) => {
  let fval = parseFloat(val);
  let suffix = '';
  if (isNaN(fval)) {
    return '-';
  }
  console.log(data_type)
  switch (data_type) {
    case 3:
      return filterNumber(fval, '0,0');
    case 1:
      if (fval >= 10000) {
        fval /= 10000;
        suffix = '万';
      }
      return filterNumber(fval, '0,0') + suffix;
    case 2:
      return filterNumber(fval*100, '0,0.0', '', '%') + suffix;
  }
  return filterNumber(fval, '0,0.00');
}
