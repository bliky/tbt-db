<template>
  <div id="board" style="-webkit-overflow-scrolling:touch;">
    <tab :line-width="2" height="44px;" slot="header" v-model="index" active-color="#09C767" active-size="17px">
      <tab-item :selected="tag === item" v-for="item in taglist" :key="item" @click="tag = item">
        {{item}}
      </tab-item>
    </tab>
    <div v-if="index === 0">
      <preview></preview>
    </div>
    <div v-if="index === 1">
      <trend></trend>
    </div>
  </div>
</template>

<style>
#board element.style {
    height: 1px;
}
#board .vux-tab .vux-tab-item{
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: #666666;
}
</style>

<script>
import { ViewBox,Tab,TabItem } from 'vux'
// import Indate from './Indate'
import Preview from './Preview'
import Trend from './Trend'

  const list = () => ['指标总览', '指标趋势']

  export default {

    components: {
      Tab,
      TabItem,
      ViewBox,
      // Indate,
      Preview,
      Trend
    },
    data () {
      return {
        tag: '指标总览',
        taglist: list(),
        index:0
      }
    },
    ready () {
    },
    methods:{
     
       
    }
  }
</script>

