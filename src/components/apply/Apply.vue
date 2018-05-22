<template>
<div id="apply" class="apply" style="-webkit-overflow-scrolling:touch;">
  <div class="applyContent" v-if="!iselIndShow"> 
       <div class="applyTitles">
          <div class="applyTitle">
            <span>指标申请</span>
            <span class="applyShow">
              <x-button mini  v-if="isClear"  @click.native="clearReast" class="clearBtn" action-type="reset" >清空重置</x-button>
              <x-button mini  v-if="!isClear" @click.native="clearReast" class="clearBtbDis" disabled>清空重置</x-button>
            </span>   
          </div>
       </div>

       <div class="cellGroup">
          <group  > 
            <cell v-for="(item,index) in indClassItem" :key="index" 
                  :title = item.className 
                  :inline-desc="getContent(item.classId)"> 
              <label @click="clickSelInd(item.classId,item.className)" 
                    v-if="getContent(item.classId) == null">
                <img  width="20px" height="20px" 
                  src="../../assets/image/icon_forward_gray@2x.png">
              </label>
              <label @click="clickSelInd(item.classId,item.className)"  v-if="getContent(item.classId) != null">
               <img  width="20px" height="20px" src="../../assets/image/icon_checked@2x.png"> 
              </label>
            </cell>
          </group>
          
       </div>

      <div class="abtn">
        <x-button class="applyBtn" v-if="isSubmitApply" @click.native="showDialog">提交申请</x-button>
        <x-button class="applyBtn" v-if="!isSubmitApply" disabled>提交申请</x-button>
      </div>

    <div v-transfer-dom>
      <x-dialog v-model="show" class="conformDialog">
        <div class="alertTitle">
          <span class="conTitle">指标确认</span>
          <span @click="show=false" class="vux-close"></span>
        </div>
        <div class="inputDesc">
          <div class="inputTip">您共选择{{count}}项指标,请确认及填写原因后提交</div>
           <group :title="('')">
              <x-textarea :height="50" :show-counter="false" :max="30"  id="desc" 
                   v-model="textareaValue"
                  name="desc" :placeholder="('请输入申请原因(30个字内)')"></x-textarea>
           </group>
           <div class="noDesc" style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;background: #323232;">
              <toast v-model="noDesc" type="text" width="10em" 
                  :time="2000" is-show-mask text="请填写申请原因" 
                  :position="position"></toast>
            </div>
        </div>
       
        <div class="selIndCon">
        <!-- <div  v-for="(item,index) in listdata" :key="index"> -->
          <div selContent v-for="(item,index) in applyContentList" :key="index" >
            <div class="x-title2">{{item.className}}</div>  
              <div class="x-text" style="margin-left:10px;margin-right:10px">
                <span > 
                <!-- <span v-for="(item,index) in item.attrNameList" :key="index">  -->
                  {{item.attrNameList}} </span>
                   <hr style="margin-top:8px;" color="#E3E3E3" size="1px">
              </div>
            <!-- </div> -->
            
          </div>

          <div class="subtn">
            <x-button class="applyBtn" @click.native="confirmSubmit">确认提交</x-button>
          </div>
        </div>
      </x-dialog>
    </div>

     </div> 

    
    <div class="selInd" v-if="iselIndShow">
      <!-- <input v-model="indClassName"> -->
       <selInd @listenToSelInd="showMsgFromChild" :indClassId="indClassId" :indClassName="indClassName" ></selInd>
    </div>  
 

</div>
</template>

<script>
import selInd from './selInd'
import Cookie from 'js-cookie'
import {
  Toast,
  XTextarea,
  ButtonTab,
  ButtonTabItem,
  Cell,
  CellBox,
  CellFormPreview,
  Badge,
  Popup,
  Checker,
  CheckerItem,
  XDialog,
  XButton,
  Group,
  XSwitch,
  TransferDomDirective as TransferDom
} from "vux";
import qs from 'qs';

