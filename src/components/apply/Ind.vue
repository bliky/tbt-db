<template>
<div class="selInd" style="padding: 15px 0px 0px 0px;-webkit-overflow-scrolling:touch;">
   
    <div id="ind" class="ind" >  
        <div id="title" class="indTitle">
          <span class="indTitleName">{{className}}</span> 
            <!-- <div  class="weui-tabbar__icon vux-center titleCountImg">
              <img slot="icon" height="18px" width="18px" src="../../assets/image/icon_collect@2x.png">
              <sup v-if="count > 0"><span class="vux-badge"> {{count}}</span></sup>
            </div> -->
        </div>

        <div class="boxIndList">
          <checker v-model="indList" 
            type="checkbox" 
            default-item-class="itemInd"
            selected-item-class="itemInd-selected">
            <checker-item :value="item" v-for="(item, index) in indItem" :key="index" 
              @on-item-click="onItemClickInd(item,item.indId,item.indName,item.isummary,item.isummapply,index,disabled)"
              :class="{'itemInd-selecteds': isSel(item.indId) }">
               {{item.indName}}
            </checker-item>
          </checker> 
        </div>
    </div> 
    
     <tabbar slot="bottom" style="background-color:#ffffff;">
        <tabbar-item @click.native="clickDetermine('ind')" >
          <div class="indDetBtn" slot="label">
            <x-button>确定</x-button>
          </div>
        </tabbar-item>
     </tabbar>
</div>
</template>

<style  lang="less" scoped>
.indDetBtn{
  color: #ffffff;
}
.weui-btn_default {
    color:  #ffffff;
    background-color: #06C792;
}
.weui-btn:after {
    border: none;
    touch-action: none;
    // background: #06C792;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
  }
// .weui-btn:after {
//   border: none;
// }
#ind {
  
  .indTitleName {
    margin: 0px 0px 0px 20px;
    font-weight: bold;
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #333333;
  }

  .titleCountImg {
    float: right;
    margin-right: 20px;
  }

  .boxIndList {
    margin: 0px 15px 0px 15px;
  }

  .vux-checker-box {
    padding-top: 10px;
  }
  .vux-badge {
    background: #06C792;
    color: #fff;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    padding: 0 6px;
    background-clip: padding-box;
    vertical-align: middle;
  }

  // .box {
  //   padding: 10px 15px 10px 10px;
  // }
  .itemInd {
    // width:25%;
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    border: 1px solid #e3e3e3;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    line-height: 25px;
  }
  .itemInd-selected {
    // width: 25%;
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    background: #06C792;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #ffffff;
    line-height: 25px;
  }
  .itemInd-selecteds {
    // width: 25%;
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    background: #06C792;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #ffffff;
    line-height: 25px;
  }
  .itemInd-disabled {
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    color: #666666;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    line-height: 25px;
  }

  
}

</style>
<script>
import Cookie from "js-cookie";
import {
  ViewBox,
  Tabbar,
  TabbarItem, 
  Sticky,
  XDialog,
  ButtonTab,
  Cell,
  ButtonTabItem,
  XButton,
  Checker,
  CheckerItem,
  Badge,
  Group,
  TransferDomDirective as TransferDom
} from "vux";
import { setTimeout } from "timers";

