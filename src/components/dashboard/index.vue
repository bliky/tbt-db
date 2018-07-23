<template>
  <div style="background-color: #f6f6f6;">
    <!-- <app-header xtitle="业绩总况"></app-header> -->
    <tab :line-width="2"  v-model="index" active-color="#06C792">
      <tab-item :selected="index === 0" @click="index = 0">统计模式</tab-item>
      <tab-item :selected="index === 1" @click="index = 1">跟踪模式</tab-item>
    </tab>
    <keep-alive>
      <statistical v-if="index === 0"></statistical>
      <trace v-else></trace>
    </keep-alive>
  </div>
</template>

<script>
import dashboard from './dashboard.js'

export default dashboard;
</script>

<style lang="less">
@import './dashboard.less';
</style>
