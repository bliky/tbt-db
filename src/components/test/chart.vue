<template>
  <chart-line :data="lineData" :max="2018-6-30"></chart-line>
</template>

<script>
import { Line as ChartLine } from '../common/chart'

export default {
  components: {
    ChartLine
  },
  filters: {
  },
  data () {
    return {
      lineData: [
        {dt:'2018-6-1', val: 100},
        {dt:'2018-6-2', val: 120},
        {dt:'2018-6-3', val: 100},
        {dt:'2018-6-4', val: 100},
        {dt:'2018-6-5', val: 100},
        {dt:'2018-6-6', val: 160},
        {dt:'2018-6-7', val: 100},
        {dt:'2018-6-8', val: 100},
        {dt:'2018-6-9', val: 100},
        {dt:'2018-6-10', val: 100},
        {dt:'2018-6-11', val: 100},
        {dt:'2018-6-12', val: 100},
        {dt:'2018-6-13', val: 100},
        {dt:'2018-6-14', val: 100},
        {dt:'2018-6-15', val: 60},
        {dt:'2018-6-16', val: 100},
        {dt:'2018-6-17', val: 100},
        {dt:'2018-6-18', val: 80},
        {dt:'2018-6-19', val: 100},
        {dt:'2018-6-20', val: 100},
        {dt:'2018-6-21', val: 100},
        {dt:'2018-6-22', val: 100},
        {dt:'2018-6-23', val: 100},
        {dt:'2018-6-24', val: 100},
        {dt:'2018-6-25', val: 0},

      ]
    }
  },
  watch: {
  },
  created () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
