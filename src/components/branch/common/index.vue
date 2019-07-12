<template>
  <div>
    <tab :line-width="2"  v-model="tabIndex" active-color="#06C792">
      <tab-item :selected="tabIndex == idx" @click.native="onClickTab(idx)" v-for="(item, idx) in tabs" :key="idx">{{ item.name }}</tab-item>
    </tab>
    <div>
      <div class="tbt-cell" style="box-sizing: border-box; padding: 15px 0; background-color: #fff;">
        <div class="tbt-cell_bd" style="text-align: center">
          <div class="tbt-sel-tag branch-com" style="width: 75px" :class="{checked: fTab == 1}" @click.stop="handleOnClickAreaSelect">
            {{ tabIndex === 0 ? '区域' : '城市' }}
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>

          <div v-show="tabIndex === 0" class="tbt-sel-tag branch-com" style="width: 90px; margin-left: 10px;" :class="{checked: fTab == 2}" @click.stop="handleOnClickYezhuSelect">业主类型
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>
          
          <div v-show="tabIndex === 0" class="tbt-sel-tag branch-com" style="width: 75px; margin-left: 10px;" :class="{checked: fTab == 3}" @click.stop="handleOnClickChSelect">渠道
            <i class="tbt-arrow" style="position: relative; left: 3px; bottom: 2px;"></i>
          </div>
        </div>
      </div>
    </div>
    <query-filter :visible.sync="showFilter" @confirm="onFilter" :tab.sync="fTab" ref="filter" @onhide="fTab = 0"></query-filter>
    <date-picker @change="onUpdateDate" ref="datepicker"></date-picker>

    <div class="tbt-pannel" style="margin-top: 15px; padding: 0 0 44px; border-bottom: 1px solid #EEEEEE; margin-bottom: 21px;">
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">{{ tableHeader.name }}</th>
          <th>{{ tableHeader.number }}</th>
          <th>{{ tableHeader.hb }}</th>
          <th>{{ tableHeader.tb }}</th>
        </tr>
        <tr v-for="row in tableData" :key="row.class_name" @click="handleOnClickRow(row)">
          <td>{{ row.name }}</td>
          <td>{{ formatRow(row.type, row.number) }}</td>
          <td>{{ formatRow(row.type, row.hb) }}</td>
          <td>{{ formatRow(row.type, row.tb) }}</td>
        </tr>
      </table>
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
      preFTab: 0,
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
        ],
        month: [
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
      queryParams: {},
      dateParams: {},
      tableHeader: {
        name: '指标',
        number: '',
        hb: '',
        tb: ''
      },
      tableData: []
    }
  },
  mounted () {
    this.$refs.datepicker.setClassType(this.class_type)
  },
  methods: {
    ...mapActions('branch', ['getCommonInd', 'getIndTrend']),
    onClickTab(idx) {
      this.tabIndex = idx
      if (idx !== 0) {
        if (this.fTab !== 1 && this.fTab !== 0) {
          this.preFTab = this.fTab
          this.fTab = 1
        }
        this.$refs.filter.more(false)
      } else {
        if (this.fTab !== 0 && this.preFTab !== 0) {
          this.fTab = this.preFTab
        }
        this.$refs.filter.more(true)
      }
    },
    handleOnClickRow (ind) {
      let { dt, citys, owner_type, channel } = this.queryParams
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
    checkParams (params) {
      return params.dt &&
             params.citys
    },
    loadData (params) {
      if (this.checkParams(params)) {
        params.class_type = this.class_type
        console.log('loadData', params)
        this.getCommonInd(params).then(data => {
          if (!data) {
            this.tableData = []
            return
          }
          this.tableHeader = data.shift()
          this.tableData = data.map(item => {
            return {
              id: item.id,
              name: item.name,
              number: item.number,
              hb: item.hb,
              tb: item.tb,
              type: item.type
            }
          })
        })
      }
    },
    onUpdateDate (params) {
      this.dateParams = params
      this.queryParams = Object.assign(this.queryParams, params)
      this.loadData(this.queryParams)
    },
    onFilter (params) {
      this.queryParams = Object.assign({}, this.dateParams, params)
      this.loadData(this.queryParams)
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
        case 0:
          return suffix ? filterNumber(fval, '0,0.00') + suffix : filterNumber(fval, '0,0') + suffix;
        case 1:
          if (suffix) {
            return filterNumber(fval, '0,0.00') + suffix;
          }
          return filterNumber(fval, '0,0');
        case 2:
          return filterNumber(fval*100, '0,0.00', '', '%');
      }
      return filterNumber(fval, '0,0.00') + suffix;
    }
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