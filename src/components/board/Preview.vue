<template>

  <div class="preview">
    <indate @listenToIndateEvent="showMsgFromChild"></indate>
    <div  class="div-table">
      <x-table>
        <thead>
          <tr>
            <th style="width:50%;">指标</th>
            <th>数值</th>
            <th v-if="index === 0">同比</th>
            <th v-if="index === 0">环比</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;color: #666666;">
          <tr style="background: #F4F5FC;">
            <td>土巴兔PC可售</td>
            <td>23</td>
            <td v-if="index === 0">45%</td>
            <td v-if="index === 0">45%</td>
          </tr>

           <tr>
            <td>深圳市新增线索接通</td>
            <td>23</td>
            <td v-if="index === 0">45%</td>
            <td v-if="index === 0">45%</td>
          </tr>

           <tr style="background: #F4F5FC;">
            <td>非落地深圳市分派次数签单</td>
            <td>23</td>
            <td v-if="index === 0">45%</td>
            <td v-if="index === 0">45%</td>
          </tr>

           <tr>
            <td>土巴兔PC可售</td>
            <td>23</td>
            <td v-if="index === 0">45%</td>
            <td v-if="index === 0">45%</td>
          </tr>
        </tbody>
      </x-table>
    </div>
    

  </div>
</template>


<script>
import { XTable, LoadMore, Popover } from "vux";
import Indate from './Indate'

export default {
  components: {
    XTable,
    LoadMore,
    Popover,
    Indate
  },
  data () {
   return {
        index:0
      }
  },
  methods: {
    showMsgFromChild(data){
      this.index = data
    },
    onShow() {
      console.log("on show");
    },
    onHide() {
      console.log("on hide");
    }
  }
};
</script>
<style scoped>
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
</style>