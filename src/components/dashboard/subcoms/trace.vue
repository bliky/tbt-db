<template>
  <div>
    <div class="tbt-pannel">
      <div class="tbt-cell" style="height: 40px;">
        <div class="tbt-cell_hd">时间粒度</div>
        <div class="tbt-cell_bd">
          <tab-radio noday v-model="granularity"></tab-radio>
        </div>
      </div>

      <div class="tbt-cell" style="height: 40px;">
        <div class="tbt-cell_hd">时间范围</div>
        <div class="tbt-cell_bd">
          <div style="margin-left: 15px; color: #333;" @click="handleOnClickDateSelect">
            {{ currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title">
        <div class="tbt-pannel_tittle-inner">漏斗转化
          <span class="tbt-pannel_title-append">({{ currentDate }})</span>
          <div class="tbt-pannel_title-rt">
            <div class="tbt-tooltip-wrapper">
              <a @click.stop="funnelTooltipShow=!funnelTooltipShow" class="tbt-icon tbt-icon-info js-fn"></a>
              <div v-show="funnelTooltipShow" v-click-outside="clickFunnelTooltipOutside" class="tbt-tooltip-content" :style="`width: ${winW-30}px;`">
                <div class="tbt-tooltip-arrow-up"></div>
                <p>
                  选择日期范围内，实际发生的发起线索数、新增线索数，在今日0点前产生的可售、分派、扣款、签约的漏斗转化数据
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tbt-pannel_bd">
        <!-- <chart-funnel></chart-funnel> -->
        <div style="height: 280px; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 40px; left: 50%;">
            <chart-funnel :data='funnelData' style="position: relative; left: -50%;"></chart-funnel>
          </div>
          <div style="position: absolute; top: 0; left: 0; width: 100%;">
            <table class="tbt-funnel-table">
              <tr><th style="width: 40%;">类别</th><th style="width: 20%;">转化率</th><th style="width: 20%;">数值</th><th style="width: 20%;">环比</th></tr>

              <tr v-for="item in funnel">
                <td>{{item.class_name}}</td><td>{{item.value[0]|filter-number('0.0', '', '%')}}</td><td>{{item.value[1]|filter-number}}</td>
                <td :class="{increase: item.value[2]>0, decrease: item.value[2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{item.value[2]|filter-abs|filter-number('0.0', '', '%')}}
                </td>
              </tr>

            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title">
        <div class="tbt-pannel_tittle-inner">转化率趋势
          <div class="tbt-pannel_title-rt">
            <div class="tbt-tooltip-wrapper">
              <a @click.stop="trendsTooltipShow=!trendsTooltipShow" class="tbt-icon tbt-icon-info js-tr"></a>
              <div v-show="trendsTooltipShow" v-click-outside="clickTrendsTooltipOutside" class="tbt-tooltip-content" :style="`width: ${winW-30}px;`">
                <div class="tbt-tooltip-arrow-up"></div>
                <p>
                  展示各个重要环节的7（30）天跟踪转化率的日趋势，如7月1日可售/新增的7天转化率，代表7月1日产生的新增线索数，在后续7天（到7月7日）的转化，即7月8日0点更新7月1日的7天转化率；同理签约/扣款的30天转化率，当天扣款信息数在30天内转化为签约订单数的转化率
                </p>
              </div>
            </div>
          </div>
          <!-- <span class="tbt-pannel_title-append">({{trendsStartDate}}&nbsp;到&nbsp;{{trendsEndDate}})</span> -->
        </div>
      </div>
      <div class="tbt-pannel_bd">
        <ul class="tbt-trend-list">
          <template v-if="trends.length">
            <li v-for="(item, idx) in trends" class="tbt-trend-item">
              <div class="tbt-trend-title">{{item.name}}</div>
              <div v-if="item.children && item.children.length" class="tbt-trend-tabs">
                <tab :line-width="2" v-model="tabs[idx]" active-color="#06C792">
                  <tab-item v-for="(sub_item, sub_idx) in item.children">{{sub_item.name}}</tab-item>
                </tab>
              </div>
              <div class="tbt-trend-chart">
                <template v-if="item.children && item.children.length" >
                  <chart-line v-for="(sub_item, sub_idx) in item.children" v-show="tabs[idx]==sub_idx" :data="sub_item.data" :y-percent="sub_item.vtype && sub_item.vtype==1"></chart-line>
                </template>
                <template v-else>
                  <chart-line :data="item.data" :y-percent="item.vtype && item.vtype==1"></chart-line>
                </template>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <popup-picker style="max-width: 100%; display: none;"  cancel-text="取消" confirm-text="确认" :show.sync="showWeekPicker" :columns="1" :show-cell="false" title="选择周" :data="weeks" v-model="currentWeek" @on-change="handleOnChangeWeek"></popup-picker>
  </div>
</template>

<script>
import mLoading from '../../common/mixins/loading'
import dashMixin from './mixin'
import conf from './trace.conf'
import {Line2 as ChartLine} from '../../common/chart'
import moment from 'moment'

export default {
  mixins: [mLoading, dashMixin],
  components: {
    ChartLine
  },
  data () {
    return {
      mode: 2,
      granularity: 1, // 时间粒度
      conf
    }
  },
  computed: {
    trendsStartDate () {
      let granularity = this.granularity;

      return granularity == 1 ? moment(this.currentWeek[0].split('~')[1]).subtract(29, 'days').format('YYYY-MM-DD')
             : granularity == 0 ? moment(this.currentDay).subtract(29, 'days').format('YYYY-MM-DD')
             : granularity == 2 ? moment(this.currentMonth).startOf('month').format('YYYY-MM-DD') : '';
    },
    trendsEndDate () {
      let granularity = this.granularity;

      return granularity == 1 ? this.currentWeek[0].split('~')[1]
             : granularity == 0 ? this.currentDay
             : granularity == 2 ?  moment(this.currentMonth).endOf('month').format('YYYY-MM-DD') : '';
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
