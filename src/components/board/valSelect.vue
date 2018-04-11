<template>
  <div id="valSelect">
    <group>  
      <popup-picker 
        :popup-title="('指标趋势图')" 
        :title="title" 
        :data="list" v-model="value" 
        @on-show="onShow" 
        @on-hide="onHide" 
        @on-change="onChange" 
        :placeholder="('指标趋势图')">
      </popup-picker>
    </group>
  
  </div>
</template>

<script>
import { PopupPicker, Group, Cell, Picker, XButton, Divider, XSwitch } from 'vux'

export default {
  components: {
    PopupPicker,
    Group,
    Picker,
    XButton,
    Divider,
    Cell,
    XSwitch
  },
  methods: {
    onChange (val) {
      console.log('val change', val)
    },
    onShow () {
      console.log('on show')
    },
    onHide (type) {
      console.log('on hide', type)
    }
  },
  data () {
    return {
      title: '趋势图',
      list: [['登记率', '可售', '通过率', '项目可售','登记率', '可售', '通过率', '项目可售']],
      value: ['登记率'],
      showPopupPicker: false, 
    }
  }
}
</script>

<style scoped>
#valSelect .vux-popup-header-right {
    color: #2BC16A;
} 
</style>