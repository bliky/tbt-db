<template>
  <div id="indate">
      <div style="padding: 15px 20% 15px 20%;">
        <button-tab v-model="index">
          <button-tab-item :selected="tag === item" v-for="item in taglist" 
            :key="item" @on-item-click="sendMsgToParent(item,index)">
            {{item}}
          </button-tab-item>  
        </button-tab>
      </div>  

      <div style="text-align: center;">
        <p style="font-size: 15px;color: #333333;letter-spacing: 0;">
          <span v-if="index === 0 || index === 1 || index === 2">
              2月4日
          </span>
          <span v-if="index === 1 || index === 2">
             - 2月11日
          </span> 
        </p>
        <p style="font-size: 12px;color: #999999;letter-spacing: 0;">更新时间：
          03/04 09:00
        </p>
      </div>
        
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @import '~vux/dist/vux.css'; */
  #indate .vux-button-group-current {
   background-color:#06C792;
}
</style>

<script>
import { ButtonTab, ButtonTabItem, Divider } from 'vux'

const list = () => ['日指标', '周指标','月指标']

export default {
  props:['message'],
  components: {
    ButtonTab,
    ButtonTabItem,
    Divider
  },
  methods: {
    sendMsgToParent:function(item,index){
      this.tag = item;
      this.index = index;
      this.$emit("listenToIndateEvent",index);
    }
  },
  data () {
   return {
        tag: '日指标',
        taglist: list(),
        index:0
      }
  }
}
</script>


