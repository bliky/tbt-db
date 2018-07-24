<template>
<div class="indesc" style="-webkit-overflow-scrolling:touch;">
  <div style="margin: 15px 20px;">
    <div class="btn-download" @click="handleOnClickDownload">
      <!-- <i class="tbt-icon tbt-icon-download" style="position: relative; left: 3px; top: 3px; margin-right: 20px;"></i> -->
      数据指标白皮书
    </div>
  </div>

  <!-- <divider>指标释义</divider> -->
  <div  class="div-table" style="padding: 0px 15px 80px;">
    <div v-for="(item,index) in listdata" :key="index">
      <div class="x-title1">{{item.className}}</div>
      <div v-for="(item,indexs) in item.childNode" :key="indexs">
        <div class="x-title2">{{item.indName}}</div>  
        <div class="x-text">{{item.inDesc}}</div>
        <hr color="#eee" size="1px">
      </div>     
      <br>
      <!-- <divider>.</divider> -->
    </div>
  </div>
</div>
</template>
<script>
import { Divider } from 'vux'
import Cookie from 'js-cookie'
import { openFile } from '../../utils/utils'
import '../common/icon'

export default {
  components: {
    Divider
  },
  data () {
   return {
        classList:[],
         listdata: [],
        classNames:'流量',
         uid: 0,
         uname: "",
         page: 1,
         size: 100
      }
  },
  mounted : function(){
    this.getList();
  }, 
  methods: {
    getList () {
      this.uid = Cookie.get('t8t-it-uid')
      this.uname = Cookie.get('t8t-oa-username')
      this.page = 1;
      this.size = 100;
      this.$http.fetch('dsa/dataBoard/inDesc/pageList',
                       {        
                        uid: this.uid,
                        uname: this.uname
                        })
                  .then((response) => {
                    console.log(response.data.result.list);
                      this.listdata = response.data.result.list;
                 }, (response) => {
                    console.log('error====='+response.error);
                });
    },
    handleOnClickDownload () {
      openFile("/static/doc.pdf", '数据指标白皮书');
    }
  }
}

</script>

<style scoped>
.btn-download {
  color: #06C792;
  font: 17px/24px PingFangSC-Regular;
  background: #FFFFFF;
  border: 1px solid #06C792;
  border-radius: 2px;
  text-align: center;
  padding: 10px 0;
}

.x-title1 {
  padding-top: 20px;
 font-weight:bold;
 font-family: PingFangSC-Medium;
 font-size: 17px;
 color: #333333;
}

.x-title2 {
  padding-top: 20px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
}

.x-text {
  padding-top: 5px;
  padding-bottom:20px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  text-align: justify;
  color: #999999;
}

</style>