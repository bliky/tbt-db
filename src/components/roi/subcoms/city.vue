<template>
  <div class="tbt-pannel" style="padding: 0;">
    <table class="tbt-roi-table">
      <tr>
        <th>全国城市</th>
        <th @click.stop="sortBy(0)">现金<i class="tbt-icon" :class="sortClass0" /></th>
        <th @click.stop="sortBy(1)">收入<i class="tbt-icon" :class="sortClass1" /></th>
        <th @click.stop="sortBy(2)">ROI<i class="tbt-icon" :class="sortClass2" /></th>
      </tr>
      <tr v-for="row in $parent.roi.city">
        <td>{{ row.name }}</td><td>{{ row.input }}</td><td>{{ row.income }}</td><td>{{ row.roi }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import mLoading from '../../common/mixins/loading'
import moment from 'moment'

export default {
  mixins: [mLoading],
  components: {
  },
  filters: {
  },
  data () {
    return {
      sort0: 1,
      sort1: 0,
      sort2: 0
    }
  },
  computed: {
    sortClass0 () {
      let sort0 = this.sort0;
      return `${sort0===2?'tbt-icon-sort-up':sort0===1?'tbt-icon-sort-down':'tbt-icon-sort'}`;
    },
    sortClass1 () {
      let sort1 = this.sort1;
      return `${sort1===2?'tbt-icon-sort-up':sort1===1?'tbt-icon-sort-down':'tbt-icon-sort'}`;
    },
    sortClass2 () {
      let sort2 = this.sort2;
      return `${sort2===2?'tbt-icon-sort-up':sort2===1?'tbt-icon-sort-down':'tbt-icon-sort'}`;
    }
  },
  mounted () {
  },
  methods: {
    sortBy (idx) {
      switch (idx) {
        case 0:
          this.sort1 = 0; this.sort2 = 0;
          break;
        case 1:
          this.sort0 = 0; this.sort2 = 0;
          break;
        case 2:
          this.sort0 = 0; this.sort1 = 0;
          break;
      }
      this['sort'+idx] = this['sort'+idx] === 1  ? 2 : 1;
    }
  }
};
</script>
