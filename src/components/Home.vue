<template>
  <div>
    <div>
      <app-header></app-header>
    </div> 

    <div>
     <app-content></app-content>
    </div>
    
    <div>
      <app-footer></app-footer>
   </div> 
  </div>
</template>
<style>
  /* @import '~vux/dist/vux.css'; */
  html{
    font-family: PingFangSC-Regular;  
  }

  body{
    line-height: 1.2; /* 设置行间距为1.2 ,默认是1.6的太大*/
  }
</style>
<script>
  import { Tab,TabItem } from 'vux'
  import AppHeader from './common/Header'

  export default {

    components: {
      Tab,
      TabItem
    },
    data () {
      return {
        index:0
      }
    },
    ready () {
    },
    methods:{
    }
  }
</script>
