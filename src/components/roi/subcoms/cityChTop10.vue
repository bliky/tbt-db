<template>
  <div class="tbt-pannel s1">
    <div class="tbt-pannel_title">Top10渠道
      <div class="tbt-pannel_title-rt s1"><btn-tab :tabs="tabs" v-model="tabIndex"></btn-tab></div>
    </div>
    <div style="overflow: hidden; min-height: 200px; padding: 10px 0 15px;">
      <h-bars :bars="tabBars[tabIndex]" :showWan="tabIndex!=2"></h-bars>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import { hBars } from '../../common/bar'

export default {
  components: {
    btnTab,
    hBars
  },
  data() {
    return {
      tabIndex: 0,
      tabs: ['消费', '收入', 'ROI']
    }
  },
  computed: {
    tabBars () {
      return this.$parent.roi.top10;
    }
  },
  methods: {
  }
};
</script>
