<template>
  <div class="tbt-tabs-btn">
    <div v-for="(tab, idx) in tabs" class="tbt-tab" :class="{checked: currentValue==idx}" @click.stop="handleOnClick(idx)">{{tab}}</div>
  </div>
</template>

<script>
import tabMixin from './tabMixin'

export default {
  mixins: [tabMixin]
}
</script>

<style lang="less">
@import '../var.less';

.tbt-tabs-btn {
  overflow: hidden;
  display: inline-block;
  .tbt-tab {
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    float: left;
    padding: 0;
    text-align: center;
    border: 1px solid #EEEEEE;
    font: 12px/22px PingFangSC-Regular;
    color: #C1C1C1;
    width: 60px;
    height: 24px;
    &:first-child {
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    &:last-child {
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    &+.tbt-tab {
      margin-left: -1px;
    }
    &.checked {
      z-index: 1;
      color: #06C792;
      border-color: #06C792;
    }
  }
}
</style>
