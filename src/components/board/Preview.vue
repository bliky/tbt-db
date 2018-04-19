<template>

  <div id="preview">
    <!-- <indate @listenToIndateEvent="showMsgFromChild"></indate> -->
    <div slot="hearder">
      <div style="padding: 15px 20% 15px 20%;">
        <button-tab v-model="index">
          <button-tab-item :selected="tag === item" v-for="item in taglist" 
            :key="item" @on-item-click="getList(item,index)">
            {{item}}
          </button-tab-item>  
        </button-tab>
      </div> 

      <div style="text-align: center;">
          <p style="font-size: 15px;color: #333333;letter-spacing: 0;">
            <span v-if="index === 0 || index === 1 || index === 2">
                {{startDate}}
            </span>
          
          </p>
          <p style="font-size: 12px;color: #999999;letter-spacing: 0;">
            更新时间：{{lupdate}}
          </p>
        </div>
    </div>

    <div  class="div-table" style="padding: 20px 10px 200px 10px;">
      <!-- <scroller scrollbar-y  :bounce="true" height="446px" 
        @on-scroll-bottom="onScrollBottom" >  -->
      <x-table class="table" >
        <thead>
          <tr class="backColor">
            <th style="text-align: left;">指标</th>
            <th style="text-align: right;">数值</th>
            <th  style="text-align: right;" v-if="index === 0">同比</th>
            <th style="text-align: right;">环比</th>
          </tr>
        </thead>
        
            <tbody style="font-size: 14px;color: #666666;">
              <tr  id="backcolor" v-for="(item,indexs) in listdata" :key="indexs" 
                   :class="{'backColor': indexs % 2 != 0} ">
                <td style="text-align: left;">{{item.dim_ind_name}}</td>
                <td style="text-align: right;">{{item.statis_num}}</td>
                <td style="text-align: right;" v-if="index === 0">{{item.dtd}}</td>
                <td style="text-align: right;">{{item.dtw}}</td>
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
  background: #F4F5FC;
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
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #333333;
  text-align: center;
}
td{
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #666666;
}
x-table {
  background: #FFFFFF;
}
thead {font-size: 15px;color: #333333;text-align: center;}

</style>
<script>
import Cookie from 'js-cookie'
import { Scroller, Spinner,ButtonTab, ButtonTabItem, XTable} from "vux";

const list = () => ['日指标', '周指标','月指标']

export default {
  components: {
    Scroller, 
    Spinner,
    XTable,
    ButtonTab,
    ButtonTabItem
  },
  data () {
   return {
        uid: 0,
        uname: "",
        listdata: [],
        tag: '日指标',
        taglist: list(),
        startDate: 0,
        lupdate: 0,
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
                    this.listdata = []
                    this.startDate = 0
                    this.lupdate = 0
                    if(response.data.status == 200){
                      this.startDate = response.data.result.endate
                      this.lupdate = response.data.result.lupdate
                      if(response.data.result.total > 0){
                        this.listdata = response.data.result.rows;
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