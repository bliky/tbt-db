<template>
<div class="selInd" style="padding: 15px 0px 80px 0px;-webkit-overflow-scrolling:touch;">
   
    <div id="ind" class="ind" >  
      <div v-if="!selDimShow && !isCityMore">
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
            selected-item-class="itemInd-selected"
            disabled-item-class="itemInd-disabled">
            <checker-item :value="item" v-for="(item, index) in indItem" :key="index" 
              @on-item-click="onItemClickInd(item,item.indId,item.indName,item.isummary,item.isummapply,index,disabled)"
              :class="{'itemInd-selecteds': isSel(item.indId) }">
               {{item.indName}}
            </checker-item>
          </checker> 
        </div>
      
        <!-- <div class="noSelInd" v-if="!isNoSelInd">
          <x-button class="noSelIndBtn" disabled>您尚未添加指标</x-button>
        </div> -->
      </div>
      <div class="indBtn">
        <!-- 指标确定 -->
        <!-- <x-button class="indDetBtn" v-if="!selDimShow && !isCityMore && isDetermine" 
                  @click.native="clickDetermine('ind')" :link="{path:'/bdc-prd-dbd/apply'}">确定</x-button> -->
         <x-button class="indDetBtn" v-if="!selDimShow && !isCityMore && isDetermine" 
                  @click.native="clickDetermine('ind')">确定</x-button>
        <!-- 维度，属性确定 -->
        <x-button class="indDetBtn" v-if="selDimShow && !isCityMore && isDimDetermine" 
          @click.native="clickDetermine('dim')">确定</x-button>
        <!-- 维度，属性城市确定 -->
        <x-button class="indDetBtn"  v-if="selDimShow && isCityMore && isDimAttrCityDetermine" 
          @click.native="clickDetermine('city')">确定</x-button>
        <x-button class="indDetBtnDisabled"
           v-if=" (!selDimShow && !isCityMore && !isDetermine)
              || (selDimShow && !isCityMore && !isDimDetermine)
              || (selDimShow && isCityMore && !isDimAttrCityDetermine)
                " disabled>确定</x-button>
      </div>  
    </div>

    
    <div class="selDim" v-if="selDimShow && !isCityMore">  
        <!-- <div id="title" class="titleDim">
          <div @click="selDimClose" class="vux-close"></div>
        </div> -->

          <div class="boxDimList" v-for="(item,index) in dimItem" :key="index">
            <!-- <div class="titleDimName"  v-if="item.dimId == 0"> -->
            <div v-if="item.dimId == 0">
              <checker v-model="dimList"  type="checkbox" 
                default-item-class="itemDim"
                selected-item-class="itemDim-selected"
                disabled-item-class="itemDim-disabled">
                <checker-item  :value="item" @on-item-click="onItemClickDim(item.dimId,item.dimName,item.isdimapply,disabled)"
                   :disabled="item.isdimapply == 'true'">
                  {{indName}}{{item.dimName}}
                  <img class="dimSummDis" 
                      src="../../assets/image/icon_chose@2x.png"> 
                </checker-item>
              </checker>
            </div>


              <div class="selDimName" style="margin-top:20px;" v-if="item.dimId > 0">
                <span class="dimName">{{item.dimName}}</span>
                <x-button mini class="fullOrMoreSel"  v-if="item.isCity == 'false'" @click.native="selectFull(item,index)" >全选</x-button>
                <x-button mini class="fullOrMoreSel"  v-if="item.isCity == 'true'"  @click.native="cityMore(item,item.dimId,index)">更多城市</x-button>
              </div>

              <checker v-model="dimList" v-if="item.dimId > 0"
                type="checkbox" 
                default-item-class="itemDims"
                selected-item-class="itemDims-selected"
                disabled-item-class="itemDims-disabled">
                  <checker-item  :value="item" v-for="(item, index) in item.dimAttrItem"  :key="index"
                      :disabled="item.isAttrApply == 'true'" :on-change="selChange(index)"
                      v-if="item.letter != null ? index < 5:index >= 0 "
                  @on-item-click="onItemClickDims(item,index,item.isAttrApply,disabled)">
                    {{item.dim_ind_name}}
                    <img class="attrDisImg"
                      src="../../assets/image/icon_chose@2x.png">
                  </checker-item>
              </checker> 
                 
        </div>
          
        
    </div> 
    
    <div class="cityMore" v-if="isCityMore" >
      <!-- <span @click="closeCityItem" class="vux-close" style="margin:0px 0px 10px 15px;"></span> -->
      <div class="hotCity" style="background:#F6F6F6">
        <div class="hotCityTitle" >
          <span class="hotCityTitleName" style="margin:0px 15px 0px 15px;font-family: PingFangSC-Regular;font-size: 14px;color: #999999;">
            热门城市
          </span>
          <!-- <x-button mini class="hotCityFull"  v-if="!isCity" @click.native="selectHotCityFull" >全选</x-button> -->
        </div> 
        <div class="selHotCity" style="padding:10px 15px 15px 10px">
          <checker v-model="dimList" type="checkbox" 
                   default-item-class="hotCityItem" 
                   selected-item-class="hotCityItemSelected"
                   disabled-item-class="hotCityItemDisabled">
            <checker-item :value="item" v-for="(item, index) in hostCityItems" :key="index"
                          :disabled="item.isAttrApply == 'true'" 
                          @on-item-click="onItemClickHotCity(item,item.attrId,item.dim_id_name,index,disabled)">
              {{item.dim_ind_name}}
              <img id="hotCityItemDis"  
                    src="../../assets/image/icon_chose@2x.png">
            </checker-item>
          </checker>
        </div>
      </div>
      <div class="selOtherCity" height="45px;">
         <!-- <sticky
          scroll-box="vux_view_box_body"
          ref="sticky"
          :offset="46"
          :check-sticky-support="false"
          :disabled="disabled"> -->
            <div class="otherCityTitle" style="background:#F6F6F6;">
              <span class="otherCityTitleName" style="margin:0px 15px 5px 15px;font-family: PingFangSC-Regular;font-size: 14px;color: #999999;">
                其他城市
              </span>
              <!-- <x-button mini class="otherCityFull"  v-if="!isCity" @click.native="selectOtherCityFull" >全选</x-button> -->
            </div>
            <div class="selOtherCityList"  v-for="(item, index) in otherCityItems" :key="index">
               
                <div class="cityLetterSort" style="padding:0px 15px 5px 15px;background:#EEEEEE;font-family: PingFangSC-Regular;font-size: 14px;color: #999999;">
                  <a :id="item.letter">{{item.letter}}</a>
                </div>

                <div v-for="(item, index) in item.list" :key="index" class="cityName" style="padding:0px 0px 0px 0px;font-family: PingFangSC-Regular;font-size: 17px;color: #333333;">
                  <checker v-model="dimList" 
                          type="checkbox" 
                          default-item-class="otherCityItem" 
                          selected-item-class="otherCityItemSelected"
                          disabled-item-class="otherCityItemDisabled">
                    <checker-item :value="item" :disabled="item.isAttrApply == 'true'" 
                          @on-item-click="onItemClickOtherCity(item,item.attrId,item.dim_ind_name,disabled)">
                      {{item.dim_ind_name}}
                      <img id="otherCityImgDis" width="25px" height="25px" style="float:right;" align="center"  
                           src="../../assets/image/checked@2x.png">
                      
                      <img id="selectOtherCityImg" width="25px" height="25px" style="float:right;" align="center" 
                            src="../../assets/image/check@2x.png">
                    </checker-item>
                    <hr color="#e3e3e3" size="1px">
                  </checker>
                </div>

            </div>

            <aside class="letter-aside" style="height:100%;-webkit-overflow-scrolling:touch;">
             <view-box ref="viewBox">
                <ul>
                  <li v-for="(item,index) in otherCityItems" :key="index" @click="naver(item.letter)" >
                    {{item.letter}}
                  </li>
                </ul>
               </view-box>
            </aside>
            <div id="tip">
              {{tipString}}
          </div>
          <!-- </sticky> -->
      </div>
    </div>
