<template>
<div class="nounDesc" style="padding: 20px 15px 80px 15px;-webkit-overflow-scrolling:touch;">
  <div  v-for="(item,index) in listdata" :key="index">
    <div class="x-title2">{{item.noun_name}}</div>  
    <div class="x-text">{{item.noun_desc}}</div>
     <hr color="#eee" size="1px">
    <br>
  </div>
</div>
</template>
<style scoped>
.x-title2 {
  padding-top: 20px;
  /* padding-left: 4%; */
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
}

.x-text {
  padding-top: 20px;
  padding-bottom:6%;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  text-align: justify;
  color: #999999;
}
</style>
<script>
import Cookie from 'js-cookie'

export default {
  components: {
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
                    if(response.data.status == 200 && response.data.result.total > 0){
                      this.listdata = response.data.result.rows;
                    }
                 }, (response) => {
                });
    },
  }
}

</script>

