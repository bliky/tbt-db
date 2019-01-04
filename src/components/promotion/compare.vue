<template>
<div class="promotion-page">
  <div class="compare-card">
    <div class="compare-row">
      <div class="compare-left">选择落地类型</div>
      <div class="compare-right">
        <ul class="compare-type-list">
          <li v-for="type in comPramas.type" :key="type">{{ type|com-type }}</li>
        </ul>
      </div>
    </div>
    <div class="compare-row">
      <div class="compare-left">对比时间1</div>
      <div class="compare-right">{{ comPramas.dt1[0] + (comPramas.dt1[1] ? ' 至 ' + comPramas.dt1[1] : '') }}</div>
    </div>
    <div class="compare-row">
      <div class="compare-left">对比时间2</div>
      <div class="compare-right">{{ comPramas.dt2[0] + (comPramas.dt2[1] ? ' 至 ' + comPramas.dt2[1] : '') }}</div>
    </div>
  </div>
  <table class="tbt-promotion-table">
    <tr>
      <th style="width: 84px;">渠道</th>
      <th>对比时间1</th>
      <th>对比时间2</th>
      <th>变动幅度%</th>
    </tr>
    <tr v-for="row in compareData" :key="row.displayNameId">
      <td>{{ row.displayName }}</td>
      <td>{{ formatRow(2, row.cost1) }}</td>
      <td>{{ formatRow(2, row.cost2) }}</td>
      <td>
        <span v-if="row.rate > 0" style="color:#FC3142">
          {{ formatRow(3, row.rate) }}
        </span>
        <span v-else>
          {{ formatRow(3, row.rate) }}
        </span>
      </td>
    </tr>
  </table>
  <div class="compare-botbar">
    <div class="compare-botbar-hd" @click="$router.push({ path: '/bdc-prd-dbd/promotion-tracking' })">返回</div>
    <div class="compare-botbar-bd" @click="$router.push({ path: '/bdc-prd-dbd/compare-filter' })">修改筛选条件</div>
  </div>
</div>
</template>

<script>
import formatRow from './formatRow'
import { fetchTrackingCashCompare } from '../../services/api'
import { goTo } from '../../utils/utils'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import mLoading from '../common/mixins/loading'

export default {
  mixins: [mLoading],
  filters: {
    comType (t) {
      return ['非落地城市', '新落地城市', '老落地城市'][t]
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('tracking', ['compareData', 'comPramas'])
  },
  mounted () {
    document.title = '现金消费对比'
    this.fetch({ params: this.comPramas, type: 'compare' })
  },
  methods: {
    ...mapActions('tracking', ['fetch']),
    formatRow (data_type, val) {
      return formatRow(data_type, val)
    }
  }
}
</script>

<style lang="less">
@import './promotion.less';
@import './tracking.less';
</style>
