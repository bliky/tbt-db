<template>
<div class="indesc">
    <!-- <divider>指标释义</divider> -->
      <div v-for="(item,index) in listdata" :key="index">
        <div class="x-title1">{{item.className}}</div>
        <div v-for="(item,indexs) in item.childNode" :key="indexs">
          <div class="x-title2">{{item.indName}}</div>  
          <div class="x-text">{{item.inDesc}}</div>
        </div>
        <br>
        <!-- <divider>.</divider> -->
      </div>
    <br>
    <br>
</div>
</template>
<script>
import { Divider } from 'vux'
import Cookie from 'js-cookie'
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
    getList(){
      this.uid = Cookie.get('t8t-it-uid');
      this.uname = Cookie.get('t8t-oa-username');
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