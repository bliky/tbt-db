<template>
  <roi-table title="Top10渠道排行" :data="$parent.roi.ch10"></roi-table>
</template>

<script>
import RoiTable from './table'

export default {
  components: {
    RoiTable
  }
};
</script>
