<template>
<div class="selInd" style="padding: 20px 15px 80px 15px;-webkit-overflow-scrolling:touch;">
    <!-- <div v-for="(item,index) in listdata" :key="index"> -->
      <!-- <div class="x-title1">{{item.className}}</div> -->
      <div id="title" class="title">
        <span class="x-title1">流量指标</span> 
          <div style="padding-left:62%" class="weui-tabbar__icon vux-center">
            <img slot="icon" height="32px" width="30px" src="../../assets/image/icon_collect@2x.png">
            <sup v-if="count > 0"><span class="vux-badge"> {{count}}</span></sup>
          </div>
      </div>
      <div class="box">
        <checker v-model="demo21"
          default-item-class="item"
          selected-item-class="item-selected"
          disabled-item-class="item-disabled">
          <checker-item :value="item" v-for="(item, index) in items1" 
            @on-item-click="onItemClick"
            :key="index">{{item.value}}
          </checker-item>
        </checker>
    </div>
      
    <div class="abtn">
      <x-button class="applyBtn">提交申请</x-button>
      <x-button class="applyBtns" disabled>提交申请</x-button>
    </div>  
  <br>
</div>
</template>
<style scoped>
.x-title1 {
 padding-top: 20px;
 padding-left: 15px;
 font-weight:bold;
 font-family: PingFangSC-Medium;
 font-size: 17px;
 color: #333333;
}

.box {
  padding: 20px 15px 10px 10px;
}
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px 10px 10px;
}
.demo1-item-selected {
  border: 1px solid green;
}
.item {
  border: 1px solid #E3E3E3;
  border-radius: 100px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  /* color: #E3E3E3; */
  padding: 5px 10px;
  margin-right: 10px;
  line-height: 18px;
  /* border-radius: 15px; */
}
.item-selected {
  padding: 5px 10px;
  background: #09C767;
  border-radius: 100px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #FFFFFF;
}
.item-disabled {
  padding: 5px 10px;
  color: #999;
  font-family: PingFangSC-Regular;
  font-size: 15px;
}
.abtn{
   touch-action: none;
   padding-top:50px;
   padding-bottom:10px;
}
.applyBtns {
  width: 88%;
}
.applyBtn {
  touch-action: none;
  background: #09C767;
  border: 1px solid #09C767;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
  width: 88%;
}
.vux-badge {
    background: #09C767;
    color: #fff;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    padding: 0 6px;
    background-clip: padding-box;
    vertical-align: middle;
}

</style>
<script>
import Cookie from 'js-cookie'
import {ButtonTab,ButtonTabItem,XButton,Checker,CheckerItem,Badge } from 'vux'

export default {
  components: {
    ButtonTab,
    ButtonTabItem,
    XButton,
    Checker, 
    Badge,
    CheckerItem
  },
  data () {
   return {
          items1: [
            {
            key: '1',
            value: 'Aasdfqewr'
          }, 
          {
            key: '2',
            value: 'Basdf'
          }, 
          {
            key: '3',
            value: 'Cad'
          },
          {
            key: '4',
            value: 'Aasdf'
          }, 
          {
            key: '5',
            value: 'Basdf'
          }, 
          {
            key: '6',
            value: 'Cad'
          }
          ],
        count: null,
         listdata: [],
         uid: 0,
         uname: " ",
         demo21: null,
         page: 1,
         size: 100
      }
  },
  mounted : function(){
     this.getList();
  }, 
  methods: {
    onItemClick (value, disabled) {
        console.log(value)
        if(!this.value){ 
          this.count +=1;
        }else{
          this.count -=1;
        }
        if (!this.disabled) {
          
          //this.showPopup = false
        }
     },
    getList(){
      this.uid = Cookie.get('t8t-it-uid');
      this.uname = Cookie.get('t8t-oa-username');
      this.page = 1;
      this.size = 100;
      // this.$http.fetch('dsa/dataBoard/nounDesc/pageList',
      //                  {        
      //                   uid: this.uid,
      //                   uname: this.uname,
      //                   page: this.page,
      //                   size: this.size
      //                   })
      //             .then((response) => {
      //               if(response.data.status == 200 && response.data.result.total > 0){
      //                 this.listdata = response.data.result.rows;
      //               }
      //            }, (response) => {
      //           });
    },
  }
}

</script>

