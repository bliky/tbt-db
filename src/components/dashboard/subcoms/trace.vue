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

              <tr v-for="item in funnel">
                <td>{{item.class_name}}</td><td>{{item.value[0]|filter-number('0.0', '', '%')}}</td><td>{{item.value[1]|filter-number}}</td>
                <td :class="{increase: item.value[2]>0, decrease: item.value[2]<0}">
                  <i class="tbt-icon tbt-icon-in" style="position: relative; left: 3px; top: 3px;"></i>
                  <i class="tbt-icon tbt-icon-de" style="position: relative; left: 3px; top: 3px;"></i>
                  {{Math.abs(item.value[2])|filter-number('0.0', '', '%')}}
                </td>
              </tr>

            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="tbt-pannel">
      <div class="tbt-pannel_title"><div class="tbt-pannel_tittle-inner">转化率趋势<span class="tbt-pannel_title-append">(基于发起线索时间)</span></div></div>
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

    <popup-picker cancel-text="取消" confirm-text="确认" :show.sync="showWeekPicker" :columns="1" :show-cell="false" title="选择周" :data="weeks" v-model="currentWeek" @on-change="handleOnChangeWeek"></popup-picker>
  </div>
</template>

<script>
import mLoading from '../../common/mixins/loading'
import dashMixin from './mixin'
import conf from './trace.conf'

export default {
  mixins: [mLoading, dashMixin],
  components: {
  },
  data () {
    return {
      mode: 2,
      granularity: 1, // 时间粒度
      conf
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
