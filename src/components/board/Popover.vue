<template>

  <div class="popover">
     <!-- <img src="../../assets/image/table_button_compositor@2x.png" style="padding-left:03px;height:15px;width:15px"/>&nbsp;&nbsp;&nbsp; -->
        <img src="../../assets/image/warning.png" style="height:12px;width:12px"/>
        <div style="text-align:center;">
            <popover placement="bottom" style="margin: 20px;">
                <div slot="content" class="popover-content">
                    <ul>
                    <li> 日同比：对比上周同日,如上周三</li>
                    <li> 日同比：对比上个月同期,往回推四周,
                                如本月第一周,对比上月第一周
                    </li>
                    <li>月同比：对比去年同期</li>
                    </ul>
                </div>
            </popover>
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

x-table {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
}
thead {font-size: 15px;color: #333333;text-align: center;}
</style>