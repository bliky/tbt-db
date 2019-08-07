<template>
  <div v-show="isShow" class="pop-pannel" style="top: 34px; z-index: 200; border-top: 1px solid #F6F6F6;" @click="hide">
    <div class="pop-pannel-bd branch" @click.stop=''>
      <div class="flex-container" style="height: 315px;">
        <div style="width: 126px;background: #F7F9FD; border-right: 1px solid #eee; box-sizing: border-box;">
          <ul class="v-menu-lt">
            <li :class="{active: cate==0}" @click="set_cate(0)">全部(默认)</li>
            <li v-if="opts.sub1.length" :class="{active: cate==1}" @click="set_cate(1)">五大城市<span class="branch-badge" v-show="picked.sub1.length">{{ picked.sub1.length }}</span></li>
            <li v-if="opts.region.length" :class="{active: cate==2}" @click="set_cate(2)">六大区域<span class="branch-badge" v-show="picked.sub2.length">{{ picked.sub2.length }}</span></li>
            <li v-if="opts.sub3.length" :class="{active: cate==3}" @click="set_cate(3)">非落地城市<span class="branch-badge" v-show="picked.sub3.length">{{ picked.sub3.length }}</span></li>
          </ul>
        </div>
        <div class="flex-item tbt-chlist" style="overflow-y: auto; height: 100%;">
          <ul v-show="cate==0" class="v-menu-rt">
            <li :class="{checked: picked.all}" @click="pick('all', true)">
              全部
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
          <ul v-show="cate==1" class="v-menu-rt">
            <li :class="{checked: picked.all1}" @click="pick('all1', true)">
              全部
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
            <li :class="{checked: picked.sub1.indexOf(opt)!==-1}" @click="pick('sub1', opt)" v-for="opt in opts.sub1" :key='opt.id'>
              {{ opt.city_name }}
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
          <div style="display: flex; height: 100%;" v-show="cate==2">
            <ul class="v-menu-rt" style="border-right: 1px solid #eee;">
              <li :class="{checked: picked.all2}" @click="pick('all2', true)">
                全部
                <i class="tbt-icon tbt-icon-checked"></i>
                <i class="tbt-icon tbt-icon-uncheck"></i>
              </li>
              <li :class="{checked: curRegion === opt}" @click="pick('region', opt)" v-for="opt in opts.region" :key='opt.id'>
                {{ opt.city_name }}
                <span class="branch-badge" v-show="regionCount(opt.child)">{{ regionCount(opt.child) }}</span>
              </li>
            </ul>
            <ul class="v-menu-rt" v-show="opts.sub2.length" style="overflow-y: auto">
              <li :class="{checked: picked.all2_}" @click="pick('all2', curRegion)">
                全部
                <i class="tbt-icon tbt-icon-checked"></i>
                <i class="tbt-icon tbt-icon-uncheck"></i>
              </li>
              <li :class="{checked: picked.sub2.indexOf(opt)!==-1}" @click="pick('sub2', opt)" v-for="opt in opts.sub2" :key='opt.id'>
                {{ opt.city_name }}
                <i class="tbt-icon tbt-icon-checked"></i>
                <i class="tbt-icon tbt-icon-uncheck"></i>
              </li>
            </ul>
          </div>
          <ul v-show="cate==3" class="v-menu-rt">
            <li :class="{checked: picked.all3}" @click="pick('all3', true)">
              全部
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
            <li :class="{checked: picked.sub3.indexOf(opt)!==-1}" @click="pick('sub3', opt)" v-for="opt in opts.sub3" :key='opt.id'>
              {{ opt.city_name }}
              <i class="tbt-icon tbt-icon-checked"></i>
              <i class="tbt-icon tbt-icon-uncheck"></i>
            </li>
          </ul>
        </div>
      </div>
      <div style="display: flex">
        <div @click="onReset" class="filter-btn-reset">重置</div>
        <div @click="onConfirm" class="filter-btn-submit" :class="{disabled: disbleConfirm}">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {push, remove} from '../util'

