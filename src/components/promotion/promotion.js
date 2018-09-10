import { fetchPromotionCh, fetchPromotionCity, fetchPromotion, fetchPromotionTrend } from '../../services/api'
import { filterNumber } from '../../common/filter'
import clickOutside from '../../directives/clickOutside'
import '../common/icon'
import { goTo } from '../../utils/utils'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { btnTab } from '../common/tab'
import { Line4 as ChartLine } from '../common/chart'
import mLoading from '../common/mixins/loading'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const winW = window.innerWidth

export default {
  mixins: [mLoading],
  data () {
    return {
      chartWidth: winW - 26,
      chartHeight: 171,
      winW: winW,
      dialogWidth: winW - 26,
      isTooltipShow: false,
      isTrendDialogShow: false,
      trendTabIndex: 0,
      trendTabs: ['日报', '月报'],
      currentTrend: {
        class_name: '',
        day: [
          { dt: '2018-09', val: 200 }
        ],
        month: [
          { dt: '2018-09', val: 100 }
        ]
      },
      chsPicked: {
        all: true,
        all_search: false,
        all_feed: false,
        search: [],
        feed: []
      }
    }
  },
  computed: {
    ...mapState('promotion', ['months', 'lastUpdateDate', 'tableData', 'trends', 'isSelectChShow', 'chCate', 'chs', 'opts', 'optsWidth', 'requestParams']),
    ...mapGetters('promotion', [])
  },
  filters: {
    filterNumber
  },
  directives: {
    clickOutside,
    TransferDom
  },
  components: {
    XDialog,
    btnTab,
    ChartLine
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations('promotion', {
      ch_cate: 'MOD_CH_CATE',
      add_opt: 'PUSH_OPT',
      tog_sel_ch: 'TOG_SEL_CH',
      submit_ch_sel: 'SUBMIT_CH_SEL'
    }),
    ...mapActions('promotion', ['getChs', 'getPromotion', 'getPromotionTrend']),
    init () {
      this.resetChSel();
      if (this.tableData.length) {
        return;
      }
      this.getPromotion();
    },
    // 初始重置渠道渠道选择
    resetChSel () {
      let { ch_type, ch_params } = this.requestParams;
      let chsPicked = this.chsPicked;

      chsPicked.all = ch_type === 1;
      chsPicked.all_search = ch_params.all_search;
      chsPicked.all_feed = ch_params.all_feed;
      chsPicked.search = [].concat(ch_params.search);
      chsPicked.feed = [].concat(ch_params.feed);
    },
    // 提交渠道选择
    submitChSel () {
      this.submit_ch_sel(this.chsPicked);
    },
    pickCh (type, id) {
      let chsPicked = this.chsPicked;
      switch (type) {
        case 'all':
        case 'all_search':
        case 'all_feed':
          if (chsPicked[type]) chsPicked[type] = false;
          else chsPicked[type] = true;
          break;
        case 'search':
        case 'feed':
          let idx = chsPicked[type].indexOf(id);
          if (idx === -1) chsPicked[type].push(id);
          else chsPicked[type].splice(idx, 1);
          break;
      }
      if (chsPicked.all || chsPicked.all_search) {
        chsPicked.search = [];
      }
      if (chsPicked.all || chsPicked.all_feed) {
        chsPicked.feed = [];
      }
    },
    handleOnClickChSelect () {
      this.tog_sel_ch();
      if (!this.isSelectChShow) {
        this.resetChSel();
      }
      if (this.chs.search.length) return;
      this.getChs();
    },
    handleOnChConfirm () {
      this.tog_sel_ch();
      this.submitChSel();
      this.getPromotion();
    },
    handleOnChCancel () {
      this.tog_sel_ch();
      this.resetChSel();
    },
    handleOnClickRow (row) {
      this.getPromotionTrend(row.class_id).then(data => {
        let { day, month } = data;
        this.isTrendDialogShow = true;
        this.currentTrend = { class_name: row.class_name,  day, month };
      });
    },
    handleOnClickCitySelect () {
      goTo.call(this, 'promotionSelcity');
    },
    handleOnClickDate () {
      this.add_opt({name: '乌鲁木齐'});
    },
    clickTooltipOutside (e) {
      let _class = e.target._prevClass;
      if (_class !== 'tbt-icon tbt-icon-info js-fn' && this.isTooltipShow) {
        this.isTooltipShow = false; 
      }
    }
  }
}
