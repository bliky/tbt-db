<template>
  <div @click="handleOnClick" class="tbt-top" v-show="show">
    Top
  </div>
</template>

<script>
export default {
  props: {

  },
  mounted () {
    let that = this;
    let app = document.getElementById('vux_view_box_body');
    app.onscroll = scroll;

    function scroll(e) {
      if (this.scrollTop > 0) {
        that.show = true;
      } else if (this.scrollTop == 0) {
        that.show = false;
      }
      // 注意: window.innerWidth 和 window.innerHeight 可以获得页面可见区域的宽和高.
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    handleOnClick () {
      this.moveTop();
    },
    moveTop () {
      let container = document.getElementById('vux_view_box_body');
      container.scrollTop = 0;
    }
  }
};
</script>

<style lang="less">
.tbt-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  border-radius: 30px;
  line-height: 56px;
  text-align: center;
  background-color: #fff;
  border: 2px solid #06C792;
}
</style>