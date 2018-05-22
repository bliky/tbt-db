<template>
  <div id="dataBoard" style="-webkit-overflow-scrolling:touch;">

    123

       
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
import Cookie from 'js-cookie'
import { ViewBox,Tab,TabItem,XButton} from 'vux'

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

