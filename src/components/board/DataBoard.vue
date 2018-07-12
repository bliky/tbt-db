<template>
  <div id="dataBoard" style="height:110%;-webkit-overflow-scrolling:touch;" :class="{'noApply': dataShow == 1 }">

    <div id="applyShow" class="applyShow" v-if="dataShow == 1">
      <img  height="260px" width="300px" style="margin-left : 11%;"
            src="../../assets/image/collect_nofound@2x.png"/>
      <h2>您还没有关注的指标</h2>
      <p>马上申请我关注的指标，随时随地的关注数据变化</p>
      <router-link to="apply">
        <div class="applybtn">
            <x-button>申请我的指标</x-button>
        </div>
      </router-link>
    </div>

    <div id="data" class="dataShow" v-if="dataShow == 2">
        <tab :line-width="2" height="44px;" slot="header" v-model="index" active-color="#06C792" active-size="17px">
          <tab-item :selected="tag === item" v-for="item in taglist" :key="item" @click="tag = item" @on-item-click="onClick(tag,item,index)">
            {{item}}
          </tab-item>
        </tab>
        <div v-if="index === 0">
          <preview @listenToPreiew="showMsgFromChild"></preview>
        </div>
        <div v-if="index === 1">
          <!-- <input  v-model="iname"> 
          <input  v-model="tindex">  -->
          <trend :inametotrend="iname" :indextotrend="tindex"></trend>
        </div>
    </div>    
  </div>
</template>

<style lang="less" scoped>
.noApply{
  background: #F6F6F6 100%;
}
.weui-btn_default{
  background: #09C767;
  color: #FFFFFF;
}
.weui-btn:after{
  border:none;
  // border: 1px solid #09C767;
}
.applybtn{
  height:44px;
  margin:30px 83px 0px 83px;
  // background: #09C767;
  // border: 1px solid #09C767;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
}
.applyShow {
  padding-top: 40px;
}

.applyShow h2 {
  color: #999999 100%;
  opacity: 100%;
  font-size: 20px;
  font-face: PingFangSC-Regular;
  character: 0px;
  line: 30px (1.5);
  text-align: center;
}

.applyShow p {
  color: #999999 100%;
  opacity: 100%;
  font-size: 13px;
  font-face: PingFangSC-Regular;
  character: 0px;
  line: 30px (2.3);
  text-align: center;
}

#board element.style {
    height: 1px;
}
#board .vux-tab .vux-tab-item{
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: #666666;
}


</style>

<script>
import Cookie from 'js-cookie'
import { ViewBox,Tab,TabItem,XButton} from 'vux'
// import Indate from './Indate'
import Preview from './Preview'
import Trend from './Trend'

  const list = () => ['指标总览', '指标趋势']

  export default {

    components: {
      Tab,
      TabItem,
      ViewBox,
      XButton,
      // Indate,
      Preview,
      Trend
    },
    data () {
      return {
        uid: null,//用户ID
        uname: null,//用户姓名
        token: null,
        tag: '指标总览',
        taglist: list(),
        iname: '',
        dataShow: 0,
        index: 0,
        tindex: 0,
      }
    },
    ready () {
    },
    mounted : function(){
     this.getIsShow();
    
   },
    methods:{
      onClick(tag,item,index){
       if(tag === '指标总览' && item==='指标总览'&&index===0){
          this.iname = ''
          this.tindex = 0
       }
      },
     showMsgFromChild: function (iname,tindex,index){
       this.iname = iname
       this.index = index
       this.tindex = tindex
      },
      getIsShow(){
        this.uid = Cookie.get('t8t-it-uid');
        this.uname = Cookie.get('t8t-oa-username')
      //  this.$http.fetch('acc/employee/findSubId',
      //         {        
      //         "uid":this.uid,
      //         "subNum":1,
      //          "type":1
      //         })
      //   .then((response) => {
      //     if(response.data.status == 200){
      //       Cookie.set('t8t-oa-item', response.data.result.name+","+response.data.result.enName)
      //     }
      //   }, (response) => {
      // });
        let token = Cookie.get('t8t-it-token')
        let ticket = Cookie.get('t8t-it-ticket')
        this.$http.fetch('dsa/dataBoard/isApply',
          {
            uid: this.uid,
            uname: this.uname,
            token: token
          })
          .then((response) => {
            if(response.data.status == 200){
                 if(response.data.result.isApply){
                   this.dataShow = 2
                 }else{
                   this.dataShow = 1
                 }
            }
          }, (response) => {
        });
      }
    }
  }
</script>

