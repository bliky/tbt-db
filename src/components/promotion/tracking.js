import formatRow from './formatRow'
import '../common/icon'
import { Tab, TabItem, XDialog, TransferDom, Popup } from 'vux'
import mLoading from '../common/mixins/loading'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import { fetchTrackingUpdateTime } from '../../services/api'

const winW = window.innerWidth

export default {
  mixins: [mLoading],
  data () {
    return {
      dialogWidth: winW - 26,
      index: 0,
      showSetInd: false,
      updateDate: '',
      tableData: [],
      checkedInd: {
        budget: ['target', 'cost', 'rate'],
        clue: ['target', 'cost', 'rate'],
        sale: ['target', 'cost', 'rate']
      },
      showInd: {
        budget: [{
          type: 2,
          label: '预算(元)',
          prop: 'target'
        },
        {
          type: 2,
          label: '实际花费(元)',
          prop: 'cost'
        },
        {
          type: 3,
          label: '花费进度',
          prop: 'rate'
        }],
        clue: [{
          type: 2,
          label: '预算(元)',
          prop: 'target'
        },
        {
          type: 2,
          label: '实际花费(元)',
          prop: 'cost'
        },
        {
          type: 3,
          label: '花费进度',
          prop: 'rate'
        }],
        sale: [{
          type: 2,
          label: '预算(元)',
          prop: 'target'
        },
        {
          type: 2,
          label: '实际花费(元)',
          prop: 'cost'
        },
        {
          type: 3,
          label: '花费进度',
          prop: 'rate'
        }]
      },
      allInd: [
        {
          type: {
            budget: 2,
            clue: 1,
            sale: 1
          },
          label: {
            budget: '预算',
            clue: '目标',
            sale: '目标'
          },
          unit: {
            budget: '元',
            clue: '个',
            sale: '个'
          },
          prop: 'target'
        },
        {
          type: {
            budget: 2,
            clue: 1,
            sale: 1
          },
          label: {
            budget: '实际花费',
            clue: '实际完成',
            sale: '实际完成'
          },
          unit: {
            budget: '元',
            clue: '个',
            sale: '个'
          },
          prop: 'cost'
        },
        {
          type: 3,
          label: {
            budget: '花费进度',
            clue: '完成进度',
            sale: '完成进度'
          },
          prop: 'rate'
        },
        {
          type: 2,
          label: '历史日均',
          uint: '元',
          prop: 'history_avg_day'
        },
        {
          type: 2,
          label: '剩余日均',
          uint: '元',
          prop: 'remain_avg_day'
        },
        {
          type: 0,
          label: '追踪ROI',
          prop: 'roi'
        }
      ]
    }
  },
  computed: {
    ...mapState('tracking', ['curDt', 'curType', 'progress', 'budgetData', 'clueData', 'saleData', 'comPramas']),
    ...mapGetters('tracking', []),
    progressPercent () {
      return parseInt(this.progress * 100) + '%'
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    XDialog,
    Popup
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('tracking', {
      chDt: 'CH_DATE'
    }),
    ...mapActions('tracking', ['fetch']),
    hasCheckInd (ind) {
      return this.checkedInd[this.curType].indexOf(ind) !== -1
    },
    selInd (ind) {
      let idx = this.checkedInd[this.curType].indexOf(ind)
      if (idx === -1) {
        if (this.checkedInd[this.curType].length < 3) {
          this.checkedInd[this.curType].push(ind)
        }
      } else {
        this.checkedInd[this.curType].splice(idx, 1)
      }
    },
    init () {
      this.fetchData()
      fetchTrackingUpdateTime().then(res => {
        this.updateDate = res.result.dt
      })
    },
    fetchData () {
      this.fetch({ params: { dt: this.curDt }, type: this.curType }).then(data => {
        this.tableData = data
      })
    },
    formatRow (data_type, val) {
      return formatRow(data_type, val)
    },
    chType (type) {
      this.$store.commit('tracking/CH_TYPE', type)
      this.fetchData()
      this.changeShowInd()
    },
    onSelDt () {
      let that = this
      this.$vux.datetime.show({
        value: this.curDt,
        confirmText: '确认',
        cancelText: '取消',
        yearRow: '{value}年',
        monthRow: '{value}月',
        dayRow: '{value}日',
        startDate: '2018-10-01',
        endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        onConfirm (value) {
          that.chDt(value)
          that.fetchData()
        },
        onHide () {
        },
        onShow () {
        }
      });
    },
    onClickCompare () {
      let comPramas = this.comPramas
      if (comPramas.type.length && comPramas.dt1.length && comPramas.dt2.length) {
        this.$router.push({ path: '/bdc-prd-dbd/promotion-compare' })
      } else {
        this.$router.push({ path: '/bdc-prd-dbd/compare-filter' })
      }
    },
    onSetShowind () {
      this.checkedInd[this.curType] = this.showInd[this.curType].map(item => {
        return item.prop
      })
      this.showSetInd = true
    },
    changeShowInd () {
      let showInds = this.checkedInd[this.curType].map(ind => {
        let indRes = this.allInd.find(ido => {
          return ido.prop == ind
        })
        let showInd = { ...indRes }
        if (typeof showInd.label === typeof {}) {
          showInd.label = showInd.label[this.curType]
        }
        if (showInd.unit) {
          if (typeof showInd.unit === 'object') {
            showInd.unit = showInd.unit[this.curType]
          }
          showInd.label += '(' + showInd.unit + ')'
        }
        if (typeof showInd.type === 'object') {
          showInd.type = showInd.type[this.curType]
        }
        return showInd
      })

      // if (this.curType !== 'budget') {
      //   let spliceIdx = showInds.findIndex(item => {
      //     return item.prop === 'roi'
      //   })

      //   if (spliceIdx !== -1) {
      //     showInds.splice(spliceIdx, 1)
      //   }
      // }

      this.showInd[this.curType] = showInds
    },
    onConfirmSetInd () {
      this.showSetInd = false
      this.changeShowInd()
    }
  }
}
