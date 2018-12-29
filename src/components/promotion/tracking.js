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
      index: 'budget',
      showSetInd: false,
      updateDate: '',
      tableData: [],
      checkedInd: ['target', 'cost', 'rate'],
      showInd: [{
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
      allInd: [
        {
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
        },
        {
          type: 2,
          label: '历史日均(元)',
          prop: 'history_avg_day'
        },
        {
          type: 2,
          label: '剩余日均(元)',
          prop: 'remain_avg_day'
        },
        {
          type: 2,
          label: '追踪ROI',
          prop: 'roi'
        }
      ]
    }
  },
  computed: {
    ...mapState('tracking', ['curDt', 'curType', 'progress', 'budgetData', 'clueData', 'saleData', 'comPramas']),
    ...mapGetters('tracking', [])
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
      return this.checkedInd.indexOf(ind) !== -1
    },
    selInd (ind) {
      let idx = this.checkedInd.indexOf(ind)
      if (idx === -1) {
        if (this.checkedInd.length < 3) {
          this.checkedInd.push(ind)
        }
      } else {
        this.checkedInd.splice(idx, 1)
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
      this.checkedInd = this.showInd.map(item => {
        return item.prop
      })
      this.showSetInd = true
    },
    onConfirmSetInd () {
      this.showSetInd = false
      this.showInd = this.checkedInd.map(ind => {
        return this.allInd.find(ido => {
          return ido.prop == ind
        })
      })
    }
  }
}
