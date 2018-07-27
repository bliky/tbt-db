<template>
    <div class="yo-scroll"
  :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
  @touchstart="touchStart($event)"
  @touchmove="touchMove($event)"
  @touchend="touchEnd($event)"
  @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
        <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
            <header class="pull-refresh">
                <slot name="pull-refresh">
                    <span class="down-tip">下拉更新</span>
                    <span class="up-tip">松开刷新数据</span>
                    <span class="refresh-tip">加载中……</span>
                </slot>
            </header>
            <slot>
            </slot>
            <footer class="load-more">
                <slot name="load-more">
                    <span v-show="downFlag === false">上拉加载更多</span>
                    <span v-show="downFlag === true">加载中……</span>
                </slot>
            </footer>
            <div class="nullData" v-show="dataList.noFlag">暂无更多数据</div>
        </section>
    </div>
</template>
<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 40 // 默认高度
    },
    enableInfinite: {
      type: Boolean,
      default: true
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    dataList: {
      default: false,
      required: false
    },
    onRefresh: {
      type: Function,
      default: undefined,
      required: false
    },
    onInfinite: {
      type: Function,
      default: undefined,
      require: false
    }
  },
  data () {
    return {
      top: 0,
      state: 0,
      startX: 0,
      startY: 0,
      touching: false,
      infiniteLoading: false,
      downFlag: true // 用来显示是否加载中
    }
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
      this.startX = e.targetTouches[0].pageX
      this.startScroll = this.$el.scrollTop || 0
      this.touching = true // 留着有用，不能删除
      this.dataList.noFlag = false
      this.$el.querySelector('.load-more').style.display = 'block'
    },
    touchMove (e) {
      if (!this.enableRefresh || this.dataList.noFlag || !this.touching) {
        return
      }
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
      if (diff > 0) e.preventDefault()
      this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
      if (this.state === 2) { // in refreshing
        return
      }
      if (this.top >= this.offset) {
        this.state = 1
      } else {
        this.state = 0
      }
      let more = this.$el.querySelector('.load-more')
      if (!this.top && this.state === 0) {
        more.style.display = 'block'
      } else {
        more.style.display = 'none'
      }
    },
    touchEnd (e) {
      if (!this.enableRefresh) {
        return
      }
      this.touching = false
      if (this.state === 2) { // in refreshing
        this.state = 2
        this.top = this.offset
        return
      }
      if (this.top >= this.offset) { // do refresh
        this.refresh()
      } else { // cancel refresh
        this.state = 0
        this.top = 0
      }
      // 用于判断滑动是否在原地 ----begin
      let endX = e.changedTouches[0].pageX
      let endY = e.changedTouches[0].pageY
      let dy = this.startY - endY
      let dx = endX - this.startX
      // 如果滑动距离太短
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
//        console.log('滑动距离太短')
        return
      }
      // --------end--------
      if (!this.enableInfinite || this.infiniteLoading) {
        return
      }
      let outerHeight = this.$el.clientHeight
      let innerHeight = this.$el.querySelector('.inner').clientHeight
      let scrollTop = this.$el.scrollTop
      let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0
      let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
//      console.log(bottom + '__' + this.offset)
      if (bottom <= this.offset && this.state === 0) {
        this.downFlag = true
        this.infinite()
      } else {
        this.$el.querySelector('.load-more').style.display = 'none'
        this.downFlag = false
      }
    },
    onScroll (e) {
      if (!this.enableInfinite) {
        return
      }
      let outerHeight = this.$el.clientHeight // 屏幕内容区域 316
      let innerHeight = this.$el.querySelector('.inner').clientHeight  // inner height 923
      let scrollTop = this.$el.scrollTop  // 滚动条距顶部高度
      let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0 // 下拉刷新div高度
      let infiniteHeight = this.$el.querySelector('.load-more').clientHeight // 上拉加载更多div高度
      let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
      if (bottom + infiniteHeight - 1 <= infiniteHeight) {
        this.infinite()
      }
    },
    refresh () {
      this.state = 2
      this.top = this.offset
      setTimeout(() => {
        this.onRefresh(this.refreshDone)
      }, 300)
    },
    refreshDone () {
      this.state = 0
      this.top = 0
    },
    infinite () {
      this.infiniteLoading = true
      setTimeout(() => {
        this.onInfinite(this.infiniteDone)
      }, 2000)
    },
    infiniteDone () {
      this.infiniteLoading = false
    }
  }
}
</script>
<style>
  .yo-scroll {
    position: absolute;
    top: 2.78rem;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff
  }
  .yo-scroll .inner {
    position: absolute;
    top: -2rem;
    width: 93%;
    transition-duration: 300ms;
    padding: 0 .25rem;
  }
  .yo-scroll .pull-refresh {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:.3rem;
  }
  .yo-scroll.touch .inner {
    transition-duration: 0ms;
  }
  .yo-scroll.down .down-tip {
    display: block;
  }
  .yo-scroll.up .up-tip {
    display: block;
  }
  .yo-scroll.refresh .refresh-tip {
    display: block;
  }
  .yo-scroll .down-tip,
  .yo-scroll .refresh-tip,
  .yo-scroll .up-tip {
    display: none;
  }
  .yo-scroll .load-more {
    height: 1.5rem;
    text-align: center;
    line-height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:.3rem;
  }
  .nullData{
    font-size: .3rem;
    text-align: center;
    height: 1rem;
    line-height: 1rem;
  }
</style>