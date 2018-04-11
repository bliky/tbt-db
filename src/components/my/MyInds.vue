<template>
<div class="myinds">
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

  </group>
  
</div>
</template>
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

<style scoped>
.x-title1 {
  font-weight:bold;
  padding-left: 4%;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  color: black;
}

.x-title2 {
  padding-top:10px;
  padding-left: 4%;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #333333;
}

.x-text {
  padding-left: 4%;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #999999;
}
.slide {
  padding: 0 0 0 0 ;
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
</style>