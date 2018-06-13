<template>
<div id="apply" class="apply" style="height:100%;-webkit-overflow-scrolling:touch;overflowScrolling:touch;">
  <div class="applyContent" v-if="!iselIndShow && !ishow && isClassShow"> 
       <div class="applyTitles">
          <div class="applyTitle" style="align-items: center;justify-content: space-between;">
            <span style="font-family: PingFangSC-Semibold;font-size: 24px;color: #333333;letter-spacing: 0;text-align: center;">指标申请</span>
            <span class="applyShow">
              <x-button mini  v-if="isClear"  @click.native="conformClearAll" class="clearBtn" action-type="reset" >清空重置</x-button>
              <!-- <x-button mini  v-if="!isClear" @click.native="clearReast" class="clearBtbDis" disabled>清空重置</x-button> -->
            </span>   
            <div>
               <div v-transfer-dom>
                  <confirm v-model="isConShow"
                  :title="'操作提示'"
                  @on-cancel="onCancel"
                  @on-confirm="onConfirm"
                  @on-show="onShow"
                  @on-hide="onHide">
                    <p style="text-align:center;ont-family: PingFangSC-Regular;font-size: 15px;color: #000000;text-align: center;">
                        确定要清空所有指标吗?
                    </p>
                  </confirm>
                </div>
            </div>
          </div>
       </div>

       <div class="cellGroup" style="margin-top:20px">
          <group> 
            <cell v-for="(item,index) in indClassItem" :key="index" 
                  :title = item.className
                   @click.native="item.attrName == null ? clickSelInd(item.classId,item.className) 
                    : aginClickSelInd(item.classId,item.className) "
                  :inline-desc = item.attrName>
                <img v-if="item.attrName == null"  width="20px" height="20px" 
                      src="../../assets/image/icon_forward_gray@2x.png">
               <img  v-if="item.attrName != null" width="20px" height="20px"
                      src="../../assets/image/icon_checked@2x.png"> 
            </cell>
          </group>
          
       </div>
      
      <div :class="{'abtn': isSubmitApply,'abtns':!isSubmitApply}"  >
        <x-button class="applyBtn" v-if="isSubmitApply" @click.native="showDialog">提交申请</x-button>
        <x-button class="applyBtns" v-if="!isSubmitApply" disabled>提交申请</x-button>
      </div>
  </div>     

    <div v-transfer-dom style="-webkit-overflow-scrolling:touch;margin:10px 15px 20px 15px">
        <x-dialog v-model="show" class="conformDialog" :scroll="true">
        <!-- <div  v-if="ishow"  style="margin:0px 15px 20px 15px" class="conformDialog"> -->
          <div class="alertTitle">
            <span class="conTitle">指标确认</span>
            <span @click="show=false" class="vux-close"></span>
          </div>
          <div class="inputDesc">
            <div class="inputTip">您共选择{{count}}项指标,请确认及填写原因后提交</div>

            <group :title="('')">
                <x-textarea :height="50" :show-counter="false" :max="30"  id="desc" 
                    v-model="textareaValue"
                    :class="{'weui-textarea': textareaValue != null,'weui-ntextarea': textareaValue == null}"
                    name="desc" :placeholder="('请输入申请原因(30个字内)')"></x-textarea>
            </group>
            <div class="noDesc" style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;background: #323232;">
                <toast v-model="noDesc" type="text" width="10em" 
                    :time="2000" is-show-mask text="请填写申请原因" 
                    :position="position">
                </toast>
            </div>
            <div class="noDesc" style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;background: #323232;">
                <toast v-model="submit" type="success" width="10em" 
                    :time="2000" is-show-mask text="提交成功" 
                    :position="position">
                </toast>
            </div>
          </div>
        
          <div class="selIndCon" style="-webkit-overflow-scrolling:touch;overflow:auto;max-height:380px;">
            <div selContent v-for="(item,index) in applyContentList" :key="index" >
              <div  class="x-title2">{{item.className}}</div>  
                <div class="x-text" style="margin-left:10px;margin-right:10px">
                  <span > 
                    {{item.attrNameList}} </span>
                    <hr style="margin-top:8px;" color="#E3E3E3" size="1px">
                </div>
            </div>
            <br><br><br>
          </div>
          
            <div class="subtn">
              <x-button class="applyBtn" @click.native="confirmSubmit">确认提交</x-button>
            </div>
          
        <!-- </div> -->
        </x-dialog>
    </div>

     

    
    <div class="selInd" v-if="iselIndShow">
       <selInd @listenToSelInd="showMsgFromChild" :cdimList="cdimList" :indClassId="indClassId" 
       :indClassName="indClassName"></selInd>
    </div>  