</div>
</template>

<style  lang="less" scoped>
.weui-btn {
  margin-left: -18px;
}
.weui-btn:after {
  border: none;
}
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
  .noSelInd {
    padding-top: 88%;
    display: flex;
    position: relative;
    z-index: 600;
    width: 146px;
    height: 50px;
    margin: auto;
  }
  .noSelIndBtn {
    z-index: 600;
    bottom: -10;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    background: #323232;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    border-radius: 100px;
    line-height: 20px;
  }

  .indBtn {
    touch-action: none;
    display: flex;
    position: absolute;
    z-index: 600;
    bottom: 0;
    width: 100%;
    height: 51px;
  }

  .indDetBtnDisabled {
    width: 125%;
    background: #b7efd3;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
  }
  .indDetBtn {
    touch-action: none;
    background: #06C792;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    width: 125%;
  }
}

.selDim {
  margin: 0px 15px 15px 15px;
}
.selDim {
  .titleDim {
    // padding: 0px 15px 10px 10px;
  }
  .titleDimName {
    padding-bottom: 10px;
  }
  .vux-close {
    align: center;
    // float:right;
    // margin-right:10px;
    // margin-top: 3px;
    // margin-bottom: 8px;
  }
  .titleDesc {
    // margin-left:15px;
    // margin-right:15px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #c1c1c1;
  }
  .itemDim {
    .dimSummDis {
      display: none;
    }
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    border: 1px solid #e3e3e3;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
    line-height: 25px;
  }
  .itemDim-selected {
    .dimSummDis {
      display: none;
    }
    padding: 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    border: 1px solid #eeeeee;
    background: #06C792;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #eeeeee;
    line-height: 25px;
  }
  .itemDim-disabled {
    .dimSummDis {
      width: 15px;
      height: 15px;
      display: block;
      float: right;
      margin-top: 5px;
      padding-left: 3px;
    }
    padding: 0px 5px 0px 15px;
    margin: 3% 4% 0% 0%;
    height: 26px;
    border: 1px solid #eeeeee;
    background: #ffffff;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #999;
    line-height: 25px;
  }
}

