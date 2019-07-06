<template>
  <div>
    <div style="text-align: center; margin: 14px 0 6px;">
      <btn-tab :tabs="tabs" v-model="tabIndex" :hidden="tabHidden" @change="onChangeTab"></btn-tab>
    </div>
    <div style="display: flex">
      <div @click="onPrev" class="branch-date-prev" :class="{disabled: picker.eqMin()}">
        <i class="tbt-icon tbt-icon-left"/>
        <span style="width: 19px; line-height: 13px; font-size: 12px;color: #666666;text-align: center;">{{ store.prevText }}</span>
      </div>
      <div style="flex: 1; text-align: center; margin: auto 0;">
        <h2 style="font-size: 17px; color: #333333;">{{ store.currentText }}</h2>
        <p style="font-size: 12px; color: #999999;">更新时间：{{ updateTime[dateType] }}</p>
      </div>
      <div @click="onNext" class="branch-date-next" :class="{disabled: picker.eqMax()}">
        <span style="width: 19px; line-height: 13px; font-size: 12px;color: #666666;text-align: center;">{{ store.nextText }}</span>
        <i class="tbt-icon tbt-icon-right"/></div>
    </div>
  </div>
</template>

<script>
import { DatePicker, DayPicker, WeekPicker, MonthPicker, YearPicker } from './Picker'
import { btnTab } from '../../common/tab'
import { branchOfficeUpdateTime } from '../../../services/api'
import moment from 'moment'

let dayPicker = new DayPicker()
let weekPicker = new WeekPicker()
let monthPicker = new MonthPicker()
let yearPicker = new YearPicker()

export default {
  components: {
    btnTab
  },
  data () {
    let picker = new DatePicker(this, dayPicker)

    return {
      picker,
      tabIndex: 0,
      tabHidden: [0, 0, 0, 1],
      tabs: ['日', '周', '月', '年'],
      dateType: 'day',
      updateTime: {
        day: '',
        week: '',
        month: '',
        year: ''
      }
    }
  },
  mounted () {
    this.getUpdateTime('day').then(_ => this.emit())
  },
  methods: {
    async getUpdateTime (ty) {
      let updateTime = this.updateTime
      this.dateType = ty
      if (updateTime[ty]) return updateTime[ty]
      return await branchOfficeUpdateTime({
        class_type: 1,
        type: ty === 'day' ? 1 :
              ty === 'week' ? 2 :
              ty === 'month' ? 3 :
              ty === 'year' ? 4 : 1
      }).then(res => {
        try {
          if (parseInt(res.status) === 200) {
            updateTime[ty] = res.result.dt
            this.picker.set(updateTime[ty], 'YYYY-MM-DD HH:mm:ss')
            let max = moment(this.picker.setMax(updateTime[ty], 'YYYY-MM-DD HH:mm:ss'))
            switch (ty) {
              case 'day':
                this.picker.setMin(max.subtract(30, 'days').format('YYYYMMDD'))
                break
              case 'week':
                this.picker.setMin(max.subtract(24, 'weeks').format('YYYYMMDD'))
                break
              case 'month':
                this.picker.setMin(max.subtract(13, 'months').format('YYYYMMDD'))
                break
              case 'year':
                this.picker.setMin(max.subtract(1, 'years').format('YYYYMMDD'))
                break
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    onPrev () {
      this.picker.prev()
      this.emit()
    },
    onNext () {
      this.picker.next()
      this.emit()
    },
    emit () {
      let ty = this.dateType
      this.$emit('change', {
        type: ty === 'day' ? 1 :
              ty === 'week' ? 2 :
              ty === 'month' ? 3 :
              ty === 'year' ? 4 : 1,
        dt: this.picker.get()
      })
    },
    onChangeTab (tabIndex) {
      switch (tabIndex) {
        case 0:
          this.picker.setPicker(dayPicker)
          this.getUpdateTime('day').then(_ => this.emit())
          break
        case 1:
          this.picker.setPicker(weekPicker)
          this.getUpdateTime('week').then(_ => this.emit())
          break
        case 2:
          this.picker.setPicker(monthPicker)
          this.getUpdateTime('month').then(_ => this.emit())
          break
        case 3:
          this.picker.setPicker(yearPicker)
          this.getUpdateTime('year').then(_ => this.emit())
          break
      }
    }
  }
}
</script>

<style lang="less">
.branch-date-prev {
  border-radius: 0 12px 12px 0;
}

.branch-date-next {
  border-radius: 12px 0 0 12px; 
}

.branch-date-prev, .branch-date-next {
  width: 38px; height: 58px; background: #F6F6F6;
  display: flex; align-items:center;
  &.disabled {
    opacity: 0.5;
  }
}
</style>

