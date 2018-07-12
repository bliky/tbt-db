import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import moment from 'moment';

function genTrendData (dt) {
  return Mock.mock({
          date: dt, // 数据日期
          uv: '@int(1000000, 10000000)', // 用户访问量
          clue_launch: '@int(1000000, 10000000)', // 发起线索次数
          clue_launch_per_uv:  '@float(0.1, 0.9)', // 发起/UV
          clue_rise:  '@int(1000000, 10000000)', // 新增线索
          clue_rise_per_launch:  '@float(0.1, 0.9)', // 新增/发起线索
          saleable:  '@int(1000000, 10000000)', // 可售信息数
          saleable_per_clue_rise:  '@float(0.1, 0.9)', // 可售/新增
          assignment:  '@int(1000000, 10000000)', // 分派
          assignment_per_saleable:  '@float(0.1, 0.9)', // 分派/可售
          payment:  '@int(1000000, 10000000)', // 扣款信息数
          payment_per_assignment:  '@float(0.1, 0.9)', // 扣款/分派
          payment_money: '@float', // 扣款金额
          order:  '@int(1000000, 10000000)', // 订单数
          order_money:  '@float', // 订单金额
          order_per_payment:  '@float(0.1, 0.9)', // 签约/扣款
          unit_price:  '@float(10000, 500000)', // 客单价
        })
}

function genPercent() {
  return Mock.Random.float(0, 120, 2, 2);
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

      switch (gra) {
        case 'day':
          // 过去30天的数据
          cdy = moment(dt);
          for (let i=0; i<30; i++) {
            trends.push(genTrendData(cdy.format('YYYY-MM-DD')))
            cdy.subtract(1, 'days')
          }
          break;
        case 'week':
          // 过去12周的数据
          cdy = moment(dt.split('~')[0]);
          for (let i=0; i<12; i++) {
            let st = cdy.format('YYYY-MM-DD');
            let end = moment(st).add(6, 'days').format('YYYY-MM-DD')
            trends.push(genTrendData(st + '~' + end))
            cdy.subtract(1, 'week')
          }
          break;
        case 'month':
          // 过去13个月的数据
          cdy = moment(dt);
          for (let i=0; i<13; i++) {
            trends.push(genTrendData(cdy.format('YYYY-MM')))
            cdy.subtract(1, 'month')
          }
          break;
      }

      let resp = {
        code: 0, // 成功返回0 失败返回错误码
        msg: '', // 可选 code!=2 时 提供异常信息
        data: {  // 响应数据
          funnel: [  // 漏斗转化数据
            [100, genNumber(), genPercent2()], // 发起: 转化率,数值,环比
            [genPercent(), genNumber(), genPercent2()], // 新增: 转化率,数值,环比
            [genPercent(), genNumber(), genPercent2()], // 可售: 转化率,数值,环比
            [genPercent(), genNumber(), genPercent2()], // 分派: 转化率,数值,环比
            [genPercent(), genNumber(), genPercent2()], // 扣款: 转化率,数值,环比
            [genPercent(), genNumber(), genPercent2()]  // 签约: 转化率,数值,环比
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

  }
};
