<template>
<div>
  <v-chart :data="chartData">
    <v-scale x :tick-count="chartCount" :max="chartMax" />
    <v-line :colors="gradient"/>
<!--     <v-guide type="tag" :options="tag" /> -->
    <v-area :colors="gradient"/>
  </v-chart>
</div>
</template>

<script>
import { VChart, VGuide, VLine, VArea, VScale } from 'vux'

export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return [0];
      },
      required: true
    },
    count: {
      type: Number,
      default: 30
    },
    max: {
      type: String,
      default: '2018-07-11'
    }
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
    },
    count (newval) {
      this.chartCount = newval;
    },
    max (newval) {
      this.chartMax = newval;
    }
  },
  data () {
    return {
      chartData: this.data,
      chartCount: this.count,
      chartMax: this.max,
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
  }
}
</script>
