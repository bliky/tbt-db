<template>
  <div class="flex-container" style="max-height: 440px;">
    <div style="width: 125px; border-right: 1px solid #eee;">
      <ul class="v-menu-lt with-sub">
        <li :class="{active: cate==0}" @click="set_cate(0)">全部(默认)</li>
        <li :class="{active: cate==1}" @click="set_cate(1)">五大城市<span class="branch-badge" v-show="picked.sub1.length">{{ picked.sub1.length }}</span></li>
        <li :class="{active: cate==2}" @click="set_cate(2)">六大区域<span class="branch-badge" v-show="picked.sub2.length">{{ picked.sub2.length }}</span></li>
        <li class="v-menu-sub" v-show="cate==2">
          <ul>
            <li :class="{checked: curRegion === opt}" @click="pick('region', opt)" v-for="opt in opts.region" :key='opt.id'>
              {{ opt.city_name }}
              <span class="branch-badge" v-show="regionCount(opt.child)">{{ regionCount(opt.child) }}</span>
            </li>
          </ul>
        </li>
        <li :class="{active: cate==3}" @click="set_cate(3)">非落地城市<span class="branch-badge" v-show="picked.sub3.length">{{ picked.sub3.length }}</span></li>
      </ul>
    </div>
    <div v-show="cate==0" class="branch-menu-child flex-container flex-item">
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all}" @click="pick('all', true)">
            全部
            <i class="tbt-icon tbt-icon-checked"></i>
            <i class="tbt-icon tbt-icon-uncheck"></i>
          </li>
        </ul>
      </div>
    </div>

    <div v-show="cate==1" class="branch-menu-child flex-container flex-item">
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all1}" @click="pick('all1', true)">
            全部
            <i class="tbt-icon tbt-icon-checked"></i>
            <i class="tbt-icon tbt-icon-uncheck"></i>
          </li>
          <li :class="{checked: sub1_pcur === opt}" @click="pick('sub1_p', opt)" v-for="opt in opts.sub1_p" :key='opt.id'>
            {{ opt.city_name }}
            <span class="branch-badge" v-show="cityCount(opt, picked.sub1)">{{ cityCount(opt, picked.sub1) }}</span>
          </li>
        </ul>
      </div>
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all1_}" @click="pick('all1_', true)">
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
      </div>
    </div>

    <div v-show="cate==2" class="branch-menu-child flex-container flex-item">
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all2}" @click="pick('all2', true)">
            全部
            <i class="tbt-icon tbt-icon-checked"></i>
            <i class="tbt-icon tbt-icon-uncheck"></i>
          </li>
          <li :class="{checked: sub2_pcur === opt}" @click="pick('sub2_p', opt)" v-for="opt in opts.sub2_p" :key='opt.id'>
            {{ opt.city_name }}
            <span class="branch-badge" v-show="cityCount(opt, picked.sub2)">{{ cityCount(opt, picked.sub2) }}</span>
          </li>
        </ul>
      </div>
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all2_}" @click="pick('all2_', true)">
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
    </div>

    <div v-show="cate==3" class="branch-menu-child flex-container flex-item">
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all3}" @click="pick('all3', true)">
            全部
            <i class="tbt-icon tbt-icon-checked"></i>
            <i class="tbt-icon tbt-icon-uncheck"></i>
          </li>
          <li :class="{checked: sub3_pcur === opt}" @click="pick('sub3_p', opt)" v-for="opt in opts.sub3_p" :key='opt.id'>
            {{ opt.city_name }}
            <span class="branch-badge" v-show="cityCount(opt, picked.sub3)">{{ cityCount(opt, picked.sub3) }}</span>
          </li>
        </ul>
      </div>
      <div class="flex-item tbt-chlist child-menu">
        <ul class="v-menu-rt">
          <li :class="{checked: picked.all3_}" @click="pick('all3_', true)">
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {push, remove} from '../util'

