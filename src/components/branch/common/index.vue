<template>
  <div>
    <tab :line-width="2"  v-model="tabIndex" active-color="#06C792">
      <tab-item :selected="tabIndex == idx" @click.native="tabIndex = idx" v-for="(item, idx) in tabs" :key="idx">{{ item.name }}</tab-item>
    </tab>
    <div>
      <div class="tbt-cell" style="box-sizing: border-box; padding: 15px 0; background-color: #fff;">
        <div class="tbt-cell_bd" style="text-align: center">
          <div class="tbt-sel-tag" style="width: 75px" @click.stop="handleOnClickChSelect">区域 <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>

          <div class="tbt-sel-tag" style="width: 90px; margin-left: 15px;" @click.stop="handleOnClickCitySelect">业主类型 <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>
          
          <div class="tbt-sel-tag" style="width: 75px; margin-left: 15px;" @click.stop="handleOnClickCitySelect">渠道 <i class="tbt-icon tbt-icon-down" style="position: relative; top: 3px;"></i></div>
        </div>
      </div>
    </div>
    <div style="text-align: center; margin: 14px 0 6px;">
      <btn-tab :tabs="graTabs" v-model="graIndex" :hidden="graHidden"></btn-tab>
    </div>
    <div style="text-align: center;">
      <h2 style="font-size: 17px; color: #333333;">2月4日</h2>
      <p style="font-size: 12px; color: #999999;">更新时间：19/03/04 09:24:23</p>
    </div>

    <div class="tbt-pannel" style="margin-top: 15px; padding: 0 0 44px; border-bottom: 1px solid #EEEEEE; margin-bottom: 21px;">
      <table class="tbt-promotion-table">
        <tr>
          <th style="width: 84px;">指标</th>
          <th>{{ gras[0] }}</th>
          <th>{{ gras[1] }}</th>
          <th>{{ gras[2] }}</th>
        </tr>
        <tr v-for="row in tableData" :key="row.class_name" @click="handleOnClickRow(row)">
          <td>{{ row.class_name }}</td>
          <td>{{ formatRow(row.data_type, row.cur_val) }}</td>
          <td>{{ formatRow(row.data_type, row.last_val) }}</td>
          <td>{{ formatRow(row.data_type, row.before_last_val) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import { Tab, TabItem } from 'vux'
import { filterNumber } from '../../../common/filter'

export default {
  components: {
    btnTab,
    Tab,
    TabItem
  },
  data () {
    return {
      tabIndex: 2,
      tabs: [
        {
          name: '装修'
        },
        {
          name: '流量'
        },
        {
          name: '材料'
        },
        {
          name: '服务'
        }
      ],
      graIndex: 0,
      graHidden: [0, 0, 0, 0],
      graTabs: ['日', '周', '月'],
      gras: ['8月', '7月', '6月'],
      tableData: [
        {
          class_name: '浪费率',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        },
        {
          class_name: '派单量房率',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        },
        {
          class_name: '量房数',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        },
        {
          class_name: '扣费率',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        },
        {
          class_name: '扣签率',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        },
        {
          class_name: '装修签约GMV',
          data_type: 1,
          cur_val: 123472692,
          last_val: 123472692,
          before_last_val: 123472692
        }
      ]
    }
  },
  methods: {
    handleOnClickRow (row) {

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
