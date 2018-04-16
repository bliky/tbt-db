<template>
  <div id="app" style="height:100%;">
    <!-- <view-box ref="viewBox">
      <router-view></router-view>
    </view-box>   -->
      <!-- <view-box> -->
        <router-view></router-view>
        <app-footer  slot="bottom"></app-footer>
      <!-- </view-box> -->
   
  </div>
</template>

<style lang="less">
@import '~vux/src/styles/reset';
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  background-color:#ffffff;
}
.weui-tab__panel{
  padding-top: 50px;
}
</style>
<script>
import AppHeader from './components/common/Header'
import AppFooter from './components/common/Footer'
import { ViewBox,Tabbar,TabbarItem } from 'vux'

  export default{
    components: {
      AppHeader,
      ViewBox,
      AppFooter,
      Tabbar,
      TabbarItem
    },
    data() {
        return {
            "routerAnimate": false,
            "enterAnimate": "", //页面进入动效
            "leaveAnimate": "" //页面离开动效
        }
    }    
  }

</script>
