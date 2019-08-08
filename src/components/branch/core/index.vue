<template>
  <div>
    <div @click="onClickSelArea" class="top-bar-sel" :class="{checked: showFilter}">
      <span style="cursor: pointer">
        选择区域/城市
        <i class="tbt-icon-triangle_low" style="position: relative; top: 3px; margin-left: 2px; opacity: .3"></i>
      </span>
    </div>
    <query-filter :visible.sync="showFilter" @confirm="onFilter" ref="filter"></query-filter>
    <date-picker @change="onChangeDt"></date-picker>
    <div class="index-board">
      <div class="index-board-grid" v-for="item in indexList" :key="item.name" @click="handleOnClickIndCard(item)">
        <div class="index-card">
          <div class=index-name>{{ item.name }}</div>
          <div class="index-value">{{ item.value|num-formater(item.type) }}</div>
          <div class="index-stat">
            <p>环比 <span :class="{positive: item.mom > 0, negtive: item.mom < 0}">{{ item.mom|stat-formater }}</span></p>
            <p>同比 <span :class="{positive: item.yoy > 0, negtive: item.yoy < 0}">{{ item.yoy|stat-formater }}</span></p>
          </div>
        </div>
      </div>
      <!-- <div class="index-board-grid full">
        <div class="index-card">
          <div class=index-name>总收入</div>
          <div class="index-value">1,372.3万</div>
          <div class="index-stat">
            <p>环比 <span :class="{positive: -0.13 > 0, negtive: -0.13 < 0}">{{ -0.13|stat-formater }}</span></p>
            <p>同比 <span :class="{positive: 0.25 > 0, negtive: 0.25 < 0}">{{ 0.25|stat-formater }}</span></p>
          </div>
        </div>
      </div> -->
    </div>
    <!-- 查看趋势图弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isTrendDialogShow" :hide-on-blur="true" :dialog-style="{maxWidth: dialogWidth + 'px', width: dialogWidth + 'px', height: '255px', borderRadius: '3px'}">
        <div class="tbt-pro-dialog">
          <div class="tbt-pro-dialog-hd tbt-pro-dialog-hd-flex">
            <div class="tbt-pro-dialog-hd-flex-1" style="font-size: 18px; line-height: 25px">{{ currentTrend.class_name }}</div>
            <div style="width: 178px; display: none"><btn-tab :tabs="trendTabs" v-model="trendTabIndex" :hidden="trendTabHidden" style="background: #fff;"></btn-tab></div>
          </div>
          <div style="margin: 20px -15px 0; background: #f6f6f6; height: 196px; overflow:hidden;">
            <div v-show="trendTabIndex==0">
              <chart-line ref="chartDay" :width="chartWidth"  :height="chartHeight" v-if="currentTrend.day.length" :data="currentTrend.day" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==1">
              <chart-line ref="chartWeek" :width="chartWidth"  :height="chartHeight" v-if="currentTrend.week.length" :data="currentTrend.week" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==2">
              <chart-line ref="chartMonth" :width="chartWidth"  :height="chartHeight" v-if="currentTrend.month.length" :data="currentTrend.month" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import QueryFilter from './filter.vue'
import DatePicker from './datePicker.vue'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import clickOutside from '../../../directives/clickOutside'
import { Line5 as ChartLine } from '../../common/chart'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import numFormater from '../numFormater'

const winW = window.innerWidth

