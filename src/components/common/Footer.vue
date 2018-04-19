<template>
  <div id="footer" height="50px;">
      <tabbar slot="bottom" style="background-color:#ffffff;">
        <tabbar-item :link="{path:'/bdc-prd-dbd/board'}"  selected>
          <img slot="icon" src="../../assets/image/icon_bottom_data_gray@2x.png">
          <img slot="icon-active" src="../../assets/image/icon_bottom_data_green@2x.png">
          <span class="label" slot="label">数据看板</span>
        </tabbar-item>
        
        <!-- <tabbar-item :link="{path:'/dbd/bdc-prd-dbd/page'}" >
          <img slot="icon" src="../../assets/image/icon_bottom_apply_gray@2x.png">
          <img slot="icon-active" src="../../assets/image/icon_bottom_apply_green@2x.png">
          <span class="label" slot="label">指标申请</span>
        </tabbar-item> -->
      
        <tabbar-item :link="{path:'/bdc-prd-dbd/myinds'}" >
          <img slot="icon" src="../../assets/image/icon_bottom_mine_gray@2x.png">
          <img slot="icon-active" src="../../assets/image/icon_bottom_mine_green@2x.png">
          <span class="label" slot="label">指标释义</span>
        </tabbar-item>
      </tabbar>
  </div>
</template>
<style>
.weui-tabbar{
  position: fixed;
}
  tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    font-family: PingFangSC-Regular;
    font-size: 9px;
    color: #09C767;
    letter-spacing: 0;
    text-align: center;
  }
</style>
<script>
  import { ViewBox,Tabbar,TabbarItem } from 'vux'
  export default{
    name: 'AppFooter',
    components: {
      ViewBox,
      Tabbar,
      TabbarItem,
    },
    data(){
      return{
        index:0
      }
    },
    methods:{
       onclick1(){
       }
    }

  }

</script>
