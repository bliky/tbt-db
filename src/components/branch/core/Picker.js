import moment from 'moment'

class Picker {
  constructor () {
    this.moment = moment()
    this.max = null
    this.min = null
    this.store = {
      prevText: 'prev',
      nextText: 'next',
      currentText: 'current'
    }
  }
  updateCurrent () {
    this.store.currentText = this.moment.format(this.format)
  }
  set (dt, format='YYYYMMDD') {
    this.moment = moment(dt, format)
    this.updateCurrent()
    return this.moment
  }
  setMax (dt, format='YYYYMMDD') {
    return this.max = moment(dt, format)
  }
  setMin (dt, format='YYYYMMDD') {
    return this.min = moment(dt, format)
  }
  eqMax () {
    return this.moment.isSame(this.max)
  }
  eqMin () {
    return this.moment.isSame(this.min)
  }
  fit () {
    if (this.min && this.moment.isBefore(this.min)) {
      this.moment = moment(this.min)
    } else if (this.max && this.moment.isAfter(this.max)) {
      this.moment = moment(this.max)
    }
  }
  get (format='YYYYMMDD') {
    return this.moment.format(format)
  }
  prev () {
    this.fit()
  }
  next () {
    this.fit()
  }
}

export class DayPicker extends Picker {
  constructor () {
    super()
    this.store.prevText = "上一日"
    this.store.nextText = "下一日"
    this.format = 'MM月DD日'
    this.updateCurrent()
  }
  prev () {
    this.moment.subtract(1, 'days')
    super.prev()
    this.updateCurrent()
  }
  next () {
    this.moment.add(1, 'days')
    super.next()
    this.updateCurrent()
  }
}

export class WeekPicker extends Picker {
  constructor () {
    super()
    this.store.prevText = "上一周"
    this.store.nextText = "下一周"
    this.format = 'MM月DD日'
    this.updateCurrent()
  }
  prev () {
    this.moment.subtract(1, 'weeks')
    super.prev()
    this.updateCurrent()
  }
  next () {
    this.moment.add(1, 'weeks')
    super.next()
    this.updateCurrent()
  }
}

export class MonthPicker extends Picker {
  constructor () {
    super()
    this.store.prevText = "上一月"
    this.store.nextText = "下一月"
    this.format = 'YYYY年MM月'
    this.updateCurrent()
  }
  prev () {
    this.moment.subtract(1, 'months')
    super.prev()
    this.updateCurrent()
  }
  next () {
    this.moment.add(1, 'months')
    super.next()
    this.updateCurrent()
  }
}

export class YearPicker extends Picker {
  constructor () {
    super()
    this.store.prevText = "上一年"
    this.store.nextText = "下一年"
    this.format = 'YYYY年'
    this.updateCurrent()
  }
  prev () {
    this.moment.subtract(1, 'years')
    super.prev()
    this.updateCurrent()
  }
  next () {
    this.moment.add(1, 'years')
    super.next()
    this.updateCurrent()
  }
}

export class DatePicker extends Picker {
  constructor (context, picker) {
    super()
    this.context = context
    this.setPicker(picker)
  }
  setPicker (picker) {
    this.picker = picker
    this.store = picker.store
    this.context.store = this.store
  }
  set (dt, format='YYYYMMDD') {
    return this.picker.set(dt, format)
  }
  setMax (dt, format='YYYYMMDD') {
    return this.picker.setMax(dt, format)
  }
  setMin (dt, format='YYYYMMDD') {
    return this.picker.setMin(dt, format)
  }
  eqMax () {
    return this.picker.eqMax()
  }
  eqMin () {
    return this.picker.eqMin()
  }
  get (format='YYYYMMDD') {
    return this.picker.get(format)
  }
  prev () {
    return this.picker.prev()
  }
  next () {
    return this.picker.next()
  }
}