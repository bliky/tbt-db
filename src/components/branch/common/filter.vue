<template>
  <div v-show="isShow" class="pop-pannel" style="top: 104px; z-index: 200; border-top: 1px solid #F6F6F6;" @click="hide">
    <div class="pop-pannel-bd branch" @click.stop=''>
      <div class="flex-container" v-show="showMore && tabIdx == 2">
        <ul class="tag-check-list">
          <li :class="{checked: owner_type.indexOf(0) !== -1 }" @click="pick('owner', 0)">全部</li>
          <li :class="{checked: owner_type.indexOf(1) !== -1 }" @click="pick('owner', 1)">微装可售</li>
          <li :class="{checked: owner_type.indexOf(2) !== -1 }" @click="pick('owner', 2)">线下签约</li>
          <li :class="{checked: owner_type.indexOf(3) !== -1 }" @click="pick('owner', 3)">精准可售</li>
          <li :class="{checked: owner_type.indexOf(4) !== -1 }" @click="pick('owner', 4)">意向可售</li>
          <li :class="{checked: owner_type.indexOf(5) !== -1 }" @click="pick('owner', 5)">推广盘</li>
          <li :class="{checked: owner_type.indexOf(6) !== -1 }" @click="pick('owner', 6)">自营</li>
          <li :class="{checked: owner_type.indexOf(7) !== -1 }" @click="pick('owner', 7)">未过销售标准</li>
        </ul>
      </div>
      <div class="flex-container" v-show="showMore && tabIdx == 3">
        <ul class="tag-check-list">
          <li :class="{checked: channel.indexOf(0) !== -1 }" @click="pick('channel', 0)">全部</li>
          <li :class="{checked: channel.indexOf(1) !== -1 }" @click="pick('channel', 1)">精准推广</li>
          <li :class="{checked: channel.indexOf(2) !== -1 }" @click="pick('channel', 2)">APP&融媒体</li>
          <li :class="{checked: channel.indexOf(3) !== -1 }" @click="pick('channel', 3)">线下引流</li>
          <li :class="{checked: channel.indexOf(4) !== -1 }" @click="pick('channel', 4)">SEO&其他</li>
        </ul>
      </div>

      <area-filter ref="areaFilter" v-show="showMore && tabIdx == 1" @change="onAreaChange" @pick="onPick"></area-filter>
      <city-filter ref="cityFilter" v-show="!showMore" @change="onCityChange" @pick="onPick"></city-filter>

      <div style="display: flex">
        <div @click="onReset" class="filter-btn-reset" v-show="tabIdx == 1">重置</div>
        <div @click="onConfirm" class="filter-btn-submit" :class="{disabled: disbleConfirm}">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaFilter from './area'