export default {
  data () {
    return {
      cate: 0,
      isLoaded: false,
      region: [],
      curRegion: null,
      sub1_pcur: null,
      sub2_pcur: null,
      sub3_pcur: null,
      opts: {
        region: [],
        sub1_p: [],
        sub2_p: [],
        sub3_p: [],
        sub1: [],
        sub2: [],
        sub3: []
      },
      picked: {
        all: false,
        all_region: [],
        all1: false,
        all2: false,
        all3: false,
        all1_: false,
        all2_: false,
        all3_: false,
        sub1: [],
        sub2: [],
        sub3: []
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('branch', ['getCities']),
    regionCount (region) {
       let total = region.reduce((total, city) => {
         let sum = city.child.filter(area => this.picked.sub2.indexOf(area) !== -1).length
         return total + sum
       }, 0)
      return total
    },
    cityCount (city, pick) {
      return city.child.filter(area => pick.indexOf(area) !== -1).length
    },
    reset () {
      this.cate = 0

      this.curRegion = null
      this.sub1_pcur = null
      this.sub2_pcur = null
      this.sub3_pcur = null

      this.picked = {
        all: false,
        all_region: [],
        all1: false,
        all2: false,
        all3: false,
        all1_: false,
        all2_: false,
        all3_: false,
        sub1: [],
        sub2: [],
        sub3: []
      }
    },
    emit () {
      this.$emit('change', this.getParams())
    },
    getParams () {
      let cityIds = this.picked.sub1.map(item => item.id)
      let regionIds = this.picked.sub2.map(item => item.id)
      let luodiIds = this.picked.sub3.map(item => item.id)
      return {
        citys: {
          cityIds,
          regionIds,
          luodiIds,
          isArea: true
        }
      }
    },
    set_cate (cate) {
      this.cate = cate
    },
    loadData () {
      if (this.isLoaded) return
      this.getCities().then(res => {
        this.opts.sub1_p = res['specialCity'].child
        this.opts.region = res['region'].child
        this.opts.sub3_p = res['noLuodi'].child
        this.curRegion = this.opts.region[0]
        this.opts.sub2_p = this.curRegion.child

        this.sub1_pcur = this.opts.sub1_p[0]
        this.sub2_pcur = this.opts.sub2_p[0]
        this.sub3_pcur = this.opts.sub3_p[0]

        this.opts.sub1 = this.sub1_pcur.child
        this.opts.sub2 = this.sub2_pcur.child
        this.opts.sub3 = this.sub3_pcur.child

        this.all()
        this.emit()
        this.isLoaded = true
      })
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
      this.allRegin(isall)
      this.all3(isall)
    },
    allRegin (isall) {
      this.opts.region.forEach(reg => {
        reg.child.forEach(city => {
          this.all2_(isall, city.child)
        })
      })
    },
    all1 (isall) {
      if (typeof isall === 'undefined') {
        this.picked.all1 = !this.picked.all1
      } else if (typeof isall === 'boolean') {
        this.picked.all1 = isall
      } else {
        return
      }

      this.opts.sub1_p.forEach(opt => {
        this.all1_(this.picked.all1, opt.child)
      })
    },
    all1_ (isall, opts) {
      if (typeof isall === 'undefined') {
        this.picked.all1_ = !this.picked.all1_
      } else if (typeof isall === 'boolean') {
        this.picked.all1_ = isall
      } else {
        return
      }

      isall = this.picked.all1_

      let sub1 = this.picked.sub1
      var opts = opts || this.opts.sub1
      if (isall) {
        opts.forEach(opt => {
          push(sub1, opt)
        })
      } else {
        opts.forEach(opt => {
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

      this.opts.sub2_p.forEach(opt => {
        this.all2_(this.picked.all2, opt.child)
      })
    },
    all2_ (isall, opts) {
      if (typeof isall === 'undefined') {
        this.picked.all2_ = !this.picked.all2_
      } else if (typeof isall === 'boolean') {
        this.picked.all2_ = isall
      } else {
        return
      }

      isall = this.picked.all2_

      let sub2 = this.picked.sub2
      var opts = opts || this.opts.sub2
      if (isall) {
        opts.forEach(opt => {
          push(sub2, opt)
        })
      } else {
        opts.forEach(opt => {
          remove(sub2, opt)
        })
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

      this.opts.sub3_p.forEach(opt => {
        this.all3_(this.picked.all3, opt.child)
      })
    },
    all3_ (isall, opts) {
      if (typeof isall === 'undefined') {
        this.picked.all3_ = !this.picked.all3_
      } else if (typeof isall === 'boolean') {
        this.picked.all3_ = isall
      } else {
        return
      }

      isall = this.picked.all3_

      let sub3 = this.picked.sub3
      var opts = opts || this.opts.sub3
      if (isall) {
        opts.forEach(opt => {
          push(sub3, opt)
        })
      } else {
        opts.forEach(opt => {
          remove(sub3, opt)
        })
      }
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
        case 'region':
          this.curRegion = data
          this.opts.sub2_p = data.child
          this.sub2_pcur = data.child[0]
          this.opts.sub2 = this.sub2_pcur.child
          break
        case 'all':
          this.all()
          break
        case 'all1':
          this.all1()
          break
        case 'all1_':
          this.all1_()
          break
        case 'all2':
          this.all2()
          break
        case 'all2_':
          this.all2_()
          break
        case 'all3':
          this.all3()
          break
        case 'all3_':
          this.all3_()
          break
        case 'sub1_p':
          this.sub1_pcur = data
          this.opts.sub1 = data.child
          break
        case 'sub2_p':
          this.sub2_pcur = data
          this.opts.sub2 = data.child
          break
        case 'sub3_p':
          this.sub3_pcur = data
          this.opts.sub3 = data.child
          break
        case 'sub1':
          idx = this.picked.sub1.indexOf(data)
          if (idx === -1) {
            this.picked.sub1.push(data)
          } else {
            this.picked.sub1.splice(idx, 1)
          }
          break
        case 'sub2':
          idx = this.picked.sub2.indexOf(data)
          if (idx === -1) {
            this.picked.sub2.push(data)
          } else {
            this.picked.sub2.splice(idx, 1)
          }
          break
        case 'sub3':
          idx = this.picked.sub3.indexOf(data)
          if (idx === -1) {
            this.picked.sub3.push(data)
          } else {
            this.picked.sub3.splice(idx, 1)
          }
          break
      }
    },
  }
}
</script>
