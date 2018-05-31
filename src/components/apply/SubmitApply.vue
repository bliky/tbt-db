<template>
<div id="submitApply" class="apply" style="-webkit-overflow-scrolling:touch;overflowScrolling:touch;">
  <div class="alertTitle">
    <span class="conTitle">指标确认</span>
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
            :position="position"></toast>
      </div>
  </div>

  <div class="selIndCon">
    <div selContent v-for="(item,index) in applyContentList" :key="index" >
      <div  class="x-title2">{{item.className}}</div>  
        <div class="x-text" style="margin-left:10px;margin-right:10px">
          <span > 
            {{item.attrNameList}} </span>
            <hr style="margin-top:8px;" color="#E3E3E3" size="1px">
        </div>
    </div>

    <div class="subtn">
      <x-button class="applyBtn" @click.native="confirmSubmit">确认提交</x-button>
    </div>
  </div>
</div>
</template>

<script>
import Cookie from 'js-cookie'
import {
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
      textareaValue: null,//申请原因值
      count: 0,//总数
      classCount: 0,//指标分类数
      indClassId: null,
      indClassName: null,
      noDesc: false,//没输入申请原因
      classId: null,//指标分类ID
      indClassItem: [],
      isSubmitApply: false,
      cdimList: [],
      isClear: false,
      ishow: false,
      show: false
    };
  },
   mounted : function(){
     this.uid = Cookie.get('t8t-it-uid')
     this.uname = Cookie.get('t8t-it-username')
     this.token = Cookie.get('t8t-it-token')
  },
  methods: {
    aginClickSelInd(classId,className){
      for(let arr of this.applyContentList){
        if(classId == arr.classId){
          this.cdimList = arr.indList
        }
      }
      this.indClassId = classId
      this.indClassName = className
      this.iselIndShow = true
    },
    confirmSubmit(){
      if(this.textareaValue != null){//判断申请原因是否为空
        //提交申请数据到后台
        let applyContent = []
        let content = {}
        let backApplyContent = []
        let reason = this.textareaValue
        for(let arr of this.applyContentList){
          content = {classId:arr.classId,className:arr.className,indList:arr.indList}
          applyContent.push(content)
        }
        
        this.$http.fetch('dsa/dataBoard/submitApply',
                {        
                token: this.token,
                uid: this.uid,
                uname: this.uname,
                reason: this.textareaValue,//申请原因
                applyContent: applyContent//申请内容
                })
          .then((response) => {
            if(response.data.status == 200){
              backApplyContent = response.data.result.rows

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
    
              //根据指标审批人发起审批流程
                let apply_id = null
                let index_chargers = []
                let big_data_chargers = []
                for(let arr of backApplyContent){
                  apply_id = arr.apply_id 
                  index_chargers = arr.index_chargers
                  big_data_chargers = arr.big_data_chargers
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
                              +'appVersion='+appVersion+'appType='+appType+'deviceId='+deviceId
                              +'version='+version+'accountId='+accountId+'token='+token
            //提交申请
                axios.post(oappUrl,params)
                          .then(function (response) {
                             this.clearReast();
                            console.log(response);
                          })
                          .catch(function (error) {
                            console.log(error);
                          });
                        }
                      }, (response) => {
                        console.log("失败")
                    });
                    this.cdimList = []
                    this.textareaValue = null
                    this.show = false;
                    this.ishow = false;
                    this.clearReast();
                    for(let arr of this.indClassItem){
                      arr.attrName = null
                    }
                  }else{
                    this.noDesc = true
                  }
                  
              }
            }
 
};
</script>
<style lang="less" scoped>
@import "~vux/src/styles/close";
#submitApply .vux-label-desc {
  font-family: PingFangSC-Regular!important;
  font-size: 12px!important;
  color: #C1C1C1!important;
}
#submitApply .weui-ntextarea{
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #C1C1C1;
  letter-spacing: 0;
}
#submitApply .weui-textarea{
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #666666;
  letter-spacing: 0;
}

.conformDialog {
  margin:0px 15px 20px 15px;
    .weui-cells {
      margin: 15px 15px 0px 15px;
      height: 60px;
      background: #FFFFFF;
      border: 1px solid #06C792;
      line-height: 1.41176471;
      font-family: PingFangSC-Semibold;
      font-size: 24px;
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
  
}

</style>
<style lang="less" scoped>
@import "~vux/src/styles/close";
.inputDesc .selIndCon{
  padding-left:35px;
}
.subtn{
  margin:10px 20px 16px 20px;
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
