<template>
  <div class="myinds" style="-webkit-overflow-scrolling:touch;">
    <group> 
      <cell
        :title="('名词释义')"
        is-link
        @click.native="navTo('nounDesc')">
      </cell>

      <cell
        :title="('指标释义')"
        is-link
         @click.native="navTo('indDesc')">
      </cell>
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
import { Cell, Group } from 'vux'
import { navTo } from '../../utils/utils'

export default {
  components: {
    Group,
    Cell
  },
  methods: {
    navTo(name) {
      navTo.call(this, name);
    }
  }
}
</script>
