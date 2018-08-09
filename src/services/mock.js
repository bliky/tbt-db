import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import moment from 'moment';

/*function genTrendData (dt) {
  return Mock.mock({
          date: dt, // 数据日期
          uv: '@int(1000000, 10000000)', // 用户访问量
          clue_launch: '@int(1000000, 10000000)', // 发起线索次数
          clue_launch_per_uv:  '@float(0, 100, 1, 1)', // 发起/UV  无
          clue_rise:  '@int(1000000, 10000000)', // 新增线索
          clue_rise_per_launch:  '@float(0, 100, 1, 1)', // 新增/发起线索
          saleable:  '@int(1000000, 10000000)', // 可售信息数
          saleable_per_clue_rise:  '@float(0, 100, 1, 1)', // 可售/新增
          assignment:  '@int(1000000, 10000000)', // 分派
          assignment_per_saleable:  '@float(0, 100, 1, 1)', // 分派/可售
          payment:  '@int(1000000, 10000000)', // 扣款信息数
          payment_per_assignment:  '@float(0, 100, 1, 1)', // 扣款/分派 无
          payment_money: '@float', // 扣款金额
          order:  '@int(1000000, 10000000)', // 订单数
          order_money:  '@float', // 订单金额
          order_per_payment:  '@float(0, 100, 1, 1)', // 签约/扣款
          unit_price:  '@float(10000, 500000)', // 客单价
        })
}*/

const trendName = ['0', '1', '2', '3', '4', '5', '6', '发起次数', '新增线索', '新增/发起线索', '可售信息数', '可售/新增', '分派', '分派/可售', '扣款信息数', '扣款金额', '订单数', '订单金额', '签约/扣款', '客单价', '扣款/分派', 'UV', '发起/UV'];

function genTrendData (dt, id) {
  return {
          dt_range: dt, // 数据日期
          class_id: id, // 
          class_name: trendName[id],
          value: [9, 11, 13, 18].indexOf(id) === -1 ? genNumber() : genPercent()
        }
}

function genPercent() {
  return Mock.Random.float(0, 100, 1, 1);
}

function genPercent2() {
  return Mock.Random.float(-100, 100, 2, 2);
}

