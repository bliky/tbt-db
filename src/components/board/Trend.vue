<template>
  <div id="trend" style=" -webkit-overflow-scrolling:touch;">
      <div style="padding: 20px 20% 15px 20%;">
        <button-tab v-model="index">
          <button-tab-item :selected="tag === item" v-for="item in taglist"  
            :key="item" @on-item-click="getList(item,index)">
            {{item}}
          </button-tab-item>  
        </button-tab>
      </div> 
    
    <div class="visual" v-if="visualShow == true">
      <div class="lupdate" style="text-align: center;">
        <p style="font-size: 15px;color: #333333;letter-spacing: 0;">
          <span v-if="index === 0 || index === 1 || index === 2">
              {{endate}} 
          </span>
        
        </p>
        <p style="margin-top:5px;font-size: 12px;color: #999999;letter-spacing: 0;">
          {{lupdate}}
        </p>
      </div>
    
      <div id="valSelect">
         <group>
            <popup-picker 
              :title="title" 
              :data="list"
              v-model="value"
              @on-show="onShow" 
              @on-hide="onHide" 
              @on-change="onChange" 
              :placeholder="('')">
            </popup-picker>
         </group> 
      </div>

      <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>

      <div style="padding: 10px 10px 30px 10px;">
        <div style="padding-left: 5px;font-family: PingFangSC-Regular;font-size:14px;color:#333333;">详细数据</div>
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
                   <td style="padding-left:9px;text-align: left;color:#FF6D16" 
                       v-if="item.week == 7 || item.week == 1">{{item.statis_dt}} 
                     <span style="color:#FF6D16" v-if="item.week == 7">(周六)</span>
                     <span style="color:#FF6D16" v-if="item.week == 1">(周日)</span>
                  </td>
                  <td style="padding-left:9px;text-align: left;" 
                       v-else>{{item.statis_dt}} 
                  </td>
                  <td style="padding-right:11px;text-align: right;">{{item.statis_num}}</td>
                </tr>

              </tbody>
              
            </x-table>
          </div>  
        <!-- </scroller> -->
      </div>  
    </div> 
  </div>

</template>

<style lang="less">
.weekColor {
  color:#FF6D16;
}
#trend .vux-button-group-current {
   background-color:#06C792;
}
#trend .vux-button-group > a.vux-button-tab-item-first:after{
  border: 1px solid #06C792;
}
#trend .vux-button-group > a.vux-button-tab-item-middle:after{
   border: 1px solid #06C792;
}

.vux-button-group > a {
    color: #06C792;
}

.vux-button-group > a.vux-button-tab-item-last:after {
    border-right: 1px solid #06C792;
    border-top: 1px solid #06C792;
    border-bottom: 1px solid #06C792;
    border-left: none;
    color: #06C792;
}

#valSelect .weui-label {
  border:0;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
 }
#valSelect .weui-cells {
   border:0;
   font-family: PingFangSC-Regular;
   font-size: 14px;
   color: #333333;
   margin-top: 10px;
 }
 #valSelect .weui-cells:before {
  border-top:none;
 }
 #valSelect .weui-cells:after {
  border-bottom:none;
 }
 #valSelect .vux-popup-picker-placeholder {
   font-family: PingFangSC-Regular;
   font-size: 14px;
   color: #333333;
}
</style>

<style scoped>


