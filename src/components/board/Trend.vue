<template>
  <div id="trend">
    <indate></indate>
    <visual ></visual>
    
    <div style="padding: 20px 10px 20px 10px;">
      <!--div class="details">
         <div>指标详情</div>
          <div>编辑</div>
      </div -->
      <x-table>
        <thead style="font-size: 15px;color: #333333;text-align: center;">
          <tr>
            <th >日期</th>
            <th>设计本PV</th>
            <th>深圳市分派次数签约率</th>
            <th>深圳市分派次数签约率</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px;color: #666666;">
          <tr style="background: #F4F5FC;">
            <td>3月15日</td>
            <td>23</td>
            <td>45%</td>
            <td>45%</td>
          </tr>

           <tr>
            <td>3月16日</td>
            <td>23</td>
            <td>45%</td>
            <td>45%</td>
          </tr>

           <tr style="background: #F4F5FC;">
            <td>3月17日</td>
            <td>23</td>
            <td>45%</td>
            <td>45%</td>
          </tr>

           <tr>
            <td>3月18日</td>
            <td>23</td>
            <td>45%</td>
            <td>45%</td>
          </tr>
        </tbody>
      </x-table>
    </div>  
        
  </div>
</template>

<script>
import Visual from './Visual'
import { XTable} from 'vux'
import Indate from './Indate'

export default {
  components: {
    XTable,
    Indate,
    Visual
  },
  methods: {
    
  }
}
</script>
<style scoped>
th{width:20%;
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
x-table{background: #FFFFFF;border: 1px solid #EEEEEE;}
</style>