export default {
  components: {
    DatePicker,
    btnTab,
    QueryFilter,
    XDialog,
    ChartLine
  },
  directives: {
    clickOutside,
    TransferDom
  },
  filters: {
    numFormater,
    statFormater (val) {
      let fval = parseFloat(val)
      if (isNaN(fval)) {
        return '-'
      }
      let num = Math.round(fval * 10000) / 100
      if (val > 0) {
        return '+' + num + '%'
      }
      return num + '%'
    }
  },
  data () {
    return {
      chartWidth: winW - 26,
      chartHeight: 196,
      winW: winW,
      dialogWidth: winW - 26,
      isTrendDialogShow: false,
      trendTabHidden: [],
      trendTabIndexDate: 0,
      trendTabIndex: 0,
      trendTabs: ['日报', '周报', '月报'],
      trendDataType: 0,
      currentTrend: {
        class_name: '',
        day: [
        ],
        week: [
        ],
        month: [
        ]
      },
      showFilter: false,
      indexList: [],
      queryParams: {}
    }
  },
  methods: {
    ...mapActions('branch', ['getCoreInd', 'getIndTrend']),
    handleOnClickIndCard (ind) {
      let { dt, citys } = this.queryParams
      let params = { dt, citys }
      params.id = ind.id

      this.getIndTrend(params).then(res => {
        if (!res) {

        }
        let { name, day, week, month } = res
        this.currentTrend.class_name = name
        this.currentTrend.day = day
        this.currentTrend.week = week
        this.currentTrend.month = month
        this.isTrendDialogShow = true
        this.trendTabIndex = this.trendTabIndexDate
        this.$nextTick(_ => {
          if (ind.type == 2) {
            this.$refs.chartDay && this.$refs.chartDay.chDatatype(3)
            this.$refs.chartWeek && this.$refs.chartWeek.chDatatype(3)
            this.$refs.chartMonth && this.$refs.chartMonth.chDatatype(3)
            this.trendDataType = 3
          } else {
            this.$refs.chartDay && this.$refs.chartDay.chDatatype(0)
            this.$refs.chartWeek && this.$refs.chartWeek.chDatatype(0)
            this.$refs.chartMonth && this.$refs.chartMonth.chDatatype(0)
            this.trendDataType = 0
          }
        })
      })
    },
    onClickSelArea () {
      if (this.showFilter) {
        this.$refs.filter.hide()
      } else {
        this.$refs.filter.show()
      }
    },
    onClickOutside () {
      this.$refs.filter.hide()
    },
    checkParams () {
      let params = this.queryParams
      return params.dt &&
             params.citys
    },
    loadData () {
      if (this.checkParams()) {
        this.getCoreInd(this.queryParams).then(data => {
          if (!data) {
            this.indexList = []
            return
          }
          this.indexList = data.map(item => {
            return {
              id: item.id,
              name: item.name,
              value: item.data,
              mom: item.hb,
              yoy: item.tb,
              type: item.type
            }
          })
        })
      }
    },
    onChangeDt (params) {
      this.queryParams = Object.assign(this.queryParams, params)
      this.trendTabIndexDate = params.type - 1
      this.loadData()
    },
    onFilter (params) {
      this.queryParams.citys = params
      this.loadData()
    }
  }
}
</script>

<style lang="less">
.tbt-pro-dialog-hd-flex {
  display: flex;
}

.tbt-pro-dialog-hd-flex-1 {
  flex: 1;
}

.index-board {
  overflow: hidden;
  margin: 30px 5px 30px 20px;
}
.index-board-grid {
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 15px 15px 0;
  &.full {
    width: 100%;
    .index-card {
      height: 112px;
    }
    .index-name {
      position: absolute;
      left: 40px;
      top: 42px;
      font-size: 20px;
      color: #999999;
    }
    .index-value {
      position: absolute;
      font-size: 24px;
      top: 28px;
      right: 34px;
    }
    .index-stat {
      position: absolute;
      bottom: 29px;
      right: 34px;
      width: 160px;
      overflow: hidden;
      p {
        float: right;
        & + p {
          margin-right: 21px;
        }
      }
    }
  }
}
.index-card {
  text-align: center;
  border: 1px solid #F6F6F6;
  border-radius: 10px;
  padding: 5px 0 10px;
  position: relative;
}
.index-name {
  font-size: 12px;
  color: #999999;
}
.index-value {
  margin-top: 8px;
  font-size: 20px;
  color: #000000;
}
.index-stat {
  font-size: 12px;
  color: #999999;
  // width: 70px;
  // margin: 5px auto 0;
  p {
    text-align: center;
  }
  .positive, .negtive {
    margin-left: 8px;
  }
  .positive {
    color: #06C792;
  }
  .negtive {
    color: #FC3142;
  }
}

.top-bar-sel {
  height: 34px; line-height: 34px; background: #F6F6F6; text-align: center; color: #999999; font-size: 12px; font-family: PingFangSC-Regular;
  &.checked {
    .tbt-icon-triangle_low {
      transform: rotateZ(180deg)
    }
  }
}
</style>

