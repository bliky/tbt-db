<template>
  <div style="background-color: #f6f6f6; margin-bottom: -50px; padding-bottom: 30px;">
    <div class="tbt-pannel" style="display:table; width: 100%; word-spacing:-1em; text-align: center; padding: 10px 0; height: 30px; letter-spacing: 0;">
      <div class="tbt-sel-tag" @click.stop="handleOnClickDateSelect">{{ currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>

      <div class="tbt-sel-tag" @click.stop="handleOnClickSelect">{{ currentSeled }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>
    </div>
    <div class="tbt-pannel s1">
      <div class="tbt-pannel_title">指标总况</div>
      <div class="roi-g">
        <div class="roi-gi">
          <div class="roi-gin">
            <p>现金消费</p>
            <p><b>{{ roi.all.input|filter-wan }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>收入</p>
            <p><b>{{ roi.all.income|filter-wan }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>ROI</p>
            <p><b>{{ roi.all.roi|filter-number('0,0.00') }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>可售信息数</p>
            <p><b>{{ roi.all.saleable|filter-wan('0,0') }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>次数浪费率</p>
            <p><b>{{roi.all.waste|filter-number('0,0.00', '', '%')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>签约订单数</p>
            <p><b>{{ roi.all.orders|filter-wan('0,0') }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>分派签约率</p>
            <p><b>{{ roi.all.order_per_assignment|filter-number('0,0.00', '', '%') }}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>可售单价</p>
            <p><b>{{ roi.all.cansold_unit_price|filter-wan }}</b></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 渠道分析：12个月趋势，分消费，收入，ROI -->
    <month-trends :city="currentSeled"></month-trends>

    <popup-picker style="max-width: 100%; display: none;" cancel-text="取消" confirm-text="确认" :show.sync="showSelector" :columns="1" :show-cell="false" title="选择渠道" :data="opts" v-model="id" @on-change="handleOnSelectorChange"></popup-picker>
  </div>
</template>

<script>
import localDb from '../../common/db'
import storage from '../../common/storage'
import { buildQuery } from '../../common/stringify'
import mLoading from '../common/mixins/loading'
import { filterNumber, filterWan } from '../../common/filter'
import monthTrends from './subcoms/monthTrends'
import moment from 'moment'
import { fetchRoiCh } from '../../services/api'
import { PopupPicker } from 'vux'

const resetRoiData = {
        all: {
          input: 0,
          income: 0,
          roi: 0,
          saleable: 0,
          waste: 0,
          orders: 0,
          order_per_assignment: 0,
          cansold_unit_price: 0
        },
        trends: {
          input: [{ dt: '', val: 0 }],
          income: [{ dt: '', val: 0 }],
          roi: [{ dt: '', val: 0 }]
        }
      };

export default {
  mixins: [mLoading],
  data () {
    let startDay = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
    return {
      id: [this.$route.params.id],
      currentDate: localDb.get('roi_cdt') || '',
      startDay,
      endDay: localDb.get('roi_endday') || moment().format('YYYY-MM-DD'),
      opts: localDb.get('channels'),
      roi: resetRoiData,
      showSelector: false
    }
  },
  computed: {
    currentSeled () {
      let channel = this.opts.find(item => item.value == this.id[0]);

      return channel && channel.name;
    }
  },
  components: {
    PopupPicker,
    monthTrends
  },
  filters: {
    filterNumber,
    filterWan
  },
  created () {
    this.fetchData();
  },
  methods: {
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
      return res.all &&
             res.trends &&
             res.trends.input && res.trends.input.length &&
             res.trends.income && res.trends.income.length &&
             res.trends.roi && res.trends.roi.length;
    },
    fetchData (id=this.id[0], dt=this.currentDate) {
      let skey = {  app: 'roiChannel', dt, id };

      let localCacheData = this.localCache(skey);
      if (localCacheData) {
        this.roi = localCacheData;
        return;
      }

      this.openLoading();
      fetchRoiCh({dt, id}).then(data => {
        if (data.status !== 200) return console.error('[fetchRoiCh]异常状态status: ', data.status);

        if (this.checkData(data.result)) {
          this.roi = data.result;
          this.localCache(skey, data.result);

          this.$nextTick(() => {
            setTimeout(this.closeLoading(), 800);
          });
        } else {
          this.resetRoi();
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
            that.fetchData();
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
    handleOnClickSelect () {
      this.showSelector = true;
    },
    handleOnSelectorChange (val) {
      this.fetchData();
    }
  }
};
</script>
