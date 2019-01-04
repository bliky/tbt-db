import { filterNumber } from '../../common/filter'

export default (data_type, val) => {
  let fval = parseFloat(val);
  let suffix = '';
  if (isNaN(fval)) {
    return '-';
  }
  if (fval >= 10000) {
    fval /= 10000;
    suffix = '万';
  }
  switch (data_type) {
    case 1:
      return suffix ? filterNumber(fval, '0,0.0') + suffix : filterNumber(fval, '0,0');
    case 2:
      return filterNumber(fval, '0,0.0') + suffix;
    case 3:
      return filterNumber(fval*100, '0,0', '', '%') + suffix;
  }
  return filterNumber(fval, '0,0.00') + suffix;
}
