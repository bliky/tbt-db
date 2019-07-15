<template>
  <div style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: #161C4C;">
    <div class="top-bar-sel2" :class="{checked: showFilter}" @click="onClickSelArea" >
      <span style="opacity: 0.8;font-family: PingFangSC-Regular;font-size: 12px;color: #FFFFFF;">
        选择区域
        <i class="tbt-arrow" style="position: relative; left: 4px; top: 1px; border-top-color: #fff"></i>
      </span>
    </div>
    <query-filter :visible.sync="showFilter" @confirm="onFilter" ref="filter"></query-filter>
    <div style="position: absolute; top: 68px; left: 25px; opacity: 0.8; font-family: PingFangSC-Semibold; font-size: 26px; color: #FFFFFF; letter-spacing: 0; line-height: 22px;">
      {{ today }}</div>
    <div style="position: absolute; right: 25px; top: 64px;">
      <btn-tab class="gmv-tab" :tabs="tabs" v-model="tabIndex" :hidden="tabHidden" @change="onChangeTab"></btn-tab>
    </div>
    <div style="position: absolute; left: 50%; top: 50%;">
      <div style="position: absolute; left: -180px; top: -180px; width: 360px; height: 360px;">
        <ring />
      </div>
      <div style="position: absolute; left: -180px; top: -180px; width: 360px; height: 360px; display: flex;">
        <div style="margin: auto; text-align: center;">
          <div style="opacity: 0.5; font-family: PingFangSC-Light; font-size: 12px; color: #FFFFFF; letter-spacing: 1px;">今日实时GMV (万)</div>
          <div style="opacity: 0.9; font-family: PingFangSC-Semibold; font-size: 45px; color: #FFFFFF;">{{ gmv|filter-number }}</div>
          <div style="opacity: 0.5; font-family: PingFangSC-Regular; font-size: 12px; color: #FFFFFF; letter-spacing: 1px;">北京时间 {{ realtime }}</div>
        </div>
      </div>
    </div>
    <div style="position: absolute; bottom: 40px; left: 25px; color: #FFFFFF; opacity: 0.3; font-size: 12px;">
      数据每十分钟更新一次
      <div style="margin: 5px 0; height: 1px; opacity: 0.1; background: #FFFFFF; border-radius: 0.5px;"></div>
      土巴兔大数据
    </div>
    <div class="gmv-bg" style="position: absolute; bottom: 34px; right: 20px; color: #fff; font-weight: bold; text-align: right;"></div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import Ring from '../../common/ring'
import QueryFilter from './filter'
import moment from 'moment'
import { setInterval } from 'timers'
import { branchOfficeGetRealtimeGmv } from '../../../services/api'
import { filterNumber } from '../../../common/filter'

export default {
  components: {
    Ring,
    btnTab,
    QueryFilter
  },
  filters: {
    filterNumber (val) {
      return filterNumber(val/10000, '0,0.00')
    }
  },
  data () {
    return {
      today: moment().format('YYYY.MM.DD'),
      realtime: moment().format('HH:mm:ss'),
      gmv: 0,
      showFilter: false,
      tabIndex: 0,
      tabHidden: [0, 0],
      tabs: ['日', '月'],
      queryParams: {
        type: 1,
        citys: {}
      }
    }
  },
  mounted () {
    this.updateRealTime()
    this.updateGMV()
  },
  methods: {
    updateRealTime () {
      setInterval(_ => {
        this.realtime = moment().format('HH:mm:ss')
      }, 1000)
    },
    updateGMV () {
      setInterval(_ => {
        this.loadData()
      }, 3000)
    },
    onClickSelArea () {
      if (this.showFilter) {
        this.$refs.filter.hide()
      } else {
        this.$refs.filter.show()
      }
    },
    onChangeTab (idx) {
      this.gmv = 0
      this.queryParams.type = idx + 1
      this.$store.commit('updateLoadingStatus', {isLoading: true}, { root: true })
      this.loadData().then(_ => {
        this.$store.commit('updateLoadingStatus', {isLoading: false}, { root: true })
      })
    },
    loadData () {
      //this.$store.commit('updateLoadingStatus', {isLoading: true}, { root: true })
      return branchOfficeGetRealtimeGmv(this.queryParams).then(res => {
        this.gmv = res.result.gmv || 0
        //this.$store.commit('updateLoadingStatus', {isLoading: false}, { root: true })
      })
    },
    onFilter (params) {
      this.queryParams.citys = params.citys
      this.$store.commit('updateLoadingStatus', {isLoading: true}, { root: true })
      this.loadData().then(_ => {
        this.$store.commit('updateLoadingStatus', {isLoading: false}, { root: true })
      })
    }
  }
}
</script>

<style lang="less">
.tbt-tabs-btn.gmv-tab {
  .tbt-tab {
    height: 28px;
    line-height: 26px;
    border-color: #35306E;
    font-size: 12px;
    &.checked {
      background: #3C3778;
      color: #fff;
    }
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: px;
    }
  }
}

.gmv-bg {
  height: 80px;
  width: 192px;
  background: url(../../../assets/image/gmv_bg@2x.png) no-repeat center/auto 80px;
}

.top-bar-sel2 {
  height: 34px; background: #25205C; text-align: center; line-height: 34px;
  &.checked {
    .tbt-arrow {
      transform: rotateZ(180deg)
    }
  }
}
</style>
