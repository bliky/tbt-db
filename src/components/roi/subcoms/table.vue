<template>
  <div class="tbt-pannel" style="padding: 0;">
    <table class="tbt-roi-table">
      <tr>
        <th style="width: 100px;">{{title}}</th>
        <th @click.stop="sortBy(0)">现金消费<i class="tbt-icon" :class="sortClass0" /></th>
        <th @click.stop="sortBy(1)">收入<i class="tbt-icon" :class="sortClass1" /></th>
        <th @click.stop="sortBy(2)" style="width: 40px;">ROI<i class="tbt-icon" :class="sortClass2" /></th>
      </tr>
      <tr v-for="row in tableData" @click="$emit('onClickRow', row)">
        <td>{{ row.name }}</td><td>{{ row.input|filter-number('0,0.00') }}</td><td>{{ row.income|filter-number('0,0.00') }}</td><td>{{ row.roi|filter-number('0,0.00') }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { filterNumber } from '../../../common/filter'

export default {
  props: {
    title: String,
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tableData: this.data,
      lockInit: false,
      sort0: 1,
      sort1: 0,
      sort2: 0
    }
  },
  filters: {
    filterNumber
  },
  watch: {
    data (val) {
      this.tableData = val;
      if (this.lockInit) {
        this.lockInit = false;
      } else {
        this.init();
      }
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
  methods: {
    init () {
      this.sort0 = 1;
      this.sort1 = 0;
      this.sort2 = 0;
    },
    sortBy (idx) {
      let sortField = '';
      switch (idx) {
        case 0:
          sortField = 'input';
          this.sort1 = 0; this.sort2 = 0;
          break;
        case 1:
          sortField = 'income';
          this.sort0 = 0; this.sort2 = 0;
          break;
        case 2:
          sortField = 'roi';
          this.sort0 = 0; this.sort1 = 0;
          break;
      }
      // 过滤排序导致 watch date 变化
      this.lockInit = true;
      this['sort'+idx] = this['sort'+idx] === 1  ? 2 : 1;
      return this['sort'+idx] == 2 ? this.tableData.sort((a, b) => a[sortField] - b[sortField])
                            : this.tableData.sort((a, b) => b[sortField] - a[sortField]);
    }
  }
};
</script>
