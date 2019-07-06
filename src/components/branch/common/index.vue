<template>
  <div>
    <tab :line-width="2"  v-model="tabIndex" active-color="#06C792">
      <tab-item :selected="tabIndex == idx" @click.native="tabIndex = idx" v-for="(item, idx) in tabs" :key="idx">{{ item.name }}</tab-item>
    </tab>
    <div>
      <div class="tbt-cell" style="box-sizing: border-box; padding: 15px 0; background-color: #fff;">
        <div class="tbt-cell_bd" style="text-align: center">
          <div class="tbt-sel-tag branch-com" style="width: 75px" :class="{checked: fTab == 1}" @click.stop="handleOnClickAreaSelect">区域
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>

          <div class="tbt-sel-tag branch-com" style="width: 90px; margin-left: 10px;" :class="{checked: fTab == 2}" @click.stop="handleOnClickYezhuSelect">业主类型
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>
          
          <div class="tbt-sel-tag branch-com" style="width: 75px; margin-left: 10px;" :class="{checked: fTab == 3}" @click.stop="handleOnClickChSelect">渠道
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>
        </div>
      </div>
    </div>
    <query-filter :visible.sync="showFilter" @confirm="onFilter" :tab.sync="fTab" ref="filter"></query-filter>
    <date-picker @change="onUpdateDate" ref="datepicker"></date-picker>

    <div class="tbt-pannel" style="margin-top: 15px; padding: 0 0 44px; border-bottom: 1px solid #EEEEEE; margin-bottom: 21px;">
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">指标</th>
          <th>{{ gras[0] }}</th>
          <th>{{ gras[1] }}</th>
          <th>{{ gras[2] }}</th>
        </tr>
        <tr v-for="row in tableData" :key="row.class_name" @click="handleOnClickRow(row)">
          <td>{{ row.name }}</td>
          <td>{{ formatRow(1, row.number) }}</td>
          <td>{{ formatRow(3, row.hb) }}</td>
          <td>{{ formatRow(3, row.tb) }}</td>
        </tr>
      </table>
    </div>
    <!-- 查看趋势图弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isTrendDialogShow" :hide-on-blur="true" :dialog-style="{maxWidth: dialogWidth + 'px', width: dialogWidth + 'px', height: '255px', borderRadius: '3px'}">
        <div class="tbt-pro-dialog">
          <div class="tbt-pro-dialog-hd">
            {{ currentTrend.class_name }}
            <btn-tab :tabs="trendTabs" v-model="trendTabIndex" :hidden="trendTabHidden"></btn-tab>
          </div>
          <div style="margin: 20px -15px 0; background: #f6f6f6; height: 196px; overflow:hidden;">
            <div v-show="trendTabIndex==0" >
              <chart-line :width="chartWidth"  :height="chartHeight" v-if="currentTrend.day.length" :data="currentTrend.day" :data-type="trendDataType"></chart-line>
              <p class="empty-trend" v-else>暂无数据</p>
            </div>
            <div v-show="trendTabIndex==1" >
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
import { Line4 as ChartLine } from '../../common/chart'
import { Tab, TabItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
import { filterNumber } from '../../../common/filter'
import QueryFilter from './filter.vue'
import DatePicker from './datePicker.vue'
import clickOutside from '../../../directives/clickOutside'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const winW = window.innerWidth

export default {
  components: {
    btnTab,
    Tab,
    TabItem,
    QueryFilter,
    DatePicker,
    XDialog,
    ChartLine
  },
  directives: {
    clickOutside,
    TransferDom
  },
  watch: {
    tabIndex (newVal) {
      this.class_type = this.tabs[newVal].id
      this.$refs.datepicker.setClassType(this.class_type)
    }
  },
  data () {
    return {
      tabIndex: 0,
      fTab: 0,
      chartWidth: winW - 26,
      chartHeight: 196,
      winW: winW,
      dialogWidth: winW - 26,
      isTrendDialogShow: false,
      trendTabHidden: [],
      trendTabIndex: 1,
      trendTabs: ['日报', '月报'],
      trendDataType: 0,
      currentTrend: {
        class_name: '',
        day: [
          { dt: '2018-09-01', val: 200 },
          { dt: '2018-09-02', val: 400 },
          { dt: '2018-09-03', val: 300 },
          { dt: '2018-09-04', val: 100 }
        ],
        month: [
          { dt: '2018-09', val: 100 },
          { dt: '2018-10', val: 200 },
          { dt: '2018-11', val: 300 },
          { dt: '2018-12', val: 200 }
        ]
      },
      class_type: '2',
      tabs: [
        {
          id: '2',
          name: '装修'
        },
        // {
        //   name: '流量'
        // },
        {
          id: '3',
          name: '材料'
        },
        {
          id: '4',
          name: '服务'
        }
      ],
      showFilter: false,
      gras: ['当前', '环比', '同比'],
      queryParams: {},
      tableData: [
        {
          name: '浪费率',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        },
        {
          name: '派单量房率',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        },
        {
          name: '量房数',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        },
        {
          name: '扣费率',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        },
        {
          name: '扣签率',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        },
        {
          name: '装修签约GMV',
          data_type: 1,
          number: 123472692,
          hb: 123472692,
          tb: 123472692
        }
      ]
    }
  },
  mounted () {
    this.$refs.datepicker.setClassType(this.class_type)
  },
  methods: {
    ...mapActions('branch', ['getCommonInd', 'getIndTrend']),
    handleOnClickRow (ind) {
      let { dt, citys, owner_type, channel } = this.queryParams
      let params = { dt, citys }
      params.id = ind.id
      console.log('getIndTrend params', params)
      this.getIndTrend(params).then(res => {
        if (!res) {

        }
        console.log('getIndTrend response', res)
        let { name, day, week, month } = res
        this.currentTrend.class_name = name
        this.currentTrend.day = day
        this.currentTrend.week = week
        this.currentTrend.month = month
        this.isTrendDialogShow = true
      }).catch(error => {
        console.log(error)
      })
    },
    handleOnClickAreaSelect () {
      this.$refs.filter.show(1)
      // if (this.showFilter) {
      //   this.$refs.filter.hide()
      // } else {
      //   this.$refs.filter.show(1)
      // }
    },
    handleOnClickYezhuSelect () {
      this.$refs.filter.show(2)
      // if (this.showFilter) {
      //   this.$refs.filter.hide()
      // } else {
      //   this.$refs.filter.show(2)
      // }
    },
    handleOnClickChSelect () {
      this.$refs.filter.show(3)
      // if (this.showFilter) {
      //   this.$refs.filter.hide()
      // } else {
      //   this.$refs.filter.show(3)
      // }
    },
    checkParams () {
      let params = this.queryParams
      return params.dt &&
             params.citys
    },
    loadData () {
      if (this.checkParams()) {
        this.queryParams.class_type = this.class_type
        console.log('loadData', this.queryParams)
        this.getCommonInd(this.queryParams).then(data => {
          if (!data) {
            this.tableData = []
            return
          }
          this.tableData = data.map(item => {
            return {
              id: item.id,
              name: item.name,
              number: item.number,
              hb: item.hb,
              tb: item.tb,
              data_type: 1
            }
          })
        })
      }
    },
    onUpdateDate (params) {
      this.queryParams = Object.assign(this.queryParams, params)
      this.loadData()
    },
    onFilter (params) {
      this.queryParams = Object.assign(this.queryParams, params)
      this.loadData()
    },
    formatRow (data_type, val) {
      let fval = parseFloat(val);
      let suffix = '';
      if (isNaN(fval)) {
        return '-';
      }
      if (fval >= 10000) {
        fval /= 10000;
        suffix = '万';
      }
      switch (data_type) {
        case 1:
          return suffix ? filterNumber(fval, '0,0.00') + suffix : filterNumber(fval, '0,0') + suffix;
        case 2:
          return filterNumber(fval, '0,0.00') + suffix;
        case 3:
          return filterNumber(fval*100, '0,0.00', '', '%') + suffix;
      }
      return filterNumber(fval, '0,0.00') + suffix;
    },
  }
}
</script>

<style lang="less">
.tbt-sel-tag.branch-com {
  min-width: 100px;
  padding: 0;
  .tbt-arrow {
    transition: transform .1s;
  }
  &.checked {
    color:#06C792;
    .tbt-arrow {
      border-top-color: #06C792;
      transform: rotateZ(180deg);
    }
  }
}

.tbt-icon-uncheck {
  background-color: #fff;
}
</style>