<template>
  <roi-table title="全国城市" :data="$parent.roi.city"></roi-table>
</template>

<script>
import RoiTable from './table'

export default {
  components: {
    RoiTable
  }
};
</script>