import CityFilter from './city'
import {push, remove} from '../util'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tab: {
      type: Number,
      default: 1
    }
  },
  components: {
    AreaFilter,
    CityFilter
  },
  computed: {
  },
  data () {
    return {
      isShow: this.visible,
      showMore: true,
      tabIdx: this.tab,
      owner_type: [0],
      channel: [0],
      params: {},
      disbleConfirm: false
    }
  },
  methods: {
    onPick (picked) {
      this.disbleConfirm = !(picked.sub1.length || picked.sub2.length || picked.sub3.length)
    },
    more (isshow) {
      this.showMore = isshow
      if (isshow) {
        this.onPick(this.$refs.areaFilter.picked)
      } else {
        this.onPick(this.$refs.cityFilter.picked)
      }
      this.emit()
    },
    show (tab) {
      if (tab !== this.tabIdx) {
        this.tabIdx = tab
        this.$emit('update:tab', tab)
      } else {
        return this.hide()
      }
      if (!this.isShow) {
        this.isShow = true
        this.$emit('update:visible', true)
      }
    },
    hide () {
      this.isShow = false
      this.tabIdx = 0
      this.$emit('update:tab', 0)
      this.$emit('update:visible', false)
      this.$emit('onhide')
    },
    pick (opt, data) {
      let idx
      switch (opt) {
        case 'owner':
          idx = this.owner_type.indexOf(data)
          if (data === 0) {
            if (idx === -1) {
              this.owner_type = [0]
            } else {
              this.owner_type = []
            }
          } else {
            if (idx === -1) {
              remove(this.owner_type, 0)
              this.owner_type.push(data)
            } else {
              this.owner_type.splice(idx, 1)
            }
          }
          break
        case 'channel':
          idx = this.channel.indexOf(data)
          if (data === 0) {
            if (idx === -1) {
              this.channel = [0]
            } else {
              this.channel = []
            }
          } else {
            if (idx === -1) {
              remove(this.channel, 0)
              this.channel.push(data)
            } else {
              this.channel.splice(idx, 1)
            }
          }
          break
      }
    },
    onReset () {
      // this.hide()

      if (this.showMore) {
        this.owner_type = []
        this.channel = []
        this.$refs.areaFilter.reset()
      } else {
        this.$refs.cityFilter.reset()
      }
    },
    getAreaParams () {
      let params = this.$refs.areaFilter.getParams()
      params.owner_type = this.owner_type
      params.channel = this.channel
      this.params = params
      return params
    },
    getCityParams () {
      let params = this.$refs.cityFilter.getParams()
      this.params = params
      return params
    },
    onCityChange () {
      this.emit()
    },
    onAreaChange (area) {
      this.emit()
    },
    emit () {
      if (this.showMore) {
        this.$emit('confirm', this.getAreaParams())
      } else {
        this.$emit('confirm', this.getCityParams())
      }
      console.log('filter emit')
    },
    onConfirm () {
      if (this.disbleConfirm) {
        return
      }
      this.emit()
      this.hide()
    }
  }
}
</script>

<style lang="less">
.tbt-chlist ul li {
  overflow: hidden;
}

.filter-btn-reset {
  border-top: 1px solid #eee; font: 17px/50px PingFangSC-Regular,sans-serif; color:#06C792; text-align:center; width: 126px;
  &.disabled {
    opacity: .5;
  }
}

.filter-btn-submit {
  font: 17px/50px PingFangSC-Regular,sans-serif; background: #06C792; color:#fff; text-align:center; flex:1;
  &.disabled {
    opacity: .5;
  }
}

.branch {
  .v-menu-lt {
    li {
      position: relative;
      padding-left: 10px;
      border-bottom: 0;
    }
    &.with-sub {
      li.active {
        color: #06C792;
      }
    }
  }
  .v-menu-sub {
    height: auto; background: #F7F9FD;
    ul li {
      &.checked {
        color: #06C792;
      }
    }
  }
  .v-menu-rt {
    padding: 0 10px;
    flex: 1;
    li {
      padding-right: 0;
      border-bottom: 0;
      &.checked {
        color: #06C792;
      }
    }
  }
  .tbt-chlist ul li .tbt-icon {
    right: 0px;
  }
  .tbt-chlist ul lic {
    color: #06C792;
  }
}

.branch-menu-child {
  .child-menu {
    background: #fff;
    max-height: 440px; overflow-y: auto;
    & + .child-menu {
      border-left: 1px solid #eee; 
    }
    li {
      &.checked {
        color: #06C792;
      }
    }
  }
}

.tag-check-list {
  padding: 21px 0 40px 20px;
  overflow: hidden;
  li {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    float: left;
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 20px;
    min-width: 100px;
    text-align: center;
    padding: 10px 0;
    border: 1px solid #eee;
    border-radius: 100px;
    &.checked {
      border-color: #06C792;
      color: #06C792;
    }
  }
}

.branch-badge {
  position: absolute;
  top: 12px;
  right: 2px;
  box-sizing: border-box;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #333333;
  color: #fff;
  line-height: 20px;
  text-align: center;
}
</style>

