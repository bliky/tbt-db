<template>
<div class="editInd" style="height:100%;margin: 15px 0px 0px 0px;padding-bottom:80px;-webkit-overflow-scrolling:touch;">
   <div style="margin-left:20px;">
    <div style="font-family:PingFangSC-Medium;font-size: 20px;color: #333333;"> 编辑指标</div>
    <div style="font-family:PingFangSC-Regular;font-size: 12px;color: #C1C1C1;">点击左边图标“眼睛”显示或隐藏指标,长按右边图标拖拽排序</div>
   </div>

   <!-- <div  v-for="(item,index) in listData" :key="index" class="showItem" style="margin-top:20px;margin-bottom:50px;padding-left:20px;font-family: PingFangSC-Regular;font-size: 17px;color: #333333;"> -->
     <div style="margin-top:20px;padding-bottom:80px;padding-left:20px;font-family: PingFangSC-Regular;font-size: 17px;color: #333333;">
      <hr color="#e3e3e3" size="1px">
       <draggable :list="dataList"
            :move="onRemove"
            :options="{animation: 150,handle:'.dargImg'}">
           <transition-group name="list-complete">
            <checker v-model="hiddenItem" v-for="(item, index) in dataList" :key="item.ind_id" v-if="item.dim_ind_name != ''"
                    type="checkbox">
              <div :class="{'showInd':item.is_show == 'true','hiddenInd':item.is_show == 'false'}" style="display: flex;align-items: center;font-family: PingFangSC-Regular;font-size: 17px;">
                <label :hidden="curDraftingName == item.dim_ind_name" class="showItem" @click="onItemClickHidden(item,item.ind_id,item.dim_ind_name,index)" >
                    <img v-if="item.is_show == 'true'" width="22px" height="22px" style="margin-right:20px" align="center"
                      src="../../assets/image/icon_eye_open@2x.png">
                    <img v-if="item.is_show == 'false'" width="22px" height="22px" style="margin-right:20px" align="center"
                        src="../../assets/image/icon_eye_close@2x.png">
                  </label>
                <checker-item :value="item"  class="showItem" :hidden="curDraftingName == item.dim_ind_name">
                    {{item.dim_ind_name}}
                </checker-item>
                <label :hidden="curDraftingName == item.dim_ind_name" class="dargImg showItem"  style="width:20%;position:static;text-align:right;float:right;clear: both; display: block;margin:auto;margin-right:10px; ">
                       <!-- <span>{{item.order_num}}</span> -->
                   <img v-if="item.is_show == 'true'" width="23px" height="23px" style="padding-right:10px;"
                        align="center"
                        src="../../assets/image/icon_handle@2x.png">
                </label>
              </div>
            <hr color="#eeeeee" size="1px">
            </checker>
          </transition-group>
       </draggable>
      <!-- <div>
        <checker v-model="showItem" v-for="(item, index) in hiddenList" :key="index" type="checkbox">
          <div :class="{'showInd':item.is_show == 'true','hiddenInd':item.is_show == 'false'}" style="display: flex;align-items: center;font-family: PingFangSC-Regular;font-size: 17px;">
             <label class="hiddenItem" @click="onItemClickShow(item,item.ind_id,item.dim_ind_name,index)" width="40px" height="40px">

                  <img v-if="item.is_show == 'true'" width="22px" height="22px" style="margin-right:20px"  align="center"
                    src="../../assets/image/icon_eye_open@2x.png">
                  <img v-if="item.is_show == 'false'" width="22px" height="22px" style="margin-right:20px"  align="center"
                    src="../../assets/image/icon_eye_close@2x.png">
                </label>
            <checker-item :value="item" class="hiddenItem">
                  {{item.dim_ind_name}}
            </checker-item>
          </div>
        <hr color="#eeeeee" size="1px">
        </checker>
      </div> -->
  </div>

  <div class="indBtn">
    <x-button class="indDetBtn" @click.native="clickDetermine">保存</x-button>
  </div>

  <div style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;background: #323232;">
    <toast v-model="save" type="success" width="10em"
        :time="4000" is-show-mask text="保存成功"
        :position="position">
    </toast>
  </div>

  <div class="noDesc" style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;background: #323232;">
      <toast v-model="isSelect" type="text" width="10em"
          :time="1000" is-show-mask text="请至少显示一项指标"
          :position="position">
      </toast>
  </div>


</div>
</template>

<style  lang="less" scoped>
.sortable-ghost {
  opacity: 0;
  // background-color: #F4E2C9;
}
// .sortable-drag{
//  background:#bebebe;
// }
// .sortable-chosen{
//  background:red;
// }
// .sortable-fallback{
//  background:black;
// }
.dargImg{
  cursor:move;
}

.showInd{
color: #333333;
}
.hiddenInd{
  color:#999999;
}
.weui-btn {
  border-radius: 0px;
}
.indBtn {
  // touch-action: none;
  // display: flex;
  position: fixed;
  z-index: 600;
  bottom: 0;
  width: 97%;
  // height: 51px;
  line-height: 50px;
}