.boxDimList {
  // .selDimName{
  //   margin-top:5px;
  // }
  .dimName {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
  }

  .fullOrMoreSel {
    background-color: #ffffff;
    float: right;
    margin-right: -15px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #06C792;
  }

  .itemDims {
    .attrDisImg {
      display: none;
    }
    padding: 0px 8px 0px 8px;
    margin: 10px 1% 0px 1%;
    height: 26px;
    border: 1px solid #e3e3e3;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    // color: #E3E3E3;
    line-height: 25px;
  }
  .itemDims-selected {
    .attrDisImg {
      display: none;
    }
    padding: 0px 8px 0px 8px;
    margin: 10px 1% 0px 1%;
    height: 26px;
    border: 1px solid #eeeeee;
    background: #06C792;
    border-radius: 100px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #eeeeee;
    line-height: 25px;
  }
  .itemDims-disabled {
    .attrDisImg {
      margin: 5px 0px 0px 3px;
      float: right;
      display: block;
      width: 14px;
      height: 14px;
    }
    padding: 0px 8px 0px 8px;
    margin: 10px 1% 0px 1%;
    height: 26px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    line-height: 25px;
  }
}

// .cityMore{
.weui-btn:after {
  border: none !important;
}
.hotCityItem {
  #hotCityItemDis {
    display: none;
  }
  padding: 0px 15px;
  margin: 3% 4% 0% 0%;
  height: 26px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  border-radius: 100px;
  color: #333333;
  text-align: center;
}
.hotCityItemSelected {
  #hotCityItemDis {
    display: none;
  }
  padding: 0px 15px;
  margin: 3% 4% 0% 0%;
  height: 26px;
  border: 1px solid #eeeeee;
  background: #06C792;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  border-radius: 100px;
  color: #eeeeee;
  line-height: 25px;
}

.hotCityItemDisabled {
  #hotCityItemDis {
    width: 14px;
    height: 14px;
    float: right;
    display: block;
    padding-top: 5px;
    margin-left: 2px;
  }
  padding: 0px 6px 0px 15px;
  margin: 3% 4% 0% 0%;
  height: 26px;
  border: 1px solid #eeeeee;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #999;
  line-height: 25px;
}

.otherCityItem {
  #otherCityImgDis {
    display: none;
  }
  #selectOtherCityImg {
    display: none;
  }
  padding: 0px 15px;
  margin: 5px 3px 5px 0px;
  height: 26px;
  width: 100%;
  background: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
  text-align: left;
}

.otherCityItemSelected {
  #otherCityImgDis {
    display: none;
  }
  #selectOtherCityImg {
    display: block;
    padding-right: 50px;
  }
  padding: 0px 15px;
  margin: 5px 3px 5px 0px;
  width: 100%;
  height: 26px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
  line-height: 25px;
  text-align: left;
}
.otherCityItemDisabled {
  #selectOtherCityImg {
    display: none;
  }
  #otherCityImgDis {
    display: block;
    padding-right: 50px;
  }
  padding: 0px 15px;
  margin: 5px 3px 5px 0px;
  width: 100%;
  height: 26px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #999;
  line-height: 25px;
  text-align: left;
}

