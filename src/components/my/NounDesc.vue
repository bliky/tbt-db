<template>
<div class="nounDesc">
  <divider>名词释义</divider>
  <div class="x-title1">周环比</div>
  <div class="x-title2">微信小程序</div>  
  <div class="x-text">对比上个月同期,往回推四周,如本月第一周,对比上月第一周</div>

  <div class="x-title2">微信小程序</div>  
  <div class="x-text">对比上个月同期,往回推四周,如本月第一周,对比上月第一周</div>
  
  
</div>
</template>
<script>
import { Divider } from 'vux'

export default {
  components: {
    Divider
  },
  mounted () {
   
  },
}

</script>

<style scoped>
.x-title1 {
  padding-left: 4%;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: black;
}

.x-title2 {
  padding-top:10px;
  padding-left: 4%;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
}

.x-text {
  padding-left: 4%;
  padding-right: 4%;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #999999;
}
</style>