export default {
  directives: {
    TransferDom
  },
  components: {
    Toast,
    selInd,
    Cookie,
    XTextarea,
    Checker,
    CheckerItem,
    Popup,
    ButtonTab,
    ButtonTabItem,
    Cell,
    CellBox,
    CellFormPreview,
    Badge,
    XDialog,
    XButton,
    Group,
    XSwitch
  },
   data() {
    return {
      uid: null,//用户id
      uname: null,//用户名
      token: null,//token
      applyContentList: [],//申请提交内容
      position: 'middle',
      textareaValue: null,//申请原因值
      count: 0,//总数
      classCount: 0,//指标分类数
      indClassId: null,
      indClassName: null,
      noDesc: false,//没输入申请原因
      classId: null,//指标分类ID
      selIndContent: [],//已选择的指标
      selIndCount: 0,//已选择的指标数
      iselIndClass: false,//是否选择指标分类
      iselIndShow: false,//选择指标是否显示
      indClassItem: [],
      isSubmitApply: false,
      isClear: false,
      show: false
    };
  },
   mounted : function(){
     this.uid = Cookie.get('t8t-it-uid')
     this.uname = Cookie.get('t8t-it-username')
     this.token = Cookie.get('t8t-it-token')

    //  this.callNative(1009, {"url":"/bdc-prd-dbd/apply","title":"指标申请"})
     this.getIndClassList();
     this.getCountValue();
    
  },
  methods: {
    // callNative(typeId, data){
    //   let jsonData = {}; //初始化
    //   if(data){
    //     jsonData = {"type":typeId,"data":data}
    //   }else{
    //     jsonData = {"type":typeId}
    //   }
    //   let searchStr = window.location.search+""
    //   if(searchStr.indexOf('appType=1') !==-1){ //android
    //     // rabbitcircle.invoke( JSON.stringify(jsonData) )
    //      window.location.href = 'to8to://www.oa.com/app/approve?json=' + JSON.stringify(jsonData)
    //   }else{ //ios
    //     window.location.href = 'to8to://www.oa.com/app/approve?json=' + JSON.stringify(jsonData)
    //   }
    // },
    getIndClassList(){//获取指标分类列表
    this.$http.fetch('dsa/dataBoard/indClassList',
                      {        
                      uid: this.uid,
                      uname: this.uname,
                      token: this.token
                      })
                .then((response) => {
                  console.log(response.data)
                  if(response.data.status == 200){
                    this.indClassItem = response.data.result.rows 
                  }
                }, (response) => {
              });
    },
    getContent(classId){
      // let className = null
      let content = null
      let applyContent = {}
      let indContent = {}
      let indList = []
      let attrContent = {}
      let attrList = []
        for(let arr of this.applyContentList){
          if(classId == arr.classId){
            content = arr.attrName
            this.selIndCount = arr.attrCount
          }
          this.count = this.selIndCount
        }
        
      
      
      if(content != null){
        // content = content.substring(0, content.indexOf("/",content.indexOf("/")+1 ))
        content = content+"等"+this.selIndCount+"个"
      }
      return content
    },
    clickSelInd(classId,className){
      this.indClassId = classId
      this.indClassName = className
      this.iselIndShow = true
    },
     showMsgFromChild: function (classList){
       console.log("开始接受数据======")
       console.log(classList)
      //  this.count = classList.
       this.isSubmitApply = true;
      //  this.count = this.count+content.applyCount
       this.iselIndShow = false
      //  this.selIndContent.push(content)
       this.applyContentList.push(classList)
       this.isClear = true;
      //  this.selIndCount = content.applyCount
      //  this.classCount = this.selIndCount
      //   if(this.selIndCount > 0){
      //     this.isClear = true;
      //   }
      },
    clearReast(){
      this.applyContentList = []
      this.count = null
      this.isClear = false 
      this.iselIndClass = false
      this.isSubmitApply = false
      this.selIndCount = 0
      this.selIndContent = []
    },
    getCountValue(){
      if(this.selIndCount > 0){
         this.isClear = true;
      }
    },
    showDialog() {
      this.show = true;
    },
    getTextareaValue(value){
       this.textareaValue = value
    },
    confirmSubmit(){
      if(this.textareaValue != null){//判断申请原因是否为空
        //提交申请数据到后台
        this.$http.fetch('/data-board/apply',
                {        
                token: this.token,
                id: this.uid,
                uname: this.uname,
                reason: this.textareaValue,//申请原因
                applyContent: applyContentList//申请内容
                })
          .then((response) => {
            console.log("成功")
            if(response.data.status == 200){
              //根据指标审批人发起审批流程
              submitApplyToOa()//提交oa
            }
          }, (response) => {
            console.log("失败")
        });
        this.textareaValue = null
        this.show = false;
        this.clearReast();
      }else{
        this.noDesc = true
      }
      
    },
  },
  submitApplyToOa(){
    let apply_indexs = [{'classId':1,'className':"指标分类1",'indexes':[{"id":1,"name":"指标1"},{"id":2,"name":"指标2"}]},{"classId":2,"className":"指标分类2","indexes":[{"id":3,"name":"指标3"},{"id":4,"name":"指标4"}]}]
    let params = new URLSearchParams();
          params.append('applyer_uid', this.uid);
          params.append('apply_id', 20263);
          params.append('apply_indexes',JSON.stringify(apply_indexs));
          params.append('reason', this.textareaValue);
          params.append('index_chargers', [20263,20940]);
          params.append('big_data_chargers',[20751]);
  let appVersion = Cookie.get('t8t-it-appVersion')
  let appType = Cookie.get('t8t-it-appType')
  let deviceId = Cookie.get('t8t-it-deviceId')
  let version =  Cookie.get('t8t-it-version')
  let accountId = Cookie.get('t8t-it-accountId')
  let oappUrl = 'https://oapp.to8to.com/app/data-board/apply?uid='+this.uid+"&token="+token
                  +'appVersion='+appVersion+'appType='+appType+'deviceId='+deviceId
                  +'version='+version+'accountId='+accountId+'token='+token
//提交申请
    axios.post(oappUrl,params)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

  }
 
};
</script>
<style lang="less">
@import "~vux/src/styles/close";
#apply .weui-textarea{
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #666666!important;
  letter-spacing: 0;
}
.conformDialog {
    .weui-cells {
      margin: 15px 15px 0px 15px;
      height: 60px;
      background: #FFFFFF;
      border: 1px solid #06C792;
      line-height: 1.41176471;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #C1C1C1;
      letter-spacing: 0;
  }
  .weui-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
}
  .weui-dialog {
    width:93%!important;
    max-width: 93%!important;
    // border-radius: 18px;
    // padding-bottom: 18px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }

  .x-title2 {
    padding-top:5px;
    padding-left:15px;
    text-align: left;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }

  .x-text {
    padding: 0px 5px 10px 5px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    text-align: justify;
    color: #999999;
  }

  .vux-close {
    float:right;
    margin-right:15px;
    margin-top: 3px;
    margin-bottom: 8px;
  }
  
}

