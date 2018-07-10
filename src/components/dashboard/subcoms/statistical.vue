<template>
  <div>
    <div class="tbt-pannel">
      <div class="tbt-cell" style="height: 40px;">
        <div class="tbt-cell_hd">时间粒度</div>
        <div class="tbt-cell_bd">
          <tab-radio></tab-radio>
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
      <div class="tbt-pannel_title"><div class="tbt-pannel_tittle-inner">漏斗转化<span class="tbt-pannel_title-append">({{ currentDate }})</span></div></div>
      <div class="tbt-pannel_bd">
        <chart-funnel></chart-funnel>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title"><div class="tbt-pannel_tittle-inner">指标趋势<span class="tbt-pannel_title-append">({{ currentDate }})</span></div></div>
      <div class="tbt-pannel_bd">
        <ul class="tbt-trend-list">
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">UV</div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">线索</div>
            <div class="tbt-trend-tabs">
              <tab custom-bar-width="60px">
                <tab-item>发起次数</tab-item>
                <tab-item>发起/UV</tab-item>
                <tab-item>新增</tab-item>
                <tab-item>新增/发起</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">可售</div>
            <div class="tbt-trend-tabs">
              <tab custom-bar-width="60px">
                <tab-item>可售信息数</tab-item>
                <tab-item>可售/新增</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">分派</div>
            <div class="tbt-trend-tabs">
              <tab custom-bar-width="60px">
                <tab-item>分派信息数</tab-item>
                <tab-item>分派/可售</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">扣款</div>
            <div class="tbt-trend-tabs">
              <tab custom-bar-width="60px">
                <tab-item>扣款信息数</tab-item>
                <tab-item>扣款/分派</tab-item>
                <tab-item>金额</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
          <li class="tbt-trend-item">
            <div class="tbt-trend-title">签约</div>
            <div class="tbt-trend-tabs">
              <tab custom-bar-width="60px">
                <tab-item>订单数</tab-item>
                <tab-item>订单金额</tab-item>
                <tab-item>签约/扣款</tab-item>
                <tab-item>客单价</tab-item>
              </tab>
            </div>
            <div class="tbt-trend-chart">
              <chart-line></chart-line>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, CellBox, Cell, Checker, CheckerItem, Tab,TabItem } from 'vux'
import { Funnel as ChartFunnel, Line as ChartLine } from '../../common/chart'
import { tabRadio } from '../../common/tab'
import '../../common/icon'
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
    ChartFunnel,
    ChartLine,
    tabRadio
  },
  data () {
    return {
      currentDate: '2018-06-26'
    }
  },
  mounted () {

  },
  methods: {
    handleOnClickDateSelect () {
      this.$vux.datetime.show({
        value: '', // 其他参数同 props
        confirmText: '确认',
        cancelText: '取消',
        onConfirm (value) {
          console.log('当前选择日期', value)
        },
        onHide () {
          const _this = this
        },
        onShow () {
          const _this = this
        }
      })
    }
  }
};
</script>
