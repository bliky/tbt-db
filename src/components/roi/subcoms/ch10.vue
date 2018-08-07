<template>
  <roi-table title="现金消费Top10" :data="$parent.roi.ch10" @onClickRow="onClickRow"></roi-table>
</template>

<script>
import RoiTable from './table'
import { navToId } from '../../../utils/utils'

export default {
  components: {
    RoiTable
  },
  methods: {
    onClickRow(row) {
      row.id && navToId.call(this, 'roiCh', row.id);
    }
  }
};
</script>