</style>
<style lang="less" scoped>
@import "~vux/src/styles/close";


.inputDesc .selIndCon{
  padding-left:35px;
}
.subtn{
  padding-bottom: 20px;
}

.alertTitle{
 padding-top:10px;
 text-align: center;
}
.conTitle{
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}
.noInputDesc{
  margin-left:15px;
  margin-top:5px;
  font-family: PingFangSC-Light;
  font-size: 12px;
  color: red;
  letter-spacing: 0;
  text-align: left; 
}
.inputTip{
  font-family: PingFangSC-Light;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  text-align: center;
}

.apply {
  padding: 13px 13px 20px 13px;
}
.applyContent {
  padding-left: 15px;
  padding-right: 10px;
  background: #ffffff;
  border: 1px solid #e3e3e3;
}
.applyTitles {
  padding-top: 15px;
  padding-bottom: 5px;
}
.applyTitle {
  padding-left:11%;
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}
.clearBtbDis{
  margin:10px 10px 0px 0px;
  align-self: auto;
  float:right;
  padding: 5px 10px;
  touch-action: none;
  border-radius: 99px !important;
  border: 1px solid #999999;
  background: #FFFFFF;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  height: 22px;
  text-align: center;
  // background:#E64340;
  color: #999999;
  line-height: 5px;
}
.clearBtn {
  margin:10px 10px 0px 0px;
  align-self: auto;
  float:right;
  padding: 5px 10px;
  touch-action: none;
  border-radius: 99px !important;
  border: 1px solid #E64340;
  background: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  height: 22px;
  text-align: center;
  // background:#E64340;
  color: #E64340;
  line-height: 5px;
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
.abtn {
  touch-action: none;
  padding-top: 8.5%;
  padding-bottom: 10px;
}

.applyBtn {
  touch-action: none;
  background: #06C792;
  /* border: 1px solid #06C792; */
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  width: 88%;
}
</style>
