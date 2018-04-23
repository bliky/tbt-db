<template>
  <div class="myinds" style="-webkit-overflow-scrolling:touch;">
        <!-- <div style="padding-top:20px;background-color:#F6F6F6;"></div> -->
      
    <group> 
      <cell
      :title="('名词释义')"
      is-link
      :link="{path:'/bdc-prd-dbd/nounDesc'}">
      </cell>

      <cell
      :title="('指标释义')"
      is-link
      :link="{path:'/bdc-prd-dbd/indesc'}">
      </cell>
      <!-- <hr  color="#E3E3E3" size="1px"> -->
    </group>
 </div> 
</template>
<style>

#myinds .weui-cell:before {
      border-top:none!important;
}
#myinds .weui-cell {
    border-top:none!important;
}
</style>

<script>
import { Cell, CellBox, CellFormPreview, Group, Badge } from 'vux'
export default {
  mounted () {
   
  },
  components: {
    Group,
    Cell,
    CellFormPreview,
    CellBox,
    Badge
  },
  methods: {
    onClick () {
      console.log('on click')
    }
  },
  data () {
    return {
      showContent01: false,
      showContent02: false
    }
  }
}
</script>
