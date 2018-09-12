<template>
<div style="overflow: hidden; width: 100%;">
  <v-chart :data="chartData" ref="chart" :width="width"  :height="height">
    <v-scale x :tick-count="4" :nice="true" :sortable='false' :formatter="xAxisFormatter" />
    <v-scale y :tick-count="5" :nice="true" :min='0' :formatter="yAxisFormatter" />
    <v-line shape="smooth" :colors="colorLine"/>
    <v-area shape="smooth" :colors="colorArea"/>
    <v-tooltip :options="tooltip" />
  </v-chart>
</div>
</template>

<script>
import { VChart, VGuide, VLine, VArea, VScale, VTooltip } from '../f2'
import { filterXAxis } from '../../../../common/filter'
import numeral from 'numeral'

const filterYAxis = (num, suffix) => {
  if (isNaN(parseFloat(num))) {
    return '-';
  }

  if (suffix === '%') return numeral(num).format('0,0.00') + suffix;
  if (suffix === 'w' && num >= 10000) return  numeral(num/10000).format('0,0.00') + '万';

  return numeral(num).format('0,0.00');
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
          content: this.yPercent ? filterYAxis(lastVal, '%') : lastVal
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
      tooltip: {
        showItemMarker: false,
        showTooltipMarker: true,
        offsetY: 0,
        showCrosshairs: true,
        onShow: function (ev) {
          let currentData = ev.items[0];

          currentData.name = null;
          /*let titleArr = currentData.title.split('-');
          let title = titleArr[0]+'月'+titleArr[1]+'日';*/
          let title = currentData.title;
          let value = currentData.value;

          ev.items[0].value = title + ' ' + value;
        }
      }
    }
  },
  computed: {
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
