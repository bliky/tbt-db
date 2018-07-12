<script>
import { Group, CellBox, Cell, Checker, CheckerItem, Tab,TabItem, PopupPicker } from 'vux'
import { Funnel as ChartFunnel, Line as ChartLine } from '../../common/chart'
import { tabRadio } from '../../common/tab'
import '../../common/icon'
import { exceptionScript } from '../../../common/exception'
import { filterNumber } from '../../../common/filter'
import _ from 'lodash'
import moment from 'moment'
import { fetchDashboard } from '../../../services/api';
import Vue from 'vue'
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)

export default {
  components: {
    Group,
    CellBox,
    Cell,
    Checker,
    CheckerItem,
    Tab,
    TabItem,
    PopupPicker,
    ChartFunnel,
    ChartLine,
    tabRadio
  },
  filters: {
    filterNumber
  },
  data () {
    let startDay = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
    let lastDay = moment().subtract(1, 'days');
    return {
      startDay,
      weeks: [],
      showWeekPicker: false,
      currentWeek: [],
      currentDate:  lastDay.format('YYYY-MM-DD'),
      funnel: [[100,0,0], [73,0,0], [54,0,0], [32,0,0], [24,0,0], [3,0,0]],
      trends: {
        uv: [{dt: '2018-07-11', value: 100}],
        clue_launch: [{dt: '2018-07-11', value: 100}],
        clue_launch_per_uv: [{dt: '2018-07-11', value: 100}],
        clue_rise: [{dt: '2018-07-11', value: 100}],
        clue_rise_per_launch: [{dt: '2018-07-11', value: 100}],
        saleable: [{dt: '2018-07-11', value: 100}],
        saleable_per_clue_rise: [{dt: '2018-07-11', value: 100}],
        assignment: [{dt: '2018-07-11', value: 100}],
        assignment_per_saleable: [{dt: '2018-07-11', value: 100}],
        payment: [{dt: '2018-07-11', value: 100}],
        payment_per_assignment: [{dt: '2018-07-11', value: 100}],
        payment_money: [{dt: '2018-07-11', value: 100}],
        order: [{dt: '2018-07-11', value: 100}],
        order_money: [{dt: '2018-07-11', value: 100}],
        order_per_payment: [{dt: '2018-07-11', value: 100}],
        unit_price: [{dt: '2018-07-11', value: 100}]
      },
      trendXCount: 30,
      trendXMax: ''
    }
  },
  watch: {
    granularity (newVal, oldVal) {
      try {
        switch (newVal) {
          case 0:
            let lastDay = moment().subtract(1, 'days');
            this.currentDate = lastDay.format('YYYY-MM-DD');
            this.trendXCount = 30;
            break;
          case 1:
            this.trendXCount = 12;
            break;
          case 2:
            let lastMonth = moment().subtract(1, 'months');
            this.currentDate = lastMonth.format('YYYY-MM');
            this.trendXCount = 13;
            break;
        }
      } catch (err) {
        exceptionScript(err);
      }
    }
  },
  created () {
    this.initWeeks();
    this.currentWeek = [this.weeks[0].value];
  },
  computed: {
    funnelData () {
      let funnel = this.funnel;
      let funnelData = [];
      for (let i=0, len=funnel.length; i<len; i++) {
        funnelData.push(funnel[i][0]);
      }
      console.log(funnelData);
      return funnelData;
    }
  },
  methods: {
    fetchData (dt, mode) {
      let param = {mode: mode||this.mode, gra: ['day', 'week', 'month'][this.granularity], dt};
      this.openLoading();
      fetchDashboard(param).then(res => {
        //console.log("请求参数", param, '响应数据', res.data);
        this.updateChart(res.data.data);
        this.$nextTick(() => {
          setTimeout(this.closeLoading(), 800);
        });
      })
    },
    updateChart (data) {
      try {
        let {funnel, trends} = data;
        let th_trends = this.trends;
        let tmp_trends = {};

        // 校验服务端返回数据是否正常
        if (!funnel || !trends) {
          throw '漏斗数据接口字段格式有误，请检查相关字段。file: statistical.vue line:205 。';
        }
        this.funnel = funnel;

        for (const k in th_trends) {
          if (th_trends.hasOwnProperty(k) && k !== 'constructor' ) {
            tmp_trends[k] = [];
            for (let i = 0, len = trends.length; i < len; i++) {
              let trend = trends[i];
              tmp_trends[k].push({dt: trend.date, value: trend[k]});
            }
          }
        }
        this.trends = tmp_trends;
      } catch (err) {
        exceptionScript(err);
      }
    },
    initWeeks () {
      let weeks = this.weeks;
      if (weeks.length === 0) {
        let yearBefore = moment().subtract(1, 'years').startOf('year');
        let lastWeek = moment().day(-7);
        let weekStart = lastWeek.startOf('week').format('YYYY-MM-DD');
        let weekEnd = lastWeek.endOf('week').format('YYYY-MM-DD');
        let th = 1;

        while (yearBefore.isBefore(weekEnd)) {
          weeks.push({
            name: weekStart + '~' + weekEnd,
            value: weekStart+'~'+weekEnd,
            parent: 0
          });
          lastWeek = lastWeek.day(-7);
          weekStart = lastWeek.startOf('week').format('YYYY-MM-DD');
          weekEnd = lastWeek.endOf('week').format('YYYY-MM-DD');
        }
      }
    },
    openDatePicker (opts) {
      try {
        let that = this;
        const def = {
          confirmText: '确认',
          cancelText: '取消',
          yearRow: '{value}年',
          monthRow: '{value}月',
          dayRow: '{value}日',
          onConfirm (value) {
            that.currentDate = value;
            that.fetchData(value);
          },
          onHide () {
            const _this = this
          },
          onShow () {
            const _this = this
          }
        };
        var opts = typeof opts === 'object' ? Object.assign({}, def, opts) : def;
        this.$vux.datetime.show(opts);
      } catch (err) {
        exceptionScript(err);
      }
    },
    graDay () {
      let lastDay = moment().subtract(1, 'days').format('YYYY-MM-DD');
      this.openDatePicker({
        value: lastDay,
        startDate: this.startDay,
        endDate: lastDay
      });
    },
    graWeek () {
      this.showWeekPicker = true
    },
    graMonth () {
      let lastMonth = moment().subtract(1, 'months');
      this.openDatePicker({
        format: 'YYYY-MM',
        value: lastMonth.format('YYYY-MM'),
        startDate: this.startDay,
        endDate: lastMonth.format('YYYY-MM-DD')
      });
    },
    handleOnClickDateSelect () {
      let granularity = this.granularity // 根据时间粒度来使用不同的日期选择
      try {
        switch (granularity) {
          case 0:
            this.graDay();
            break;
          case 1:
            this.graWeek();
            break;
          case 2:
            this.graMonth();
            break;
          default:
            throw '未识别的时间粒度参数：' + granularity;
        }
      } catch (err) {
        exceptionScript(err);
      }
    },
    handleOnChangeWeek (val) {
      this.fetchData(val[0]);
    }
  }
}
</script>
