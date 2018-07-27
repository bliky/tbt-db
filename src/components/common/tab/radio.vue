<template>
  <div class="tbt-tabs-radio">
    <div v-if="!noday" class="tbt-tab" :class="{checked: currentValue==0}" @click.stop="handleOnClick(0)">日</div>
    <div class="tbt-tab" :class="{checked: currentValue==1}" @click.stop="handleOnClick(1)">周</div>
    <div class="tbt-tab" :class="{checked: currentValue==2}" @click.stop="handleOnClick(2)">月</div>  
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number, Array, Object],
    noday: Boolean
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  methods: {
    handleOnClick (gra) {
      this.currentValue = gra
    }
  }
}
</script>

<style lang="less">
@import '../var.less';

.tbt-tabs-radio {
  overflow: hidden;
  margin-left: 12px;
}

.tbt-tab {
  box-sizing: border-box;
  cursor: pointer;
  font: 12px/18px PingFangSC-Regular;
  color: #999999;
  float: left;
  padding: 0;
  text-align: center;
  border: 1px solid @color-border;
  width: 45px;
  height: 20px;
  line-height: 18px;
  border-radius: 100px;
  &+.tbt-tab {
    margin-left: 10px;
  }
  &.checked {
    color: @color-primary;
    border-color: @color-primary;
  }
}
</style>
