<template>
  <div class="tbt-h-bars">
    <table>
      <tr v-for="bar in barsData" valign="middle">
        <td>{{ bar.name }}</td>
        <td>
          <div class="tbt-h-bar">
            <div class="tbt-h-bar_inner" :style="{width: bar.w + '%'}">
            </div>
            <div v-if="isShowWan" class="tbt-h-bar_label">{{ bar.value/10000|filter-number('0,0.00', '', '万') }}</div>
            <div v-else class="tbt-h-bar_label">{{ bar.value|filter-number('0,0.00') }}</div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { filterNumber } from '../../../common/filter'

const buildBarW = bars => {
  let newBars = [...bars];  // 拷贝一个新的数组 以免排序造成 数据源watch 无限调用
  let max = newBars.sort((a, b) => parseFloat(b.value) - parseFloat(a.value))[0].value;

  if (max == 0) {
      return newBars.map(bar => {
        return { ...bar, w: 0 }
      })
  }
  // max = max < 5000 ? 5000 : max;

  return newBars.map(bar => {
    if (bar.name) { bar.name = bar.name.replace(/.*==/g, ''); }
    return { ...bar, w: parseFloat(bar.value)*70/max }
  })
};

export default {
  props: {
    bars: Array,
    showWan: Boolean
  },
  filters: {
    filterNumber
  },
  data () {
    return {
      barsData: buildBarW(this.bars),
      isShowWan: this.showWan,
      lock: false
    }
  },
  watch: {
    bars (val) {
      this.barsData = buildBarW(val);
      // 以下注释是解决watch无限循环的 软件锁定方案 已采用替代方案 及 拷贝数据源 不在源数据上进行计算
      /*if (!this.lock) {
        this.lock = true;
        this.barsData = buildBarW(val);
        this.$nextTick(()=>{
          this.lock = false;
        });
      }*/
    },
    showWan (val) {
      this.isShowWan = val;
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
@import '../var.less';

.tbt-h-bars {
  overflow: hidden;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout:fixed;
    width: 100%;
    td {
      font: 13px/18px PingFangSC-Regular,sans-serif;
      color: #666666;
      padding-top: 7px;
      padding-bottom: 7px;
      // vertical-align: middle;
    }
    td:first-child {
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 10px;
      padding-right: 7px;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      font-size: 10px;
      line-height: 13px;
    }
    td:nth-child(2) {
      width: 274px;
      // width: 230px;
      padding-right: 10px;
    }
  }
  .tbt-h-bar {
    background: #F0F7F5;
    height: 12px;
    width: 100%;
    float: left;
    .tbt-h-bar_inner {
      height: 100%;
      float: left;
      background: #06C792;
      width: 0;
      transition: width .3s;
    }
    .tbt-h-bar_label {
      float: left;
      margin-left: 5px;
      margin-top: -3px;
    }
  }
}
</style>
