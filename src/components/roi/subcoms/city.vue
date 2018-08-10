<template>
  <roi-table title="全国城市" :data="$parent.roi.city" @onClickRow="onClickRow"></roi-table>
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
      row.id && navToId.call(this, 'roiCity', row.id);
    }
  }
};
</script>
