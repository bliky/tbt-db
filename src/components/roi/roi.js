import vue from 'vue'
import { Tab } from '../common/tab'
import '../common/icon'
import Totop from '../common/totop'
import moment from 'moment'
import City from './subcoms/city'
import Ch10 from './subcoms/ch10'
import { fetchRoi } from '../../services/api'
import { filterNumber, filterAbs } from '../../common/filter'
import { exceptionScript } from '../../common/exception'
import storage from '../../common/storage'
import localDb from '../../common/db'
import { buildQuery } from '../../common/stringify'
import mLoading from '../common/mixins/loading'
import clickOutside from '../../directives/clickOutside'
import Vue from 'vue'
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)

const resetRoiData = {
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

export default {
  mixins: [mLoading],
  data () {
    let lastMonth = moment();
    let startDay = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
    return {
      winW: window.innerWidth,
      roiTooltipShow: false,
      index: 0,
      currentDate: lastMonth.format('YYYY-MM'),
      startDay,
      endDay: lastMonth.format('YYYY-MM-DD'),
      roi: resetRoiData
    }
  },
  directives: {
    clickOutside
  },
  components: {
    Tab,
    Totop,
    City,
    Ch10
  },
  filters: {
    filterAbs,
    filterNumber
  },
  created () {
    this.openLoading();
    this.autoFetchLastedData();
  },
  mounted () {
  },
  methods: {
    isBeforeStartDay (dt) {
      // 判断当前日期是否超出最早日期
      return moment(dt).isBefore(this.startDay);
    },
    preDate () {
      let cday = moment(this.endDay).subtract(1, 'days');
      this.currentDate = cday.format('YYYY-MM');
      this.endDay = cday.format('YYYY-MM-DD');
      return !this.isBeforeStartDay(this.endDay);
    },
    autoFetchLastedData () {
      let dt = this.currentDate;
      return fetchRoi({dt}).then(data => {
        if (this.checkData(data.result)) {
          let skey = {app: 'roi', dt};
          this.roi = data.result;
          this.localCache(skey, data.result);
          // 提取城市和渠道数据 保存到localDb 可用作详情页 下拉选择组件的选项数据
          this.saveCityCh();
          // 将当期日期保存到 localDb 用于详情页 初始化当前选择日期
          localDb.set('roi_cdt', dt);
          // 保存数据最近更新日期到 localDb 用于详情页 初始化日期结束日
          localDb.set('roi_endday', this.endDay);
          this.$nextTick(() => {
            setTimeout(this.closeLoading(), 800);
          });
        } else {
          if (!this.preDate()) {
            return this.$vux.toast.text('超出起始日期！');
          }
          return this.autoFetchLastedData();
        }
      })
    },
    resetRoi () {
      this.roi = resetRoiData;
    },
    localCache (param, data) {
      let qs = buildQuery(param);
      if (!data) {
        return storage.get(qs);
      }

      return storage.set(qs, data);
    },
    checkData (res) {
      return res.all && res.city && res.city.length && res.ch10 && res.ch10.length;
    },
    fetchData (dt=this.currentDate) {
      let skey = {app: 'roi', dt};

      let localCacheData = this.localCache(skey);
      if (localCacheData) {
        this.roi = localCacheData;
        return;
      }

      this.openLoading();
      fetchRoi({dt}).then(data => {
        if (data.status !== 200) return console.error('[fetchRoi]异常状态status: ', data.status);

        if (this.checkData(data.result)) {
          this.roi = data.result;
          this.localCache(skey, data.result);
          // 提取城市和渠道数据 保存到localDb 可用作详情页 下拉选择组件的选项数据
          this.saveCityCh();
          this.$nextTick(() => {
            setTimeout(this.closeLoading(), 800);
          });
        } else {
          this.resetRoi ();
          this.closeLoading()
          this.$vux.toast.text('当前日期(' + this.currentDate + ')数据未更新');
        }
      }).catch(err => {
        setTimeout(()=>{
          this.closeLoading();
          this.$vux.toast.text('服务器繁忙,请稍后再试');
        }, 800);
      });
    },
    graMonth () {
      this.openDatePicker({
        format: 'YYYY-MM',
        value: this.currentDate,
        startDate: this.startDay,
        endDate: this.endDay
      });
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
            // 将当期选择日期保存到 localDb 用于详情页 初始化当前选择日期
            localDb.set('roi_cdt', value);
          }
        };
        var opts = typeof opts === 'object' ? Object.assign({}, def, opts) : def;
        this.$vux.datetime.show(opts);
      } catch (err) {
        exceptionScript(err);
      }
    },
    handleOnClickDateSelect () {
      this.graMonth();
    },
    clickRoiTooltipOutside (e) {
      let _class = e.target._prevClass;
      if (_class !== 'tbt-icon tbt-icon-info js-roi' && this.roiTooltipShow) {
        this.roiTooltipShow = false; 
      }
    },
    saveCityCh () {
      this.saveCity();
      this.saveCh();
    },
    // 保存城市数据到localDb
    saveCity () {
      let citys = this.roi.city.map(item => { return { value: item.id, name: item.name } });
      localDb.set('citys', citys);
    },
    // 保存渠道数据到localDb
    saveCh () {
      let chs = this.roi.ch10.map(item => { return { value: item.id, name: item.name } });
      localDb.set('channels', chs);
    }
  }
}