.indDetBtn {
  touch-action: none;
  background: #06c792;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  width: 108%;
}
.flex-indDetBtn:active {
  background: #00b180;
}

.showItem,
.hiddenItem {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
<script>
import draggable from 'vuedraggable'
import Cookie from "js-cookie";
import { formatDate } from "../../utils/date.js";
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
  Group,
  Toast,
  TransferDomDirective as TransferDom
} from "vux";
import { setTimeout } from "timers";

export default {

  directives: {
    TransferDom
  },
  components: {
    draggable,
    Toast,
    formatDate,
    Tabbar,
    TabbarItem,
    Cell,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Checker,
    CheckerItem,
    Group
  },
  data() {
    return {
      drag: false,
      drop: false,
      uid: "",
      uname: "",
      save: false,
      isSelect: false,
      position: "middle",
      token: "",
      curDraftingName: "",//当前拖拽名称
      curDraftingList: {},//当前拖拽数据
      //listData: [{//没有用到
      dataList: [],
      showList: [], //获取的显示数据，暂时没有用到
      showListBack: [], //显示数据初始化备份
      hiddenList: [], //获取的隐藏数据，暂时没有用到
      hiddenListBack: [], //隐藏数据初始化备份
      showItem: [], //显示数组
      hiddenItem: [] //隐藏数组
    };
  },
  mounted: function() {

    Array.prototype.insert = function (index, item) {
         this.splice(index, 0, item);
    }
    this.uid = Cookie.get("t8t-it-uid");
    this.uname = Cookie.get("t8t-oa-username");
    this.token = Cookie.get("t8t-it-token");

    this.getList();
  },

  methods: {
    onAdd: function (evt){ //拖拽时候添加有新的节点的时候发生该事件
   console.log('onAdd.foo:', [evt.item, evt.from]);
  },
  onUpdate: function (evt){ //拖拽更新节点位置发生该事件
   console.log('onUpdate.foo:', [evt.item, evt.from]);
  },
  onRemove: function (evt){ //删除拖拽节点的时候促发该事件
   console.log('onRemove.foo:', [evt.item, evt.from]);
  },
  onStart:function(evt){ //开始拖拽出发该函数
  this.curDraftingName = null
  const startList = [evt.item, evt.from]
   console.log('onStart.foo:', startList);
   console.log("innerText=========")
   console.log(startList[0].innerText)
   this.curDraftingName = startList[0].innerText
  },
  onSort:function(evt){ //发生排序发生该事件
   console.log('onSort.foo:', [evt.item, evt.from]);
  },
  onEnd: function(evt){ //拖拽完毕之后发生该事件
   console.log('onEnd.foo:', [evt.item, evt.from]);
  },
    getdata (evt) {
      // console.log("evt==========")
      // console.log(evt)
      // let curElement = evt
      // this.curDraftingName = curElement.relatedContext.element.dim_ind_name
      // this.curDraftingList = curElement.relatedContext.element
      // console.log("开始")
      // console.log(curElement)
      // console.log(this.curDraftingName)
      // console.log(this.curDraftingList)
      },
      datadragEnd (evt) {
        // let oindex = evt.oldIndex
        // let nindex = evt.newIndex
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
        // this.curDraftingName = this.showList[nindex].dim_ind_name
        // console.log(this.curDraftingName)
        // console.log("this.dataList======")
        // console.log(this.dataList)
        // let index = evt.newIndex
        // this.showListBack.insert(index,this.curDraftingList)
        // console.log(this.showListBack)
      },
    onItemClickHidden(item, ind_id, dim_ind_name, index) {
      let date = new Date();
      date = formatDate(date, "yyyy-MM-dd hh:mm:ss");

      let hitem = item;
      hitem.update_time = date.toString();
      if (hitem.is_show == "true") {
        if (this.showListBack.length > 1) {
          hitem.is_show = "false";
          for (var i = this.showListBack.length - 1; i >= 0; i--) {
            let a = new String(this.showListBack[i].dim_ind_name);
            let b = new String(dim_ind_name);
            if (this.showListBack[i].dim_ind_name == dim_ind_name) {
              this.showListBack.splice(i, 1);
            }
          }

          this.hiddenListBack.unshift(hitem);
        } else {
          this.isSelect = true;
        }
      } else {
        hitem.is_show = "true";
        for (var i = this.hiddenListBack.length - 1; i >= 0; i--) {
          if (this.hiddenListBack[i].dim_ind_name == dim_ind_name) {
            this.hiddenListBack.splice(i, 1);
          }
        }
        // this.hiddenListBack.splice(index,1)
        this.showListBack.push(hitem);
      }
    },
    onItemClickShow(item, ind_id, dim_ind_name, index) {
      let date = new Date();
      date = formatDate(date, "yyyy-MM-dd hh:mm:ss");

      let hitem = item;
      hitem.update_time = date.toString();
      if (hitem.is_show == "false") {
        hitem.is_show = "true";
        for (var i = this.hiddenListBack.length - 1; i >= 0; i--) {
          if (this.hiddenListBack[i].dim_ind_name == dim_ind_name) {
            this.hiddenListBack.splice(i, 1);
          }
        }
        // this.hiddenListBack.splice(index,1)
        this.showListBack.push(hitem);
      } else {
        if (this.showListBack.length > 1) {
          hitem.is_show = "false";
          for (var i = this.showListBack.length - 1; i >= 0; i--) {
            if (this.showListBack[i].dim_ind_name == dim_ind_name) {
              this.showListBack.splice(i, 1);
            }
          }
          // this.showListBack.splice(index,1)
          this.hiddenListBack.unshift(hitem);
        } else {
          this.isSelect = true;
        }
      }
    },
    clickDetermine() {

      for(let arr of this.dataList){
        if(arr.is_show == 'true'){
         this.showList.push(arr)
        }
        if(arr.is_show == 'false'){
          this.hiddenList.push(arr)
        }
      }
      // for(let i = 0; i < this.dataList.length; i++){
      //   this.dataList[i].is_show = 'false'
      //   this.dataList.splice(i,1)
      // }
      // console.log("保存dataList====")
      // console.log(this.dataList)
      // this.showListBack = this.dataList
      // console.log("this.showListBack===1=============")
      // console.log(this.showListBack)
      for (let i = 0; i < this.showList.length; i++) {
        this.showList[i].order_num = i + 1;
      }

      for (let i = 0; i < this.hiddenList.length; i++) {
        this.hiddenList[i].order_num = i + 1;
      }

      this.$http
        .fetch("dsa/dataBoard/editInd", {
          uid: this.uid,
          dbuaToken: this.token,
          uname: this.uname,
          showList: this.showList,
          hiddenList: this.hiddenList
        })
        .then(
          response => {
            if (response.data.status == 200) {
              console.log("保存成功");
            }
          },
          response => {
            console.log("保存失败");
          }
        );

      setTimeout(() => {
        this.save = true;
      }, 900);
      setTimeout(() => {
        this.$router.push({ path: "/bdc-prd-dbd/dataBoard" });
      }, 3500);
    },
    getList() {
      console.log("uid===" + this.uid);
      console.log("uname===" + this.uname);
      this.$http
        .fetch("dsa/dataBoard/getEditIndList", {
          uid: this.uid,
          dbuaToken: this.token,
          uname: this.uname
        })
        .then(
          response => {
            if (response.data.status == 200) {
              console.log("成功了");
              this.dataList = []
              this.showList = []
              this.hiddenList = []
              this.showListBack = []
              this.hiddenListBack = []

              this.dataList = response.data.result.dataList

              // this.showList = response.data.result.showList
              // this.hiddenList = response.data.result.hiddenList

              this.showListBack = response.data.result.showList
              this.hiddenListBack = response.data.result.hiddenList
              for (var i = this.dataList.length - 1; i >= 0; i--) {
                this.dataList[i].dim_ind_name = this.dataList[
                  i
                ].dim_ind_name.replace("汇总", "");
              }

              console.log("this.dataList===list=============")
              console.log(this.dataList)
              console.log("this.showListBack===list=============")
              console.log(this.showListBack)
              console.log("this.hiddenListBack===list=============")
              console.log(this.hiddenListBack)

              // for (var i = this.showList.length - 1; i >= 0; i--) {
              //   this.showList[i].dim_ind_name = this.showList[
              //     i
              //   ].dim_ind_name.replace("汇总", "");
              // }

              // for (var i = this.hiddenList.length - 1; i >= 0; i--) {
              //   this.hiddenList[i].dim_ind_name = this.hiddenList[
              //     i
              //   ].dim_ind_name.replace("汇总", "");
              // }

              for (var i = this.showListBack.length - 1; i >= 0; i--) {
                this.showListBack[i].dim_ind_name = this.showListBack[
                  i
                ].dim_ind_name.replace("汇总", "");
              }

              for (var i = this.hiddenListBack.length - 1; i >= 0; i--) {
                this.hiddenListBack[i].dim_ind_name = this.hiddenListBack[
                  i
                ].dim_ind_name.replace("汇总", "");
              }
            }
          },
          response => {}
        );
      // this.$http
      //   .fetch("dsa/dataBoard/getEditIndList", {
      //     uid: this.uid,
      //     dbuaToken: this.token,
      //     uname: this.uname
      //   })
      //   .then(
      //     response => {
      //       if (response.data.status == 200) {
      //         this.showListBack = [];
      //         this.hiddenListBack = [];
      //         this.showListBack = response.data.result.showList;
      //         this.hiddenListBack = response.data.result.hiddenList;
      //         for (var i = this.showListBack.length - 1; i >= 0; i--) {
      //           this.showListBack[i].dim_ind_name = this.showListBack[
      //             i
      //           ].dim_ind_name.replace("汇总", "");
      //         }

      //         for (var i = this.hiddenListBack.length - 1; i >= 0; i--) {
      //           this.hiddenListBack[i].dim_ind_name = this.hiddenListBack[
      //             i
      //           ].dim_ind_name.replace("汇总", "");
      //         }
      //       }
      //     },
      //     response => {}
      //   );
    }
  }
};
</script>