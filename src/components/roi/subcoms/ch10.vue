<template>
  <div class="tbt-pannel" style="padding: 0;">
    <table class="tbt-roi-table">
      <tr>
        <th>全国城市</th><th>现金</th><th>收入</th><th>ROI</th>
      </tr>
      <tr v-for="row in $parent.roi.ch10">
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
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
