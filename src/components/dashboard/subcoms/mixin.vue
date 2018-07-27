<script>
import { Group, CellBox, Cell, Checker, CheckerItem, Tab,TabItem, PopupPicker } from 'vux'
import { Funnel as ChartFunnel } from '../../common/chart'
import { tabRadio } from '../../common/tab'
import '../../common/icon'
import { exceptionScript } from '../../../common/exception'
import { buildQuery } from '../../../common/stringify'
import { confirm } from '../../../common/notify'
import { filterNumber, filterAbs } from '../../../common/filter'
import storage from '../../../common/storage'
import _ from 'lodash'
import moment from 'moment'
import { fetchDashboard } from '../../../services/api';
import Vue from 'vue'
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)

const funnelResetData = [
        {class_id: 1, class_name: '发起', value: [0,0,0]}, 
        {class_id: 2, class_name: '新增', value: [0,0,0]},
        {class_id: 3, class_name: '可售', value: [0,0,0]},
        {class_id: 4, class_name: '分派', value: [0,0,0]},
        {class_id: 5, class_name: '扣款', value: [0,0,0]},
        {class_id: 6, class_name: '签约', value: [0,0,0]}
      ];

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
    tabRadio
  },
  filters: {
    filterAbs,
    filterNumber
  },
  directives: {
    ClickOutside : {
      bind: function (el, { value }) {
        let onClickOutside = value
        el.handler = function (e) {
          if (el && !el.contains(e.target)) {
            onClickOutside(e)
          }
        }
        document.addEventListener('click', el.handler, true)
      },
      unbind: function (el) {
        document.removeEventListener('click', el.handler, true)
        el.handler = null
      }
    }
  },
  data () {
    let startDay = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
    let lastDay = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let lastMonth = moment().subtract(1, 'months');
    return {
      winW: window.innerWidth,
      startDay,
      endDay: lastDay,
      endMonth: lastMonth.format('YYYY-MM-DD'),
      weeks: [],
      showWeekPicker: false,
      currentDay: lastDay,
      currentMonth: lastMonth.format('YYYY-MM'),
      currentWeek: [],
      funnel: funnelResetData,
      tabs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 支持10组数据的tab切换
      trends: [],
      funnelTooltipShow: false,
      trendsTooltipShow: false
    }
  },
  watch: {
    granularity () {
      this.fetchData();
    }
  },
  created () {
    this.initWeeks();
    this.currentWeek = [this.weeks[0].value];
    this.fetchData();
  },
  computed: {
    funnelData () {
      let funnel = this.funnel;
      let funnelData = [];
      for (let i=0, len=funnel.length; i<len; i++) {
        funnelData.push(funnel[i].value[0]);
      }
      return funnelData;
    },
    currentDate () {
      let granularity = this.granularity;

      return granularity == 1 ? this.currentWeek[0]
             : granularity == 0 ? this.currentDay
             : granularity == 2 ? this.currentMonth : '';
    }
  },
  methods: {
    resetFunnel () {
      this.funnel = funnelResetData;
    },
    resetTrends () {
      this.trends = [];
    },
    localCache (param, data) {
      let qs = buildQuery(param);
      if (!data) {
        return storage.get(qs);
      }

      return storage.set(qs, data);
    },
    fetchData (dt, mode) {
      let param = {mode: mode||this.mode, gra: ['day', 'week', 'month'][this.granularity], dt: dt||this.currentDate};

      let localCacheData = this.localCache(param);
      if (localCacheData) {
        return this.updateChart(localCacheData);
      }

      this.openLoading();
      fetchDashboard(param).then(res => {
        if (this.updateChart(res.data.result)) {
          this.localCache(param, res.data.result);
        }
        this.$nextTick(() => {
          setTimeout(this.closeLoading(), 800);
        });
      }).catch(err => {
        setTimeout(()=>{
          this.closeLoading();
          alert('获取数据失败');
        }, 800);
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

        trendsTemp[kid].push({ dt: dt_range, val: Number(value)||0 });
      });

      this.conf.forEach(item => {
        if (item.children && item.children.length) {
          let kp = trendsRes.length;
          trendsRes.push({name: item.name, children:[]});
          item.children.forEach(item => {
            let id = String(item.id);
            let trd = trendsRes[kp].children;
            trd.push({ id, name: item.name||trendsName[id], data: trendsTemp[id]||[] });
            if (item.vtype) {
              trd[trd.length-1]['vtype'] = item.vtype;
            }
          })
        } else {
          let id = String(item.id);

          trendsRes.push({ id, name: item.name||trendsName[id], data: trendsTemp[id]||[] });
          if (item.vtype) {
            trendsRes[trendsRes.length-1]['vtype'] = item.vtype;
          }
        }
      });

      return trendsRes;
    },
    isBeforeStartDay (dt) {
      // 判断当前日期是否超出最早日期
      return moment(dt).isBefore(this.startDay);
    },
    preDate () {
      switch (this.granularity) {
        case 0: // 日
          this.currentDay = moment(this.currentDay).subtract(1, 'days').format('YYYY-MM-DD');
          return !this.isBeforeStartDay(this.currentDay);
        case 1: // 周
          let lastWeek = moment(this.currentWeek[0].split('~')[0]).day(-7);
          let weekStart = lastWeek.startOf('week').format('YYYY-MM-DD');
          let weekEnd = lastWeek.endOf('week').format('YYYY-MM-DD');
          this.currentWeek[0] = weekStart + '~' + weekEnd;
          return !this.isBeforeStartDay(weekEnd);
        case 2: // 月
          this.currentMonth = moment(this.currentMonth).subtract(1, 'months').format('YYYY-MM');
          return !this.isBeforeStartDay(this.currentMonth);
      }
    },
    autoFetchLastedData () {
      if (!this.preDate()) {
        return '超出起始日期！';
      }
      let param = {mode: this.mode, gra: ['day', 'week', 'month'][this.granularity], dt: this.currentDate};

      this.openLoading();
      return fetchDashboard(param).then(res => {
        let {funnel} = res.data.result;
        if (funnel && funnel.length) {
          return res.data.result;
        } else {
          return this.autoFetchLastedData();
        }
      })
    },
    updateChart (data) {
      try {
        let {funnel, trends} = data;

        // 校验服务端返回数据是否正常
        if (!funnel || !trends) {
          this.$vux.toast.text('API接口返回数据,无相关字段~');
          throw '漏斗数据接口字段格式有误，请检查相关字段。file: mixin.vue line:165 。';
        }

        /**
          @comment: 漏斗转化数据为空，自动获取最近一个日期的数据，产品经理要求去掉这个功能，所以暂时注释，如果需要去掉注释即可
          @author: ken.li
          @date: 2018-07-18
        */
        /*if (!funnel.length) {
          confirm.call(this, '当前日期(' + this.currentDate + ')暂无转化率数据~', '是否获取最近一个有效日期的数据？')
                .then(() => {
                  this.autoFetchLastedData().then(res => {
                    if (typeof res === typeof '') {
                      this.closeLoading();
                      return this.$vux.toast.text(res);
                    }
                    let {funnel, trends} = res;
                    this.funnel = funnel;
                    this.trends = this.parseTrends(trends);
                    let param = {mode: this.mode, gra: ['day', 'week', 'month'][this.granularity], dt: this.currentDate};
                    this.localCache(param, res);
                    this.$nextTick(() => {
                      setTimeout(this.closeLoading(), 800);
                    });
                  });
                })
                .catch(() => {
                  console.log('取消获取最近的数据');
                });
          return false;
        }*/
        if (funnel.length) {
          this.funnel = funnel;
        } else {
          this.resetFunnel();
        }
        if (trends.length) {
          this.trends = this.parseTrends(trends);
        }  else {
          this.resetTrends();
        }
        if (!trends.length) {
          this.$vux.toast.text('趋势数据为空!');
        }
        if (!funnel.length) {
          this.$vux.toast.text('漏斗数据为空!');
        }
        if (!funnel.length || !trends.length) {
          return false;
        }
        return true;
      } catch (err) {
        exceptionScript(err);
        return false;
      }
      return true;
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
            that[that.granularity==0?'currentDay':'currentMonth'] = value;
            // 更新当前Day或Month
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
      this.openDatePicker({
        value: this.currentDay,
        startDate: this.startDay,
        endDate: this.endDay
      });
    },
    graWeek () {
      this.showWeekPicker = true
    },
    graMonth () {
      this.openDatePicker({
        format: 'YYYY-MM',
        value: this.currentMonth,
        startDate: this.startDay,
        endDate: this.endMonth
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
    },
    clickFunnelTooltipOutside (e) {
      let _class = e.target._prevClass;
      if (_class !== 'tbt-icon tbt-icon-info js-fn' && this.funnelTooltipShow) {
        this.funnelTooltipShow = false; 
      }
    },
    clickTrendsTooltipOutside (e) {
      let _class = e.target._prevClass;
      if (_class !== 'tbt-icon tbt-icon-info js-tr' && this.trendsTooltipShow) {
        this.trendsTooltipShow = false; 
      }
    }
  }
}
</script>