.letter-aside {
  width:35px;
  position: fixed;
  right: 5px;
  top: 0px;
  ul {
    list-style: none;
    line-height: 1.4em;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #999999;
    text-align: center;
  }
  li {
    padding-top: 15px;
  }
}

#tip {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 1px solid #333333;
  width: 100px;
  height: 100px;
  z-index: 1000;
  text-align: center;
  line-height: 100px;
  font-size: 50px;
  opacity: 0;
}

.tipAppear {
  animation: appearTip 1 linear 0.5s;
}

@keyframes appearTip {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

.tipShow {
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  color: #bbbbbb;
}
.hotCityFull {
  float: top;
  // background:#F6F6F6;
  height: 25px;
  float: right;
  margin-right: 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #06C792;
}
.otherCityFull {
  // background:#F6F6F6;
  height: 25px;
  float: right;
  margin-right: 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #06C792;
}
// }
</style>
<script>
import Cookie from "js-cookie";
import {
  ViewBox, 
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
    ViewBox,
    XDialog,
    Cell,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Checker,
    Badge,
    CheckerItem,
    Group,
    Sticky
  },
  data() {
    return {
      classId: null, //指标大类id
      className: null, //指标大类名称
      isummary: false, //是否汇总
      isummapply: false, //指标维度汇总是否已经申请过
      isdimapply: false, //维度是否已经申请过
      indId: null, //指标id
      indName: null, //指标名称
      dimId: null,//维度ID
      dimName: null,//维度名称
      selIndItem: [], //已选择的指标数组
      indItem: [],//指标列表
      dimItem: [],//维度列表
      hostCityItems: [],//热门城市
      otherCityItems: [],//其他城市
      isDimDisabld: false,
      isDimListDisabld: false,
      isNoSelInd: false,
      isSelDim: false,
      selDimName: null,
      secIndName: null,
      isCity: false,
      hostCityItem: null,
      selHotCityList: [], //已经选择热门城市
      otherCityItem: null,
      selOtherCityList: [], //已经选择其他城市
      show: false, //是否弹窗显示
      count: null, //选择指标数
      dimCount: null, //选择维度数
      dimAttrCount: null, //选择维度属性数
      dimAttrCityCount: null, //选择维度属性城市数
      selDimShow: false, //选择维度显示
      isDetermine: false, //指标按钮是否确定
      isDimDetermine: false, //指标维度按钮是否确定
      isDimAttrDetermine: false, //指标维度，属性按钮是否确定
      isDimAttrCityDetermine: false, //指标维度，属性,城市按钮是否确定
      isSelect: false, //是否选择
      isSelAll: false, //是否选择全部
      disabled: false, //是否禁用
      isCityMore: false, //是否选择更多城市
      tipString: null, //点击城市首字母动画内容
      isSelectOtherCity: false, //是否选择其他城市
      hotCityKey: [],
      hotCityName: [],
      otherCityKey: [],
      otherCityName: [],
      listdata: [],
      uid: 0,
      uname: " ",
      dimList: [],
      indList: [], //选择的指标
      isInd: false,//指标选择后的颜色
      defSelIndList : [],//默认选择的指标
      selIndIdList: [], //选择的指标Id
      selIndList:[],//选择的指标列表，包含维度列表
      selDimList: [], //选择的维度列表，包含维度属性列表
      selAttrName: null,//已选择的维度属性连接名称
      selAttrCount: 0,//选择维度属性数
      selAttrNameList: null,//已选择的维度属性名称列表
      dimListIndex: 10000000//第几个维度属性选择列表
    };
  },
  mounted: function() {
    this.uid = Cookie.get('t8t-it-uid')
    this.uname = Cookie.get('t8t-it-uname')
    this.token = Cookie.get('t8t-it-token')

    // utils.callNative(1009, {"url":apply,"title":"指标申请"})
    this.getList();
    this.getCountValue();
    document.getElementById("vux_view_box_body").scrollTo = (500);
    // this.sendMsgToApply();
  },
  methods: {
    clickDetermine(deter) {
      //点击确定按钮
      let classList = []//已选择的指标大类列表
        if (deter === "ind") {
          for(let arr of this.selIndList){
            for(let dimrr of arr.dimList){
              this.selAttrName += dimrr.dim_ind_name+"/" 
              this.selAttrNameList += dimrr.dim_ind_name+"，" 
            }
          }
        classList = {classId:this.classId,className:this.className
                     ,attrCount: this.selAttrCount
                     ,attrName:  this.selAttrName.substring(0, this.selAttrName.indexOf("/",this.selAttrName.indexOf("/")+2 )).replace("null",'')
                     ,attrNameList: this.selAttrNameList.substring(0,this.selAttrNameList.length-1).replace("null",'')
                     ,indList:  this.dimList}
                    //  ,indList:this.selIndList}
        this.sendMsgToApply(classList);
        //  this.$emit("listenToSelInd",selInd)
      } else if (deter === "dim") {
        console.log("cityList=========")
        console.log(thiss.dimList.otherCityList)
        //  for(let arr of this.dimList){
        //    if(arr.otherCityList ){

        //    }
        //  }

        let result = [], isRepeated;
        for (let i = 0, len = this.dimList.length; i < len; i++) {
          isRepeated = false;
          for (let j = 0, len = result.length; j < len; j++) {
            if (this.dimList[i] == result[j]) {   
                isRepeated = true;
                break;
            }
          }
          if (!isRepeated) {
            result.push(this.dimList[i]);
          }
        }
       this.dimList = result
        //维度确定
        this.selDimShow = false; //关闭页面
        this.isDimDetermine = false; //确定按钮取消
        //确定选择指标下的维度，维度属性
        let count = 0;
        for(let arr of this.dimList){
          count += 1;
          if(arr.dimId === 0){
            arr.attrId = 0
            arr.dim_ind_name = this.indName+arr.dimName
          }
        }
        
        this.selAttrCount = count
        let dimList = {}
        let indlist = {}
        if(this.selIndList.length > 0){
          let selndList = {indId:this.indId,indName:this.indName}
          for(let indArr of this.selIndList){
            for(let ndimArr of indArr.dimList){
              for(let odimArr of this.dimList){
                if(this.indId == indArr.indId && ndimArr.attrId == odimArr.attrId 
                  && ndimArr.dimId == odimArr.dimId){
                  // this.selAttrName += ndimArr.dim_ind_name+"/" 
                  // this.selAttrNameList +=  ndimArr.dim_ind_name+"，" 
                   return 
                }else{
                  // this.selAttrName += odimArr.dim_ind_name+"/" 
                  // this.selAttrNameList +=  odimArr.dim_ind_name+"，" 
                  dimList = {dimId:odimArr.dimId,dimName:odimArr.dimName
                                     ,attrId:odimArr.attrId,dim_ind_name:odimArr.dim_ind_name} 
                  indlist.dimList = dimList
                  return 
                }
              }
            }
          }
          indlist.indId = this.indId
          indlist.indName = this.indName
          this.selIndList.push(indlist)
        }else{
         let selndList = {indId:this.indId,indName:this.indName,dimList: this.dimList}
         this.selIndList.push(selndList)
        }
        
      } else if (deter === "city") {
        //维度城市确定
        this.isCityMore = false; //关闭城市页面
        this.isDimAttrCityDetermine = false;
        this.isDimDetermine = true;
      }
    },
    sendMsgToApply: function(classList) {
      this.$emit("listenToSelInd", classList);
    },
    selChange() {},
    selectFull(dimItem, index) {
      let isExisted = false;
      for (let arr of this.dimList) {
        if (arr.index === index && arr.dimName == dimItem.dimName) {
          isExisted = true;
        }
      }
      if (isExisted == true) {
        //判断是否已经选择过,有则删除
        this.dimCount -= 1;
        if (this.dimCount > 0) {
          this.isDimDetermine = true;
        } else {
          this.isDimDetermine = false;
        }
        for (var i = this.dimList.length - 1; i >= 0; i--) {
          if (
            this.dimList[i].index == index &&
            this.dimList[i].dimName == dimItem.dimName
          ) {
            this.dimList.splice(i, 1);
            this.dimAttrCount -= 1;
            if (this.dimAttrCount > 0) {
              this.isDimAttrDetermine = true;
            } else {
              this.isDimAttrDetermine = false;
            }
          }
        }
      } else {
        //没有则添加
        this.dimCount += 1;
        this.isDimDetermine = true;
        for (let arr of dimItem.dimAttrItem) {
          if (arr.isAttrApply == "false") {
            arr.index = index;
            arr.dimName = dimItem.dimName;
            this.dimList.push(arr);
            this.dimAttrCount += 1;
            this.isDimAttrDetermine = true;
          }
        }
      }
      console.log(this.dimList)
    },
    alertDetermine() {
      this.selDimShow = false;
    },
    getCountValue() {
      this.isSelDim = true;
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
          this.isDimDetermine = false;
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
    onItemClickDim(indId, indName, isummapply, disabled) {
      if (!disabled) {
        this.dimCount += 1;
        this.dimAttrCount += 1;
        this.isDimDetermine = true;
        this.isDimAttrDetermine = true;
      }
    },
    onItemClickDims(item,index,isAttrApply,disabled) {
      if (!disabled) {
        this.dimCount += 1;
        this.dimAttrCount += 1;
        this.isDimDetermine = true;
        this.isDimAttrDetermine = true;
      }
    },
    cityMore(item,dimId,index) {
      console.log(item,dimId,index)
      this.hostCityItems = item.dimAttrItem
      this.otherCityItems = item.otherCityList
      this.dimAttrCityCount = 0;
      // this.hostCityItem = [];
      // this.otherCityItem = [];
      this.isDimAttrCityDetermine = false;
      this.isCityMore = true;
    },
    selectHotCityFull() {},
    selectOtherCityFull() {
      console.log(123);
    },
    selDimClose() {
      this.selDimShow = false;
    },
    closeCityItem() {
      this.isCityMore = false;
    },
    onItemClickHotCity(hotCityItem, cityId,cityName,index, disabled) {
      console.log("点击选择")
      if (!disabled) {
        let isExisted = false;
        let hotCityList = {};
        for (let arr of this.selHotCityList) {
          if (arr.cityId == cityId) {
            isExisted = true;
          }
        }
        if (isExisted) {
          //已经选择过
          console.log("已经选择过")
          this.dimAttrCityCount -= 1;
          if (this.dimAttrCityCount < 1) {
            this.isDimAttrCityDetermine = false;
            // this.isNoSelInd = false
          }
          for (var i = this.selHotCityList.length - 1; i >= 0; i--) {
            if (this.selHotCityList[i].cityId == cityId) {
              this.selHotCityList.splice(i, 1);
              // this.isDimAttrCityDetermine = false;
            }
          }
        } else {
          //没有选择过
          hotCityList.cityId = cityId;
          hotCityList.cityName = cityName;
          this.selHotCityList.push(hotCityList);
          this.dimAttrCityCount += 1;
          this.isDimAttrCityDetermine = true;
          // this.isNoSelInd = true
        }
      }
    },
    onItemClickOtherCity(oterCityItem, cityId, cityName, disabled) {
      if (!disabled) {
        let isExisted = false;
        let otherCityList = {};
        for (let arr of this.selOtherCityList) {
          console.log(arr);
          if (arr.cityId == cityId) {
            isExisted = true;
          }
        }
        if (isExisted) {
          //已经选择过
          this.dimAttrCityCount -= 1;
          if (this.dimAttrCityCount < 1) {
            this.isDimAttrCityDetermine = false;
            // this.isNoSelInd = false
          }
          for (var i = this.selOtherCityList.length - 1; i >= 0; i--) {
            if (this.selOtherCityList[i].cityId == cityId) {
              this.selOtherCityList.splice(i, 1);
            }
          }
        } else {
          //没有选择过
          otherCityList.cityId = cityId;
          otherCityList.cityName = cityName;
          this.selOtherCityList.push(otherCityList);
          this.dimAttrCityCount += 1;
          this.isDimAttrCityDetermine = true;
          // this.isNoSelInd = true
        }
      }
    },
    naver(id) {
      // 点击右边字母滚动
      this.tipString = id;
      let obj = document.getElementById(id);
      let tip = document.getElementById("tip");
      tip.setAttribute("class", "tipAppear");
      setTimeout(function() {
        tip.removeAttribute("class");
      }, 500);
      let oPos = obj.offsetTop;
      return document.getElementById("vux_view_box_body").scrollTop = (oPos - 36);
    },
    getList() {
      this.dimList = this.cdimList
      if(this.dimList.length > 0){
        this.isDetermine = true
      }
      this.classId = this.indClassId;
      this.className = this.indClassName;
      // this.classId = this.$route.query.classId
      // this.className = this.$route.query.className
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
  props: ["indClassId", "indClassName","cdimList"]
};
</script>