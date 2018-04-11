<template>
  <div>
       <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
       <ul>
      <li v-for="(item,index) in listdata" :key="index">{{item.path}}</li>
         <li v-for="(item,index) in downdata" :key="index">{{item.path}}</li>
       </ul>
    </v-scroll>
  </div> 
</template>

 <script>
import Scroll from './testMove'
import token from '../../utils/token.js'

export default{
mixins: [token],
 data () {
    return {
      counter : 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
      num : 5,  // 一次显示多少条
      pageStart : 0, // 开始页数
      pageEnd : 0, // 结束页数
      listdata: [], // 下拉更新数据存放数组
      downdata: []  // 上拉更多的数据存放数组
    }
  },
  mounted : function(){
     this.getList();
  },      
  methods: {
    getList(){
       let vm = this;
          vm.$http.fetch('dsa/heatMap/heatSumCount',
                       {url:"http://sz.to8to.com/",
                        dateTag:"date0",
                        page:3
                      })
                  .then((response) => {
                    console.log("success===="+response.data.status);
                    //if(response.data.status == 200){
                      console.log("data====="+response.data.result.point.slice(0,15));
                      vm.listdata = response.data.result.point.slice(0,15);
                      console.log("listdata====="+vm.listdata);
                    //}
                 }, (response) => {
                    console.log('error1');
                });
    },
    onRefresh(done) {
             this.getList();
             done() // call done
    },
    onInfinite(done) {
              let vm = this;
              vm.$http.fetch('dsa/heatMap/heatSumCount',
                          {url:"http://sz.to8to.com/",
                            dateTag:"date0",
                            page:3
                          })
              .then((response) => {
                  vm.counter++;
                  vm.pageEnd = vm.num * vm.counter;
                  vm.pageStart = vm.pageEnd - vm.num;
                  let arr = response.data.result.point;
                     let i = vm.pageStart;
                     let end = vm.pageEnd;
                     for(; i<end; i++){
                        let obj ={};
                        obj["name"] = arr[i].name;
                        vm.downdata.push(obj);
                         if((i + 1) >= response.data.result.point.length){
                          this.$el.querySelector('.load-more').style.display = 'none';
                          return;
                        }
                        }
                  done() // call done
                   }, (response) => {
                    console.log('error2');
                });
           },
//            onRefresh (done) {
//         // 执行刷新方法
//         a()
//         done() // call done
//       },
// // 加载更多方法
//       onInfinite () {
//         var _this = this
//         let more = _this.$el.querySelector('.load-more')
//        b()
//       },   
  },
  components : {
'v-scroll': Scroll
  }
}
</script>

<!--template>
 <div>
   <x-header :left-options="{backText: ''}"> 
    </x-header>
 <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
    use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
    lock-x ref="scrollerBottom" height="-48">
  <div style="padding: 10px 0">
  <div class="box" v-for="(item, index) in list" :key="index">
   
   <p class="list"> {{item}}</p>
    
  </div>
  </div>
 </scroller>
 </div>
</template>
<script>
 import {Scroller, XHeader} from 'vux'


 
 const pulldownDefaultConfig = {
 content: '下拉刷新',
 height: 40,
 autoRefresh: false,
 downContent: '下拉刷新',
 upContent: '释放后刷新',
 loadingContent: '正在刷新...',
 noMoreData:'所有数据加载完成',
 noData:'没有数据',
 clsPrefix: 'xs-plugin-pulldown-'
 }
 const pullupDefaultConfig = {
 content: '上拉加载更多',
 pullUpHeight: 60,
 height: 40,
 autoRefresh: false,
 downContent: '释放后加载',
 upContent: '上拉加载更多',
 loadingContent: '加载中...',
 noMoreData:'所有数据加载完成',
 noData:'没有数据',
 clsPrefix: 'xs-plugin-pullup-'
 }

 export default {
 components: {
  XHeader,
  Scroller
 },
 mounted() {
  this.$nextTick(() => {
  this.$refs.scrollerBottom.reset({top: 0})
  })
  this.loadMore()
 },
 data() {
  return {
    //  dataCurPage : 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
    //   num : 5,  // 一次显示多少条
    //   pageStart : 0, // 开始页数
    //   pageEnd : 0, // 结束页数

    // dataCurPage: this.dataCurPage,// 数据页码
    // loadMores: this.loadMores,// 第一次加载数据时的正在加载
    // loadMoreing: this.loadMoreing,// 上拉加载数据时的正在加载
    list: [],// 存放数组
    pullupDefaultConfig: pullupDefaultConfig,
    pulldownDefaultConfig: pulldownDefaultConfig
  }
 },
 methods: {
  fetchData(cb) {
    this.$http.fetch('dsa/heatMap/heatSumCount',
                       {url:"http://sz.to8to.com/",
                        dateTag:"date0",
                        page:dataCurPage
                      })
  .then(response => {
   this.$nextTick(() => {
   this.$refs.scrollerBottom.reset()
   })
   this.list = response.data.result.point
   console.log("list====")
   console.log(this.list)
   cb(response.data.result.point)
  })
  },
  refresh() {
  this.fetchData(data => {
    console.log("刷新数据");
    console.log(data);
   this.dataCurPage = 1
   console.log("刷新数据"+dataCurPage)
   this.list =  this.list.concat(data.list)
   this.$refs.scrollerBottom.enablePullup()
   this.$refs.scrollerBottom.donePulldown()
  })
  },
  loadMore() {
  this.fetchData(data => {
    console.log("加载数据");
    console.log(data);
   if (this.list.length >= 10) {
   this.dataCurPage += 1
   console.log("dataCurpage==="+this.dataCurPage);
   this.$refs.scrollerBottom.disablePullup()
   this.list = this.list.concat(data.list)
   this.$refs.scrollerBottom.donePullup()
   }
   
  })
  }
 }
 }
</script>
<style lang="less">
 .box {
 padding: 5px 10px 5px 10px;
 &:first-child {
  padding: 0 10px 5px 10px;
 }
 &:last-child {
  padding: 5px 10px 0 10px;
 }
 }
 .list {
 background-color: #fff;
 border-radius: 4px;
 border: 1px solid #f0f0f0;
 padding: 20px;
 }
 .xs-plugin-pulldown-container {
 line-height: 100px;
 }
 .xs-plugin-pullup-container {
 line-height: 50px;
 }
</style -->
