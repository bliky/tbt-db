<template>
  <div id="app" height="100%">
      
      <router-view></router-view>
      <app-footer  slot="bottom"></app-footer>
        
  </div>
</template>

<style lang="less">
@import '~vux/src/styles/reset';

html, body {
  width:100%;
  height:100%;
  -webkit-overflow-scrolling: touch!important;
  overflow-x: hidden;
  background-color:#ffffff;
}
#app{
  -webkit-overflow-scrolling: touch!important;
}
.vux-table td:before, .vux-table th:before {
  border-top: 0!important;
  border-bottom:0!important;
  border-left: 0!important;
  border-right:0!important;
}
.vux-table:after {
  border-top: 0!important; 
}
 
.vux-table td, .vux-table th {
  border-top: 0!important;
  border-bottom:0!important;
  border-left: 0!important;
  border-right:0!important;
}
.vux-table td:after, .vux-table th:after {
  border-top: 0!important;
  border-bottom:0!important;
  border-left: 0!important;
  border-right:0!important;
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
            "routerAnimate": false
        }
    }    
  }

</script>
