<template>
  <div class="tbt-tabs-radio" style="margin-left: 15px;">
    <div v-if="!noday" class="tbt-tab" :class="{checked: currentValue==0}" @click.stop="handleOnClick(0)">日</div>
    <div class="tbt-tab" :class="{checked: currentValue==1}" @click.stop="handleOnClick(1)">周</div>
    <div class="tbt-tab" :class="{checked: currentValue==2}" @click.stop="handleOnClick(2)">月</div>  
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number, Array, Object],
    noday: Boolean
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  methods: {
    handleOnClick (gra) {
      this.currentValue = gra
    }
  }
}
</script>

<style lang="less">
@import '../var.less';

.tbt-tabs-radio {
  padding: 0 10px;
}

.tbt-tab {
  cursor: pointer;
  color: @color-text;
  font-size: @font-size-main;
  float: left;
  padding: 0 20px;
  text-align: center;
  border: 1px solid @color-border;
  height: 22px;
  line-height: 22px;
  border-radius: 100px;
  &+.tbt-tab {
    margin-left: 10px;
  }
  &.checked {
    color: @color-primary;
    border-color: @color-primary;
  }
}
</style>
