<template>
<div class="indesc">
    <divider>指标释义</divider>
      <div v-for="(item,index) in listdata" :key="index">
        <div class="x-title1">{{item.className}}</div>
        <div class="x-title2">{{item.indName}}</div>  
        <div class="x-text">{{item.inDesc}}</div>
        <divider>.</divider>
      </div>

</div>
</template>
<script>
import { Divider } from 'vux'

export default {
  components: {
    Divider
  },
  data () {
   return {
         listdata: []
      }
  },
  mounted : function(){
     this.getList();
  }, 
  methods: {
    getList(){
      let uid = 6881;
      let uname = "测试名";
      let page = 1;
      let size = 100;
       let vm = this;
          vm.$http.fetch('dsa/dataBoard/inDesc/pageList',
                       {        
                        "uid":uid,
                        "uname":uname,
                        "page":page,
                        "size":size
                        })
                  .then((response) => {
                    console.log(response.data.result.rows);
                    if(response.data.status == 200 && response.data.result.total > 0){
                      vm.listdata = response.data.result.rows;
                    }
                 }, (response) => {
                    console.log('error1');
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