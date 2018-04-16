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
            上次更新时间：{{lupdate}}
          </p>
        </div>
    </div>

    <div  class="div-table">
      <x-table >
        <thead>
          <tr style="background-color: #F7F7F7">
            <th style="width:40%;">指标</th>
            <th >数值</th>
            <th  v-if="index === 0">同比</th>
            <th  v-if="index === 0">环比</th>
          </tr>
        </thead>
        <!-- <scroller lock-x @on-scroll-bottom="onScrollBottom" 
            height="200px"
            ref="scrollerBottom" :scroll-bottom-offst="200"> -->

         <!-- <p v-for="i in indexs">placeholder {{i}}</p> -->
            <tbody class="box2" style="font-size: 14px;color: #666666;" 
                    v-for="(item,indexs) in listdata" :key="indexs">
              <tr >
                <td style="width:40%;">{{item.dim_ind_name}}</td>
                <td>{{item.statis_num}}</td>
                <td v-if="index === 0">{{item.dtd}}</td>
                <td v-if="index === 0">{{item.dtw}}</td>
              </tr>
              <!-- <tr style="background: #F4F5FC;"> -->
            </tbody>
            <!-- <load-more tip="loading"></load-more> -->
        <!-- </scroller>   -->
      </x-table>
    </div>
    

  </div>
</template>


<script>
import Cookie from 'js-cookie'
import { Scroller, Spinner,LoadMore,ViewBox,ButtonTab, ButtonTabItem, Divider,XTable} from "vux";
// import Indate from './Indate'

const list = () => ['日指标', '周指标','月指标']

export default {
  components: {
    Scroller, 
    Spinner,
    LoadMore,
    XTable,
    ButtonTab,
    ButtonTabItem,
    Divider
    // Indate
  },
  data () {
   return {
         listdata: [],
         tag: '日指标',
        taglist: list(),
        startDate:0,
        lupdate:0,
         index: 0
      }
  },
  mounted : function(){
     this.getList();
  }, 
  methods: {
    onScrollBottom () {
      if (this.onFetching) {
        // do nothing
      } else {
        this.onFetching = true
        setTimeout(() => {
          this.indexs += 15
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset()
          })
          this.onFetching = false
        }, 2000)
      }
    },
    getList(item,index){
      this.tag = item;
      this.index = index;
      let uid = Cookie.get('t8t-it-uid');
      let uname = Cookie.get('t8t-oa-username');
      console.log("uid====="+uid);
      console.log("uname==="+uname);
      
      let page = 1;
      let size = 100;
      let dataType = "D";
      if (this.index == 0) {
        dataType = "D"
      }else if(this.index == 1){
        dataType = "W"
      }else if(this.index == 2){
        dataType = "M"
      }
      console.log("dataType======"+dataType);
       let vm = this;
          vm.$http.fetch('dsa/dataBoard/indPvw/pageList',
                       {        
                        "uid":uid,
                        "uname":uname,
                        "dataType":dataType,
                        "page":page,
                        "size":size
                        })
                  .then((response) => {
                    console.log("success====");
                    console.log(response.data);
                    this.listdata = []
                    this.startDate = 0
                    this.lupdate = 0
                    if(response.data.status == 200){
                      vm.startDate = response.data.result.endate
                      vm.lupdate = response.data.result.lupdate
                      if(response.data.result.total > 0){
                        vm.listdata = response.data.result.rows;
                      }
                      
                    }
                 }, (response) => {
                    console.log("error=="+response.data);
                });
    },
    showMsgFromChild(data){
      this.index = data
    },
    onShow() {
      console.log("on show");
    },
    onHide() {
      console.log("on hide");
    },
    onScroll (pos) {
      this.scrollTop = pos.top
    },
    changeList () {
      this.showList1 = false
      this.$nextTick(() => {
        this.$refs.scroller.reset({
          top: 0
        })
      })
    },
  }
};
</script>
<style scoped>
#preview .vux-button-group-current {
   background-color:#09C767;
}

.popover-demo-content {
  padding: 5px 10px;
}
.div-table {padding: 20px 10px 20px 10px;} 

th{
  font-family: PingFangSC-Medium;
  font-size: 15px;
  color: #333333;
  text-align: center;
}
td{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}
x-table {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
}
thead {font-size: 15px;color: #333333;text-align: center;}
.box2-wrap {
   height: 500px;
  overflow: hidden;
}
</style>