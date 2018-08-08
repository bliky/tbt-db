<template>
  <div class="tbt-pannel s1">
    <div class="tbt-pannel_title">{{ currentCity }}趋势
      <div class="tbt-pannel_title-rt s1"><btn-tab :tabs="tabs" v-model="tabIndex"></btn-tab></div>
    </div>
    <div style="overflow: hidden; min-height:  240px;">
      <chart-line v-if="tabLines.length > 0" v-show="tabIndex==0" :data="tabLines[0]"></chart-line>
      <chart-line v-if="tabLines.length > 1" v-show="tabIndex==1" :data="tabLines[1]"></chart-line>
      <chart-line v-if="tabLines.length > 2" v-show="tabIndex==2" :data="tabLines[2]"></chart-line>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import { Line3 as ChartLine } from '../../common/chart'

export default {
  props: {
    city: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentCity: this.city,
      tabIndex: 0,
      tabs: ['消费', '收入', 'ROI']
    }
  },
  watch: {
    city (val) {
      this.currentCity = val;
    }
  },
  computed: {
    tabLines () {
      return this.$parent.roi.trends;
    }
  },
  components: {
    btnTab,
    ChartLine
  },
  methods: {
  }
};
</script>
