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
          <div class="index-value">{{ item.value|num-formater(2) }}</div>
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
          <div class="tbt-pro-dialog-hd">
            {{ currentTrend.class_name }}
            <btn-tab :tabs="trendTabs" v-model="trendTabIndex" :hidden="trendTabHidden" style="background: #fff;"></btn-tab>
          </div>
          <div style="margin: 20px -15px 0; background: #f6f6f6; height: 196px; overflow:hidden;">
            <div v-show="trendTabIndex==0">
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.day.length" :data="currentTrend.day" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==1">
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.week.length" :data="currentTrend.week" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==2">
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.month.length" :data="currentTrend.month" :data-type="trendDataType"></chart-line>
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
import { Line4 as ChartLine } from '../../common/chart'
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
      let num = Math.round(fval * 1000) / 10
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
      trendTabIndex: 0,
      trendTabs: ['日报', '周报', '月报'],
      trendDataType: 0,
      currentTrend: {
        class_name: '',
        day: [
          { dt: '2018-09-01', val: 200 },
          { dt: '2018-09-02', val: 400 },
          { dt: '2018-09-03', val: 300 },
          { dt: '2018-09-04', val: 100 }
        ],
        week: [
          { dt: '2018-09-01', val: 100 },
          { dt: '2018-09-02', val: 200 },
          { dt: '2018-09-03', val: 360 },
          { dt: '2018-09-04', val: 500 },
          { dt: '2018-09-05', val: 400 }
        ],
        month: [
          { dt: '2018-09', val: 100 },
          { dt: '2018-10', val: 200 },
          { dt: '2018-11', val: 300 },
          { dt: '2018-12', val: 200 }
        ]
      },
      showFilter: false,
      indexList: [
        {
          name: '土巴兔APP的DAU',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '浪费率',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '量房数',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '线上装修成交GMV',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '材料成交GMV',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        },
        {
          name: '转介绍激活量',
          value: '1,372.3万',
          mom: -0.13,
          yoy: 0.25
        }
      ],
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
      console.log('click outsite')
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
              yoy: item.tb
            }
          })
        })
      }
    },
    onChangeDt (params) {
      this.queryParams = Object.assign(this.queryParams, params)
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

