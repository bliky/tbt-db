<template>
  <div id="trend" style=" -webkit-overflow-scrolling:touch;">
    <div calss="indate">
      <div style="padding: 20px 20% 15px 20%;">
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
          <p style="margin-top:5px;font-size: 12px;color: #999999;letter-spacing: 0;">
            更新时间：{{lupdate}}
          </p>
        </div>
    </div>
    
    <div class="visual" v-if="visualShow == true">
      <div id="valSelect"> 
        <group>
          <popup-picker 
            :title="title" 
            :data="list"
            @on-show="onShow" 
            @on-hide="onHide" 
            @on-change="onChange" 
            :placeholder="('GMV(万元)')">
          </popup-picker>
        </group>  
      </div>

      <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>
    </div>

    <div style="padding: 10px 10px 200px 10px;">
      <div style="padding-left: 5px;font-size:14px;color:#333333;">指标详情</div>
        <div class="box12" style="padding-top:9px;">
          <x-table class="box1-items" style="padding-left:6px;padding-right:6px;">
            <thead>
              <tr class="backColor">
                <th style="font-size:15px;color:#333333;padding-left:9px;text-align: left;">日期</th>
                <th style="font-size:15px;color:#333333;padding-right:11px;text-align: right;">
                  {{indName}}
                </th>
              </tr>
            </thead>
            <tbody style="font-size: 14px;color: #666666;" 
              v-for="(item,index) in listdata" :key="index">
              <tr :class="{'backColor': index % 2 != 0} ">
                <td style="padding-left:9px;text-align: left;">{{item.statis_dt}}</td>
                <td style="padding-right:11px;text-align: right;">{{item.statis_num}}</td>
              </tr>

            </tbody>
             
          </x-table>
        </div>  
      <!-- </scroller> -->
    </div>  
     
  </div>

</template>

<style>
#valSelect .weui-label {
  border:0;
  font-size: 14px;
 }
#valSelect .weui-cells {
   margin-top: 10px;
 }
 #valSelect .weui-cells:before {
  border-top:none;
 }
 #valSelect .weui-cells:after {
  border-bottom:none;
 }
 #valSelect .vux-popup-picker-placeholder {
  font-size: 14px;
}
</style>

<style scoped>


.backColor{
  background: #F4F5FC!important;
}
#trend{
 -webkit-overflow-scrolling:touch;
}
#trend .vux-button-group-current {
  background-color: #09c767;
}
th {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #333333;
}
td {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #666666;
}

x-table {
  background: #ffffff;
}


</style>


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

const list = () => ["日指标", "周指标", "月指标"];

export default {
  components: {
    F2,
    Cookie,
    ButtonTab,
    ButtonTabItem,
    XTable,
    PopupPicker,
    Group,
    Cell,
    Picker,
    XButton
  },
  data() {
    return {
      datav: [],
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
      value: ["GMV(万元)"],
      indName: "GMV(万元)",
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
      this.indName = "GMV(万元)"; //指标名称
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
          this.datav = []
          if(response.data.status == 200){
              // 使用 html5 canvas api 创建渐变色对象
                const canvas = document.getElementById("mountNode");
                const ctx = canvas.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
                      gradient.addColorStop(0, "#09C767");
                      gradient.addColorStop(0.5, "#09C767");
                      gradient.addColorStop(1, "#09C767");

                let maxDate = response.data.result.maxDate//'7日'
                let maxValues = response.data.result.maxValues//98.88
              //  let position = [maxDate,maxValues]
              //  let content = '最大值：'+maxValues
                this.datav = response.data.result.rows
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
                    range: [0, 1],
                    tickCount: 5
                  },
                  值: {
                    tickCount: 5,
                    min: 0
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
                chart.source(this.datav, defs);
                chart.tooltip({
                  showCrosshairs: true
                });
                // chart.guide().tag({
                //   position: position,
                //   content: content,
                //   direct: "tl",
                //   offsetY: -5,
                //   background: {
                //     fill: "#09C767"
                //   },
                //   pointStyle: {
                //     fill: "#09C767"
                //   }
                // });
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
        }, (response) => {
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
            this.listdata = [];
            if (response.data.status == 200) {
              if(response.data.result.total > 0){
                this.listdata = response.data.result.rows;
              }
                
            }
          },
          response => {
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
                
                  this.indName = "GMV(万元)"; //指标名称
                  this.value = ["GMV(万元)"];
                  for (let arr of this.selistdate) {
                    this.values.push(arr.dim_ind_name);
                  }
                  this.list.push(this.values);
                }  
            }
          },
          response => {
          }
        );
    },
    
    onChange(val) {
      this.indName = val.join(",");
      this.changeValue();
      this.pageList();
    },
    showMsgFromChild(data) {
      this.index = data;
    },
    onShow() {
      // console.log("on show");
    },
    onHide() {
      // console.log("on hide");
    },
    onScroll(pos) {
      // this.scrollTop = pos.top;
    },
    onCellClick() {
      // window.alert("cell click");
    },
    onClickButton() {
      // window.alert("click");
    },
    changeList() {
      // this.showList1 = false;
      // this.$nextTick(() => {
      //   this.$refs.scroller.reset({
      //     top: 0
      //   });
      // });
    }
  }
};
</script>