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
            <p><b>{{roi.all.input/10000|filter-number('0,0.00', '', '万')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>收入</p>
            <p><b>{{roi.all.income/10000|filter-number('0,0.00', '', '万')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>ROI</p>
            <p><b>{{roi.all.roi|filter-number('0,0.00')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>可售信息数</p>
            <p><b>{{roi.all.saleable/10000|filter-number('0,0.00', '', '万')}}</b></p>
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
            <p><b>{{roi.all.order/10000|filter-number('0,0.00', '', '万')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>分派签约率</p>
            <p><b>{{roi.all.order_per_assignment|filter-number('0,0.00', '', '%')}}</b></p>
          </div>
        </div>
        <div class="roi-gi">
          <div class="roi-gin">
            <p>可售单价</p>
            <p><b>{{roi.all.unit_price/10000|filter-number('0,0.00', '', '万')}}</b></p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 城市分析：渠道top10，分消费，收入，ROI -->
    <city-ch-top10></city-ch-top10>
    <!-- 城市分析：12个月趋势，分消费，收入，ROI -->
    <month-trends :city="currentSeled"></month-trends>

    <popup-picker style="max-width: 100%; display: none;" cancel-text="取消" confirm-text="确认" :show.sync="showSelector" :columns="1" :show-cell="false" title="选择城市" :data="opts" v-model="id" @on-change="handleOnSelectorChange"></popup-picker>
  </div>
</template>

<script>
import localDb from '../../common/db'
import storage from '../../common/storage'
import { buildQuery } from '../../common/stringify'
import mLoading from '../common/mixins/loading'
import { filterNumber } from '../../common/filter'
import cityChTop10 from './subcoms/cityChTop10'
import monthTrends from './subcoms/monthTrends'
import moment from 'moment'
import { fetchRoiCity } from '../../services/api'
import { PopupPicker } from 'vux'

const resetRoiData = {
        all: {
          input: 0,
          income: 0,
          roi: 0,
          saleable: 0,
          liangfang: 0,
          order: 0,
          order_per_assignment: 0,
          unit_price: 0
        },
        top10: [
          [{ name: '', value: 0 }],
          [{ name: '', value: 0 }],
          [{ name: '', value: 0 }]
        ],
        trends: [
          [{ dt: '', val: 0 }],
          [{ dt: '', val: 0 }],
          [{ dt: '', val: 0 }]
        ]
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
      opts: localDb.get('citys'),
      roi: resetRoiData,
      showSelector: false
    }
  },
  computed: {
    currentSeled () {
      let city = this.opts.find(item => item.value == this.id[0]);

      return city && city.name;
    }
  },
  components: {
    PopupPicker,
    cityChTop10,
    monthTrends
  },
  filters: {
    filterNumber
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
      return res.all && res.top10 && res.top10.length && res.trends && res.trends.length;
    },
    fetchData (id=this.id[0], dt=this.currentDate) {
      let skey = {  app: 'roiCity', dt, id };

      let localCacheData = this.localCache(skey);
      if (localCacheData) {
        this.roi = localCacheData;
        return;
      }

      this.openLoading();
      fetchRoiCity({dt, id}).then(data => {
        if (data.status !== 200) return console.error('[fetchRoiCity]异常状态status: ', data.status);

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
