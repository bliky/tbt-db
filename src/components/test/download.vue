<template>
  <div style="margin: 20px;"><x-button type="primary" @click.native="download">下载</x-button></div>
</template>

<script>
import { XButton } from 'vux'
import { openFile } from '../../utils/utils'

export default {
  components: {
    XButton
  },
  filters: {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  created () {
  },
  computed: {
  },
  methods: {
    download () {
      openFile("/static/doc.pdf");
    }
  }
}
</script>
