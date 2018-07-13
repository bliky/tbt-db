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
      funnel: [
        {class_id: 1, class_name: '发起', value: [100,0,0]}, 
        {class_id: 2, class_name: '新增', value: [73,0,0]},
        {class_id: 3, class_name: '可售', value: [54,0,0]},
        {class_id: 4, class_name: '分派', value: [32,0,0]},
        {class_id: 5, class_name: '扣款', value: [24,0,0]},
        {class_id: 6, class_name: '签约', value: [3,0,0]}
      ],
      tabs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 支持10组数据的tab切换
      trends: []
    }
  },
  watch: {
    granularity (newVal, oldVal) {
      try {
        switch (newVal) {
          case 0:
            let lastDay = moment().subtract(1, 'days');
            this.currentDate = lastDay.format('YYYY-MM-DD');
            break;
          case 1:
            break;
          case 2:
            let lastMonth = moment().subtract(1, 'months');
            this.currentDate = lastMonth.format('YYYY-MM');
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
        funnelData.push(funnel[i].value[0]);
      }
      return funnelData;
    }
  },
  methods: {
    fetchData (dt, mode) {
      let param = {mode: mode||this.mode, gra: ['day', 'week', 'month'][this.granularity], dt};
      this.openLoading();
      fetchDashboard(param).then(res => {
        //console.log("请求参数", param, '响应数据', res.data);
        this.updateChart(res.data.result);
        this.$nextTick(() => {
          setTimeout(this.closeLoading(), 800);
        });
      })
    },
    parseTrends (trends) {
      let trendsTemp = {};
      let trendsName = {};
      let trendsRes = [];

      trends.forEach(item => {
        let {dt_range, class_id, class_name, value} = item;
        let kid = String(class_id);
        if (typeof trendsTemp[kid] === 'undefined') {
          trendsTemp[kid] = [];
          trendsName[kid] = class_name;
        }
        if (dt_range.indexOf('~') !== -1) {
          console.log(dt_range);
          dt_range = dt_range.split('~')[1];
        }
        trendsTemp[kid].push({ dt: dt_range, val: value });
      });

      this.conf.forEach(item => {
        if (item.children && item.children.length) {
          let kp = trendsRes.length;
          trendsRes.push({name: item.name, children:[]});
          item.children.forEach(item => {
            let id = String(item.id);
            let trd = trendsRes[kp].children;
            trd.push({ id, name: trendsName[id]||item.name, data: trendsTemp[id]||[] });
            if (item.vtype) {
              trd[trd.length-1]['vtype'] = item.vtype;
            }
          })
        } else {
          let id = String(item.id);

          trendsRes.push({ id, name: trendsName[id]||item.name, data: trendsTemp[id]||[] });
          if (item.vtype) {
            trendsRes[trendsRes.length-1]['vtype'] = item.vtype;
          }
        }
      });

      console.log(trendsTemp, trendsRes);
      return trendsRes;
    },
    updateChart (data) {
      try {
        let {funnel, trends} = data;

        // 校验服务端返回数据是否正常
        if (!funnel || !trends || !funnel.length || !trends.length) {
          throw '漏斗数据接口字段格式有误，请检查相关字段。file: statistical.vue line:205 。';
        }
        this.funnel = funnel;
        this.trends = this.parseTrends(trends);
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
