<template>
<div>
  <v-chart :data="chartData" ref="chart">
    <v-scale x :tick-count="6" :sortable='false' :formatter="xAxisFormatter" />
    <v-scale y :tick-count="5" alias="数值" :formatter="yAxisFormatter" />
    <v-line :colors="gradient"/>
    <v-area :colors="gradient"/>
    <v-guide type="line" top :options="lineGuide" />
    <v-guide type="tag" top :options="tagGuide" />
  </v-chart>
</div>
</template>

<script>
import { VChart, VGuide, VLine, VArea, VScale } from '../f2'
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
    yPercent: Boolean
  },
  components: {
    VChart,
    VGuide,
    VArea,
    VLine,
    VScale
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
      gradient: [
        [0, '#57FFD6'],
        [0.5, '#57FFD6'],
        [1, '#57FFD6']
      ],
      lineGuide: {
        start(xScale, yScales) {
          return ['min', that.average]; // 位置信息
        },
        end(xScale, yScales) {
          return ['max', that.average]; // 位置信息
        },
        style: {
          stroke: '#f5da55', // 线的颜色
          lineWidth: 2,
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
        content: '均值线'
      }
    }
  },
  computed: {
    average() {
      if (!this.data || !this.data.length) return 0;

      let sum = this.data.map(item => item.val).reduce((total, cur) => {
        return total + cur;
      });

      return sum/this.data.length;
    }
  },
  methods: {
    xAxisFormatter (val) {
      return filterXAxis(val);
    },
    yAxisFormatter (val) {
      if (this.yPercent) return filterYAxis(val, '%');
      return filterYAxis(val);
    }
  }
}
</script>
