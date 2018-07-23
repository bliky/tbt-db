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
  }
};
