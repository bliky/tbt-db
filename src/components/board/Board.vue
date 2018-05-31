<template>
  <div id="board" style="height:100%;-webkit-overflow-scrolling:touch;">
     <flexbox orient="vertical" style=""> 
      <flexbox-item>
        <label @click="callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/dataBoard',title:'数据看板'})">
          <!-- <router-link to="dataBoard"> -->
            <div class="flex-board"  style="margin-right: 19px;display: flex;align-items: center;justify-content: space-between;width:335px;height:80px;">
              <div style="display: flex;align-items: center;">
                <img style="margin-left:20px;height:24px;width:24px;" src="../../assets/image/index/icon/data@2x.png">
                <span style="margin-left:15px;font-family:PingFangSC-Medium;font-size: 17px;color:#FFFFFF;letter-spacing: 0;">
                  数据看板
                </span>
              </div>
              <img style="float:right;margin-right:5.3%;width:7px;height:13px;"  src="../../assets/image/index/icon/white@2x.png">
            </div>
          <!-- </router-link> -->
        </label>
      </flexbox-item> 
      <flexbox-item>
        <label @click="callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/apply',title:''})">
          <!-- <router-link to="apply"> -->
            <div class="flex-apply" style="margin-right: 19px;display: flex;align-items: center;justify-content: space-between;width:335px;height:80px;">
              <div style="display: flex;align-items: center;">
                <img style="margin-left:20px;height:24px;width:24px;"  src="../../assets/image/index/icon/apply@2x.png">
                <span style="margin-left:15px;font-family:PingFangSC-Medium;font-size:17px;color:#FFFFFF;letter-spacing: 0;">
                  指标申请
                </span>
              </div>
              <img style="float:right;margin-right:5.3%;width:7px;height:13px;"  src="../../assets/image/index/icon/white@2x.png">
            </div>
          <!-- </router-link> -->
        </label>
      </flexbox-item>
      <flexbox-item>
        <label @click="callNative(1007,{url:'https://dbdbigdata.to8to.com/bdc-prd-dbd/MyInds',title:'指标释义'})">
          <!-- <router-link to="MyInds"> -->
            <div class="flex-desc"  style="margin-right: 19px;display: flex;align-items: center;justify-content: space-between;width:335px;height:80px;">
              <div style="display: flex;align-items: center;">
                <img style="margin-left:20px;height:24px;width:24px;" src="../../assets/image/index/icon/explain@2x.png">
                <span style="margin-left:15px;font-family:PingFangSC-Medium;font-size:17px;color: #FFFFFF;letter-spacing: 0;">
                  指标释义
                </span>
              </div>
              <img style="float:right;margin-right:5.3%;width:7px;height:13px;" src="../../assets/image/index/icon/white@2x.png">
            </div>
          <!-- </router-link> -->
        </label>
      </flexbox-item>
    </flexbox>

  <div style="margin:0px 28% 30px 28%;position: fixed;z-index: 600;bottom: 0;line-height:18px;font-family: PingFangSC-Regular;font-size: 13px;color: #C1C1C1;letter-spacing: 0;text-align: center;">
    <divider >土巴兔大数据中心</divider>
  </div>
    
  </div>
</template>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';

.vux-divider{
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #C1C1C1;
  letter-spacing: 0;
  text-align: center;
}
.flex-board {
  margin:30px 20px 0 20px;
  height:12%;
  background: linear-gradient(-90deg, #4B63D5 0%, #483A8E 100%);
  box-shadow: 0 3px 8px 0 rgba(28,0,189,0.20);
  border-radius: 4px;
  // text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.flex-board:active {
  background:#483A8E;
}
.flex-apply {
  margin:4.5% 5.3% 0% 5.3%;
  height:12%;
  background: linear-gradient(-90deg, #00B7FF 0%,#0079DE 100%);
  box-shadow: 0 3px 8px 0 rgba(0,142,192,0.30);
  // text-align: center;
  border-radius: 4px;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.flex-apply:active  {
  background:#0079DE;
}
.flex-desc {
  margin:4.5% 5.3% 0% 5.3%;
  height:12%;
  background: linear-gradient(-90deg, #74DBD8 0%,#00C9C6  100%);
  box-shadow: 0 3px 8px 0 rgba(0,169,163,0.30);
  border-radius: 4px;
  // text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.flex-desc:active  {
  background: #00C9C6;
}
</style>

<script>
import Cookie from 'js-cookie'
import { Divider,Tab,TabItem,XButton,Flexbox, FlexboxItem,ViewBox,Tabbar,TabbarItem} from 'vux'

  const list = () => ['指标总览', '指标趋势']

  export default {

    components: {
      Cookie,
      Divider,
      Tab,
      TabItem,
      ViewBox,
      XButton,
      Flexbox,
      FlexboxItem,
      Tabbar,
      TabbarItem,
    },
    data () {
      return {
        uid: null,//用户ID
        uname: null,//用户姓名
        token: null,
        tag: '指标总览',
        taglist: list(),
        iname: '',
        index: 0,
        tindex: 0,
        params: null
      }
    },
    ready () {
    },
    mounted : function(){
     this.getIsShow();
    
   },
    methods:{
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
     showMsgFromChild: function (iname,tindex,index){
       this.iname = iname
       this.index = index
       this.tindex = tindex
      },
      getIsShow(){
        
        //  Cookie.set('t8t-it-appVersion', this.$route.query.appVersion)
        //  Cookie.set('t8t-it-appType', this.$route.query.appType)
        //  Cookie.set('t8t-it-deviceId', this.$route.query.deviceId)
        //  Cookie.set('t8t-it-version', this.$route.query.version)
        //  Cookie.set('t8t-it-accountId', this.$route.query.accountId)
        //  Cookie.set('t8t-it-ticket', this.$route.query.tickets)
        //  Cookie.set('t8t-it-token', this.$route.query.token)
        //  Cookie.set('t8t-it-uid', this.$route.query.uid)
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
       this.params = "?appType=" + this.$route.query.appType
                      + "&uid=" + this.$route.query.uid
                      + "&tickets=" + this.$route.query.tickets
                      + "&uname=" + this.uname
                      + "&token=" + this.$route.query.token
      }
     
    }
  }
</script>