export default {
  directives: {
    TransferDom
  },
  components: {
    Tabbar,
    TabbarItem,
    Cell,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Checker,
    Badge,
    CheckerItem,
    Group
  },
  data() {
    return {
      classId: null, //指标大类id
      className: null, //指标大类名称
      isummary: false, //是否汇总
      uid: 0,
      uname: " ",
      indItem: [],
      dimList: [],
      indList: [], //选择的指标
      isInd: false,//指标选择后的颜色
      defSelIndList : [],//默认选择的指标
      selIndIdList: [], //选择的指标Id
      selIndList:[],//选择的指标列表，包含维度列表
      selDimList: [], //选择的维度列表，包含维度属性列表
      selAttrName: null,//已选择的维度属性连接名称
      selAttrCount: 0,//选择维度属性数
      selAttrNameList: null//已选择的维度属性名称列表
    };
  },
  mounted: function() {
    this.uid = Cookie.get('t8t-it-uid')
    this.uname = Cookie.get('t8t-it-uname')
    this.token = Cookie.get('t8t-it-token')

    this.getList();
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
    isSel(indId){
      let isSel = false
      if(typeof(this.selIndList) != null){
        console.log(this.selIndList)
        for(let arr of this.selIndList){
          if( arr.indId == indId && arr.dimList.length > 0){
              // this.isInd = true
              isSel = true
          }
        }
      }
      return isSel
    },
    clickDetermine(deter) {
      //点击确定按钮
      let classList = []//已选择的指标大类列表
          for(let arr of this.selIndList){
            for(let dimrr of arr.dimList){
              this.selAttrName += dimrr.dim_ind_name+"/" 
              this.selAttrNameList += dimrr.dim_ind_name+"，" 
            }
          }
        classList = {classId:this.classId,className:this.className
                     ,attrCount: this.selAttrCount
                     ,attrName:  this.selAttrName == null ? null : this.selAttrName.substring(0, this.selAttrName.indexOf("/",this.selAttrName.indexOf("/")+2 )).replace("null",'')
                     ,attrNameList: this.selAttrNameList == null ? null : this.selAttrNameList.substring(0,this.selAttrNameList.length-1).replace("null",'')
                     ,indList:  this.dimList}
                    //  ,indList:this.selIndList}
        this.sendMsgToApply(classList);
         this.$router.push({path:'/bdc-prd-dbd/apply',
          query:{
            classList: classList
          }
        }
        )
      console.log(classList)
      // this.callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/selDim',title:'选择维度'})
    },
    sendMsgToApply: function(classList) {
      this.$emit("listenToSelInd", classList);
    },
    onItemClickInd(indItem, indId, indName, isummary, isummapply,index,disabled) {
      this.indId = indId
      this.indName = indName
      this.isummary = isummary
      this.isummapply = isummapply
      let isExisted = false;
      let indIdList = {};
      for (let arr of this.selIndIdList) {
        if (arr.indId == indId) {
          isExisted = true;
        }
      }
      if (isExisted) {
        //已经选择过
        this.count -= 1;
        if (this.count < 1) {
          this.isDetermine = false;
          // this.isNoSelInd = false
        }
        for (var i = this.selIndIdList.length - 1; i >= 0; i--) {
          if (this.selIndIdList[i].indId == indId) {
            this.selIndIdList.splice(i, 1);
          }
        }
      } else {
        //没有选择过
        indIdList.indId = indId;
        this.selIndIdList.push(indIdList);
        this.count += 1;
        this.isDetermine = true;
        // this.isNoSelInd = true

        setTimeout(() => {
          this.dimCount = 0;
          this.dimAttrCount = 0;
          // this.dimList = [];
          this.isDimDetermine = true;
          this.selDimShow = true; //去往维度选择
        }, 100);
      }
       //维度list
        this.uid = Cookie.get("t8t-it-uid");
        this.uname = Cookie.get("t8t-oa-username");
        this.uid = Cookie.get('t8t-it-uid');
        let token = ''
        let ticket = ''
        this.$http.fetch('dsa/dataBoard/dimAndAttrList',
                      {        
                      uid: this.uid,
                      uname: this.uname,
                      indId: indId,
                      token: token,
                      ticket: ticket
                      })
                .then((response) => {
                  if(response.data.status == 200){
                    this.dimItem = response.data.result.rows 
                  }
                }, (response) => {
              });
    },
    getList() {
      this.classId = this.$route.query.classId
      this.className = this.$route.query.className
      this.dimList = this.$route.query.dimList
      if(this.dimList != null){
        this.isDetermine = true
      }
      
      this.uid = Cookie.get("t8t-it-uid");
      this.uname = Cookie.get("t8t-oa-username");
      this.uid = Cookie.get('t8t-it-uid');
      let token = ''
      let ticket = ''
      this.$http.fetch('dsa/dataBoard/indList',
                      {        
                      uid: this.uid,
                      uname: this.uname,
                      indClassId: this.classId,
                      token: token,
                      ticket: ticket
                      })
                .then((response) => {
                  console.log(response.data)
                  if(response.data.status == 200){
                    this.indItem = response.data.result.rows 
                  }
                }, (response) => {
              });
    }
  },
  // props: ["indClassId", "indClassName","cdimList"]
};
</script>