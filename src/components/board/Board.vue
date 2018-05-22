<template>
  <div id="board" style="-webkit-overflow-scrolling:touch;">

    <div id="applyShow" class="applyShow" v-if="dataShow">
      <img height="100%" width="100%" src="../../assets/image/collect_nofound@2x.png"/>
      <h2>您还没有关注的指标</h2>
      <p>马上申请我关注的指标，随时随地的关注数据变化</p>
    </div>

    <div id="data" class="dataShow" v-if="!dataShow">
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

<style scoped>
.applyShow {
  padding-top:40%;
  text-align: center;
}

.applyShow h2 {
  margin-top:-30px;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: #999999;
  letter-spacing: 0;
  text-align: center;
  line-height: 30px;
}

.applyShow p {
  margin-top:5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #3F3F3F;
  letter-spacing: 0;
  text-align: center;
  line-height: 30px;
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
        dataShow: true,
        dataType: "D",
        page: 1,
        size: 2,
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
        this.$http.fetch('acc/employee/findById',
                {        
                id: this.uid
                })
          .then((response) => {
            if(response.data.status == 200){
              Cookie.set('t8t-oa-username', response.data.result.name+","+response.data.result.enName)
            }
          }, (response) => {
        });
       this.uname = Cookie.get('t8t-oa-username');
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
      let token = ""
      let ticket = ""
      this.$http.fetch('dsa/dataBoard/isApply',
                      {        
                      uid: this.uid,
                      uname: this.uname,
                      token: token,
                      ticket: ticket
                      })
                .then((response) => {let count = 0
                  console.log(response.data)
                  if(response.data.status == 200){
                    if(!response.data.result.isApply){
                      this.dataShow = true;
                    } 
                  }
                }, (response) => {
              });
      }
    }
  }
</script>

