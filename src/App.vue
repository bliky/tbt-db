<template>
  <div id="app" style="-webkit-overflow-scrolling: touch; height: 100%">
    <view-box ref="viewBox" body-padding-top="0px">
      <router-view></router-view>
      <!-- <app-footer  slot="bottom"></app-footer> -->
    </view-box>
      
        
  </div>
</template>

<style lang="less">
@import "~vux/src/styles/reset";

html,
body {
  font-family: PingFangSC-Medium;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
}
#app {
  overflow-y: auto;
  z-index: 999;
  -webkit-overflow-scrolling: touch;
}
.vux-table td:before,
.vux-table th:before {
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
}
.vux-table:after {
  border-top: 0 !important;
}

.vux-table td,
.vux-table th {
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
}
.vux-table td:after,
.vux-table th:after {
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
}
.weui-tab__panel {
  padding-top: 50px;
}
</style>
<script>
import Board from "./components//board/Board";
import AppHeader from "./components/common/Header";
import AppFooter from "./components/common/Footer";
import { ViewBox, Tabbar, TabbarItem } from "vux";


export default {
  components: {
    Board,
    AppHeader,
    ViewBox,
    AppFooter,
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      routerAnimate: false
    };
  }
};
</script>
