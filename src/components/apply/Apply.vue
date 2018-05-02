<template>
<div id="apply" class="apply" style="-webkit-overflow-scrolling:touch;">

    <div class="applyContent"> 
       <div class="applyTitles">
          <div class="applyTitle">
            <span >指标申请</span>
            <span class="applyShow" style="padding-left:28px;">
               <x-button mini  class="clearBtn">清空重置</x-button>
            </span>   
          </div>
       </div>

       <div class="cellGroup">
          <group> 
            <cell
            :title="('总况')"
            is-link
            :link="{path:'/bdc-prd-dbd/selInd'}">
            </cell>
      
            
          </group>

          
       </div>
       <div class="abtn">
         <x-button class="applyBtn">提交申请</x-button>
        <x-button class="applyBtn" disabled>提交申请</x-button>
      </div>    
    </div>
</div>
</template>
<style scoped>
  .apply{
    padding:15px 15px 20px 15px;
  }
  .applyContent{
    padding-left:15px;
    padding-right: 10px;
    background: #FFFFFF;
    border: 1px solid  #E3E3E3;
  }
  .applyTitles{
    padding-top:15px;
    padding-bottom:5px;
  }
  .applyTitle{
    /* padding-left:25%; */
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
  }

  .clearBtn{
    padding:0 10px;
    touch-action: none;
    border-radius: 99px!important;
    border: 1px solid #999999;
    background: #FFFFFF;
    font-family: PingFangSC-Regular;
    font-size: 1px;
    height: 27.8px;
    text-align: center;
    color: #999999;
  }
  #apply .weui-cell:before {
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
      /* border-top:none!important; */
  }
  #apply .weui-cell {
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
      /* border-top:none!important; */
  }
  .abtn{touch-action: none;
   padding-top:50px;
   padding-bottom:10px;
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
</style>
<script>
  import {ButtonTab,ButtonTabItem,XButton,Cell, CellBox, CellFormPreview,Badge,Group,Popup, TransferDom,Checker, CheckerItem } from 'vux'
 
  export default{
    directives: {
     TransferDom
    },
    data(){
      return{
        ishow: false,
        showPopup: false,
        demo4: '花跟叶',
      }
    },
    components:{
      Checker,
      CheckerItem,
      Popup,
      ButtonTab,
      ButtonTabItem,
      Cell, 
      CellBox, 
      CellFormPreview,
      Badge,
      Group,
      XButton
    },
    created () {
    },
    methods:{
      onItemClick (value, disabled) {
        console.log(value, disabled)
        if (!this.disabled) {
          this.showPopup = false
        }
      }
    },
  }
</script>
