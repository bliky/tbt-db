<template>
<div style="overflow: hidden; width: 100%;">
  <v-chart :data="chartData" ref="chart">
    <v-scale x :tick-count="5" :sortable='false' :formatter="xAxisFormatter" />
    <v-scale y :tick-count="5" alias="数值" :formatter="yAxisFormatter" />
    <v-line :colors="gradient"/>
    <v-area :colors="gradient"/>
    <v-tooltip :options="tooltip" />
  </v-chart>
</div>
</template>

<script>
import { VChart, VLine, VArea, VScale, VTooltip } from '../f2'
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
      gradient: [
        [0, '#57FFD6'],
        [0.5, '#57FFD6'],
        [1, '#57FFD6']
      ],
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
          /*let average = that.yPercent ? filterYAxis(currentData.origin.average, '%') : filterYAxis(currentData.origin.average);*/
          ev.items[0].value = title + ':\n数值 ' + value;// + "\n均值 " + average;
        }
      }
    }
  },
  computed: {
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