function genNumber() {
  return Mock.Random.natural(500, 15000);
}

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    mock.onPost('/dashboard').reply(config => {
      let params = JSON.parse(config.data);
      let mode = params.mode;
      let gra = params.gra;
      let dt = params.dt;
      let trends = [];
      let cdy;
      let class_id = 8;

      let class_ids = mode == 1 ? [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] :
                                 [3, 6, 9, 12];

      switch (gra) {
        case 'day':
          // 过去30天的数据
          cdy = moment(dt);
          for (let i=0; i<30; i++) {
            for (let j=0; j<class_ids.length; j++) {
              trends.push(genTrendData(cdy.format('YYYY-MM-DD'), class_ids[j]));
            }
            cdy.subtract(1, 'days');
          }
          break;
        case 'week':
          // 过去12周的数据
          cdy = moment(dt.split('~')[0]);
          for (let i=0; i<12; i++) {
            let st = cdy.format('YYYY-MM-DD');
            let end = moment(st).add(6, 'days').format('YYYY-MM-DD')
            for (let j=0; j<class_ids.length; j++) {
              trends.push(genTrendData(st + '~' + end, class_ids[j]));
            }
            cdy.subtract(1, 'week');
          }
          break;
        case 'month':
          // 过去13个月的数据
          cdy = moment(dt);
          for (let i=0; i<13; i++) {
            for (let j=0; j<class_ids.length; j++) {
              trends.push(genTrendData(cdy.format('YYYY-MM'), class_ids[j]));
            }
            cdy.subtract(1, 'month');
          }
          break;
      }
      trends.reverse();

      let resp = {
        status: 200, // 成功返回200 失败返回错误码
        msg: '', // 可选 status!=200 时 提供异常信息
        result: {  // 响应数据
          funnel: [  // 漏斗转化数据
            {
              class_id: 1,
              class_name: "发起",
              value: [
                100,          // 转化率
                genNumber(),  // 数值
                genPercent2() // 环比
              ]
            },
            {
              class_id: 2,
              class_name: "新增",
              value: [
                genPercent(),  // 转化率
                genNumber(),   // 数值
                genPercent2()  // 环比
              ]
            },
            {
              class_id: 3,
              class_name: "可售",
              value: [
                genPercent(),  // 转化率
                genNumber(),   // 数值
                genPercent2()  // 环比
              ]
            },
            {
              class_id: 4,
              class_name: "分派",
              value: [
                genPercent(),  // 转化率
                genNumber(),   // 数值
                genPercent2()  // 环比
              ]
            },
            {
              class_id: 5,
              class_name: "扣款",
              value: [
                genPercent(),  // 转化率
                genNumber(),   // 数值
                genPercent2()  // 环比
              ]
            },
            {
              class_id: 6,
              class_name: "签约",
              value: [
                genPercent(),  // 转化率
                genNumber(),   // 数值
                genPercent2()  // 环比
              ]
            }
          ],
          trends
        }
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, resp]);
        }, Math.random() * 1000 + 1000);
      });
    });

    mock.onPost('/urlIsAccess').reply(config => {
      let params = JSON.parse(config.data);
      let resp = {
        status: 200,
        result: {
          isAccess: 'true'
        }
      };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, resp]);
        }, Math.random() * 1000 + 1000);
      });
    });

    // 获取ROI数据
    mock.onPost('/roi').reply(config => {
      let params = JSON.parse(config.data);
      let resp = {
        status: 200,
        result: {
          all: {
            input: Mock.Random.float(200000, 10000000, 2, 2),
            income: Mock.Random.float(200000, 10000000, 2, 2),
            roi:  Mock.Random.float(0, 2, 2, 2)
          },
          city: Mock.mock({'city|100-200': [
                            {
                              id: '@increment',
                              name: '@city',
                              input: '@float(10000, 1000000, 2, 2)',
                              income: '@float(10000, 1000000, 2, 2)',
                              roi: '@float(0, 2, 2, 2)'
                            }
                          ]}).city,
          ch10: Mock.mock({'ch10|100-200': [
                            {
                              id: '@increment',
                              name: '@ctitle',
                              input: '@float(10000, 1000000, 2, 2)',
                              income: '@float(10000, 1000000, 2, 2)',
                              roi: '@float(0, 2, 2, 2)'
                            }
                          ]}).ch10
        }
      };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, resp]);
        }, Math.random() * 1000 + 1000);
      });
    });

    // 获取 ROI 城市分析数据
    mock.onPost('/roiCity').reply(config => {
      let params = JSON.parse(config.data);
      console.log('传参', params);
      let resp = {
        status: 200
      };
      resp.result = genRoiDetail(params.dt);
      resp.result.top10 = genCityTop10Ch();

      console.log('响应', resp);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, resp]);
        }, Math.random() * 1000 + 1000);
      });
    });

    // 获取 ROI 渠道分析数据
    mock.onPost('/roiCh').reply(config => {
      let params = JSON.parse(config.data);
      console.log('传参', params);
      let resp = {
        status: 200
      };
      resp.result = genRoiDetail(params.dt);

      console.log('响应', resp);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, resp]);
        }, Math.random() * 1000 + 1000);
      });
    });
  }
};

function genRoiDetail (dt) {
  var dt = dt || moment().format('YYYY-MM');

  function last12MonthRoiTrends (dt, desStr='@float(10000, 1000000, 2, 2)') {
    let cdy = moment(dt);
    let trends = [];
    for (let i=0; i<13; i++) {
      trends.push(Mock.mock({
        dt: cdy.format('YYYY-MM'),
        val: desStr
      }));
      cdy.subtract(1, 'month');
    }
    trends.reverse();
    return trends;
  }

  return {
          all: {
            input: Mock.Random.float(200000, 10000000, 2, 2),
            income: Mock.Random.float(200000, 10000000, 2, 2),
            roi:  Mock.Random.float(0, 2, 2, 2),
            saleable: Mock.Random.float(10000, 200000, 2, 2),
            waste: Mock.Random.float(0, 99, 2, 2),
            order: Mock.Random.float(1000, 50000, 2, 2),
            order_per_assignment: Mock.Random.float(0, 99, 2, 2),
            unit_price: Mock.Random.float(10000, 500000, 2, 2)
          },
          trends: {
            input: last12MonthRoiTrends(dt),
            income: last12MonthRoiTrends(dt),
            roi: last12MonthRoiTrends(dt, '@float(0, 2, 2, 2)')
          }
        };
}

function genCityTop10Ch () {
  return  {
            input: Mock.mock({'data|10': [
                            {
                              name: '@ctitle',
                              value: '@float(10000, 1000000, 2, 2)'
                            }
                          ]}).data,
            income: Mock.mock({'data|10': [
                            {
                              name: '@ctitle',
                              value: '@float(10000, 1000000, 2, 2)'
                            }
                          ]}).data,
            roi: Mock.mock({'data|10': [
                            {
                              name: '@ctitle',
                              value: '@float(0, 2, 2, 2)'
                            }
                          ]}).data
          };
}

function genNumber() {
  return Mock.Random.natural(500, 15000);
}
