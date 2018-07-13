<template>
<div>
  <v-chart :data="chartData" ref="chart">
    <v-scale x :tick-count="6" type="timeCat" mask="M-D" />
    <v-scale y :tick-count="5" alias="数值" :formatter="yAxisFormatter" />
    <v-line :colors="gradient"/>
<!--     <v-guide type="tag" :options="tag" /> -->
    <v-area :colors="gradient"/>
  </v-chart>
</div>
</template>

<script>
import { VChart, VGuide, VLine, VArea, VScale } from '../f2'
import { filterYAxis } from '../../../../common/filter'


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
    return {
      chartData: this.data,
      gradient: [
        [0, '#57FFD6'],
        [0.5, '#57FFD6'],
        [1, '#57FFD6']
      ],
/*      tag: {
        position: [ 2010, 28.9 ],
        content: '28.9',
        direct: 'tl',
        offsetY: -5,
        background: {
          fill: 'rgba(0,0,0,0.80)'
        },
        pointStyle: {
          fill: '#57FFD6'
        }
      },*/
    }
  },
  methods: {
    yAxisFormatter (val) {
      if (this.yPercent) return filterYAxis(val, '%');
      return filterYAxis(val);
    }
  }
}
</script>
