<template>
  <div v-show="isShow" class="pop-pannel" style="top: 34px; z-index: 200; border-top: 1px solid #F6F6F6;" @click="hide">
    <div class="pop-pannel-bd branch" @click.stop=''>
      <area-filter ref="areaFilter" @change="onAreaChange" @pick="onPick"></area-filter>
      <div style="display: flex">
        <div @click="onReset" class="filter-btn-reset">重置</div>
        <div @click="onConfirm" class="filter-btn-submit" :class="{disabled: disbleConfirm}">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {push, remove} from '../util'
import AreaFilter from '../common/area'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AreaFilter
  },
  data () {
    return {
      isShow: this.visible,
      disbleConfirm: false
    }
  },
  methods: {
    onPick (picked) {
      this.disbleConfirm = !(picked.sub1.length || picked.sub2.length || picked.sub3.length)
    },
    onReset () {
      // this.hide()
      this.$refs.areaFilter.reset()
    },
    show (tab) {
      this.isShow = true
      this.$emit('update:visible', true)
      this.$refs.areaFilter.refresh()
    },
    hide () {
      this.isShow = false
      this.$emit('update:visible', false)
      this.$emit('onhide')
    },
    getParams () {
      return this.$refs.areaFilter.getParams()
    },
    emit () {
      this.$emit('confirm', this.getParams())
    },
    onAreaChange () {
      this.emit()
    },
    onConfirm () {
      if (this.disbleConfirm) {
        return
      }
      this.emit()
      this.hide()
    }
  }
}
</script>