</div>
</template>

<script>
import selInd from './selInd'
import Cookie from 'js-cookie'
import {
  Confirm ,
  ConfigPlugin,
  ViewBox,
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
    Confirm,
    ViewBox,
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
      applyList: [],
      position: 'middle',
      textareaValue: null,//申请原因值
      count: 0,//总数
      classCount: 0,//指标分类数
      indClassId: null,
      indClassName: null,
      noDesc: false,//没输入申请原因
      submit: false,
      classId: null,//指标分类ID
      selIndContent: [],//已选择的指标
      selIndCount: 0,//已选择的指标数
      iselIndClass: false,//是否选择指标分类
      iselIndShow: false,//选择指标是否显示
      isDouClick: false,
      indClassItem: [],
      isSubmitApply: false,
      cdimList: [],
      insertApplyContent: [],
      isClear: false,
      ishow: false,
      isConShow: false,
      isClassShow: false,
      show: false
    };
  },
   mounted : function(){
     this.uid = Cookie.get('t8t-it-uid')
     this.uname = Cookie.get('t8t-oa-username')
     this.token = Cookie.get('t8t-it-token')

     
     this.getIndClassList();
    //  this.getCountValue();
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
    onClick(tag,item,index){
      if(tag === '指标总览' && item==='指标总览'&&index===0){
        this.iname = ''
        this.tindex = 0
      }
    },
    getIndClassList(){//获取指标分类列表
     this.uname = Cookie.get('t8t-oa-username')
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
                    this.isClassShow = true
                    for(let arr of this.indClassItem){
                      arr.attrName = null
                    }
                  }
                }, (response) => {
              });
    },
    clickSelInd(classId,className){
      this.cdimList = []
      // let url = "https://dbdbigdata.to8to.com/bdc-prd-dbd/apply/ind?uid="+this.uid+"&classId="
      //         +classId+"&className="+className+"&dimList="+ encodeURIComponent(JSON.stringify(this.cdimList))

      // this.$router.push({path:'/bdc-prd-dbd/apply/ind',
      //     query:{
      //       classId: classId,
      //       className: className,
      //       dimList: encodeURIComponent(JSON.stringify(this.cdimList)),
      //     }
      //   }
      //   )

      // this.callNative(1007,{url:url,title:'选择指标'})
      this.indClassId = classId
      this.indClassName = className
      this.iselIndShow = true
    },
    aginClickSelInd(classId,className){
      for(let arr of this.applyContentList){
        if(classId == arr.classId){
          this.cdimList = arr.indList
           break
        }
      }
      this.indClassId = classId
      this.indClassName = className
      this.iselIndShow = true
    },
    showMsgFromChild: function (classList){
      if(classList.attrNameList != null){
        for (var i = this.applyContentList.length - 1; i >= 0; i--) {
          if (this.applyContentList[i].classId == classList.classId
          ) {
            this.applyContentList.splice(i, 1);
          }

        }
        this.applyContentList.push(classList)
        this.count = 0
        for(let arr of this.applyContentList){
          this.count += arr.attrCount
        }
        // this.count += classList.attrCount
        this.iselIndShow = false
        let content = null
        if(classList.attrCount >= 2){
          content = classList.attrName
          content = content.substring(0,11) + "...等"+classList.attrCount+"个"
        }else{
          content = classList.attrNameList+ " "+classList.attrCount+"个"
          content = content.replace(",","/")
        }
        
        for(let arr of this.indClassItem){
          if(arr.classId == classList.classId){
              arr.attrName = content
          }
        }
        if(this.count > 0){
          this.isClear = true
          this.isSubmitApply = true
        }
      }else{
        for (var i = this.indClassItem.length - 1; i >= 0; i--) {
          if (this.indClassItem[i].classId == classList.classId
          ) {
            this.indClassItem[i].attrName = null
            for (var i = this.applyContentList.length - 1; i >= 0; i--) {
              if (this.applyContentList[i].classId == classList.classId
              ) {
                this.count = this.count - this.applyContentList[i].attrCount
                this.applyContentList.splice(i, 1);
              }
            }
            
            
          }

        }
        if(this.count <= 0){
          this.isClear = false 
          this.iselIndClass = false
          this.isSubmitApply = false
        }
         this.iselIndShow = false
      }  
      
    },
    //清除重置
    clearReast(){
      for(let arr of this.indClassItem){
        arr.attrName = null
      }
      this.cdimList = []
      this.applyContentList = []
      this.count = null
      this.isClear = false 
      this.iselIndClass = false
      this.isSubmitApply = false
      this.selIndCount = 0
      this.selIndContent = []
      
    },
    onCancel(){
      console.log('on onCancel')
    },
    onConfirm(){
      this.clearReast()
    },
     onHide () {
      console.log('on hide')
    },
    onShow () {
      console.log('on show')
    },
    conformClearAll(){
      this.isConShow = true
    },
    getCountValue(){
      if(this.selIndCount > 0){
         this.isClear = true;
      }
    },
    showDialog() {
      this.show = true;//显示弹窗
      // this.ishow = true;//显示指标指标选择页面
    },
    getTextareaValue(value){
       this.textareaValue = value
    },
    confirmSubmit(){
      if(this.textareaValue != null){//判断申请原因是否为空
        if(!this.isDouClick){
          this.isDouClick = true
          console.log("只可以提交一次")
          //提交申请数据到后台
          let backApplyContent = []
          let reason = this.textareaValue
          let applyContent = []
          let content = {}
          let apcList = this.applyContentList
        for(let carr of apcList){
          for(let arr of carr.indList){
            delete arr.indName
            delete arr.isAttrApply
            delete arr.isBranchCity
            delete arr.isHotCIty
            delete arr.letter
          }
          var payArr = [carr.indList[0]];
            for(var i = 1; i < carr.indList.length; i++){
                var payItem = carr.indList[i];
                var repeat = false;
                for (var j = 0; j < payArr.length; j++) {
                  if (payItem.attrId == payArr[j].attrId && payItem.indId ==  payArr[j].indId
                      && payItem.dimId == payArr[j].dimId) {
                        // payArr[j].dim_ind_name = payArr[j].indId+payItem.dim_ind_name;
                        repeat = true;
                        break;
                  }
                }
              if (!repeat) {
                  payArr.push(payItem);
              }
            }
            carr.indList = payArr
            content = {classId:carr.classId,className:carr.className,indList:carr.indList}
            applyContent.push(content)
          }
          this.insertApplyContent = applyContent
          this.uname = Cookie.get('t8t-oa-username')
          this.$http.fetch('dsa/dataBoard/submitApply',
                  {        
                  token: this.token,
                  uid: this.uid,
                  uname: this.uname,
                  reason: this.textareaValue,//申请原因
                  applyContent: applyContent//申请内容
                  })
            .then((response) => {
              this.submit = true
              if(response.data.status == 200){
                backApplyContent = response.data.result.rows
              
               //根据指标审批人发起审批流程
                  let apply_id = null
                  let index_chargers = []
                  let big_data_chargers = []
                  for(let arr of backApplyContent){
                    apply_id = arr.apply_id 
                    index_chargers = arr.index_chargers
                    big_data_chargers = arr.big_data_chargers
                  }
                  this.uname = Cookie.get('t8t-oa-username')
                  this.$http.fetch('dsa/dataBoard/insertApply',
                          {        
                          token: this.token,
                          uid: this.uid,
                          uname: this.uname,
                          oapplyStatus: 200,
                          applyId: apply_id,
                          reason: response.data,//提交OA返回状态 
                          applyContent: applyContent//申请内容
                          })
                    .then((response) => {
                      console.log("插入成功")
                    })

          let toaContent = {}
          let oaContent = []
    
          let oapplyContent = applyContent
          for(let arr of oapplyContent){
            for(let indArr of arr.indList){
              delete indArr.dimId
              delete indArr.dimName
              delete indArr.indName
              delete indArr.isCity
              delete indArr.dimCode
              delete indArr.isdimapply
              indArr.id = indArr.attrId 
              delete indArr.attrId
              delete indArr.letter
              delete indArr.isHotCIty
              delete indArr.isBranchCity
              delete indArr.isAttrApply
              delete indArr.indId
              indArr.name = indArr.dim_ind_name
              delete indArr.dim_ind_name
            }
              toaContent = {classId:arr.classId,className:arr.className,indexes:arr.indList}
              oaContent.push(toaContent)
            }
                  let params = new URLSearchParams();
                        params.append('applyer_uid', this.uid);//流程发起人uid
                        params.append('apply_id', apply_id);//数据中心指标记录ID
                        params.append('apply_indexes',JSON.stringify(oaContent));//申请指标内容
                        params.append('reason', reason);//申请原因
                        params.append('index_chargers', index_chargers);//指标负责人uids 
                        params.append('big_data_chargers',big_data_chargers);//数据中心审批人uids
                let appVersion = Cookie.get('t8t-it-appVersion')
                let appType = Cookie.get('t8t-it-appType')
                let deviceId = Cookie.get('t8t-it-deviceId')
                let version =  Cookie.get('t8t-it-version')
                let accountId = Cookie.get('t8t-it-accountId')
                let token = Cookie.get('t8t-it-token')
                let oappUrl = 'https://oapp.to8to.com/app/data-board/apply?uid='+this.uid+"&token="+token
                                +'&appVersion='+appVersion+'&appType='+appType+'&deviceId='+deviceId
                                +'&version='+version+'&accountId='+accountId+'&token='+token
              //提交申请
                  axios.post(oappUrl,params)
                            .then(function (response) {
                              if(response.data.code == 200){
                                //提交OA申请成功，插入申请指标
                                    console.log("插入成功")
                              }else{
                                console.log("插入失败，进行回滚")
                                this.$http.fetch('dsa/dataBoard/insertApply',
                                            {        
                                            token: this.token,
                                            uid: this.uid,
                                            uname: this.uname,
                                            oapplyStatus: 500,
                                            reason: response.data,//提交OA返回状态 
                                            applyId: apply_id//申请ID
                                            })
                                      .then((response) => {
                                        console.log("回滚成功")
                                      })
                              }
                               this.clearReast()
                            })
                          }
                        }, (response) => {
                          console.log("提交OA失败")
                           //删除申请指标数据
                             this.submit = false
                             this.$http.fetch('dsa/dataBoard/insertApply',
                                      {        
                                      token: this.token,
                                      uid: this.uid,
                                      uname: this.uname,
                                      oapplyStatus: 500,
                                      reason: response.data,//提交OA返回内容
                                      applyId: apply_id//申请ID
                                      })
                                .then((response) => {
                                  console.log("回滚成功")
                                })
                      });
                    
                      setTimeout(() => {
                        this.cdimList = []
                        this.textareaValue = null
                        this.show = false
                        this.ishow = false
                        this.isDouClick = false
                        for(let arr of this.indClassItem){
                        arr.attrName = null
                      }
                        this.clearReast();
                      }, 3000);
                    
                    }
                  }else{
                    this.noDesc = true
                  }
                  
              }
            }
 
};
</script>
<style lang="less">
@import "~vux/src/styles/close";
.vux-close{
  height: 16px;
  width: 16px;
}

  // .weui-toast.vux-toast-bottom {
  //   bottom: 85px;
  // }

