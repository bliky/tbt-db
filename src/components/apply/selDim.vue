<template>
<div class="selDim" style="padding: 20px 15px 80px 15px;-webkit-overflow-scrolling:touch;">
      <div id="title" class="title">
        <div class="titleDimName">
          <checker v-model="demo21"
            default-item-class="item"
            selected-item-class="item-selected"
            disabled-item-class="item-disabled">
            <checker-item  :value="secIndName" @on-item-click="onItemClick">{{secIndName}}
              <!-- <img width="14px" height="14px" v-if="!isSel" src="../../assets/image/icon_chose@2x.png"> 
              <img width="14px" height="14px" v-if="isSel" src="../../assets/image/icon_delete@2x.png">  -->
            </checker-item>
          </checker>
        </div>  
        <div class="titleDesc">
           选择关注的维度，组成维度指标，如上海线索数、SEM线索数，如不需要细分则忽略。
        </div>
      </div>
      
      <div class="box">
        <div class="selDimName">
          <span class="dimName">{{secDimName}}</span>
          <x-button mini class="fullOrMoreSel"  v-if="!isCity" @click.native="selectFirstTwo" >全选</x-button>
          <x-button mini class="fullOrMoreSel"  v-if="isCity">更多城市</x-button>
           <!-- <x-button @click.native="selectFirstTwo" type="primary"> Select first two</x-button> -->
            <!-- <checklist ref="demoObject" :title="('Option Array with key and value (key must be string)')"
             :options="objectList" v-model="objectListValue" @on-change="change"></checklist> -->
          <!-- <checklist :title="('更多城市')" :label-position="labelPosition" required :options="commonList" 
          v-model="checklist001" @on-change="change"></checklist> -->
        </div>
        <!-- <checklist  
        :options="commonList" v-model="checklist001"></checklist> -->

        <div>
          <checker v-model="demo21"
            type="checkbox" 
            default-item-class="item"
            selected-item-class="item-selected"
            disabled-item-class="item-disabled">
              <checker-item :value="item" v-for="(item, index) in items1" 
               @on-item-click="onItemClick"
                :key="index">{{item.value}}
                <!-- <img width="14px" height="14px" v-if="!isSel" src="../../assets/image/icon_chose@2x.png"> 
                <img width="14px" height="14px" v-if="isSel" src="../../assets/image/icon_delete@2x.png">  -->
              </checker-item>
          </checker> 
        </div>  
    </div>
      
    <div class="abtn">
      <x-button class="applyBtn" link="BACK">确定</x-button>
      <x-button class="applyBtns" disabled>确定</x-button>
    </div>  
    <!-- <group>
      <cell-box>{{ fullValues }}</cell-box>
    </group>
    <div style="padding:15px;">
      <x-button type="primary" @click.native="fullValues = $refs.demoObject.getFullValue()">获取值</x-button>
    </div> -->
  <br>
</div>
</template>
<style scoped>
.title{
  padding: 0px 15px 10px 10px;
}
.titleDimName{
  padding-bottom: 10px;
}
.titleDesc {
 font-family: PingFangSC-Regular;
 font-size: 12px;
 color: #C1C1C1;
}

.box {
  padding: 20px 15px 10px 10px;
}
.dimName{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
}
.vux-checker-box{
  padding-top:10px;
}
.weui-btn:after {
    border: none;
}

.fullOrMoreSel{
  background-color:#ffffff;
  float:right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #06C792;
}

.item {
  width:25%;
  height: 26px;
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
  width: 25%;
  height: 26px;
  border: 1px solid #EEEEEE;
  padding: 5px 10px;
  /* background: #06C792; */
  border-radius: 100px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #EEEEEE;
  /* background: #ffffff url(../../assets/image/icon_chose@2x.png) no-repeat right center; */
}
.item-disabled {
  width: 25%;
  height: 26px;
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
  background: #06C792;
  /* border: 1px solid #06C792; */
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
import Cookie from 'js-cookie'
import {ButtonTab,ButtonTabItem,XButton,Checker,CheckerItem,Badge,Checklist,Group,CellBox  } from 'vux'

export default {
  components: {
    ButtonTab,
    ButtonTabItem,
    XButton,
    Checker, 
    Badge,
    CheckerItem,
    Checklist,
    Group,
    CellBox
  },
  data () {
   return {
     secIndName: "外呼转化率",
     secDimName: "DAU",
     isCity: false,
     isSel: false,
     labelPosition: 'right',
     fullValues: [],
     checklist001: [],
     error: '',
     commonList: [ 'China', 'Japan', 'America' ],
     checklist0011: [],
      checklist002: [ 'China', 'Japan' ],
      checklist003: [ 'China', 'Japan' ],
      checklist005: [ '01', '02', '03' ],
      checklist005Value: [],
      objectList: [{key: '1', value: '001 value'}, {key: '2', value: '002 value'}, {key: '3', value: '003 value'}],
      objectListValue: ['1', '2'],
      inlineDescList: [
        {key: '1', value: 'Tiger is good', inlineDesc: 'Tiger is the king of mountain'},
        {key: '2', value: 'Lion is better', inlineDesc: 'Lion is the king of woods'},
        {key: '3', value: 'Camel is best, no inline-desc'}
      ],
      inlineDescListValue: [1],
      asyncList: [],
      asyncListValue: [],
      radioValue: ['China'],
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
     change (val, label) {
      console.log('change', val, label)
    },
    selectFirst () {
      this.checklist001 = ['China']
    },
    selectFirstTwo () {
      
      this.isSel = true;
      this.checklist001 = ['China', 'Japan']
    },
    selectLeft () {
      const left = _.without.apply(_, [this.commonList].concat(this.checklist001))
      console.log("left=====");
      console.log(left);
      this.checklist001 = left
    },
    onItemClick (value,selected, disabled,active) {
      console.log("=========================");
      console.log(disabled);
      console.log(selected);
      console.log(active);
       this.isSel = true;
        console.log(value)
        if(!this.value){ 
          this.count +=1;
        }else{
          this.count -=1;
        }
        if (!this.disabled) {
          console.log(126324231);
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

