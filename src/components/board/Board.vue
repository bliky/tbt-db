<template>
  <div id="board">
    <tab :line-width="2" slot="header" v-model="index" active-color="#09C767" active-size="15px">
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

