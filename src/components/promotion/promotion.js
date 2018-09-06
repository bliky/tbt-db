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
      optsWidth: winW,
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
      }
    }
  },
  watch: {
    opts () {
      this.$nextTick(() => {
        this.getOptsWidth();
      });
    }
  },
  computed: {
    ...mapState('promotion', ['months', 'lastUpdateDate', 'tableData', 'trends', 'isSelectChShow', 'chCate', 'chs', 'opts']),
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
    this.$on('onClickRow', row => {
      // this.openLoading('加载趋势数据..');
      // this.currentTrend.class_name = row.class_name;
      // fetchPromotionTrend({ dt: '2018-09-06' }).then(data => {
      //   let { day, month } = data.result;

      //   this.currentTrend.day = day;
      //   this.currentTrend.month = month;
      //   this.isTrendDialogShow = true;
      //   this.$nextTick(() => {
      //     this.closeLoading();
      //   });
      // });
    })
    this.getOptsWidth();
  },
  methods: {
    ...mapMutations('promotion', {
      ch_cate: 'MOD_CH_CATE',
      add_opt: 'PUSH_OPT',
      tog_sel_ch: 'TOG_SEL_CH'
    }),
    ...mapActions('promotion', ['getChs', 'getPromotion', 'getPromotionTrend']),
    init () {
      if (this.tableData.length) {
        console.log('已有数据');
        return;
      }
      this.getPromotion({
        dt: '2018-09',
        city_type: 0,
        city_params: [],
        ch_type: 0,
        ch_params: {
          search: [],
          feed: []
        }
      }).then(data => {
        console.log('推广数据', data);
      });
    },
    getOptsWidth () {
      let opts = document.getElementById('promotionOpts');
      if (!opts) return 600;

      let optsLens = [];

      for (let i=0,len=opts.childNodes.length; i<len; i++) {
        optsLens.push(opts.childNodes[i].offsetWidth + 10);
      }

      //let sum = opts.childNode.reduce((sum, item, idx, arr)=>{
      //   console.log({sum, item, idx, arr});
      //   return sum+item.offsetWidth;
      // }, 0);
      // console.log({sum});

      let sum = optsLens.reduce((sum, item)=>{
        return sum+item;
      });

      this.optsWidth = sum + 26;
      return sum;
    },
    handleOnClickChSelect () {
      this.tog_sel_ch();
      if (this.chs.search.length) return;
      this.getChs();
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
