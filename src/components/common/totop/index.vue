<template>
  <div @click="handleOnClick" class="tbt-top" v-show="show">
    <i class="tbt-icon tbt-icon-totop" />
  </div>
</template>

<script>

// 注意: window.innerWidth 和 window.innerHeight 可以获得页面可见区域的宽和高.
const winH = window.innerHeight;
const winW = window.innerWidth;

export default {
  props: {

  },
  mounted () {
    this.bind(true);
  },
  deactivated () {
  },
  beforeDestroy () {
  },
  destroyed () {
    this.bind(false);
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    onScroll (e) {
      let app = document.getElementById('vux_view_box_body');
      // 滚动超出一个可视区域高度时 出现返回顶部按钮
      if (app.scrollTop > winH) {
        this.show = true;
      } else if (app.scrollTop <= 0) {
        this.show = false;
      }
    },
    bind (bd) {
      let app = document.getElementById('vux_view_box_body');

      if (bd) {
        app.addEventListener('scroll', this.onScroll);
      } else {
        app.removeEventListener('scroll', this.onScroll);
      }
    },
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
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
}
</style>