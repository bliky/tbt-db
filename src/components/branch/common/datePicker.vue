<template>
  <div>
    <div style="text-align: center; margin: 14px 0 6px;">
      <btn-tab :tabs="tabs" v-model="tabIndex" :hidden="tabHidden" @change="onChangeTab"></btn-tab>
    </div>
    <div style="text-align: center;">
      <h2 style="font-size: 17px; color: #333333;">{{ currentText }}</h2>
      <p style="font-size: 12px; color: #999999;">更新时间：{{ classType && updateTime[classType] && updateTime[classType][dateType].updateDt }}</p>
    </div>
  </div>
</template>

<script>
import { btnTab } from '../../common/tab'
import { branchOfficeUpdateTime } from '../../../services/api'
import moment from 'moment'

export default {
  components: {
    btnTab
  },
  data () {
    return {
      classType: '2',
      tabIndex: 0,
      tabHidden: [0, 0, 0, 1],
      tabs: ['日', '周', '月', '年'],
      dateType: 'day',
      updateTime: {},
      currentText: '',
      preTabIndex: 0,
      preDateType: 'day',
      preClassType: '2'
    }
  },
  mounted () {
    this.getUpdateTime('4', 'month').then(_ =>
      this.getUpdateTime('2', 'week').then(_ =>
        this.getUpdateTime('2', 'month').then(_ =>
          this.getUpdateTime('3', 'day').then(_ =>
            this.getUpdateTime('3', 'week').then(_ =>
              this.getUpdateTime('3', 'month').then(_ =>
                this.getUpdateTime('2', 'day').then(res => {
                  this.currentText = moment(res.result.dataDt, 'YYYY-MM-DD HH:mm:ss').format('MM月DD日')
                  this.emit()
                })
              )
            )
          )
        )
      )
    )
  },
  methods: {
    setClassType (classType) {
      if (classType == 4) {
        this.preTabIndex = this.tabIndex
        this.preDateType = this.dateType
        this.preClassType = 4
        this.tabIndex = 2
        this.dateType = 'month'
        this.tabHidden = [1, 1, 0, 1]
        return this.getUpdateTime(this.classType, this.dateType)
      } else if (this.preClassType == 4) {
        this.tabHidden = [0, 0, 0, 1]
        this.tabIndex = this.preTabIndex
        this.dateType = this.preDateType
      }
      this.classType = classType
      return this.getUpdateTime(this.classType, this.dateType)
    },
    async getUpdateTime (classType, dateType) {
      if (!classType || !dateType) return

      let updateTime = this.updateTime
  
      if (!updateTime[classType]) {
        updateTime[classType] = {
          day: {},
          week: {},
          month: {},
          year: {}
        }
      }
      if (updateTime[classType] && updateTime[classType][dateType] && updateTime[classType][dateType].dataDt) {
        return this.currentText = moment(updateTime[classType][dateType].dataDt, 'YYYY-MM-DD HH:mm:ss').format('MM月DD日')
      }
      if (!classType) {
        return classType
      }
      return await branchOfficeUpdateTime({
        class_type: classType,
        type: dateType === 'day' ? 1 :
              dateType === 'week' ? 2 :
              dateType === 'month' ? 3 :
              dateType === 'year' ? 4 : 1
      }).then(res => {
        try {
          if (parseInt(res.status) === 200) {
            updateTime[classType][dateType].dataDt = res.result.dataDt
            updateTime[classType][dateType].updateDt = res.result.updateDt
          } else {
            this.currentText = ''
          }
        } catch (error) {
          this.currentText = ''
          console.log(error)
        }
        return res
      }).catch(error => {
        console.log(error)
        this.currentText = ''
      })
    },
    emit () {
      this.$emit('change', this.getParams())
    },
    getParams () {
      let ty = this.dateType
      return {
        type: ty === 'day' ? 1 :
              ty === 'week' ? 2 :
              ty === 'month' ? 3 :
              ty === 'year' ? 4 : 1,
        dt: this.classType && this.updateTime[this.classType] && this.updateTime[this.classType][ty].dataDt && moment(this.updateTime[this.classType][ty].dataDt, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD')
      }
    },
    onChangeTab (tabIndex) {
      switch (tabIndex) {
        case 0:
          this.dateType = 'day'
          this.getUpdateTime(this.classType, this.dateType).then(_ => this.emit())
          break
        case 1:
          this.dateType = 'week'
          this.getUpdateTime(this.classType, this.dateType).then(_ => this.emit())
          break
        case 2:
          this.dateType = 'month'
          this.getUpdateTime(this.classType, this.dateType).then(_ => this.emit())
          break
        case 3:
          this.dateType = 'year'
          this.getUpdateTime(this.classType, this.dateType).then(_ => this.emit())
          break
      }
    }
  }
}
</script>
