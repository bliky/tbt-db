import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import zkModel from '../components/dashboard/model';

const MockData = {
  zk: Mock.mock({'rows|10': [{
    date: '@date',
    uv: '@int(1000000, 10000000)',
    clue_launch: '@int(100000, 1000000)', // 发起线索
    clue_rise: '@int(10000, 100000)', // 新增线索
    saleable: '@int(1000, 10000)', // 可售
    assignment: '@int(100, 1000)', // 分派
    payment: '@int(10, 100)', // 扣款数
    payment_money: '@int(10000, 10000000)', // 扣款金额
    order: '@int(100, 1000)', // 订单数
    order_money: '@int(10000, 10000000)', // 订单金额
    sign: '@int(100, 1000)', // 签约数
    unit_price: '@int(1000, 100000)', // 客单价
    clue_launch_per_uv: '@float(0.1, 0.9)', // 发起线索/UV
    clue_rise_per_launch: '@float(0.1, 0.9)', // 新增/发起线索
    saleable_per_clue_launch: '@float(0.1, 0.9)', // 可售/新增
    assignment_per_saleable: '@float(0.1, 0.9)', // 分派/可售
    payment_per_assignment: '@float(0.1, 0.9)', // 扣款/分派
    sign_per_payment: '@float(0.1, 0.9)' // 签约/扣款
  }]})
}

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    mock.onPost('/dashboard').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {status: 200, result: MockData.zk}]);
        }, Math.random() * 1000 + 1000);
      });
    });
  }
};
