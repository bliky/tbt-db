export const roiViewModel = res => {
  let result = res.data.result;
  let vresult = {
        all: {
          input: 0,
          income: 0,
          roi: 0,
          input_m_ratio: 0,
          input_y_ratio: 0,
          income_m_ratio: 0,
          income_y_ratio: 0,
          roi_m_ratio: 0,
          roi_y_ratio: 0
        },
        city: [],
        ch10: []
      };
  let city = vresult.city;
  let ch10 = vresult.ch10;
  let _city = {};
  let _ch10 = {};

  const idMap = {
    '1': 'input',
    '2': 'income'
  }

  for (let i=0, len=result.length; i<len; i++) {
    let item = result[i];
    let dim_id = item.dim_id;
    let dim_value = item.dim_value;
    let class_id = item.class_id;
    let value = item.value;

    let key;
    switch (dim_id) {
      case 0:
        // 汇总值
        break;
      case 1:
        // 城市分析
        if (!_city[dim_value]) {
          _city[dim_value] = {};
        }
        key = idMap[String(class_id)];
        if (key) {
          _city[dim_value][key] = value
        }
        break;
      case 6:
        // 渠道分析
        if (!_ch10[dim_value]) {
          _ch10[dim_value] = {};
        }
        key = idMap[String(class_id)];
        if (key) {
          _ch10[dim_value][key] = value
        }
        break;
    }
  }

  res.data.result = vresult;
  return res;
}
