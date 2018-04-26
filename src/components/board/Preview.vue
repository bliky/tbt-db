<template>

  <div id="preview" style=" -webkit-overflow-scrolling:touch;">
    <!-- <indate @listenToIndateEvent="showMsgFromChild"></indate> -->
    <div slot="hearder">
      <div style="padding: 20px 20% 0px 20%;">
        <button-tab v-model="index">
          <button-tab-item :selected="tag === item" v-for="item in taglist" 
            :key="item" @on-item-click="getList(item,index)">
            {{item}}
          </button-tab-item>  
        </button-tab>
      </div> 

      <div style="text-align: center;">
          <p style="margin-top:10px;font-size: 15px;color: #333333;letter-spacing: 0;">
            <span v-if="index === 0 || index === 1 || index === 2">
                {{startDate}}
            </span>
          
          </p>
          <p style="margin-top:5px;font-size: 12px;color: #999999;letter-spacing: 0;">
            {{lupdate}}
          </p>
        </div>
    </div>

    <div  class="div-table" style="padding: 18px 10px 80px 10px;">
      <!-- <scroller scrollbar-y  :bounce="true" height="446px" 
        @on-scroll-bottom="onScrollBottom" >  -->
      <x-table class="table" style="padding-left:6px;padding-right:6px;" v-if=" dataShow == true">
        <thead>
          <tr class="backColor">
            <th style="width:38%;text-align: left;padding-left:9px;" >指标</th>
            <th style="width:22%;text-align: right;padding-right:11px;">数值</th>
            <th style="width:20%;text-align: right;padding-right:11px;">环比</th>
            <th  style="width:20%;text-align: right;padding-right:11px;" v-if="index === 0">同比</th>
            
          </tr>
        </thead>
        
            <tbody style="font-size: 14px;color: #666666;">
              <tr  id="backcolor" v-for="(item,indexs) in listdata" :key="indexs" 
                   :class="{'backColor': indexs % 2 != 0} " 
                   @click="sendMsgToParent(item.dim_ind_name)">
                <td style="text-align: left;padding-left:9px;">{{item.dim_ind_name}}</td>
                <td style="text-align: right;padding-right:11px;">{{item.statis_num}}</td>
                <td style="text-align: right;padding-right:11px;" v-if="index === 0">{{item.dtd}}</td>
                <td style="text-align: right;padding-right:11px;" v-if="index === 1">{{item.wtw}}</td>
                <td style="text-align: right;padding-right:11px;" v-if="index === 2">{{item.mtm}}</td>
                
                <td style="text-align: right;padding-right:11px;" v-if="index === 0">{{item.dtw}}</td>
              </tr>
            </tbody>  
            <!-- <load-more tip="loading"></load-more> -->
        
      </x-table>
      <!-- </scroller>   -->
    </div>

  </div>
</template>


<style scoped>
.backColor{
  background: #F8F9FF;
}
#preview{
  -webkit-overflow-scrolling: touch!important;
}
#preview .vux-button-group-current {
   background-color:#09C767;
}

.popover-demo-content {
  padding: 5px 10px;
}
.div-table {padding: 20px 10px 20px 10px;} 

th{
  height:36px;
  font-family: PingFangSC-Medium;
  font-size: 15px;
  color: #333333;
}
td{
  height: 40px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}
