<template>
<div class="promotion-page white">
  <div class="compare-unit">
    <div class="compare-unit-hd">选择落地类型</div>
    <div class="compare-unit-bd">
      <ul class="compare-unit-list">
        <li :class="{ checked: type.indexOf(0) !== -1 }" @click="selType(0)">非落地城市</li>
        <li :class="{ checked: type.indexOf(1) !== -1 }" @click="selType(1)">新落地城市</li>
        <li :class="{ checked: type.indexOf(2) !== -1 }" @click="selType(2)">老落地城市</li>
      </ul>
    </div>
  </div>
  <div class="compare-unit" style="margin-top: 30px;">
    <div class="compare-unit-hd">选择对比时间(段)</div>
    <div class="compare-unit-bd">
      <div class="compare-unit-date-group">
        <div class="compare-unit-date" @click="onSelDt('dt1.start')">
          <span class="compare-unit-date_inner" :class="{active: dateRange.dt1.start }">{{ dateRange.dt1.start || "时间一开始" }}</span>
          <i class="tbt-icon tbt-icon-down"></i>
        </div>
        <span class="compare-center">~</span>
        <div class="compare-unit-date" @click="onSelDt('dt1.end')">
          <span class="compare-unit-date_inner" :class="{active: dateRange.dt1.end}">{{ dateRange.dt1.end || "时间一结束" }}</span>
          <i class="tbt-icon tbt-icon-down"></i>
        </div>
      </div>
      <p class="compare-vs"><i class="compare-icon-vs"></i></p>
      <div class="compare-unit-date-group">
        <div class="compare-unit-date" @click="onSelDt('dt2.start')">
          <span class="compare-unit-date_inner" :class="{active: dateRange.dt2.start}">{{ dateRange.dt2.start || "时间二开始" }}</span>
          <i class="tbt-icon tbt-icon-down"></i>
        </div>
        <span class="compare-center">~</span>
        <div class="compare-unit-date" @click="onSelDt('dt2.end')">
          <span class="compare-unit-date_inner" :class="{active: dateRange.dt2.end}">{{ dateRange.dt2.end || "时间二结束" }}</span>
          <i class="tbt-icon tbt-icon-down"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="filter-bot">
    <div class="compare-btn" @click="onCompare">对比</div>
    <div class="compare-btn compare-btn-text" @click="$router.go(-1)">取消</div>
  </div>
</div>
</template>

<script>
import '../common/icon'
import moment from 'moment'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
const theDayBeforeYesterday = moment().subtract(2, 'days').format('YYYY-MM-DD')

export default {
  data () {
    return {
      type: [],
      dateRange: {
        dt1: {
          start: '',
          end: ''
        },
        dt2: {
          start: '',
          end: ''
        }
      }
    }
  },
  computed: {
    ...mapState('tracking', ['comPramas']),
  },
  mounted () {
    let comPramas = this.comPramas
    let dateRange = this.dateRange
    this.type = comPramas.type
    dateRange.dt1.start = comPramas.dt1[0]
    dateRange.dt1.end = comPramas.dt1[1]
    dateRange.dt2.start = comPramas.dt2[0]
    dateRange.dt2.end = comPramas.dt2[1]
  },
  methods: {
    selType (t) {
      let type = this.type
      let idx = type.indexOf(t)
      if (idx === -1) {
        type.push(t)
      } else {
        type.splice(idx, 1)
      }
    },
    onSelDt (dttoken) {
      let dto = dttoken.split('.')
      let curdt = this.dateRange[dto[0]][dto[1]]
      let dateRange = this.dateRange
      // 起始时间
      let startDate = '2017-01-01'
      let endDate = yesterday
      if (dto[0] === 'dt1') {
        if (dto[1] === 'end') {
          if (dateRange.dt1.start) {
            startDate = dateRange.dt1.start
          }
        }
      } else {
        if (dto[1] === 'start') {
          if (dateRange.dt1.start) {
            startDate = dateRange.dt1.start
          }
        } else {
          if (dateRange.dt2.start) {
            startDate = dateRange.dt2.start
          }
        }
      }

      this.$vux.datetime.show({
        value: curdt || yesterday,
        confirmText: '确认',
        cancelText: '取消',
        yearRow: '{value}年',
        monthRow: '{value}月',
        dayRow: '{value}日',
        startDate: startDate,
        endDate: endDate,
        onConfirm (value) {
          dateRange[dto[0]][dto[1]] = value
        },
        onHide () {
        },
        onShow () {
        }
      })
    },
    onCompare () {
      let dateRange = this.dateRange
      if (this.type.length && (dateRange.dt1.start || dateRange.dt1.end) && (dateRange.dt2.start || dateRange.dt2.end)) {
        let comParams = {
          type: [...this.type],
          dt1: [],
          dt2: []
        }
        if (dateRange.dt1.start) {
          comParams.dt1.push(dateRange.dt1.start)
        }
        if (dateRange.dt1.end) {
          comParams.dt1.push(dateRange.dt1.end)
        }
        if (dateRange.dt2.start) {
          comParams.dt2.push(dateRange.dt2.start)
        }
        if (dateRange.dt2.end) {
          comParams.dt2.push(dateRange.dt2.end)
        }
        this.$store.commit('tracking/CH_COM', comParams)
        this.$router.push({ path: '/bdc-prd-dbd/promotion-compare' })
      } else {
        if (this.type.length) {
          this.$vux.toast.text('请选择对比时间！')
        } else {
          this.$vux.toast.text('请选择落地类型！')
        }
      }
    }
  }
}
</script>


<style lang="less">
.compare-unit {
  margin-top: 40px;
  padding: 0 25px;
}

.compare-unit-hd {
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #333333;
  padding-left: 5px;
}

.compare-unit-hd + .compare-unit-bd {
  margin-top: 15px;
}

ul.compare-unit-list {
  overflow: hidden;
  li {
    background: #FFFFFF;
    border: 1px solid#EEEEEE;
    border-radius: 22px;
    float: left;
    height: 40px;
    line-height: 38px;
    padding: 0 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    &.checked {
      color: #06C792;
      border-color: #06C792;
    }
  }
}

.compare-unit-date {
  background: #F6F6F6;
  border-radius: 22.5px;
  height: 45px;
  line-height: 45px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #C1C1C1;
  padding: 0 20px;
  position: relative;
  box-sizing: border-box;
  .active {
    color: #666666;
  }
  .tbt-icon-down {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}

.compare-vs {
  height: 37px;
  text-align: center;
  .compare-icon-vs {
    margin-top: 9px;
  }
}

.compare-btn {
  background: #06C792;
  border: 1px solid #06C792;
  border-radius: 2px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  margin-left: 20px;
  margin-right: 20px;
  & + & {
    margin-top: 2px;
  }
  &.compare-btn-text {
    background: #fff;
    color: #06C792;
    border: 0;
  }
}

.filter-bot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 7px;
}

.compare-unit + .compare-btn {
  margin-top: 169px;
}

.compare-unit-date-group {
  overflow: hidden;
  .compare-center {
    float: left;
    width: 10%;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .compare-unit-date {
    float: left;
    width: 45%;
  }
}
</style>

