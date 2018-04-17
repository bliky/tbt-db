<template>
  <div id="trend">
    <!-- indate></indate -->
    <div calss="indate">
      <div style="padding: 15px 20% 15px 20%;">
        <button-tab v-model="index">
          <button-tab-item :selected="tag === item" v-for="item in taglist" 
            :key="item" @on-item-click="getList(item,index)">
            {{item}}
          </button-tab-item>  
        </button-tab>
      </div> 

      <div class="lupdate" style="text-align: center;">
          <p style="font-size: 15px;color: #333333;letter-spacing: 0;">
            <span v-if="index === 0 || index === 1 || index === 2">
                {{endate}} 
            </span>
          
          </p>
          <p style="font-size: 12px;color: #999999;letter-spacing: 0;">
            上次更新时间：{{lupdate}}
          </p>
        </div>

    </div>
    
    <div class="visual" v-if="visualShow == true">
      <div id="valSelect">
        <group>  
          <popup-picker 
            :popup-title="('指标趋势图')" 
            :title="title" 
            :data="list"
             v-model="value" 
            @on-show="onShow" 
            @on-hide="onHide" 
            @on-change="onChange" 
            :placeholder="('(小)合作装修公司_UV')">
          </popup-picker>
        </group>
      </div>

      <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>
    </div>

    <!-- <visual ></visual> -->

    <div style="padding: 20px 10px 20px 10px;">
      <!-- <scroller lock-y :scrollbar-x=false> -->
        <div class="box12">
          <x-table class="box1-items">
            <thead style="font-size: 15px;color: #333333;text-align: center;" >
              <tr style="background-color: #F7F7F7">
                <th>日期</th>
                <!-- <th v-if="dateShow == true">日期</th> -->
                <!-- <th style="width:150px;" v-for="(item,selindex) in selistdate" :key="selindex"> -->
                <th>
                  {{indName}}
                  <!-- {{item.dim_ind_name}} -->
                </th>
              </tr>
            </thead>
            <tbody style="font-size: 14px;color: #666666;" 
              v-for="(item,indexs) in listdata" :key="indexs">
              <!-- <tr style="background: #F4F5FC;" > -->
              <tr>
                <td>{{item.statis_dt}}</td>
                <td>{{item.statis_num}}</td>
              </tr>

            </tbody>
          </x-table>
        </div>  
      <!-- </scroller> -->
    </div>  
  

    
  </div>
</template>

<script>
import F2 from "@antv/f2";
import Cookie from "js-cookie";
import {
  Scroller,
  Spinner,
  LoadMore,
  ButtonTab,
  ButtonTabItem,
  XTable,
  PopupPicker,
  Group,
  Cell,
  Picker,
  XButton
} from "vux";

// import Indate from './Indate'
// import Visual from './Visual'

const list = () => ["日指标", "周指标", "月指标"];

