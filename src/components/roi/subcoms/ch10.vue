<template>
  <roi-table title="现金消费Top10" :data="$parent.roi.ch10"></roi-table>
</template>

<script>
import RoiTable from './table'

export default {
  components: {
    RoiTable
  }
};
</script>
