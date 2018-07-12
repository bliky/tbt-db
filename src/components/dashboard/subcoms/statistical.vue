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
            {{ granularity == 1 ? currentWeek[0] : currentDate }} <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title"><div class="tbt-pannel_tittle-inner">漏斗转化<span class="tbt-pannel_title-append">({{ currentDate }})</span></div></div>
      <div class="tbt-pannel_bd">
        <!-- <chart-funnel></chart-funnel> -->
        <div style="height: 280px; overflow: hidden; position: relative;">
          <div style="position: absolute; top: 40px; left: 50%;">
            <chart-funnel :data='funnelData' style="position: relative; left: -50%;"></chart-funnel>
          </div>
          <div style="position: absolute; top: 0; left: 0; width: 100%;">
            <table class="tbt-funnel-table">
              <tr><th style="width: 40%;">类别</th><th style="width: 20%;">转化率</th><th style="width: 20%;">数值</th><th style="width: 20%;">环比</th></tr>

              <tr>
                <td>发起</td><td>{{funnel[0][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[0][1]|filter-number}}</td>
                <td :class="{increase: funnel[0][2]>0, decrease: funnel[0][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[0][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

              <tr>
                <td>新增</td><td>{{funnel[1][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[1][1]|filter-number}}</td>
                <td :class="{increase: funnel[1][2]>0, decrease: funnel[1][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[1][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

              <tr>
                <td>可售</td><td>{{funnel[2][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[2][1]|filter-number}}</td>
                <td :class="{increase: funnel[2][2]>0, decrease: funnel[2][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[2][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

              <tr>
                <td>分派</td><td>{{funnel[3][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[3][1]|filter-number}}</td>
                <td :class="{increase: funnel[3][2]>0, decrease: funnel[3][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[3][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

              <tr>
                <td>扣款</td><td>{{funnel[4][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[4][1]|filter-number}}</td>
                <td :class="{increase: funnel[4][2]>0, decrease: funnel[4][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[4][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

              <tr>
                <td>签约</td><td>{{funnel[5][0]|filter-number('0.0', '', '%')}}</td><td>{{funnel[5][1]|filter-number}}</td>
                <td :class="{increase: funnel[5][2]>0, decrease: funnel[5][2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(funnel[5][2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title"><div class="tbt-pannel_tittle-inner">指标趋势<span class="tbt-pannel_title-append">({{ currentDate }})</span></div></div>
      <div class="tbt-pannel_bd">
        <ul class="tbt-trend-list">
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">UV</div>
            <div class="tbt-trend-chart">
              <chart-line :data="trends.uv" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">线索</div>
            <div class="tbt-trend-tabs">
              <tab :line-width="2" v-model="tabs[0]" active-color="#06C792">
                <tab-item>发起次数</tab-item>
                <tab-item>发起/UV</tab-item>
                <tab-item>新增</tab-item>
                <tab-item>新增/发起</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line v-show="tabs[0]==0" :data="trends.clue_launch" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[0]==1" :data="trends.clue_launch_per_uv" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[0]==2" :data="trends.clue_rise" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[0]==3" :data="trends.clue_rise_per_launch" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">可售</div>
            <div class="tbt-trend-tabs" style="width: 220px;">
              <tab :line-width="2" v-model="tabs[1]" active-color="#06C792">
                <tab-item>可售信息数</tab-item>
                <tab-item>可售/新增</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line v-show="tabs[1]==0" :data="trends.saleable" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[1]==1" :data="trends.saleable_per_clue_rise" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">分派</div>
            <div class="tbt-trend-tabs" style="width: 220px;">
              <tab :line-width="2" v-model="tabs[2]" active-color="#06C792">
                <tab-item>分派信息数</tab-item>
                <tab-item>分派/可售</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line v-show="tabs[2]==0" :data="trends.assignment" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[2]==1" :data="trends.assignment_per_saleable" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">扣款</div>
            <div class="tbt-trend-tabs" style="width: 330px;">
              <tab :line-width="2" v-model="tabs[3]" active-color="#06C792">
                <tab-item>扣款信息数</tab-item>
                <tab-item>扣款/分派</tab-item>
                <tab-item>金额</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line v-show="tabs[3]==0" :data="trends.payment" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[3]==1" :data="trends.payment_per_assignment" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[3]==2" :data="trends.payment_money" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">签约</div>
            <div class="tbt-trend-tabs">
              <tab :line-width="2" v-model="tabs[4]" active-color="#06C792">
                <tab-item>订单数</tab-item>
                <tab-item>订单金额</tab-item>
                <tab-item>签约/扣款</tab-item>
                <tab-item>客单价</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line v-show="tabs[4]==0" :data="trends.order" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[4]==1" :data="trends.order_money" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[4]==2" :data="trends.order_per_payment" :count="trendXCount" :max="trendXMax"></chart-line>
              <chart-line v-show="tabs[4]==3" :data="trends.unit_price" :count="trendXCount" :max="trendXMax"></chart-line>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <popup-picker cancel-text="取消" confirm-text="确认" :show.sync="showWeekPicker" :columns="1" :show-cell="false" title="选择周" :data="weeks" v-model="currentWeek" @on-change="handleOnChangeWeek"></popup-picker>
  </div>
</template>

<script>
import mLoading from '../../common/mixins/loading'
import dashMixin from './mixin'

export default {
  mixins: [mLoading, dashMixin],
  components: {
  },
  filters: {
  },
  data () {
    return {
      mode: 1,
      granularity: 0, // 时间粒度
      tabs: [0, 0, 0, 0, 0]
    }
  },
  watch: {
  },
  created () {
    // 获取初始数据：日
    this.fetchData(this.currentDate, 1);
  },
  mounted () {
  },
  methods: {
  }
};
</script>