#apply .vux-label-desc {
  font-family: PingFangSC-Regular!important;
  font-size: 12px!important;
  color: #C1C1C1!important;
}

.conformDialog {
  margin:0px 15px 20px 15px;
    .weui-textarea {
      display: block;
      border: 0;
      resize: none;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #666666;
      letter-spacing: 0;
      line-height: inherit;
      outline: 0;
  }
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
    // -webkit-overflow-scrolling:touch;
    // overflow:auto;
    max-height: 550px!important;
    width:93%!important;
    max-width: 93%!important;
    // border-radius: 10px;
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
    height: 16px;
    width: 16px;
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
  position: fixed;
  width: 270px;
  bottom: 0px;
  margin:20px 20px 15px 39px;
}

.alertTitle{
 padding-top:10px;
 text-align: center;
}
.conTitle{
  font-family: PingFangSC-Semibold;
  font-size: 24px;
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
  padding: 15px 15px 20px 15px;
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
  // padding-left:11%;
  // font-family: PingFangSC-Semibold;
  // font-size: 20px;
  // color: #333333;
  // letter-spacing: 0;
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
  border: 1px solid #e3e3e3;
  background: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  // width:64px;
  height: 21px;
  text-align: center;
  // background:#E64340;
  color: #c1c1c1;
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
  margin:46px 20px 15px 20px;
  background: #FFFFFF;
  touch-action: none;
}
.abtns {
  margin: 19px 20px 11px 19px;
  background: #E3E3E3;
  touch-action: none;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
}
.applyBtns{
  margin-right: 50px;
  margin-bottom: 15px;
}
.applyBtn {
  margin-top:11px 20px 15px 20px;
  height:50px;
  touch-action: none;
  background: #06C792;
  /* border: 1px solid #06C792; */
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
}
</style>