const copyPicked = p => {
    let tp = {
        all: p.all,
        all1: p.all1,
        all2: p.all2,
        all3: p.all3,
        all_region: [...p.all_region],
        sub1: [...p.sub1],
        sub2: [...p.sub2],
        sub3: [...p.sub3]
    }
    return tp
}

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: this.visible,
      cate: 0,
      opts: {
        region: [],
        sub1: [],
        sub2: [],
        sub3: []
      },
      curRegion: null,
      isLoaded: false,
      picked: {
        all: false,
        all1: false,
        all2: false,
        all_region: [],
        all3: false,
        sub1: [],
        sub2: [],
        sub3: []
      },
      confirmPicked: {
        all: false,
        all1: false,
        all2: false,
        all_region: [],
        all3: false,
        sub1: [],
        sub2: [],
        sub3: []
      },
      disbleConfirm: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('branch', ['getCities']),
    refresh () {
      this.picked = copyPicked(this.confirmPicked)
      let picked = this.picked
      this.disbleConfirm = !(picked.sub1.length || picked.sub2.length || picked.sub3.length)
    },
    loadData () {
      if (this.isLoaded) return
      this.getCities().then(res => {
        this.opts.sub1 = res['specialCity'].child
        this.opts.region = res['region'].child
        this.opts.sub3 = res['noLuodi'].child
        if (this.opts.region && this.opts.region.length) {
          this.curRegion = this.opts.region[0]
          this.opts.sub2 = this.curRegion.child
        }
        this.all()
        this.picked.all2_ = true
        this.emit()
        this.isLoaded = true
      })
    },
    set_cate (cate) {
      this.cate = cate
    },
    show () {
      this.isShow = true
      this.$emit('update:visible', true)
      this.refresh()
    },
    hide () {
      this.isShow = false
      this.$emit('update:visible', false)
    },
    all (isall) {
      if (typeof isall === 'undefined') {
        this.picked.all = !this.picked.all
      } else if (typeof isall === 'boolean') {
        this.picked.all = isall
      } else {
        return
      }

      isall = this.picked.all
      this.all1(isall)
      this.all2(isall)
      this.all3(isall)
    },
    all1 (isall) {
      if (typeof isall === 'undefined') {
        this.picked.all1 = !this.picked.all1
      } else if (typeof isall === 'boolean') {
        this.picked.all1 = isall
      } else {
        return
      }

      isall = this.picked.all1

      let sub1 = this.picked.sub1
      if (isall) {
        this.opts.sub1.forEach(opt => {
          push(sub1, opt)
        })
      } else {
        this.opts.sub1.forEach(opt => {
          remove(sub1, opt)
        })
      }
    },
    all2 (isall) {
      if (typeof isall === 'undefined') {
        this.picked.all2 = !this.picked.all2
      } else if (typeof isall === 'boolean') {
        this.picked.all2 = isall
      } else {
        return
      }

      isall = this.picked.all2
      let regions = this.opts.region
      regions.forEach(region => {
        this.allRegin(region, isall)
      })
    },
    allRegin (region, isall) {
      let idx = this.picked.all_region.indexOf(region)
      if (typeof isall === 'undefined') {
        if (idx === -1) {
          this.picked.all_region.push(region)
        } else {
          this.picked.all_region.splice(idx, 1)
        }
      } else if (typeof isall === 'boolean') {
        isall ? push(this.picked.all_region, region) : remove(this.picked.all_region, region)
      } else {
        return
      }

      idx = this.picked.all_region.indexOf(region)
      let sub2 = this.picked.sub2
      if (idx === -1) {
        region.child.forEach(item => {
          remove(sub2, item)
        })
        this.picked.all2_ = false
        this.picked.all2 = false
      } else {
        region.child.forEach(item => {
          push(sub2, item)
        })
        this.picked.all2_ = true
        this.updateAll2_()
      }
    },
    all3 (isall) {
      if (typeof isall === 'undefined') {
        this.picked.all3 = !this.picked.all3
      } else if (typeof isall === 'boolean') {
        this.picked.all3 = isall
      } else {
        return
      }

      isall = this.picked.all3
      let sub3 = this.picked.sub3
      if (isall) {
        this.opts.sub3.forEach(opt => {
          push(sub3, opt)
        })
      } else {
        this.opts.sub3.forEach(opt => {
          remove(sub3, opt)
        })
      }
    },
    updateAll1() {
      this.picked.all1 = this.picked.sub1.length === this.opts.sub1.length
    },
    updateAll2() {
      let pickedNum = this.regionCount(this.curRegion.child)
      let total = this.opts.sub2.length
      this.picked.all2_ = pickedNum === total
      this.updateAll2_()
    },
    updateAll2_() {
      let pickedNum = this.picked.sub2.length
      let total = this.opts.region.reduce((total, region) => {
        let sum = region.child.length
        return sum + total
      }, 0)
      this.picked.all2 = pickedNum === total
    },
    updateAll3() {
      this.picked.all3 = this.picked.sub3.length === this.opts.sub3.length
    },
    pick (opt, data) {
      let idx
      switch (opt) {
        case 'sub1':
          idx = this.picked.sub1.indexOf(data)
          if (idx === -1) {
            this.picked.sub1.push(data)
            this.updateAll1()
          } else {
            this.picked.sub1.splice(idx, 1)
            this.picked.all = false
            this.picked.all1 = false
          }
          break
        case 'sub2':
          idx = this.picked.sub2.indexOf(data)
          if (idx === -1) {
            this.picked.sub2.push(data)
            this.updateAll2()
          } else {
            this.picked.sub2.splice(idx, 1)
            remove(this.picked.all_region, this.curRegion)
            this.picked.all = false
            this.picked.all2 = false
            this.picked.all2_ = false
          }
          break
        case 'sub3':
          idx = this.picked.sub3.indexOf(data)
          if (idx === -1) {
            this.picked.sub3.push(data)
            this.updateAll3()
          } else {
            this.picked.sub3.splice(idx, 1)
            this.picked.all = false
            this.picked.all3 = false
          }
          break
        case 'region':
          this.curRegion = data
          this.opts.sub2 = data.child
          break
        case 'all':
          this.all()
          break
        case 'all1':
          this.all1()
          break
        case 'all2':
          if (typeof data === 'object') {
            this.allRegin(this.curRegion)
          } else {
            this.all2()
          }
          break
        case 'all3':
          this.all3()
          break
      }
      let picked = this.picked
      this.disbleConfirm = !(picked.sub1.length || picked.sub2.length || picked.sub3.length)
    },
    onReset () {
      // this.all(true)
      this.cate = 0
      this.opts.sub2 = []
      this.curRegion = null
      this.picked = {
        all: false,
        all1: false,
        all2: false,
        all_region: [],
        all3: false,
        sub1: [],
        sub2: [],
        sub3: []
      }
      // this.hide()
      let picked = this.picked
      this.disbleConfirm = !(picked.sub1.length || picked.sub2.length || picked.sub3.length)
    },
    getParams () {
      this.confirmPicked = copyPicked(this.picked)
      let cityIds = this.picked.sub1.map(item => item.id)
      let regionIds = this.picked.sub2.map(item => item.id)
      let luodiIds = this.picked.sub3.map(item => item.id)
      return {
        cityIds,
        regionIds,
        luodiIds,
        isArea: false
      }
    },
    emit () {
      this.$emit('confirm', this.getParams())
    },
    onConfirm () {
      if (this.disbleConfirm) {
        return
      }
      this.emit()
      this.hide()
    },
    regionCount (region) {
      return region.filter(city => this.picked.sub2.indexOf(city) !== -1).length
    }
  }
}
</script>
