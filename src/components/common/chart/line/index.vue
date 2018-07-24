<template>
<div style="overflow: hidden; width: 100%;">
  <v-chart :data="chartData" ref="chart">
    <v-scale x :tick-count="5" :nice="true" :sortable='false' :formatter="xAxisFormatter" />
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
import { filterXAxis, filterYAxis } from '../../../../common/filter'

export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return [0];
      },
      required: true
    },
/*    average: {
      type: Number,
      default: 0
    },*/
    yPercent: Boolean,
    yW: Boolean
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
    data (newval) { 
      this.chartData = newval;
    }
  },
  mounted () {
  },
  data () {
    let that = this;
    return {
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
      tagGuide: {
        direct: 'tc',
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
          return ['median', that.average];
        },
        content: '均值 '+ that.average
      },
      tooltip: {
        showItemMarker: false,
        showTooltipMarker: true,
        offsetY: 50,
        showCrosshairs: true,
        onShow: function (ev) {
          let currentData = ev.items[0];

          currentData.name = null;
          let title = currentData.title;
          let value = currentData.value;
          let average = that.yPercent ? filterYAxis(that.average, '%') :
                        that.yW ? filterYAxis(that.average, 'w') : filterYAxis(that.average);
          ev.items[0].value = title + ':\n数值 ' + value + "\n均值 " + average;
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

      return parseInt(average);
    }
  },
  methods: {
    xAxisFormatter (val) {
      return filterXAxis(val);
    },
    yAxisFormatter (val) {
      return this.yPercent ? filterYAxis(val, '%') :
             this.yW ? filterYAxis(val, 'w') : filterYAxis(val);
    }
  }
}
</script>
