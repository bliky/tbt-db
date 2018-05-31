<template>
  <div class="myinds" style="-webkit-overflow-scrolling:touch;">
        <!-- <div style="padding-top:20px;background-color:#F6F6F6;"></div> -->
      
    <group> 
      <cell
      :title="('名词释义')"
      is-link
      @click.native="goToDesc(1)">
      <!-- :link="{path:'/bdc-prd-dbd/nounDesc'}"> -->
      </cell>

      <cell
      :title="('指标释义')"
      is-link
       @click.native="goToDesc(2)">
      <!-- :link="{path:'/bdc-prd-dbd/indesc'}"> -->
      </cell>
      <!-- <hr  color="#E3E3E3" size="1px"> -->
    </group>
 </div> 
</template>
<style>

#myinds .weui-cell:before {
      border-top:none!important;
}
#myinds .weui-cell {
    border-top:none!important;
}
</style>

<script>
import Cookie from 'js-cookie'
import { Cell, CellBox, CellFormPreview, Group, Badge } from 'vux'
export default {
  mounted () {
   
  },
  components: {
    Cookie,
    Group,
    Cell,
    CellFormPreview,
    CellBox,
    Badge
  },
  data () {
    return {
      showContent01: false,
      showContent02: false,
      params: null
    }
  },
  methods: {
    callNative(typeId, data){
      let jsonData = {}; //初始化
      if(data){
        jsonData = {"type":typeId,"data":data}
      }else{
        jsonData = {"type":typeId}
      }
      if(Cookie.get('t8t-it-appType') == 1){ //android
        rabbitcircle.invoke( JSON.stringify(jsonData) )
      }else{ //ios
        window.location.href = 'to8to://www.oa.com/app/approve?json=' + JSON.stringify(jsonData)
      }
    },
    goToDesc(descType){
      this.params = "?appType=" + this.$route.query.appType
                      + "&uid=" + this.$route.query.uid
                      + "&tickets=" + this.$route.query.tickets
                      + "&uname=" + this.$route.query.uname
                      + "&token=" + this.$route.query.token
      let url = null
      let title = null
      if(descType == 1){
        url = "nounDesc"
        title = "名词释义"
      }else if(descType == 2){
        url = "indesc"
        title = "指标释义"
      }
      // this.callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/' + url+this.params,title:title})
       this.callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/' + url,title:title})
    },
    onClick () {
      console.log('on click')
    }
  },
  
}
</script>
