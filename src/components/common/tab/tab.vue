<template>
  <div class="tbt-tabs">
    <div v-for="(tab, idx) in tabs" class="tbt-tab" :class="{checked: currentValue==idx}" @click.stop="handleOnClick(idx)">{{tab}}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number, Array, Object],
    tabs: Array
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
    handleOnClick (val) {
      this.currentValue = val;
    }
  }
}
</script>

<style lang="less">
@import '../var.less';

.tbt-tabs {
  overflow: hidden;
  height: 40px;
  background: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #F6F6F6;
  .tbt-tab {
    float: left;
    box-sizing: border-box;
    padding: 10px 0 9px;
    color: #333;
    font: 15px/21px PingFangSC-Regular,sans-serif;
    height: 100%;
    position: relative;
    cursor: pointer;
    &+.tbt-tab {
      margin-left: 20px;
    }

    &.checked {
      color: #06C792;
      font-family: PingFangSC-Medium,sans-serif;
      &:after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #06C792;
      }
    }
  }
}
</style>
