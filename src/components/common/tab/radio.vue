<template>
  <div class="tbt-tabs-radio" style="margin-left: 15px;">
    <div class="tbt-tab checked">日</div>
    <div class="tbt-tab">周</div>
    <div class="tbt-tab">月</div>  
  </div>
</template>

<script>
  
</script>

<style lang="less">
@import '../var.less';

.tbt-tabs-radio {
  padding: 0 10px;
}

.tbt-tab {
  cursor: pointer;
  color: @color-text;
  font-size: @font-size-main;
  float: left;
  padding: 0 20px;
  text-align: center;
  border: 1px solid @color-border;
  height: 22px;
  line-height: 22px;
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
