<template>
  <!-- <div id="header" height="100%"> -->
    <x-header :left-options="{backText: ''}" :on-click="{back:''}" 
      slot="header"
      style="background-color:#ffffff;">
      <span class="span-title">{{tag}}</span>
    </x-header>
  <!-- </div> -->
</template>
<style>
  .span-title{
    text-align:center;
    margin:auto;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #333333;
    letter-spacing: -0.41px;
    text-align: center;
    line-height: 23px;
  }
</style>
<script>
  import { Tabbar,TabbarItem,XHeader, ButtonTab, ButtonTabItem,ViewBox} from 'vux'

  export default{
    name: 'AppHeader',
    data (){
        return{
          tag:'我的指标',
          showMenus: false
        }
    },
    components: {
      Tabbar,
      TabbarItem,
      XHeader,
      ButtonTab, 
      ButtonTabItem,
      ViewBox
    },
    methods: {
    },
  }
</script>