export default {
  components: {
    F2,
    Cookie,
    Scroller,
    ButtonTab,
    ButtonTabItem,
    XTable,
    PopupPicker,
    Group,
    Cell,
    Picker,
    XButton,
    Spinner,
    LoadMore
    //Indate,
    // Visual
  },
  data() {
    return {
      page:1,
      size:100,
      visualShow: false,
      dateShow: false,
      showList1: true,
      scrollTop: 0,
      onFetching: false,
      bottomCount: 20,
      listdata: [],
      selistdate: [],
      tag: "日指标",
      taglist: list(),
      endate: 0,
      lupdate: 0,
      title: "趋势图",
      dataType: "D",
      uid:0,
      uname:"",
      list: [
        "登记率",
        "可售",
        "通过率",
        "项目可售",
        "登记率",
        "可售",
        "通过率",
        "项目可售"
      ],
      value: ["(小)合作装修公司_UV"],
      indName: "(小)合作装修公司_UV",
      showPopupPicker: false,
      index: 0
    };
  },
  mounted: function() {
    //参数赋值
    this.getList();
     //分页查询列表
    this.pageList();
    //选择列表
    this.selist();
    //折线图
    this.changeValue();
  },
  methods: {
    onScrollBottom() {
      if (this.onFetching) {
        // do nothing
      } else {
        this.onFetching = true;
        setTimeout(() => {
          this.bottomCount += 10;
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
          });
          this.onFetching = false;
        }, 2000);
      }
    },
    getList(item, index) {
      this.tag = item;
      this.index = index;
      this.uid = Cookie.get("t8t-it-uid");
      this.uname = Cookie.get("t8t-oa-username");
      this.page = 1;
      this.size = 100;
      this.dataType = "D";
      this.listValue = [];
      this.indName = "(小)合作装修公司_UV"; //指标名称
      if (this.index == 0) {
        this.dataType = "D";
      } else if (this.index == 1) {
        this.dataType = "W";
      } else if (this.index == 2) {
        this.dataType = "M";
      }
      //选择列表
      this.selist();
      //折线图
      this.changeValue();
      //分页查询列表
      this.pageList();
      
      
    },
    changeValue(){ //趋势图
      this.$http.fetch('dsa/dataBoard/indTnd/numList',
                         {
                          uid:this.uid,
                          uname:this.uname,
                          dataType:this.dataType,
                          indName:this.indName
                          })
        .then((response) => {
            console.log(response.data);
          if(response.data.status == 200){
            console.log("趋势指标=======");
              console.log(response.data);
             if(response.data.result.rows.length > 0){
              // 使用 html5 canvas api 创建渐变色对象
                const canvas = document.getElementById("mountNode");
                const ctx = canvas.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
                      gradient.addColorStop(0, "#09C767");
                      gradient.addColorStop(0.5, "#09C767");
                      gradient.addColorStop(1, "#09C767");

                let maxDate = response.data.result.maxDate//'7日'
                let maxValues = response.data.result.maxValues//98.88
                let position = [maxDate,maxValues]
                let content = '最大值：'+maxValues
                console.log(position)
                console.log(content)
                
                const data = response.data.result.rows
                const chart = new F2.Chart({
                  id: "mountNode",
                  width: window.innerWidth,
                  height:
                    window.innerWidth > window.innerHeight
                      ? window.innerHeight - 54
                      : window.innerWidth * 0.707,
                  pixelRatio: window.devicePixelRatio
                });
                const defs = {
                  日期: {
                    //mask: 'DD日',
                    range: [0, 1],
                    max: '30日',
                    tickCount: 10
                  },
                  值: {
                    tickCount: 5
                  }
                };
                chart.axis("日期", {
                  label(text, index, total) {
                    const cfg = {
                      textAlign: "center"
                    };
                    if (index === 0) {
                      cfg.textAlign = "start";
                    }
                    if (index > 0 && index === total - 1) {
                      cfg.textAlign = "end";
                    }
                    return cfg;
                  }
                });
                chart.source(data, defs);
                chart.tooltip({
                  showCrosshairs: true
                });
                chart.guide().tag({
                  position: position,
                  content: content,
                  direct: "tl",
                  offsetY: -5,
                  background: {
                    fill: "#09C767"
                  },
                  pointStyle: {
                    fill: "#09C767"
                  }
                });
                chart
                  .line()
                  .position("日期*值")
                  .shape("smooth")
                  .color(gradient);
                chart
                  .area()
                  .position("日期*值")
                  .shape("smooth")
                  .color(gradient);
                chart.render();
            }

          }
        }, (response) => {
          console.log("error=="+response.data);
      });
    },
    pageList(){//分页列表
      this.$http
        .fetch("dsa/dataBoard/indTnd/pageList", {
          uid: this.uid,
          uname: this.uname,
          dataType: this.dataType,
          indName: this.indName,
          page: this.page,
          size: this.size
        })
        .then(
          response => {
            console.log(response.data);
            this.dateShow = false;
            this.listdata = [];
            if (response.data.status == 200) {
              if(response.data.result.rows.length > 0){
                this.dateShow = true;
                this.listdata = response.data.result.rows;
              }
                
            }
          },
          response => {
            console.log("error=="+response.error);
          }
        );
    },
    selist(){//选择列表
      this.$http
        .fetch("dsa/dataBoard/indTnd/seList", {
          uid: this.uid,
          uname: this.uname,
          dataType: this.dataType
        })
        .then(
          response => {
            console.log("success=1===");
            console.log(response.data);
            this.endate = 0;
            this.lupdate = 0;
            this.selistdate = [];
            this.values = [];
            this.list = [];
            this.value = [];
            this.visualShow = false;
            if (response.data.status == 200) {
                this.endate = response.data.result.endate;
                this.lupdate = response.data.result.lupdate;
                if(response.data.result.rows.length > 0){
                  this.visualShow = true;
                  this.selistdate = response.data.result.rows;
                }
                this.indName = "(小)合作装修公司_UV"; //指标名称
                this.value = ["(小)合作装修公司_UV"];
                //  this.selistdate.forEach((value,i)=>{   //数组循环
                //     for(var pl in value){  //数组对象遍历
                //         console.log("p1"+pl);   //获取key
                //         console.log("v1"+value[pl])  //获取key的值
                //     }
                //   })
                for (let arr of this.selistdate) {
                  this.values.push(arr.dim_ind_name);
                }
                this.list.push(this.values);
            }
          },
          response => {
            console.log("error=="+response.data);
          }
        );
    },
    
    
    onChange(val) {
      this.indName = val.join(",");
      this.changeValue();
      this.pageList();
      console.log("val change indName===",this.indName, val);
    },
    showMsgFromChild(data) {
      this.index = data;
    },
    onShow() {
      console.log("on show");
    },
    onHide() {
      console.log("on hide");
    },
    onScroll(pos) {
      this.scrollTop = pos.top;
    },
    onCellClick() {
      window.alert("cell click");
    },
    onClickButton() {
      window.alert("click");
    },
    changeList() {
      this.showList1 = false;
      this.$nextTick(() => {
        this.$refs.scroller.reset({
          top: 0
        });
      });
    }
  }
};
</script>
<style scoped>
#trend .vux-button-group-current {
  background-color: #09c767;
}
th {
  font-family: PingFangSC-Medium;
  font-size: 15px;
  color: #333333;
  text-align: center;
}
td {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}

