<template>
  <div>
    <div class="tbt-pannel">
      <div class="tbt-cell" style="height: 40px;">
        <div class="tbt-cell_hd">时间粒度</div>
        <div class="tbt-cell_bd">
          <tab-radio v-model="granularity"></tab-radio>
        </div>
      </div>

      <div class="tbt-cell" style="height: 40px;">
        <div class="tbt-cell_hd">时间范围</div>
        <div class="tbt-cell_bd">
          <div style="margin-left: 15px; color: #333;" @click.stop="handleOnClickDateSelect">
            {{ currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title">
        <div class="tbt-pannel_tittle-inner">漏斗转化
          <span class="tbt-pannel_title-append">({{currentDate }})</span>
          <div class="tbt-pannel_title-rt">
            <div class="tbt-tooltip-wrapper">
              <i @click="funnelTooltipShow=true" class="tbt-icon tbt-icon-info" style="position: relative; right: 2px;" />
              <div v-show="funnelTooltipShow" v-click-outside="()=>{funnelTooltipShow=false}" class="tbt-tooltip-content" :style="`width: ${winW-30}px;`">
                <div class="tbt-tooltip-arrow-up"></div>
                <table class="tbt-tooltip-table">
                  <tr><td valign="top">日同比：</td><td>对比上周同日，如上周三对比上周同日</td></tr>
                  <tr><td valign="top">周同比：</td><td>对比上个月同期，往回推四周，如本月第一周，对比上月第一周</td></tr>
                  <tr><td valign="top">月同比：</td><td>对比去年同期</td></tr>
                </table>
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
        <div class="tbt-pannel_tittle-inner">指标趋势
          <div class="tbt-pannel_title-rt">
            <div class="tbt-tooltip-wrapper">
              <i @click="trendsTooltipShow=true" class="tbt-icon tbt-icon-info" style="position: relative; right: 2px;" />
              <div v-show="trendsTooltipShow" v-click-outside="()=>{trendsTooltipShow=false}" class="tbt-tooltip-content" :style="`width: ${winW-30}px;`">
                <div class="tbt-tooltip-arrow-up"></div>
                <table class="tbt-tooltip-table">
                  <tr><td valign="top">日同比：</td><td>对比上周同日，如上周三对比上周同日</td></tr>
                  <tr><td valign="top">周同比：</td><td>对比上个月同期，往回推四周，如本月第一周，对比上月第一周</td></tr>
                  <tr><td valign="top">月同比：</td><td>对比去年同期</td></tr>
                </table>
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
                  <chart-line v-for="(sub_item, sub_idx) in item.children" v-show="tabs[idx]==sub_idx" :data="sub_item.data" :y-percent="sub_item.vtype && sub_item.vtype==1" :y-w="sub_item.vtype && sub_item.vtype==2"></chart-line>
                </template>
                <template v-else>
                  <chart-line :data="item.data" :y-percent="item.vtype && item.vtype==1" :y-w="item.vtype && item.vtype==2"></chart-line>
                </template>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <popup-picker style="max-width: 100%; display: none;" cancel-text="取消" confirm-text="确认" :show.sync="showWeekPicker" :columns="1" :show-cell="false" title="选择周" :data="weeks" v-model="currentWeek" @on-change="handleOnChangeWeek"></popup-picker>
  </div>
</template>

<script>
import mLoading from '../../common/mixins/loading'
import dashMixin from './mixin'
import conf from './statistical.conf'
import {Line as ChartLine} from '../../common/chart'
import moment from 'moment'

export default {
  mixins: [mLoading, dashMixin],
  components: {
    ChartLine
  },
  filters: {
  },
  data () {
    return {
      mode: 1,
      granularity: 0, // 时间粒度
      conf
    }
  },
  computed: {
    trendsStartDate () {
      let granularity = this.granularity;

      return granularity == 1 ? moment(this.currentWeek[0].split('~')[0]).subtract(11, 'weeks').format('YYYY-MM-DD')
             : granularity == 0 ? moment(this.currentDay).subtract(29, 'days').format('YYYY-MM-DD')
             : granularity == 2 ? moment(this.currentMonth).subtract(12, 'months').format('YYYY-MM') : '';
    },
    trendsEndDate () {
      let granularity = this.granularity;

      return granularity == 1 ? this.currentWeek[0].split('~')[1]
             : granularity == 0 ? this.currentDay
             : granularity == 2 ? this.currentMonth : '';
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