.backColor{
  background: #F8F9FF!important;
}
#trend{
 -webkit-overflow-scrolling:touch;
}
#trend .vux-button-group-current {
  background-color: #06C792;
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
      dataShow: false,
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
      tag: '',
      taglist: list(),
      endate: '',
      lupdate: '',
      title: "趋势图",
      dataType: "D",
      uid:0,
      uname:"",
      list: [],
      value: [""],
      indName: '',
      showPopupPicker: false,
      isClick: false,
      isSel: false,
      selIndex: this.indextotrend,
      stepIndName: '',
      index: this.indextotrend,
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
  //  this.changeValue();
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
      if(typeof(item) == "undefined"){
        this.isClick = false;
        if(this.inametotrend.length > 0){
          this.index = this.indextotrend;
        }else{
          this.index = index;
        }
      }else{
        this.isClick = true;
        this.selIndex = index;
        this.index = index;
      }
      this.tag = item;
      this.uid = Cookie.get("t8t-it-uid");
      this.uname = Cookie.get("t8t-oa-username");
      this.dataType = "D";
      this.stepIndName = this.indName;
      if (this.index == 0) {
        this.dataType = "D";
        this.inametotrend = this.inametotrend.replace(/MAU/,"DAU");
        this.inametotrend = this.inametotrend.replace(/WAU/,"DAU");
      } else if (this.index == 1) {
        this.dataType = "W";
        this.inametotrend = this.inametotrend.replace(/MAU/,"WAU");
        this.inametotrend = this.inametotrend.replace(/DAU/,"WAU");
      } else if (this.index == 2) {
        this.dataType = "M";
        this.inametotrend = this.inametotrend.replace(/DAU/,"MAU");
        this.inametotrend = this.inametotrend.replace(/WAU/,"MAU");
      }
      //选择列表
      this.selist();
      this.page = 1;
      this.size = 100;
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
          this.visualShow = false;
          if(response.data.status == 200){
            if(response.data.result.rows.length > 0){
              this.visualShow = true;
              // 使用 html5 canvas api 创建渐变色对象
                const canvas = document.getElementById("mountNode");
                const ctx = canvas.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
                      gradient.addColorStop(0, "#06C792");
                      gradient.addColorStop(0.5, "#06C792");
                      gradient.addColorStop(1, "#06C792");

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
                 // showItemMarker: false,
                  showCrosshairs: true,
                  onShow(ev) {
                  const { items } = ev;
                  items[0].name = items[0].title;
                }
                 
                });
                // chart.guide().tag({
                //   position: position,
                //   content: content,
                //   direct: "tl",
                //   offsetY: -5,
                //   background: {
                //     fill: "#06C792"
                //   },
                //   pointStyle: {
                //     fill: "#06C792"
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
                let arr = response.data.result.rows;
                arr = arr.map((item) => { 
                  let arr = new Array(); 
                  let xiaoshu = "";  //用来记录参数小数数值包括小数点
                  let zhengshu ="";  //用来记录参数录整数数值
                  let t = item.statis_num.toString();
                 
                  if(item.statis_num < 1000 || t.indexOf('%') > 0){    //当参数小于1000的时候直接返回参数
                      return item;
                  }else{
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
                      if(head.length > 0 && t  != '-'){  //如果head存在，则在head后面加个千位分隔符，
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
                });
                this.listdata = arr;
              }
                
            }
          },
          response => {
          }
        );
    },
    selist(){//选择列
      this.$http
        .fetch("dsa/dataBoard/indTnd/seList", {
          uid: this.uid,
          uname: this.uname,
          dataType: this.dataType
        })
        .then(
          response => {
            this.endate = '';
            this.lupdate = '';
            this.selistdate = [];
            this.values = [];
            this.list = [];
            this.value = [];
            this.indName = ''; //指标名称
            this.value = [];
            if (response.data.status == 200) {
                this.endate = response.data.result.endate;
                this.lupdate = '更新时间：'+response.data.result.lupdate;
                this.isSel = false;
                if(response.data.result.rows.length > 0){
                  this.selistdate = response.data.result.rows;
                  
                  for (let arr of this.selistdate) {
                    this.values.push(arr.dim_ind_name);
                  }
                  this.list.push(this.values);

                  let  a = this.selistdate.shift();
                  
                  if(!this.isClick && this.inametotrend.length > 0 && !this.isSel){
                   this.indName = this.inametotrend; //指标名称
                   this.value = [this.inametotrend];
                   this.index = this.indextotrend;
                  }else if(this.isClick && this.inametotrend.length > 0 && !this.isSel){
                    this.indName = this.inametotrend; 
                    this.value = [this.inametotrend];
                  }else{
                    this.indName = a.dim_ind_name; //指标名称
                    this.value = [a.dim_ind_name];
                  }
                  
                    this.changeValue();
                    //分页查询列表
                    this.pageList();
                        
                }  
            }
          },
          response => {
          }
        );
    },
    
    onChange(val) {
      // debugger
      this.isSel = true;
      this.index = this.selIndex;
      this.indextotrend = this.index;
      this.indName = val.join(",");
      // console.log(val);
      // this.value = [val];
      this.inametotrend = this.indName;
        // this.getList();
      this.changeValue();
      this.pageList();
    },
    showMsgFromChild(data) {
      // this.index = data;
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
  },
  props: ['inametotrend','indextotrend']
};
</script>