x-table {
  background: #ffffff;
  border: 1px solid #eeeeee;
}

.box1 {
  width: 5000px;
}
.box1-item {
  float: left;
  display: inline-block;
  margin-left: 15px;
  text-align: center;
  text-align: center;
}

.box2-wrap {
  height: 300px;
  overflow: hidden;
}
</style>

<!--template>
  <div>
    

    <scroller lock-x height="200px" @on-scroll-bottom="onScrollBottom" 
    ref="scrollerBottom" :scroll-bottom-offst="200">
      <div class="box2">
        <p v-for="i in bottomCount">placeholder {{i}}</p>
        <load-more tip="loading"></load-more>
      </div>
    </scroller>

  </div>
</template>

<script>
import { Scroller, Spinner,LoadMore } from 'vux'

export default {
  components: {
    Scroller,
    Spinner,
    LoadMore
  },
  data () {
    return {
      scrollTop: 0,
      onFetching: false,
      bottomCount: 15
    }
  },
  mounted () {
    
  },
  methods: {
    onScrollBottom () {
      if (this.onFetching) {
        // do nothing
      } else {
        this.onFetching = true
        setTimeout(() => {
          this.bottomCount += 15
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset()
          })
          this.onFetching = false
        }, 2000)
      }
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
    }
  }
}
</script>

<style scoped>
.box1 {
  height: 100px;
  position: relative;
  width: 1490px;
}
.box1-item {
  width: 200px;
  height: 100px;
  background-color: #ccc;
  display:inline-block;
  margin-left: 15px;
  float: left;
  text-align: center;
  line-height: 100px;
}
.box1-item:first-child {
  margin-left: 0;
}
.box2-wrap {
  height: 300px;
  overflow: hidden;
}
</style -->