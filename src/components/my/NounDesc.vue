<template>
<div class="nounDesc">
  <!-- <divider >名词释义</divider> -->
  <!-- <div class="x-title1">周环比</div> -->
  <div v-for="(item,index) in listdata" :key="index">
    <div class="x-title2">{{item.noun_name}}</div>  
    <div class="x-text">{{item.noun_desc}}</div>
    <br>
    <!-- <divider>.</divider> -->
  </div>
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
         listdata: [],
         uid: 0,
         uname: " ",
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
      this.$http.fetch('dsa/dataBoard/nounDesc/pageList',
                       {        
                        uid: this.uid,
                        uname: this.uname,
                        page: this.page,
                        size: this.size
                        })
                  .then((response) => {
                    console.log(response.data.result.rows);
                    if(response.data.status == 200 && response.data.result.total > 0){
                      this.listdata = response.data.result.rows;
                    }
                 }, (response) => {
                    console.log('error===='+response.error);
                });
    },
  }
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