x-table {
  background: #FFFFFF;
  margin-left:6px;
  margin-right: 6px; 
}
thead {font-size: 15px;color: #333333;}

</style>
<script>
import Trend from './Trend'
import Cookie from 'js-cookie'
import { Scroller, LoadMore,ViewBox,Spinner,ButtonTab, ButtonTabItem, XTable} from "vux";

const list = () => ['日指标', '周指标','月指标']

export default {
  components: {
    Scroller, 
    LoadMore,
    ViewBox,
    Spinner,
    XTable,
    ButtonTab,
    ButtonTabItem
  },
  data () {
   return {
        Trend,
        dataShow: false,
        uid: 0,
        uname: "",
        listdata: [],
        tag: '日指标',
        taglist: list(),
        startDate: '',
        lupdate: '',
        index: 0,
        indexs: 0,
        page: 1,
        dataType: "D",
        scrollTop: 0,
        onFetching: false,
        bottomCount: 15,
        size: 150
      }
  },
  mounted : function(){
     this.getList();
    
  }, 
  methods: {
    sendMsgToParent:function(indName){
     this.$emit("listenToPreiew",indName,1);
    },
    getList(item,index){
      this.tag = item;
      this.index = index;
      this.uid = Cookie.get('t8t-it-uid');
      this.uname = Cookie.get('t8t-oa-username');
      // this.page = 1;
      // this.size = 100;
      this.dataType = "D";
      if (this.index == 0) {
        this.dataType = "D"
      }else if(this.index == 1){
        this.dataType = "W"
      }else if(this.index == 2){
        this.dataType = "M"
      }
      this.$http.fetch('dsa/dataBoard/indPvw/pageList',
                       {        
                        uid: this.uid,
                        uname: this.uname,
                        dataType: this.dataType,
                        page: this.page,
                        size: this.size
                        })
                  .then((response) => {
                     this.dataShow = false;
                     this.startDate = ''
                     this.lupdate = ''
                    if(response.data.status == 200){
                      if(response.data.result.total > 0){
                        this.startDate = response.data.result.endate
                        this.lupdate = '更新时间：'+response.data.result.lupdate
                        let arrs = response.data.result.rows;
                        arrs = arrs.map((item) => {
                          let arr = new Array(); 
                          let xiaoshu = "";  //用来记录参数小数数值包括小数点
                          let zhengshu ="";  //用来记录参数录整数数值
                          let t = item.statis_num.toString();
                          if(item.statis_num < 1000 || t.indexOf('%') > 0){    //当参数小于1000的时候直接返回参数
                              return item;
                          }else{
                             ;   //将整数转换成字符串
                              if(t.indexOf('.')>0){   //如果参数存在小数，则记录小数部分与整数部分
                                  var index = t.indexOf('.');
                                  xiaoshu = t.slice(index,t.length);
                                  zhengshu = t.slice(0,index);
                              }else{   //否则整数部分的值就等于参数的字符类型
                                  zhengshu = t;
                              }
                              var num = parseInt(zhengshu.length/3);   //判断需要插入千位分割符的个数

                              //将整数1234567890部分拆分为2部分，变量head:1   变量body:123456789
                              var head = zhengshu.slice(0,zhengshu.length-num*3);  
                              if(head.length>0){  //如果head存在，则在head后面加个千位分隔符，
                                  head += ',';
                              }
                              var body = zhengshu.slice(zhengshu.length-num*3,zhengshu.length);

                              //将body字符串123456789转换成一个字符数组arr2 = ['123','456','789']
                              var arr2 = new Array();   
                              for(var i=0;i<num;i++){
                                  arr2.push(body.slice(i*3,i*3+3));
                              }
                              body = arr2.join(',');   //将数组arr2通过join(',')   方法，拼接成一个以逗号为间隔的字符串

                              zhengshu = head + body;  //拼接整数部分
                              item.statis_num = zhengshu + xiaoshu;   //最后拼接整数和小数部分
                              return item;   //返回结果

                          }
                          //item.statis_num = (item.statis_num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                        });
                        this.listdata = arrs;
                        // setTimeout(() => {  
                           this.dataShow = true;
                        // }, 80);
                      }
                      
                    }
                 }, (response) => {
                });
    },
    onScrollBottom () {
      if (this.onFetching) { 
        // do nothing
      } else {//分页
        this.onFetching = true
        // this.page += 1;
          // this.getList();
        setTimeout(() => {
        //  this.bottomCount += 15
          // this.$nextTick(() => {
          //   this.$refs.scrollerBottom.reset()
          // })
          this.onFetching = false
        }, 2000)
      }
    },
    onScroll (pos) {
      this.scrollTop = pos.top
    },
    changeList () {
      // this.$nextTick(() => {
      //   this.$refs.scroller.reset({
      //     top: 0
      //   })
      // })
    },
  }
};
</script>