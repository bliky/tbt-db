<template>
  <div v-show="isShow" class="pop-pannel" style="top: 34px; z-index: 200; border-top: 1px solid #F6F6F6;" @click="hide">
    <div class="pop-pannel-bd branch" @click.stop=''>
      <area-filter ref="areaFilter" @change="onAreaChange"></area-filter>
      <div style="display: flex">
        <div @click="onReset" style="border-top: 1px solid #eee; font: 17px/50px PingFangSC-Regular,sans-serif; color:#06C792; text-align:center; width: 126px;">重置</div>
        <div @click="onConfirm" style="font: 17px/50px PingFangSC-Regular,sans-serif; background: #06C792; color:#fff; text-align:center; flex:1;">确定</div>
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
      isShow: this.visible
    }
  },
  methods: {
    onReset () {
      this.hide()
      this.$refs.areaFilter.reset()
      this.$emit('confirm', this.getParams())
    },
    show (tab) {
      this.isShow = true
      this.$emit('update:visible', true)
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
      this.emit()
      this.hide()
    }
  }
}
</script>
