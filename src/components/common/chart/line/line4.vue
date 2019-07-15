<template>
<div style="overflow: hidden; width: 100%;">
  <v-chart :data="chartData" ref="chart" :width="width"  :height="height">
    <v-scale x :tick-count="4" :nice="true" :sortable='false' :formatter="xAxisFormatter" />
    <v-scale y :tick-count="5" :nice="true" :min='0' :formatter="yAxisFormatter" />
    <v-line shape="smooth" :colors="colorLine"/>
    <v-area shape="smooth" :colors="colorArea"/>
    <v-guide type="line" top :options="lineGuide" />
    <v-tooltip :options="tooltip" />
  </v-chart>
</div>
</template>

<script>
import { VChart, VGuide, VLine, VArea, VScale, VTooltip } from '../f2'
import { filterXAxis } from '../../../../common/filter'
import numeral from 'numeral'

const filterYAxis = (num, suffix, format) => {
  if (isNaN(parseFloat(num))) {
    return '-';
  }

  var format = format || (num.toString().lastIndexOf('.') !== -1 ? '0,0.00' : '0,0');

  if (suffix === '%') return numeral(num).format(format) + suffix;
  if (suffix === 'w' && num >= 10000) return  numeral(num/10000).format('0,0.00') + '万';

  return numeral(num).format(format);
}

export default {
  props: {
    width: Number,
    height: Number,
    dataType: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: function () {
        return [0];
      },
      required: true
    }
  },
  components: {
    VChart,
    VGuide,
    VArea,
    VLine,
    VScale,
    VTooltip
  },
  watch: {
    dataType (v) {
      if (v == 3) {
        this.yPercent = true;
      } else {
        this.yPercent = false;
      }
    },
    data (newval) {
      this.chartData = newval;
      this.$nextTick(() => {
        this.$refs.chart.render();
        let chart = this.$refs.chart.chart;
        // let point = chart.getPosition(newval[newval.length-1]);
        // console.log('chart', chart, point);
        // chart.showTooltip(point);
        let lastVal = newval[newval.length-1].val;
        chart.guide().tag({
          direct: 'tl',
          background: {
            padding: [ 4, 6 ], // tag 内边距，用法同 css 盒模型的 padding
            radius: 2, // tag 圆角
            fill: '#1890FF', // tag 背景填充颜色
            fillOpacity: 0.5
          },
          textStyle: {
            fontSize: 12, // 字体大小
            fill: '#fff' // 字体颜色
          },
          position () {
            return ['max', lastVal];
          },
          content: this.yPercent ? filterYAxis(lastVal, '%') : filterYAxis(lastVal, 'w')
        });
        chart.render();
      });
    }
  },
  mounted () {
  },
  data () {
    let that = this;
    that.data[that.data.length-1];
    return {
      yPercent: false,
      chartData: this.data,
      colorLine: [[0, '#00E9A9'], [0.5, '#00E9A9'], [1, '#00E9A9']],
      colorArea: [[0.3, '#57FFD6'], [0.3, '#57FFD6'], [0.3, '#57FFD6']],
      lineGuide: {
        start(xScale, yScales) {
          return ['min', that.average]; // 位置信息
        },
        end(xScale, yScales) {
          return ['max', that.average]; // 位置信息
        },
        style: {
          stroke: '#FFAE22', // 线的颜色
          lineWidth: 1,
          lineDash: [5, 5]
        }
      },
      tooltip: {
        showItemMarker: false,
        showTooltipMarker: true,
        offsetY: 30,
        showCrosshairs: true,
        onShow: function (ev) {
          let currentData = ev.items[0];

          currentData.name = null;
          /*let titleArr = currentData.title.split('-');
          let title = titleArr[0]+'月'+titleArr[1]+'日';*/
          let title = currentData.title;
          let value = currentData.value;

          let tooltipVal =  title + ' ' + value;
          if (typeof currentData.origin.hb !== 'undefined') {
            tooltipVal =  filterXAxis(title) + ': ' + filterYAxis(value)
            tooltipVal += '\n环比: ' + filterYAxis(currentData.origin.hb*100, '%') + '\n同比: ' + filterYAxis(currentData.origin.tb*100, '%')
          }
          ev.items[0].value = tooltipVal;
        }
      }
    }
  },
  computed: {
    average() {
      if (!this.data || !this.data.length) return 0;

      let sum = this.data.map(item => item.val).reduce((total, cur) => {
        return total + cur;
      });

      let average = sum/this.data.length;

      return average;
    }
  },
  methods: {
    lastVal () {
      return this.data[this.data.length-1].val;
    },
    xAxisFormatter (val) {
      return filterXAxis(val);
    },
    yAxisFormatter (val) {
      if (this.yPercent) return filterYAxis(val, '%');
      return filterYAxis(val, 'w');
    }
  }
}
</script>
